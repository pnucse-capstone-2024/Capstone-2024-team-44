import { useState } from "react";

export default function useInstanceModal() {
  const [isInstanceModalOpen, setIsInstanceModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const openInstanceModal = (option: string) => {
    setIsInstanceModalOpen(true);
    setSelectedOption(option);
  };

  const closeInstanceModal = () => {
    setIsInstanceModalOpen(false);
    setSelectedOption("");
  };

  return {
    isInstanceModalOpen,
    selectedOption,
    openInstanceModal,
    closeInstanceModal,
  };
}
