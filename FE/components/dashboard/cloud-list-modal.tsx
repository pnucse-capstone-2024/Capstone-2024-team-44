import React, { useState } from "react";
import ButtonSmall from "../commons/button-small";
import { CloudInstanceList } from "@/types/dashboard/dashboard-type";
import { cls } from "@/utils/class-utils";
import { ChangeMonitoringCloud } from "@/api/dashboard/dashboard-api";
import ConfirmModal from "../commons/confirm-modal";
import useConfirmModal from "@/hooks/commons/use-confirm-modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CloudInstanceList | null;
}

export default function CloudListModal({ isOpen, onClose, data }: ModalProps) {
  const {
    isConfirmModalOpen,
    success,
    openConfirmModal,
    closeConfirmModal,
    setSuccess,
  } = useConfirmModal();

  const [selectedCloud, setSelectedCloud] = useState<string>(
    data && data.selectedCloud ? data?.selectedCloud?.remoteHost : ""
  );

  const updateSelectedCloud = async (selectedCloud: string): Promise<void> => {
    const result = await ChangeMonitoringCloud(selectedCloud);
    setSuccess(result);
    openConfirmModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      <div className="w-[90%] xs:w-[80%] sm:w-[548px] bg-white px-6 xs:px-8 sm:px-10 pt-4 xs:pt-5 sm:pt-6 pb-6 xs:pb-7 sm:pb-8 rounded-xl shadow-lg z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-[22px] xs:text-[24px] sm:text-[26px] font-bold ml-1">
            클라우드 변경
          </div>
          <div
            className="flex flex-row justify-center items-center w-[24px] xs:w-[27px] sm:w-[30px] h-[24px] xs:h-[27px] sm:h-[30px] rounded-full bg-[#E5E5E5] hover:bg-gray-300 text-[12px] xs:text-[14px] sm:text-[16px] mr-1"
            onClick={onClose}
          >
            ✕
          </div>
        </div>
        <div className="flex flex-col justify-start items-start h-[337px] xs:h-[350px] sm:h-[363px] gap-0 xs:gap-0.5 sm:gap-1 rounded-lg border border-[#E5E7EB] overflow-y-auto px-2 py-2 mt-3 xs:mt-4 sm:mt-5">
          {data?.clouds.map((cloud) => (
            <div
              key={cloud.remoteHost}
              className={cls(
                "flex flex-row justify-start items-center w-full hover:bg-gray-200 rounded-xl text-[13px] xs:text-[14px] sm:text-[15px] font-semibold px-3 py-2 truncate flex-shrink-0 gap-2 transition-colors cursor-pointer",
                selectedCloud === cloud.remoteHost ? "bg-gray-100" : ""
              )}
              onClick={() => setSelectedCloud(cloud.remoteHost)}
            >
              <div className="w-[40%] truncate">{cloud.remoteName}</div>
              <div className="w-[60%]">{cloud.remoteHost}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-center items-center w-full mt-5 xs:mt-6 sm:mt-7">
          <ButtonSmall
            label="선택"
            onClick={() => {
              updateSelectedCloud(selectedCloud);
            }}
          />
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        option="changeMonitoringCloud"
        success={success}
        overlay={false}
      />
    </div>
  );
}
