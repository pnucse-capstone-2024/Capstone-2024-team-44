import { useState } from "react";
import { useSSHCommand } from "./use-ssh-command";
import { TerminalInput } from "@/types/project/project-type";

interface UseShellModalReturn {
  isShellModalOpen: boolean;
  openShellModal: () => Promise<void>;
  closeShellModal: () => void;
  inputs: TerminalInput[];
  setInputs: React.Dispatch<React.SetStateAction<TerminalInput[]>>;
  handleCommandSubmit: (command: string) => Promise<void>;
}

export default function useShellModal(): UseShellModalReturn {
  const {
    inputs,
    setInputs,
    handleCommandSubmit,
    connectSocket,
    disconnectSocket,
  } = useSSHCommand();
  const [isShellModalOpen, setIsShellModalOpen] = useState(false);

  const openShellModal = async () => {
    try {
      await connectSocket();
      setIsShellModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const closeShellModal = () => {
    setIsShellModalOpen(false);
    disconnectSocket();
  };

  return {
    isShellModalOpen,
    openShellModal,
    closeShellModal,
    inputs,
    setInputs,
    handleCommandSubmit,
  };
}
