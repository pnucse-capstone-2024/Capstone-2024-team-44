import ButtonSmall from "@/components/commons/button-small";
import DropdownMenu from "@/components/commons/dropdown-menu";
import Input from "@/components/commons/input";
import InstanceModal from "@/components/commons/instance-modal";
import Layout from "@/components/commons/layout";
import ToggleButton from "@/components/commons/toggle-button";
import InstanceList from "@/components/setting/instance-list";
import useInstanceModal from "@/hooks/commons/use-instance-modal";
import useNicknameCheck from "@/hooks/commons/use-nickname-check";
import useToggleButton from "@/hooks/commons/use-toggle-button";
import { SettingPageProps, getSettingSSR } from "@/ssr/setting/setting-ssr";
import { Nickname } from "@/types/login/login-type";
import type { Setting, SshInfo } from "@/types/setting/setting-type";
import { cls } from "@/utils/class-utils";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import isEqual from "lodash/isEqual";
import { editSetting } from "@/api/setting/setting-api";
import ConfirmModal from "@/components/commons/confirm-modal";
import useConfirmModal from "@/hooks/commons/use-confirm-modal";

export const getServerSideProps: GetServerSideProps<SettingPageProps> =
  getSettingSSR;

export default function Setting({ NicknameSSR, SettingSSR }: SettingPageProps) {
  const nicknameRef = useRef<Nickname | null>(NicknameSSR);
  const settingRef = useRef<Setting | null>(SettingSSR);
  const [sshList, setSshList] = useState<SshInfo[]>(
    settingRef.current?.sshInfos || []
  );
  const [selectedSshId, SetSelectedSshId] = useState<number | null>(
    SettingSSR?.monitoringSshId || null
  );
  const [monitoringSshHost, setMonitoringSshHost] = useState<string | null>(
    sshList
      ? sshList.find((ssh) => ssh.id === selectedSshId)?.remoteHost || null
      : null
  );

  const {
    nickname,
    isValidNickname,
    nicknameMsg,
    isNicknameEdited,
    handleNicknameChange,
  } = useNicknameCheck(SettingSSR?.nickName || "");

  const {
    isInstanceModalOpen,
    selectedOption,
    openInstanceModal,
    closeInstanceModal,
  } = useInstanceModal();

  const {
    isConfirmModalOpen,
    success,
    openConfirmModal,
    closeConfirmModal,
    setSuccess,
  } = useConfirmModal();

  const { isToggled, handleToggle } = useToggleButton(
    settingRef.current?.receivingAlarm ? true : false
  );

  const [disabled, setDisabled] = useState(true);

  const initialState = useRef({
    nickName: SettingSSR?.nickName,
    monitoringSshId: SettingSSR?.monitoringSshId,
    sshInfos: SettingSSR?.sshInfos,
    receivingAlarm: SettingSSR?.receivingAlarm,
  });

  useEffect(() => {
    const isChanged =
      nickname !== initialState.current.nickName ||
      selectedSshId !== initialState.current.monitoringSshId ||
      isToggled !== initialState.current.receivingAlarm ||
      !isEqual(sshList, initialState.current.sshInfos);

    setDisabled(isChanged && isValidNickname ? false : true);
  }, [nickname, selectedSshId, isToggled, sshList, isValidNickname]);

  const handleEditButton = async () => {
    if (disabled) return;
    const nickName = nickname;
    const receivingAlarm = isToggled;
    const sshInfos = sshList.map(
      ({ remoteName, remoteHost, remoteKeyPath }) => ({
        remoteName,
        remoteHost,
        remoteKeyPath,
      })
    );
    console.log("nickName: " + nickName);
    console.log("receivingAlarm: ", receivingAlarm);
    console.log("monitoringSshHost: ", monitoringSshHost);
    console.log("sshInfos: ", sshInfos);

    if (monitoringSshHost) {
      const result = await editSetting(
        nickName,
        receivingAlarm,
        monitoringSshHost,
        sshInfos
      );
      setSuccess(result);
      openConfirmModal();
    }
  };

  console.log("SettingSSR: ", SettingSSR);

  return (
    <Layout nickname={nicknameRef.current?.nickName || null}>
      <div className="px-5 xs:px-7 sm:px-10 max-w-[1200px]">
        <div className="h-[640px] xs:h-[670px] sm:h-[700px]">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row justify-start items-center">
              <span className="text-[24px] xs:text-[30px] sm:text-[36px] text-black font-bold pl-1">
                설정
              </span>
            </div>
            <div className="flex flex-row justify-start items-center">
              <DropdownMenu options={["license", "key", "withdraw"]} />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center w-full px-1 mt-6 xs:mt-7 sm:mt-8">
            <div className="text-[18px] xs:text-[20px] sm:text-[22px]">
              알람 설정
            </div>
            <ToggleButton isToggled={isToggled} onToggle={handleToggle} />
          </div>
          <div className="flex flex-col justify-start items-center relative w-full mt-10 xs:mt-12 sm:mt-14">
            <Input
              type="text"
              label="닉네임"
              placeholder="닉네임을 입력해주세요."
              value={nickname}
              onChange={handleNicknameChange}
              maxWidth="1200px"
            />
            <div
              className={cls(
                "w-full max-w-[1200px] absolute top-[44px] xs:top-[49px] sm:top-[54px] text-[11px] xs:text-[12px] sm:text-[13px] font-semibold px-1 mt-0.5",
                isValidNickname ? "text-blue-400" : "text-red-400",
                isNicknameEdited ? "visible" : "hidden"
              )}
            >
              {nicknameMsg}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center w-full px-1 mt-6 xs:mt-7 sm:mt-8">
            <div className="text-[18px] xs:text-[20px] sm:text-[22px]">
              클라우드 인스턴스
            </div>
            <div>
              <Image
                src="/images/add-1.svg"
                alt="add-1"
                width={25}
                height={22}
                className="w-[19px] h-[16px] xs:w-[22px] xs:h-[19px] sm:w-[25px] sm:h-[22px] cursor-pointer"
                onClick={() => openInstanceModal("add")}
                priority
              />
            </div>
          </div>
          <InstanceList
            monitoringSshId={selectedSshId}
            setMonitoringSshId={SetSelectedSshId}
            setMonitoringSshHost={setMonitoringSshHost}
            sshInfos={sshList}
            setSshInfos={setSshList}
          />
        </div>
        <div className="flex flex-row justify-end items-center w-full">
          <ButtonSmall
            label="수정"
            onClick={handleEditButton}
            disabled={disabled}
          />
        </div>
      </div>
      <InstanceModal
        isOpen={isInstanceModalOpen}
        onClose={closeInstanceModal}
        option={selectedOption}
        sshInfos={sshList}
        setSshInfos={setSshList}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        option="editSetting"
        success={success}
      />
    </Layout>
  );
}
