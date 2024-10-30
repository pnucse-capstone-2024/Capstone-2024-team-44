import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useState } from "react";
import { requestLoginToken } from "@/api/login/login-api";
import { AccessToken } from "@/types/login/login-type";

interface UseLoginCheckReturn {
  email: string;
  password: string;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  verifyLogin: () => Promise<void>;
  isLoginFailed: boolean;
  setIsLoginFailed: (value: boolean) => void;
  LoginFailedMsg: string;
}

export const useLoginCheck = (): UseLoginCheckReturn => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoginFailed, setIsLoginFailed] = useState<boolean>(false);
  const [LoginFailedMsg, setLoginFailedMsg] = useState<string>("");

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);
  };

  const verifyLogin = async (): Promise<void> => {
    if (email === "" || password === "") return;

    const {
      success,
      message,
      result,
    }: { success: boolean; message: string; result: AccessToken | null } =
      await requestLoginToken(email, password);

    if (!success) {
      setIsLoginFailed(true);
      setLoginFailedMsg(message);
      console.log("Login failed: ", message);
      return;
    }

    if (result?.accessToken) {
      Cookies.set("accessToken", result?.accessToken, {
        secure: false,
        httpOnly: false,
        sameSite: "Lax",
        path: "/",
      });

      setIsLoginFailed(false);
      router.push("/dashboard");
    }
  };

  return {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    verifyLogin,
    isLoginFailed,
    setIsLoginFailed,
    LoginFailedMsg,
  };
};
