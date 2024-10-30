import React, { useEffect, useState } from "react";
import ButtonSmall from "../commons/button-small";
import { LogFileList } from "@/types/project/project-type";
import { cls } from "@/utils/class-utils";
import Image from "next/image";
import { useRouter } from "next/router";
import useChatbotModal from "@/hooks/project/use-chatbot-modal";
import ChatbotModal from "./chatbot-modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  option: string;
  logFileList: LogFileList | null;
}

export default function LogFileModal({
  isOpen,
  onClose,
  option,
  logFileList,
}: ModalProps) {
  const router = useRouter();
  const { id } = router.query;

  const { isChatbotModalOpen, openChatbotModal, closeChatbotModal } =
    useChatbotModal();
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [selectedFileList, setSelectedFileList] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const disabledChatbot =
      option === "chatbot" && selectedFileList.length === 0;
    const disabledLog = option === "log" && selectedFile == "";
    setDisabled(disabledChatbot || disabledLog);
  }, [option, selectedFileList, selectedFile, setDisabled]);

  const handleFileSelect = (fileName: string) => {
    console.log("selectedFileList: ", selectedFileList);
    setSelectedFileList((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(fileName)) {
        return prevSelectedFiles.filter((file) => file !== fileName);
      } else {
        return [...prevSelectedFiles, fileName];
      }
    });
  };

  const handleChatbotButton = () => {
    if (disabled) return;
    openChatbotModal();
  };

  const handleLogButton = () => {
    if (disabled) return;
    router.push(`/project/${id}/${selectedFile}`);
  };

  const handleCloseButton = () => {
    setSelectedFile("");
    setSelectedFileList([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen flex items-center justify-center z-50">
      <div
        className={cls(
          "fixed inset-0 w-screen bg-black",
          isChatbotModalOpen ? "opacity-0" : "opacity-70"
        )}
        onClick={handleCloseButton}
      ></div>
      <div
        className={cls(
          "w-[90%] xs:w-[80%] sm:w-[548px] bg-white px-6 xs:px-8 sm:px-10 pt-4 xs:pt-5 sm:pt-6 pb-6 xs:pb-7 sm:pb-8 rounded-xl shadow-lg z-10",
          isChatbotModalOpen ? "hidden" : "inline"
        )}
      >
        <div className="flex flex-row justify-between items-center">
          <div className="text-[22px] xs:text-[24px] sm:text-[26px] font-bold ml-1">
            {option === "chatbot" ? "질문할 로그" : "확인할 로그"}
          </div>
          <div
            className="flex flex-row justify-center items-center w-[24px] xs:w-[27px] sm:w-[30px] h-[24px] xs:h-[27px] sm:h-[30px] rounded-full bg-[#E5E5E5] hover:bg-gray-300 text-[12px] xs:text-[14px] sm:text-[16px] mr-1 cursor-pointer"
            onClick={handleCloseButton}
          >
            ✕
          </div>
        </div>
        <div className="flex flex-col justify-start items-start relative h-[337px] xs:h-[350px] sm:h-[363px] rounded-lg border border-[#E5E7EB] overflow-y-auto gap-1 xs:gap-1.5 sm:gap-2 px-2 py-2 mt-3 xs:mt-4 sm:mt-5 custom-scrollbar">
          {logFileList && logFileList.files.length > 0 ? (
            logFileList.files.map((logFile, index) => (
              <div
                key={index}
                className={cls(
                  "w-full hover:bg-gray-200 rounded-xl text-[13px] xs:text-[14px] sm:text-[15px] font-semibold px-3 py-2 truncate flex-shrink-0 cursor-pointer transition-colors",
                  option === "chatbot" && selectedFileList.includes(logFile)
                    ? "bg-gray-100"
                    : "",
                  option === "log" && selectedFile === logFile
                    ? "bg-gray-100"
                    : ""
                )}
                onClick={
                  option === "chatbot"
                    ? () => handleFileSelect(logFile)
                    : () => setSelectedFile(logFile)
                }
              >
                {logFile}
              </div>
            ))
          ) : (
            <>
              <div className="flex flex-row justify-center items-center w-full mt-24 xs:mt-24 sm:mt-24">
                <Image
                  src="/images/empty.svg"
                  alt="empty"
                  width={65}
                  height={67}
                  className="w-[52px] h-[54px] xs:w-[59px] xs:h-[60px] sm:w-[65px] sm:h-[67px]"
                  priority
                />
              </div>
              <div className="w-full text-center text-[13px] xs:text-[14px] sm:text-[15px] mt-10">
                로그 파일이 없습니다.
              </div>
            </>
          )}
        </div>
        <div className="flex flex-row justify-center items-center w-full mt-5 xs:mt-6 sm:mt-7">
          <ButtonSmall
            label="선택"
            onClick={
              option === "chatbot" ? handleChatbotButton : handleLogButton
            }
            type="modal"
            disabled={disabled}
          />
        </div>
      </div>
      <ChatbotModal
        isOpen={isChatbotModalOpen}
        onClose={() => {
          closeChatbotModal();
          handleCloseButton();
        }}
        logFileList={selectedFileList}
      />
    </div>
  );
}
