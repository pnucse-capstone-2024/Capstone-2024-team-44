import { useState } from "react";

export default function useActionConfirmModal() {
  const [isActionConfirmModalOpen, setIsActionConfirmModalOpen] =
    useState(false);

  const openActionConfirmModal = () => {
    setIsActionConfirmModalOpen(true);
  };

  const closeActionConfirmModal = () => {
    setIsActionConfirmModalOpen(false);
  };

  return {
    isActionConfirmModalOpen,
    openActionConfirmModal,
    closeActionConfirmModal,
  };
}
