import React from "react";
import ButtonSmall from "../commons/button-small";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  date: string;
  content: string;
}

export default function InsightRecordModal({
  isOpen,
  onClose,
  name,
  date,
  content,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      <div className="w-[90%] xs:w-[85%] sm:w-[75%] h-[500px] xs:h-[600px] sm:h-[700px] bg-white px-6 xs:px-8 sm:px-10 pt-4 xs:pt-5 sm:pt-6 pb-6 xs:pb-7 sm:pb-8 rounded-xl shadow-lg z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-[22px] xs:text-[24px] sm:text-[26px] font-bold ml-1 pr-5 truncate">
            {name + " -> " + date}
          </div>
          <div
            className="flex flex-row justify-center items-center w-[24px] xs:w-[27px] sm:w-[30px] h-[24px] xs:h-[27px] sm:h-[30px] rounded-full bg-[#E5E5E5] hover:bg-gray-300 text-[12px] xs:text-[14px] sm:text-[16px] mr-1"
            onClick={onClose}
          >
            ✕
          </div>
        </div>
        <div
          className="h-[350px] xs:h-[430px] sm:h-[515px] mt-5 p-3 text-[14px] xs:text-[16px] sm:text-[18px] overflow-y-auto overflow-x-hidden custom-scrollbar"
          style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        >
          {content}
        </div>
        <div className="flex flex-row justify-center items-center w-full mt-4 xs:mt-5 sm:mt-6">
          <ButtonSmall label="확인" onClick={onClose} type="modal" />
        </div>
      </div>
    </div>
  );
}
