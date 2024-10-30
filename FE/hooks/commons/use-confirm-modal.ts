import { useState } from "react";

export default function useConfirmModal() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  return {
    isConfirmModalOpen,
    success,
    openConfirmModal,
    closeConfirmModal,
    setSuccess,
  };
}
