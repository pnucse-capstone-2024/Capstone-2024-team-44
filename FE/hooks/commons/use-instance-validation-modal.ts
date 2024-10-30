import { useState } from "react";

export default function useInstanceValidationModal() {
  const [isInstanceValidationModalOpen, setIsInstanceValidationModalOpen] =
    useState(false);

  const openInstanceValidationModal = () => {
    setIsInstanceValidationModalOpen(true);
  };

  const closeInstanceValidationModal = () => {
    setIsInstanceValidationModalOpen(false);
  };

  return {
    isInstanceValidationModalOpen,
    openInstanceValidationModal,
    closeInstanceValidationModal,
  };
}
