import { ResetNewPassword } from "@/api/login/signup-api";
import { validatePassword } from "@/utils/validation-utils";
import { useState, useEffect } from "react";

interface UsePasswordCheckReturn {
  password: string;
  passwordConfirm: string;
  isValidPassword: boolean | null;
  isPasswordMatching: boolean | null;
  validationMessage: string;
  confirmMessage: string;
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordConfirmChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  resetNewPassword: () => Promise<boolean>;
}

export default function usePasswordCheck(): UsePasswordCheckReturn {
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const [isPasswordMatching, setIsPasswordMatching] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [confirmMessage, setConfirmMessage] = useState<string>("");

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);

    if (inputPassword.trim() === "") {
      setIsValidPassword(false);
      setValidationMessage("");
      setPasswordConfirm("");
    }
  };

  const handlePasswordConfirmChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputPasswordConfrim = event.target.value;
    setPasswordConfirm(inputPasswordConfrim);

    if (inputPasswordConfrim.trim() === "") {
      setIsPasswordMatching(false);
      setConfirmMessage("");
    }
  };

  useEffect(() => {
    if (password) {
      if (
        validatePassword(password) &&
        password.length >= 8 &&
        password.length <= 20
      ) {
        setIsValidPassword(true);
        setValidationMessage("사용 가능한 비밀번호입니다.");
      } else {
        setIsValidPassword(false);
        setValidationMessage(
          "비밀번호는 8-20자, 문자, 숫자, 특수문자를 포함해야 합니다."
        );
        setPasswordConfirm("");
      }
    }

    if (isValidPassword && password && passwordConfirm) {
      setIsPasswordMatching(password === passwordConfirm);
      setConfirmMessage(
        password === passwordConfirm
          ? "비밀번호가 일치합니다."
          : "비밀번호가 일치하지 않습니다."
      );
    } else {
      setConfirmMessage("");
    }
  }, [password, passwordConfirm, isValidPassword]);

  const resetNewPassword = async () => {
    const code = sessionStorage.getItem("code");
    if (code) {
      const result = await ResetNewPassword(code, password);
      return result;
    }
    return false;
  };

  return {
    password,
    passwordConfirm,
    isValidPassword,
    isPasswordMatching,
    validationMessage,
    confirmMessage,
    handlePasswordChange,
    handlePasswordConfirmChange,
    resetNewPassword,
  };
}
