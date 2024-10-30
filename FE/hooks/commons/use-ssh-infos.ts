import { SSHInfo } from "@/types/login/login-type";
import { useState } from "react";

export default function useSSHInfos() {
  const SSH_INFOS_KEY = "sshInfos";

  const [sshInfos, setSSHInfos] = useState<SSHInfo[]>([]);

  const saveSSHInfosToSession = (infos: SSHInfo[]) => {
    sessionStorage.setItem(SSH_INFOS_KEY, JSON.stringify(infos));
  };

  const getSSHInfosFromSession = (): SSHInfo[] => {
    const storedData = sessionStorage.getItem(SSH_INFOS_KEY);
    return storedData ? JSON.parse(storedData) : [];
  };

  const addSSHInfo = (info: SSHInfo) => {
    const updatedInfos = [...sshInfos, info];
    setSSHInfos(updatedInfos);
    saveSSHInfosToSession(updatedInfos);
    sessionStorage.setItem("monitoringSshHost", info.remoteHost);
  };

  const resetSSHInfos = () => {
    setSSHInfos([]);
    sessionStorage.removeItem(SSH_INFOS_KEY);
  };

  return {
    sshInfos,
    saveSSHInfosToSession,
    getSSHInfosFromSession,
    addSSHInfo,
    resetSSHInfos,
  };
}
