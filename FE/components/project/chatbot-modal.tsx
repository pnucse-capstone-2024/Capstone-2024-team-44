import React, { useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import useConfirmModal from "@/hooks/commons/use-confirm-modal";
import ConfirmModal from "../commons/confirm-modal";
import { useChatbotSSE } from "@/hooks/project/use-chatbot-sse";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  logFileList: string[];
}

export default function ChatbotModal({
  isOpen,
  onClose,
  logFileList,
}: ModalProps) {
  const {
    question,
    logSummary,
    chatbotMessageList,
    isConnected,
    handleQuestionChange,
    startSSE,
    stopSSE,
  } = useChatbotSSE({
    logFiles: logFileList.map((name) => ({ name })),
  });

  const { isConfirmModalOpen, openConfirmModal, closeConfirmModal } =
    useConfirmModal();

  const handleCloseModal = () => {
    stopSSE();
    closeConfirmModal();
    onClose();
  };

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logSummary, chatbotMessageList]);

  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      startSSE();
    }
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex flex-col justify-end sm:justify-center items-center z-50">
      <div className="fixed inset-0 bg-black opacity-0 sm:opacity-70"></div>
      <div className="flex flex-col justify-center items-center relative w-screen sm:w-[80%] sm:min-w-[548px] sm:max-w-[1000px] h-[calc(100vh-70px)] sm:h-[80%] bg-white p-4 xs:p-5 sm:p-6 rounded-none sm:rounded-xl shadow-lg z-10">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="text-[22px] xs:text-[24px] sm:text-[26px] font-bold ml-1 pr-5 truncate">
            질문하기
          </div>
          <div
            className="flex flex-row justify-center items-center w-[24px] xs:w-[27px] sm:w-[30px] h-[24px] xs:h-[27px] sm:h-[30px] rounded-full bg-[#E5E5E5] hover:bg-gray-300 text-[12px] xs:text-[14px] sm:text-[16px] mr-1 cursor-pointer"
            onClick={openConfirmModal}
          >
            ✕
          </div>
        </div>
        <div
          className="flex flex-col justify-start items-center w-full h-full mt-5 py-3 pb-5 text-[14px] xs:text-[16px] sm:text-[18px] overflow-y-scroll overflow-x-hidden gap-6 xs:gap-7 sm:gap-8 custom-scrollbar"
          ref={logContainerRef}
        >
          {chatbotMessageList.map((message, index) => (
            <div className="w-full" key={index}>
              {message.role === "user" ? (
                <div className="flex flex-row justify-end items-start w-full px-2 xs:px-3 sm:px-4 gap-2">
                  <div
                    className="max-w-[75%] lg:max-w-[510px] bg-[#F6F6F6] px-3 xs:px-4 sm:px-5 py-2 xs:py-3 sm:py-4 rounded-3xl text-[13px] xs:text-[14px] sm:text-[16px]"
                    style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                  >
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="flex flex-row justify-start items-start w-full gap-1 xs:gap-2 sm:gap-3 pr-2 xs:pr-3 sm:pr-4">
                  <div className="-mt-3 w-[30px] h-[30px] flex-shrink-0">
                    <Image
                      src="/images/logo.svg"
                      alt="logo"
                      width={30}
                      height={30}
                      className="w-[20px] h-[20px] xs:w-[25px] xs:h-[25px] sm:w-[30px] sm:h-[30px]"
                      priority
                    />
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    className="prose w-full max-w-none text-[13px] xs:text-[14px] sm:text-[16px]"
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          {logSummary && isConnected ? (
            <div className="flex flex-row justify-start items-start w-full gap-1 xs:gap-2 sm:gap-3 pr-2 xs:pr-3 sm:pr-4">
              <div className="-mt-3 w-[30px] h-[30px] flex-shrink-0">
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  width={30}
                  height={30}
                  className="w-[20px] h-[20px] xs:w-[25px] xs:h-[25px] sm:w-[30px] sm:h-[30px]"
                  priority
                />
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                className="prose w-full max-w-none text-[13px] xs:text-[14px] sm:text-[16px]"
              >
                {logSummary}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>
        <div className="flex flex-row justify-center items-center relative w-full bg-gray-100 border border-gray-300 rounded-3xl">
          <div className="flex flex-row justify-start items-center w-[50px]">
            <div className="flex flex-row justify-center items-center absolute sm:bottom-4 left-3">
              <Image
                src="/images/arrow-right.svg"
                alt="arrow-right"
                width={19}
                height={13}
                className="w-[15px] h-[9px] xs:w-[17px] xs:h-[11px] sm:w-[19px] sm:h-[13px]"
                priority
              />
            </div>
          </div>
          <div className="w-full">
            <ReactTextareaAutosize
              minRows={1}
              maxRows={3}
              placeholder="여기에 텍스트를 입력하세요..."
              className="block w-full text-[12px] xs:text-[14px] sm:text-[16px] p-2 my-0 xs:my-[1px] sm:my-0.5 resize-none border-none bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none overflow-y-auto custom-scrollbar"
              value={question}
              onChange={handleQuestionChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
            />
          </div>
          <div className="flex flex-row justify-end items-center w-[50px]">
            <div
              className="flex flex-row justify-center items-center w-[27px] h-[27px] xs:w-[31px] xs:h-[31px] sm:w-[35px] sm:h-[35px] bg-gray-800 hover:bg-black text-[18px] xs:text-[19px] sm:text-[20px] text-white rounded-full absolute bottom-1 right-1 sm:right-1.5 cursor-pointer"
              onClick={!isConnected ? startSSE : stopSSE}
            >
              {isConnected ? "◼︎" : "→"}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        option="closeChatbotModal"
        overlay={false}
        action={handleCloseModal}
      />
    </div>
  );
}
