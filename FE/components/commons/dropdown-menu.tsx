import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import CloudListModal from "../dashboard/cloud-list-modal";
import { CloudInstanceList } from "@/types/dashboard/dashboard-type";
import { cls } from "@/utils/class-utils";
import ActionConfirmModal from "./action-confirm-modal";
import useActionConfirmModal from "@/hooks/commons/use-action-confirm-modal";

interface DropdownMenuProps {
  options: string[];
  cloudInstanceList?: CloudInstanceList | null;
  name?: string;
}

export default function DropdownMenu({
  options,
  cloudInstanceList = null,
  name = "",
}: DropdownMenuProps) {
  const router = useRouter();
  const { id } = router.query;

  const {
    isActionConfirmModalOpen,
    openActionConfirmModal,
    closeActionConfirmModal,
  } = useActionConfirmModal();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isCloudListModalOpen, setIsCloudListModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleOptionClick = (option: string) => {
    optionActionsMap[option]?.action();
    setIsMenuOpen(false);
  };

  const openCloudListModal = () => {
    setIsCloudListModalOpen(true);
  };

  const closeCloudListModal = () => {
    setIsCloudListModalOpen(false);
  };

  const optionActionsMap: {
    [key: string]: { label: string; action: () => void };
  } = {
    edit: {
      label: "수정하기",
      action: () => router.push(`/project/${id}/edit`),
    },
    restart: {
      label: "컨테이너 재시작",
      action: () => {
        setSelectedOption("restart");
        openActionConfirmModal();
      },
    },
    stop: {
      label: "컨테이너 종료",
      action: () => {
        setSelectedOption("stop");
        openActionConfirmModal();
      },
    },
    delete: {
      label: "삭제하기",
      action: () => {
        setSelectedOption("delete");
        openActionConfirmModal();
      },
    },
    license: {
      label: "오픈소스 라이센스",
      action: () => router.push("/setting/license"),
    },
    key: {
      label: "API 키 관리",
      action: () => router.push("/setting/api-key"),
    },
    withdraw: {
      label: "계정 삭제",
      action: () => {
        setSelectedOption("withdraw");
        openActionConfirmModal();
      },
    },
    change: {
      label: "클라우드 변경",
      action: () => openCloudListModal(),
    },
  };

  return (
    <div className="relative">
      <button ref={buttonRef} onClick={toggleMenu}>
        <Image
          src="/images/ellipsis-vertical.svg"
          alt="ellipsis-vertical"
          width={44}
          height={44}
          className="w-[35px] h-[35px] xs:w-[40px] xs:h-[40px] sm:w-[44px] sm:h-[44px] mt-1.5 cursor-pointer"
          priority
        />
      </button>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-0 xs:mt-0.5 sm:mt-1 w-28 xs:w-32 sm:w-36 bg-white border border-gray-300 rounded-xl shadow-lg z-10"
        >
          {options.map((option, index) => (
            <div
              key={option}
              className={cls(
                "text-[12px] xs:text-[14px] sm:text-[16px] font-medium border-b-[1px] last:border-b-0 border-[#DBDBDB] first:rounded-tl-xl first:rounded-tr-xl last:rounded-bl-xl last:rounded-br-xl px-1 xs:px-2 sm:px-3 py-1 sm:py-1.5 text-center hover:bg-gray-100 cursor-pointer",
                index === options.length - 1 && options.length > 1
                  ? "text-[#FD5252]"
                  : "text-black"
              )}
              onClick={() => handleOptionClick(option)}
            >
              {optionActionsMap[option].label || option}
              {/* optionLabelMap에 없는 값이 들어올 경우 기본 option을 표시 */}
            </div>
          ))}
        </div>
      )}
      <ActionConfirmModal
        isOpen={isActionConfirmModalOpen}
        onClose={closeActionConfirmModal}
        option={selectedOption}
        name={name}
      />
      <CloudListModal
        isOpen={isCloudListModalOpen}
        onClose={closeCloudListModal}
        data={cloudInstanceList}
      />
    </div>
  );
}
