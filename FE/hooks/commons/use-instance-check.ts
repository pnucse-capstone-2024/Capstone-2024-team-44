import { useState, useEffect } from "react";
import { filterInput } from "@/utils/ip-utils";
import useIsMobile from "./use-is-mobile";
import { validateHost, validateName } from "@/utils/instance-validation-utils";
import { SSHPemKeyUpload, validateInstance } from "@/api/login/signup-api";

interface UseInstanceCheckReturn {
  remoteName: string;
  remoteHost: string;
  remoteKeyPath: string;
  remoteNameMsg: string;
  remoteHostMsg: string;
  remoteKeyPathMsg: string;
  isValidRemoteName: boolean;
  isValidRemoteHost: boolean;
  isValidRemoteKeyPath: boolean;
  isValidInstance: boolean | null;
  isRemoteNameEdited: boolean;
  isRemoteHostEdited: boolean;
  handleRemoteNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoteHostChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoteKeyPathChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  checkInstanceValidity: () => void;
  resetRemoteValues: () => void;
}

export default function useInstanceCheck(
  initialRemoteName: string = "",
  initialRemoteHost: string = "",
  initialRemoteKeyPath: string = ""
): UseInstanceCheckReturn {
  const [remoteName, setRemoteName] = useState<string>("");
  const [remoteHost, setRemoteHost] = useState<string>("");
  const [remoteKeyPath, setRemoteKeyPath] = useState<string>("");
  const [isValidRemoteName, setIsValidRemoteName] = useState<boolean>(false);
  const [isValidRemoteHost, setIsValidRemoteHost] = useState<boolean>(false);
  const [isValidRemoteKeyPath, setIsValidRemoteKeyPath] =
    useState<boolean>(false);
  const [remoteNameMsg, setRemoteNameMsg] = useState<string>("");
  const [remoteHostMsg, setRemoteHostMsg] = useState<string>("");
  const [remoteKeyPathMsg, setRemoteKeyPathMsg] = useState<string>("");
  const [isRemoteNameEdited, setIsRemoteNameEdited] = useState(false);
  const [isRemoteHostEdited, setIsRemoteHostEdited] = useState(false);
  const [isRemoteKeyPathEdited, setIsRemoteKeyPathEdited] = useState(false);

  const [isValidInstance, setIsValidInstance] = useState<boolean | null>(null);

  const isMobile = useIsMobile(640);

  useEffect(() => {
    setRemoteName(initialRemoteName);
    setRemoteHost(initialRemoteHost);
    setRemoteKeyPath(initialRemoteKeyPath);
  }, [initialRemoteName, initialRemoteHost, initialRemoteKeyPath]);

  const handleRemoteNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { isValid, message } = validateName(
      event.target.value,
      initialRemoteName
    );
    setRemoteName(event.target.value);
    setRemoteNameMsg(message);
    setIsValidRemoteName(isValid);
    setIsRemoteNameEdited(true);
  };

  const handleRemoteHostChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const cleanedInput = filterInput(
      event.target.value,
      event.target.value.includes(":")
    );
    const { isValid, message } = validateHost(
      cleanedInput,
      initialRemoteHost,
      isMobile
    );
    setRemoteHost(cleanedInput);
    setRemoteHostMsg(message);
    setIsValidRemoteHost(isValid);
    setIsRemoteHostEdited(true);
  };

  const handleRemoteKeyPathChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await SSHPemKeyUpload(file);
    if (result && typeof result === "string") {
      setRemoteKeyPath(result);
      setIsValidRemoteKeyPath(true);
      setRemoteKeyPathMsg("프라이빗 키 업로드가 완료되었습니다.");
    } else {
      setRemoteKeyPath("");
      setIsValidRemoteKeyPath(false);
      setRemoteKeyPathMsg(
        "프라이빗 키 업로드에 실패했습니다. 다시 시도해주세요."
      );
    }

    if (!isRemoteKeyPathEdited) setIsRemoteKeyPathEdited(true);
  };

  useEffect(() => {
    if (remoteHost.includes(":") && !isValidRemoteHost) {
      setRemoteHostMsg(
        isMobile
          ? "IPv6 형식에 맞춰 입력하세요. 예: 2001:db8::1"
          : "IPv6 형식에 맞춰 입력하세요. 예: 2001:0db8:85a3:0000:0000:8a2e:0370:7334"
      );
    }
  }, [isMobile, isValidRemoteHost, remoteHost]);

  const checkInstanceValidity = async (): Promise<void> => {
    const isValid = await validateInstance({
      remoteName,
      remoteHost,
      remoteKeyPath,
    });
    setIsValidInstance(isValid);
  };

  const resetRemoteValues = () => {
    setRemoteName(initialRemoteName);
    setRemoteHost(initialRemoteHost);
    setRemoteKeyPath(initialRemoteKeyPath);
    setIsValidRemoteName(false);
    setIsValidRemoteHost(false);
    setIsValidRemoteKeyPath(false);
    setRemoteNameMsg("");
    setRemoteHostMsg("");
    setRemoteKeyPathMsg("");
    setIsValidInstance(null);
  };

  return {
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
  };
}
