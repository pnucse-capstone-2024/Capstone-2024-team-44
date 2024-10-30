import { useState } from "react";

export default function useInsightRecordModal() {
  const [isInsightRecordModalOpen, setIsInsightRecordModalOpen] =
    useState(false);

  const openInsightRecordModal = () => {
    setIsInsightRecordModalOpen(true);
  };

  const closeInsightRecordModal = () => {
    setIsInsightRecordModalOpen(false);
  };

  return {
    isInsightRecordModalOpen,
    openInsightRecordModal,
    closeInsightRecordModal,
  };
}
