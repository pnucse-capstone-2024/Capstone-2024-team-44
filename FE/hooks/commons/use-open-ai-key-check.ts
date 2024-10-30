import { verifyOpenAIKey } from "@/api/login/signup-api";
import { useEffect, useState } from "react";

interface useOpenAIKeyCheckReturn {
  openAIKey: string;
  isVaildOpenAIKey: boolean | null;
  openAIKeyMsg: string;
  handleOpenAIKeyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function useOpenAIKeyCheck(): useOpenAIKeyCheckReturn {
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [isPossibleOpenAIKey, setIsPossibleOpenAIKey] =
    useState<boolean>(false);
  const [isVaildOpenAIKey, setIsValidOpenAIKey] = useState<boolean>(false);
  const [openAIKeyMsg, setOpenAIKeyMsg] = useState<string>("");

  const handleOpenAIKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputOpenAIKey = event.target.value.trim();
    setOpenAIKey(inputOpenAIKey);

    if (inputOpenAIKey.trim() === "") {
      setIsPossibleOpenAIKey(false);
      setOpenAIKeyMsg("");
      return;
    }

    if (/\s/.test(inputOpenAIKey)) {
      setIsPossibleOpenAIKey(false);
      setOpenAIKeyMsg("API 키에 공백이 포함될 수 없습니다.");
      return;
    }

    if (inputOpenAIKey.length < 20 || inputOpenAIKey.length > 60) {
      setIsPossibleOpenAIKey(false);
      setOpenAIKeyMsg("API 키의 길이가 유효하지 않습니다.");
      return;
    }

    if (!inputOpenAIKey.startsWith("sk-")) {
      setIsPossibleOpenAIKey(false);
      setOpenAIKeyMsg("API 키는 'sk-'로 시작해야 합니다.");
      return;
    }

    setIsPossibleOpenAIKey(true);
    setOpenAIKeyMsg("유효한 형식의 API 키입니다. 검증 중...");
  };

  useEffect(() => {
    if (!isPossibleOpenAIKey) return;

    const timer = setTimeout(async () => {
      const result = await verifyOpenAIKey(openAIKey);

      if (result) {
        setIsValidOpenAIKey(true);
        setOpenAIKeyMsg("유효한 API 키입니다.");
      } else {
        setIsValidOpenAIKey(false);
        setOpenAIKeyMsg("유효하지 않은 API 키입니다.");
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isPossibleOpenAIKey, openAIKey]);

  return {
    openAIKey,
    isVaildOpenAIKey,
    openAIKeyMsg,
    handleOpenAIKeyChange,
  };
}
