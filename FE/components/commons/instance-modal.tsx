import React, { useEffect, useState } from "react";
import Input from "./input";
import ButtonSmall from "./button-small";
import useInstanceCheck from "@/hooks/commons/use-instance-check";
import { cls } from "@/utils/class-utils";
import { SshInfo } from "@/types/setting/setting-type";
import InstanceValidationModal from "./instance-validation-modal";
import useConfirmModal from "@/hooks/commons/use-confirm-modal";
import useInstanceValidationModal from "@/hooks/commons/use-instance-validation-modal";
import ConfirmModal from "./confirm-modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  option: string;
  sshInfos: SshInfo[];
  setSshInfos: React.Dispatch<React.SetStateAction<SshInfo[]>>;
  ssh?: SshInfo;
  reconnect?: boolean;
}

export default function InstanceModal({
  isOpen,
  onClose,
  option,
  sshInfos,
  setSshInfos,
  ssh = {
    id: 0,
    remoteName: "",
    remoteHost: "",
    remoteKeyPath: "",
    isWorking: false,
  },
}: // reconnect = false,
ModalProps) {
  const {
    remoteName,
    remoteHost,
    remoteKeyPath,
    remoteNameMsg,
    remoteHostMsg,
    remoteKeyPathMsg,
    isValidRemoteName,
    isValidRemoteHost,
    isValidRemoteKeyPath,
    isValidInstance,
    isRemoteNameEdited,
    isRemoteHostEdited,
    handleRemoteNameChange,
    handleRemoteHostChange,
    handleRemoteKeyPathChange,
    checkInstanceValidity,
    resetRemoteValues,
  } = useInstanceCheck(ssh.remoteName, ssh.remoteHost, ssh.remoteKeyPath);

  const {
    isInstanceValidationModalOpen,
    openInstanceValidationModal,
    closeInstanceValidationModal,
  } = useInstanceValidationModal();

  const {
    isConfirmModalOpen,
    success,
    openConfirmModal,
    closeConfirmModal,
    setSuccess,
  } = useConfirmModal();

  const [disabled, setDisabled] = useState(true);
  const [confirmModalOption, setConfirmModalOption] = useState<string>(option);

  useEffect(() => {
    if (
      (remoteName === ssh.remoteName &&
        remoteHost === ssh.remoteHost &&
        remoteKeyPath === ssh.remoteKeyPath) ||
      remoteName === "" ||
      remoteHost === "" ||
      remoteKeyPath === ""
    )
      setDisabled(true);
    else setDisabled(false);
  }, [
    remoteName,
    remoteHost,
    remoteKeyPath,
    ssh.remoteName,
    ssh.remoteHost,
    ssh.remoteKeyPath,
    setDisabled,
  ]);

  const handleSave = () => {
    if (option === "add") {
      const newSsh: SshInfo = {
        id: sshInfos.length + 1,
        remoteName,
        remoteHost,
        remoteKeyPath,
        isWorking: true,
      };
      setSshInfos((prev) => [...prev, newSsh]);
    } else {
      setSshInfos((prev) =>
        prev.map((item) =>
          item.id === ssh.id
            ? {
                ...item,
                remoteName,
                remoteHost,
                remoteKeyPath,
                isWorking: true,
              }
            : item
        )
      );
    }
  };

  const handleDelete = () => {
    setSshInfos((prev) => prev.filter((item) => item.id !== ssh.id));
  };

  const handleSaveButton = async () => {
    setConfirmModalOption(option === "add" ? "addNewInstance" : "editInstance");
    openInstanceValidationModal();
    await checkInstanceValidity();
  };

  const handleDeleteButton = async () => {
    setConfirmModalOption("deleteInstance");
    setSuccess(true);
    handleDelete();
    openConfirmModal();
  };

  const handleReconnectButton = async () => {
    setConfirmModalOption("reconnectInstance");
    openInstanceValidationModal();
    await checkInstanceValidity();

    if (isValidInstance) {
      setSshInfos((prevSshInfos) =>
        prevSshInfos.map((info) =>
          info.id === ssh.id ? { ...info, isWorking: true } : info
        )
      );
    }
  };

  const handleValidButton = () => {
    setSuccess(true);
    handleSave();
    openConfirmModal();
    closeInstanceValidationModal();
  };

  const handeInvalidButton = () => {
    setSuccess(false);
    openConfirmModal();
    closeInstanceValidationModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-hidden">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={() => {
          resetRemoteValues();
          onClose();
        }}
      ></div>
      <div className="w-[90%] xs:w-[80%] sm:w-[75%] lg:w-[770px] bg-white px-6 xs:px-8 sm:px-10 py-4 xs:py-5 sm:py-6 rounded-xl shadow-lg z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-[24px] xs:text-[26px] sm:text-[28px] font-bold ml-1">
            {option === "add"
              ? "인스턴스 추가"
              : option === "edit"
              ? "인스턴스 상세정보"
              : "인스턴스 재연결"}
          </div>
          <div
            className="flex flex-row justify-center items-center w-[24px] xs:w-[27px] sm:w-[30px] h-[24px] xs:h-[27px] sm:h-[30px] rounded-full bg-[#E5E5E5] hover:bg-gray-300 text-[12px] xs:text-[14px] sm:text-[16px] mr-1 cursor-pointer"
            onClick={() => {
              resetRemoteValues();
              onClose();
            }}
          >
            ✕
          </div>
        </div>
        <div className="flex flex-col justify-start items-start overflow-y-hidden gap-8 xs:gap-9 sm:gap-10 pt-8 xs:pt-9 sm:pt-10 pb-3 xs:pb-4 sm:pb-5 mt-3 xs:mt-4 sm:mt-5 px-0.5">
          <div className="flex flex-col justify-start items-start relative w-full">
            <Input
              type="text"
              label="원격 서버 사용자"
              placeholder="원격 서버의 사용자명을 입력해주세요."
              value={remoteName}
              onChange={handleRemoteNameChange}
              readOnly={option === "reconnect" ? true : false}
            />
            <div
              className={cls(
                "w-full max-w-[605px] absolute top-[44px] xs:top-[49px] sm:top-[54px] text-[11px] xs:text-[12px] sm:text-[13px] font-semibold px-1 mt-0.5",
                isValidRemoteName ? "text-blue-400" : "text-red-400",
                isRemoteNameEdited ? "visible" : "hidden"
              )}
            >
              {remoteNameMsg}
            </div>
          </div>
          <div className="flex flex-col justify-start items-start relative w-full mt-4 xs:mt-5 sm:mt-6">
            <Input
              type="text"
              label="호스트"
              placeholder="원격 서버의 IP 주소를 입력해주세요."
              value={remoteHost}
              onChange={handleRemoteHostChange}
              readOnly={option === "reconnect" ? true : false}
            />
            <div
              className={cls(
                "w-full max-w-[605px] absolute top-[44px] xs:top-[49px] sm:top-[54px] text-[11px] xs:text-[12px] sm:text-[13px] font-semibold px-1 mt-0.5",
                isValidRemoteHost ? "text-blue-400" : "text-red-400",
                isRemoteHostEdited ? "visible" : "hidden"
              )}
            >
              {remoteHostMsg}
            </div>
          </div>
          <div className="flex flex-col justify-start items-start relative w-full mt-4 xs:mt-5 sm:mt-6">
            <Input
              type="text"
              label="프라이빗 키"
              placeholder="SSH pem 키를 업로드해주세요."
              value={remoteKeyPath}
              onChange={handleRemoteKeyPathChange}
              readOnly
              disabled={option === "reconnect" ? true : false}
            />
            <div
              className={cls(
                "w-full max-w-[605px] absolute top-[44px] xs:top-[49px] sm:top-[54px] text-[11px] xs:text-[12px] sm:text-[13px] font-semibold px-1 mt-0.5",
                isValidRemoteKeyPath ? "text-blue-400" : "text-red-400"
              )}
            >
              {remoteKeyPathMsg}
            </div>
          </div>
        </div>
        {option === "add" ? (
          <div className="flex flex-row justify-center items-center w-full my-4 xs:my-5 sm:my-6 transition-colors">
            <ButtonSmall
              label="완료"
              onClick={handleSaveButton}
              disabled={disabled}
              type="modal"
            />
          </div>
        ) : option === "edit" ? (
          <div className="flex flex-row justify-center items-center w-full my-4 xs:my-5 sm:my-6 gap-3 xs:gap-4 sm:gap-5 transition-colors">
            <ButtonSmall
              label="삭제"
              onClick={handleDeleteButton}
              type="modal"
            />
            <ButtonSmall
              label="수정"
              onClick={handleSaveButton}
              disabled={disabled}
              type="modal"
            />
          </div>
        ) : (
          <div className="flex flex-row justify-center items-center w-full my-4 xs:my-5 sm:my-6 transition-colors">
            <ButtonSmall
              label="재연결"
              onClick={handleReconnectButton}
              type="modal"
            />
          </div>
        )}
      </div>
      <InstanceValidationModal
        isOpen={isInstanceValidationModalOpen}
        onValidClose={handleValidButton}
        onInvalidClose={handeInvalidButton}
        isValid={isValidInstance}
        ip={remoteHost}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          resetRemoteValues();
          closeConfirmModal();
          onClose();
        }}
        option={confirmModalOption}
        success={success}
        overlay={false}
      />
    </div>
  );
}
