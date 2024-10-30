import { useState, useEffect } from "react";
import useTimer from "./use-timer";
import {
  CheckEmailDuplication,
  CheckRegisteredEmail,
  ResendCode,
  VerifyEmailCode,
} from "@/api/login/signup-api";
import {
  validateEmailDomainPart,
  validateEmailLocalPart,
} from "@/utils/validation-utils";
import {
  calculateRemainingTime,
  getSessionStorageKey,
} from "@/utils/timer-utils";

interface UseEmailCheckReturn {
  email: string;
  code: string;
  isValidEmail: boolean | null;
  isValidCode: boolean | null;
  emailMsg: string;
  codeMsg: string;
  timer: number;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  verifyEmail: () => Promise<void>;
  verifyCode: () => Promise<void>;
  resendCode: () => Promise<void>;
}

export default function useEmailCheck(type: string): UseEmailCheckReturn {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isValidCode, setIsValidCode] = useState<boolean>(false);
  const [emailMsg, setEmailMsg] = useState<string>("");
  const [codeMsg, setCodeMsg] = useState<string>("");

  const { timer, startTimer, resetTimer } = useTimer(180);

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);

    if (inputEmail.trim() === "") {
      setIsValidEmail(false);
      setEmailMsg("");
    }
  };

  const handleCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputCode = event.target.value;
    setCode(inputCode);

    if (inputCode.trim() === "") {
      setIsValidCode(false);
      setCodeMsg("");
    }
  };

  useEffect(() => {
    if (timer === 0) {
      setCode("");
      setIsValidCode(false);
      setCodeMsg("인증번호 확인 시간이 만료되었습니다.");
    }
  }, [timer]);

  const validateEmail = (): boolean => {
    if (email === "") {
      setEmailMsg("");
      return false;
    } else if (!email.includes("@")) {
      setEmailMsg("'@'를 포함한 올바른 이메일 주소를 입력해주세요.");
      return false;
    } else {
      const [localPart, domainPart] = email.split("@");

      if (!validateEmailLocalPart(localPart)) {
        setEmailMsg("영문, 숫자, 특수문자(._%+-)만 사용 가능합니다.");
        return false;
      } else if (!validateEmailDomainPart(domainPart)) {
        setEmailMsg("올바른 도메인 형식을 입력해주세요. 예: domain.com");
        return false;
      }
    }

    return true;
  };

  const verifyEmail = async (): Promise<void> => {
    const isValid = validateEmail();
    if (!isValid) {
      setIsValidEmail(false);
      return;
    }

    try {
      const isAvailable =
        type === "join"
          ? await CheckEmailDuplication(email)
          : await CheckRegisteredEmail(email);
      const sessionStorageKey = getSessionStorageKey(email);
      const savedTimestamp = sessionStorage.getItem(sessionStorageKey);

      if (isAvailable) {
        if (savedTimestamp) {
          const remaining = calculateRemainingTime(Number(savedTimestamp));
          if (remaining > 0 && remaining <= 180) {
            console.log("타이머 재설정 시작.");
            setIsValidEmail(true);
            setEmailMsg("인증번호를 이미 발송하였습니다.");
            resetTimer();
            startTimer(remaining);
          } else {
            sessionStorage.setItem(sessionStorageKey, Date.now().toString());
            setIsValidEmail(true);
            type === "join"
              ? setEmailMsg("사용 가능한 이메일입니다.")
              : setEmailMsg("가입된 이메일입니다.");
            resetTimer();
            startTimer(180);
          }
        } else {
          sessionStorage.setItem(sessionStorageKey, Date.now().toString());
          setIsValidEmail(true);
          type === "join"
            ? setEmailMsg("사용 가능한 이메일입니다.")
            : setEmailMsg("가입된 이메일입니다.");
          resetTimer();
          startTimer(180);
        }
      } else {
        setIsValidEmail(false);
        type === "join"
          ? setEmailMsg("이미 존재하는 이메일입니다.")
          : setEmailMsg("가입되지 않은 이메일입니다.");
      }
      setCodeMsg("");
    } catch (error) {
      console.error("이메일 중복 확인 중 오류 발생:", error);
      setIsValidEmail(false);
      setEmailMsg("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const verifyCode = async (): Promise<void> => {
    try {
      const isMatching = await VerifyEmailCode(email, code, type);
      setIsValidCode(isMatching ? true : false);
      setCodeMsg(
        isMatching ? "인증번호가 일치합니다." : "인증번호가 일치하지 않습니다."
      );
    } catch (error) {
      setIsValidCode(false);
      setCodeMsg("인증번호 확인 중 오류가 발생했습니다.");
      console.error("인증번호 확인 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (code) {
        await verifyCode();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [code]);

  const resendCode = async (): Promise<void> => {
    if (timer > 0) return;

    try {
      const result = await ResendCode(email, type);
      if (result) {
        getSessionStorageKey(email);
        setCode("");
        setIsValidCode(false);
        setCodeMsg("");
        resetTimer();
        startTimer(180);
      }
    } catch (error) {
      setCode("");
      setIsValidCode(false);
      setCodeMsg("인증번호 요청 중 오류가 발생했습니다.");
      console.error("인증번호 요청 중 오류 발생:", error);
    }
  };

  return {
    email,
    code,
    isValidEmail,
    isValidCode,
    emailMsg,
    codeMsg,
    timer,
    handleEmailChange,
    handleCodeChange,
    verifyEmail,
    verifyCode,
    resendCode,
  };
}
