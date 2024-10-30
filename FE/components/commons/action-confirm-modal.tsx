import React, { useState } from "react";
import ButtonSmall from "./button-small";
import { useRouter } from "next/router";
import { cls } from "@/utils/class-utils";
import {
  deleteContainer,
  restartContainer,
  stopContainer,
} from "@/api/project/project-api";
import { withdrawAccount } from "@/api/setting/setting-api";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  option: string;
  overlay?: boolean;
  message?: string;
  name?: string;
}

export default function ActionConfirmModal({
  isOpen,
  onClose,
  option,
  overlay = true,
  name = "",
}: ModalProps) {
  const router = useRouter();
  const { id } = router.query;

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const restartAction = async () => {
    if (!isConfirmed) {
      const result = await restartContainer(Number(id), name);
      setIsConfirmed(true);
      setIsSuccessful(result);
    } else {
      setIsConfirmed(false);
      onClose();
    }
  };

  const stopAction = async () => {
    if (!isConfirmed) {
      const result = await stopContainer(Number(id), name);
      setIsConfirmed(true);
      setIsSuccessful(result);
    } else {
      setIsConfirmed(false);
      onClose();
    }
  };

  const deleteAction = async () => {
    if (!isConfirmed) {
      const result = await deleteContainer(Number(id));
      setIsConfirmed(true);
      setIsSuccessful(result);
    } else {
      setIsConfirmed(false);
      onClose();
    }
  };

  const withdrawAction = async () => {
    if (!isConfirmed) {
      const result = await withdrawAccount();
      setIsConfirmed(true);
      setIsSuccessful(result);
    } else {
      setIsConfirmed(false);
      onClose();
    }
  };

  const modalContents: {
    [key: string]: {
      title: string;
      message: string;
      buttonText: string;
      closeAction: () => void;
      confirmAction: () => void;
    };
  } = {
    restart: {
      title: !isConfirmed
        ? "컨테이너를 재시작하시겠습니까?"
        : "컨테이너 재시작",
      message: !isConfirmed
        ? "진행 중인 작업이 있다면 종료 후 다시 시작해 주세요."
        : isSuccessful
        ? "컨테이너가 성공적으로 재시작되었습니다."
        : "컨테이너 재시작에 실패했습니다.",
      buttonText: !isConfirmed ? "재시작" : "확인",
      closeAction: !isConfirmed ? onClose : restartAction,
      confirmAction: restartAction,
    },
    stop: {
      title: !isConfirmed ? "컨테이너를 종료하시겠습니까?" : "컨테이너 종료",
      message: !isConfirmed
        ? "진행 중인 작업이 있다면 종료 후 다시 시작해 주세요."
        : isSuccessful
        ? "컨테이너가 성공적으로 종료되었습니다."
        : "컨테이너 종료에 실패했습니다.",
      buttonText: !isConfirmed ? "종료" : "확인",
      closeAction: !isConfirmed ? onClose : stopAction,
      confirmAction: stopAction,
    },
    delete: {
      title: !isConfirmed
        ? "정말 프로젝트를 삭제하시겠습니까?"
        : "프로젝트 삭제",
      message: !isConfirmed
        ? "관련된 모든 로그 파일과 기록이 삭제되며, 복구가 불가능합니다."
        : isSuccessful
        ? "프로젝트가 성공적으로 삭제되었습니다."
        : "프로젝트 삭제에 실패했습니다.",
      buttonText: "삭제",
      closeAction: !isConfirmed ? onClose : deleteAction,
      confirmAction: deleteAction,
    },
    withdraw: {
      title: !isConfirmed ? "정말 탈퇴하시겠습니까?" : "회원 탈퇴",
      message: !isConfirmed
        ? "탈퇴 시 데이터 복구가 불가능합니다."
        : isSuccessful
        ? "회원 탈퇴가 완료되었습니다."
        : "회원 탈퇴에 실패했습니다.",
      buttonText: "탈퇴",
      closeAction: !isConfirmed ? onClose : withdrawAction,
      confirmAction: withdrawAction,
    },
  };

  const modalContent = modalContents[option] || {
    title: "알 수 없는 동작",
    message: "올바른 동작을 선택해주세요.",
    buttonText: "확인",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div
        className={cls(
          "fixed inset-0 bg-black",
          overlay ? "opacity-70" : "opacity-20"
        )}
        onClick={modalContent.closeAction}
      ></div>
      <div className="max-w-[90%] bg-white px-6 xs:px-8 sm:px-10 py-4 xs:py-5 sm:py-6 rounded-xl shadow-lg z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-[18px] xs:text-[20px] sm:text-[22px] font-bold">
            {modalContent.title}
          </div>
          <div
            className="flex flex-row justify-center items-center w-[24px] xs:w-[27px] sm:w-[30px] h-[24px] xs:h-[27px] sm:h-[30px] rounded-full bg-[#E5E5E5] hover:bg-gray-300 text-[12px] xs:text-[14px] sm:text-[16px] cursor-pointer"
            onClick={modalContent.closeAction}
          >
            ✕
          </div>
        </div>
        <div className="text-[14px] xs:text-[16px] sm:text-[18px] mt-2 xs:mt-3 sm:mt-4">
          {modalContent.message}
        </div>
        <div className="flex flex-row justify-center items-center w-full mt-6 xs:mt-7 sm:mt-8">
          <ButtonSmall
            label={modalContent.buttonText}
            onClick={modalContent.confirmAction}
            type="modal"
          />
        </div>
      </div>
    </div>
  );
}
