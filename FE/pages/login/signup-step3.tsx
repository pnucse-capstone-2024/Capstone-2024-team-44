import ButtonSmall from "@/components/commons/button-small";
import Input from "@/components/commons/input";
import Logo from "@/components/commons/logo";
import useInstanceCheck from "@/hooks/commons/use-instance-check";
import { cls } from "@/utils/class-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InstanceValidationModal from "@/components/commons/instance-validation-modal";
import useSSHInfos from "@/hooks/commons/use-ssh-infos";

export default function SignupStep3() {
  const router = useRouter();

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
    handleRemoteNameChange,
    handleRemoteHostChange,
    handleRemoteKeyPathChange,
    checkInstanceValidity,
    resetRemoteValues,
  } = useInstanceCheck();

  const { addSSHInfo } = useSSHInfos();

  const [disabled, setDisabled] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    setDisabled(
      isValidRemoteName && isValidRemoteHost && isValidRemoteKeyPath
        ? false
        : true
    );
  }, [isValidRemoteName, isValidRemoteHost, isValidRemoteKeyPath]);

  const handleNextButton = async () => {
    if (disabled) return;
    setIsConfirmModalOpen(true);
    await checkInstanceValidity();
  };

  const handleValidButton = () => {
    addSSHInfo({ remoteName, remoteHost, remoteKeyPath });
    sessionStorage.setItem("monitoringSshHost", remoteHost);
    router.push("/login/signup-step4");
  };

  const handeInvalidButton = () => {
    resetRemoteValues();
    setIsConfirmModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col justify-start items-center w-screen max-w-[605px] mx-auto h-[680px] xs:h-[720px] sm:h-[760px] gap-8 xs:gap-9 sm:gap-10 px-6 pt-[15vh] overflow-y-auto overflow-x-hidden">
        <Logo />
        <div className="flex flex-col justify-start items-center relative w-full mt-8 xs:mt-9 sm:mt-10">
          <Input
            type="text"
            label="원격 서버 사용자"
            placeholder="원격 서버의 사용자명을 입력해주세요."
            value={remoteName}
            onChange={handleRemoteNameChange}
          />
          <div
            className={cls(
              "w-full max-w-[605px] absolute top-[44px] xs:top-[49px] sm:top-[54px] text-[11px] xs:text-[12px] sm:text-[13px] font-semibold px-1 mt-0.5",
              isValidRemoteName ? "text-blue-400" : "text-red-400"
            )}
          >
            {remoteNameMsg}
          </div>
        </div>
        <div className="flex flex-col justify-start items-center relative w-full mt-5 xs:mt-6 sm:mt-7">
          <Input
            type="text"
            label="호스트"
            placeholder="원격 서버의 IP 주소를 입력해주세요."
            value={remoteHost}
            onChange={handleRemoteHostChange}
          />
          <div
            className={cls(
              "w-full max-w-[605px] absolute top-[44px] xs:top-[49px] sm:top-[54px] text-[11px] xs:text-[12px] sm:text-[13px] font-semibold px-1 mt-0.5",
              isValidRemoteHost ? "text-blue-400" : "text-red-400"
            )}
          >
            {remoteHostMsg}
          </div>
        </div>
        <div className="flex flex-col justify-start items-center relative w-full mt-5 xs:mt-6 sm:mt-7">
          <Input
            type="text"
            label="프라이빗 키"
            placeholder="SSH pem 키를 업로드해주세요."
            value={remoteKeyPath}
            onChange={handleRemoteKeyPathChange}
            readOnly
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
      <div className="flex flex-row justify-end items-center gap-1 xs:gap-2 sm:gap-3 w-full max-w-[605px] mx-auto px-6 pb-[15vh]">
        <button
          className="h-[45px] xs:h-[50px] sm:h-[55px] text-[16px] xs:text-[18px] sm:text-[20px] rounded-md bg-white text-black font-semibold px-[20px] xs:px-[22px] sm:px-[24px]"
          onClick={() => router.push("/login/signup-step2")}
        >
          취소
        </button>
        <ButtonSmall
          label="다음"
          disabled={disabled}
          onClick={handleNextButton}
        />
      </div>
      <InstanceValidationModal
        isOpen={isConfirmModalOpen}
        onValidClose={handleValidButton}
        onInvalidClose={handeInvalidButton}
        isValid={isValidInstance}
        ip={remoteHost}
      />
    </div>
  );
}
