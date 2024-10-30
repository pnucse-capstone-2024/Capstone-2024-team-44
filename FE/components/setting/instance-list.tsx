import useInstanceModal from "@/hooks/commons/use-instance-modal";
import Image from "next/image";
import InstanceModal from "../commons/instance-modal";
import { useState } from "react";
import { SshInfo } from "@/types/setting/setting-type";

interface InstaceListProps {
  monitoringSshId: number | null;
  setMonitoringSshId: (value: number) => void;
  setMonitoringSshHost: (value: string) => void;
  sshInfos: SshInfo[];
  setSshInfos: React.Dispatch<React.SetStateAction<SshInfo[]>>;
}

export default function InstanceList({
  monitoringSshId,
  setMonitoringSshId,
  setMonitoringSshHost,
  sshInfos,
  setSshInfos,
}: InstaceListProps) {
  console.log("sshInfos: ", sshInfos);
  const [selectedSSH, setSelectedSSH] = useState<SshInfo>({
    id: 0,
    remoteName: "",
    remoteHost: "",
    remoteKeyPath: "",
    isWorking: false,
  });

  const {
    isInstanceModalOpen,
    selectedOption,
    openInstanceModal,
    closeInstanceModal,
  } = useInstanceModal();

  return (
    <div className="flex flex-col justify-start items-center w-full max-w-[1200px] h-[310px] xs:h-[330px] sm:h-[340px] gap-2 xs:gap-2.5 sm:gap-3 py-1 overflow-hidden">
      <div className="flex flex-col justify-start items-center w-full min-h-[290px] rounded-md shadow-md border border-[#E5E7EB] gap-2 xs:gap-3 sm:gap-4 px-3 xs:px-4 sm:px-5 py-5 xs:py-6 sm:py-7 mt-3 xs:mt-4 sm:mt-5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {sshInfos?.map((ssh) => (
          <div
            className="flex flex-row justify-start items-center w-full rounded-xl bg-[#F4F4F5] py-2 text-[12px] xs:text-[15px] sm:text-[18px] font-medium border border-transparent hover:border-gray-400 cursor-pointer"
            onClick={() => {
              setMonitoringSshId(ssh.id);
              setMonitoringSshHost(ssh.remoteHost);
            }}
            key={ssh.id}
          >
            <div className="flex flex-row justify-center items-center w-[13%]">
              {monitoringSshId === ssh.id && (
                <Image
                  src="/images/check.svg"
                  alt="check"
                  width={25}
                  height={27}
                  className="w-[18px] h-[20px] xs:w-[22px] xs:h-[24px] sm:w-[25px] sm:h-[27px]"
                  priority
                />
              )}
            </div>
            <div className="w-[25%] truncate">{ssh.remoteName}</div>
            <div className="w-[30%] truncate">{ssh.remoteHost}</div>
            <div className="w-[20%] truncate">
              {ssh.isWorking ? "정상" : "재연결 필요"}
            </div>
            <div className="w-[12%]">
              <Image
                src="/images/info.svg"
                alt="info"
                width={26}
                height={27}
                className="w-[20px] h-[21px] xs:w-[23px] xs:h-[24px] sm:w-[26px] sm:h-[27px]"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedSSH(ssh);

                  if (ssh.isWorking) {
                    openInstanceModal("edit");
                  } else {
                    openInstanceModal("reconnect");
                  }
                }}
                priority
              />
            </div>
          </div>
        ))}
      </div>
      <InstanceModal
        isOpen={isInstanceModalOpen}
        onClose={closeInstanceModal}
        option={selectedOption}
        ssh={selectedSSH}
        sshInfos={sshInfos}
        setSshInfos={setSshInfos}
      />
    </div>
  );
}
