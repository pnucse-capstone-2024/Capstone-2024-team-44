import React, { useState, useEffect } from "react";
import ButtonSmall from "./button-small";
import { cls } from "@/utils/class-utils";

interface ModalProps {
  isOpen: boolean;
  onValidClose: () => void;
  onInvalidClose: () => void;
  isValid: boolean | null;
  ip?: string;
  overlay?: boolean;
}

export default function InstanceValidationModal({
  isOpen,
  onValidClose,
  onInvalidClose,
  isValid = null,
  ip = "",
  overlay = false,
}: ModalProps) {
  const [validationResult, setValidationResult] = useState<string>("");

  useEffect(() => {
    if (isValid === null) return;
    if (isValid) {
      setValidationResult("유효한 인스턴스입니다.");
    } else {
      setValidationResult("유효하지 않은 인스턴스입니다.");
    }
    // let timer: NodeJS.Timeout;
    // if (isOpen) {
    //   timer = setTimeout(() => {
    //     if (isValid) {
    //       setValidationResult("유효한 인스턴스입니다.");
    //     } else {
    //       setValidationResult("유효하지 않은 인스턴스입니다.");
    //     }
    //   }, 3500);
    // }
    // return () => clearTimeout(timer);
  }, [isOpen, isValid]);

  const handleClose = () => {
    if (isValid) {
      onValidClose();
    } else {
      onInvalidClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={cls(
          "fixed inset-0 bg-black",
          overlay ? "opacity-70" : "opacity-20"
        )}
        onClick={handleClose}
      ></div>
      <div className="min-w-[300px] max-w-[90%] bg-white px-6 xs:px-8 sm:px-10 py-4 xs:py-5 sm:py-6 rounded-xl shadow-lg z-10">
        <div className="flex flex-row justify-end items-center">
          <div
            className="flex flex-row justify-center items-center w-[24px] xs:w-[27px] sm:w-[30px] h-[24px] xs:h-[27px] sm:h-[30px] rounded-full bg-[#E5E5E5] hover:bg-gray-300 text-[12px] xs:text-[14px] sm:text-[16px] cursor-pointer"
            onClick={handleClose}
          >
            ✕
          </div>
        </div>
        <div className="text-[14px] xs:text-[16px] sm:text-[18px] mt-2 xs:mt-3 sm:mt-4 font-semibold text-center truncate">
          {ip}
          <div className="flex flex-row justify-center items-center h-8 mt-1 xs:mt-2 sm:mt-3">
            {isValid === null ? (
              <div className="w-6 xs:w-6.5 sm:w-7 h-6 xs:h-6.5 sm:h-7 border-[3px] xs:border-[3.5px] sm:border-4 border-t-transparent border-gray-700 rounded-full animate-spin"></div>
            ) : (
              <div className="">{validationResult}</div>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-center items-center w-full mt-2.5 xs:mt-4 sm:mt-6">
          <ButtonSmall
            label="확인"
            onClick={handleClose}
            disabled={isValid === null ? true : false}
            type="modal"
          />
        </div>
      </div>
    </div>
  );
}
