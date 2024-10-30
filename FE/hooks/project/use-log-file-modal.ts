import { useState } from "react";

export default function useLogFileModal() {
  const [isLogFileModalOpen, setIsLogFileModalOpen] = useState(false);

  const openLogFileModal = () => setIsLogFileModalOpen(true);
  const closeLogFileModal = () => setIsLogFileModalOpen(false);

  return {
    isLogFileModalOpen,
    openLogFileModal,
    closeLogFileModal,
  };
}
