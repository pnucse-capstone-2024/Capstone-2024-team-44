import ButtonLarge from "@/components/commons/button-large";
import ConfirmModal from "@/components/commons/confirm-modal";
import Input from "@/components/commons/input";
import Logo from "@/components/commons/logo";
import useConfirmModal from "@/hooks/commons/use-confirm-modal";
import { useLoginCheck } from "@/hooks/login/use-login-check";
import { useEffect } from "react";

export default function Login() {
  const {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    verifyLogin,
    isLoginFailed,
    setIsLoginFailed,
    LoginFailedMsg,
  } = useLoginCheck();

  const { isConfirmModalOpen, openConfirmModal, closeConfirmModal } =
    useConfirmModal();

  useEffect(() => {
    if (isLoginFailed) openConfirmModal();
  }, [isLoginFailed, openConfirmModal]);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen gap-8 xs:gap-9 sm:gap-10 px-6 pb-[15vh] overflow-y-auto overflow-x-hidden">
      <Logo />
      <div className="w-full max-w-[605px] mx-auto mt-4 xs:mt-5 sm:mt-6">
        <Input
          type="email"
          label="이메일"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div className="w-full max-w-[605px] mx-auto mt-1 xs:mt-2 sm:mt-3">
        <Input
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <ButtonLarge label="로그인" kind="login" onClick={verifyLogin} />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsLoginFailed(false);
          closeConfirmModal();
        }}
        option="loginFailure"
        message={LoginFailedMsg}
      />
    </div>
  );
}
