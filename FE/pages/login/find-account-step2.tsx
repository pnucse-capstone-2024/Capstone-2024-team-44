import ButtonLarge from "@/components/commons/button-large";
import ConfirmModal from "@/components/commons/confirm-modal";
import Input from "@/components/commons/input";
import Logo from "@/components/commons/logo";
import usePasswordCheck from "@/hooks/login/use-password-check";
import { cls } from "@/utils/class-utils";
import { useEffect, useState } from "react";

export default function FindAccountStep2() {
  const {
    password,
    passwordConfirm,
    isValidPassword,
    isPasswordMatching,
    validationMessage,
    confirmMessage,
    handlePasswordChange,
    handlePasswordConfirmChange,
    resetNewPassword,
  } = usePasswordCheck();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(isValidPassword && isPasswordMatching ? false : true);
  }, [isValidPassword, isPasswordMatching]);

  const handleNextButton = async (): Promise<void> => {
    if (disabled) return;
    const result = await resetNewPassword();
    setSuccess(result);
    openConfirmModal();
  };

  return (
    <div>
      <div className="flex flex-col justify-start items-center w-screen max-w-[605px] mx-auto h-[500px] xs:h-[553px] sm:h-[618px] gap-8 xs:gap-9 sm:gap-10 px-6 pt-[15vh] overflow-y-auto overflow-x-hidden">
        <Logo />
        <div className="flex flex-col justify-start items-center relative w-full mt-8 xs:mt-9 sm:mt-10">
          <Input
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={handlePasswordChange}
          />
          <div
            className={cls(
              "w-full max-w-[605px] absolute top-[44px] xs:top-[49px] sm:top-[54px] text-[11px] xs:text-[12px] sm:text-[13px] font-semibold px-1 mt-0.5",
              isValidPassword ? "text-blue-400" : "text-red-400"
            )}
          >
            {validationMessage}
          </div>
        </div>
        <div className="flex flex-col justify-start items-center relative w-full mt-5 xs:mt-6 sm:mt-7">
          <Input
            type="password"
            label="비밀번호 확인"
            placeholder="비밀번호를 입력해주세요."
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            readOnly={isValidPassword ? false : true}
          />
          <div
            className={cls(
              "w-full max-w-[605px] absolute top-[44px] xs:top-[49px] sm:top-[54px] text-[11px] xs:text-[12px] sm:text-[13px] font-semibold px-1 mt-0.5",
              isPasswordMatching ? "text-blue-400" : "text-red-400"
            )}
          >
            {confirmMessage}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center w-full max-w-[605px] mx-auto px-6 pb-[15vh]">
        <ButtonLarge
          label="다음"
          kind="check"
          disabled={disabled}
          onClick={handleNextButton}
        />
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        option="resetNewPassword"
        success={success}
      />
    </div>
  );
}
