import { useState } from "react";

export default function useChatbotModal() {
  const [isChatbotModalOpen, setIschatbotModalOpen] = useState(false);

  const openChatbotModal = () => {
    setIschatbotModalOpen(true);
  };

  const closeChatbotModal = () => {
    setIschatbotModalOpen(false);
  };

  return {
    isChatbotModalOpen,
    openChatbotModal,
    closeChatbotModal,
  };
}
