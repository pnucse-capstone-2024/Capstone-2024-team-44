// import useInstanceModal from "@/hooks/commons/use-instance-modal";
// import Image from "next/image";
// import { useState } from "react";
// import { cls } from "@/utils/class-utils";

// interface SSHInfo {
//   remoteName: string;
//   remoteHost: string;
//   remoteKeyPath: string;
// }

// interface SSHListProps {
//   sshInfos: SSHInfo[];
//   monitoringSshHost: string | null;
//   setMonitoringSshHost: (host: string) => void;
// }

// export default function InstanceList({
//   sshInfos,
//   monitoringSshHost,
//   setMonitoringSshHost,
// }: SSHListProps) {
//   const [selectedSSH, setSelectedSSH] = useState<SSHInfo>({
//     remoteName: "",
//     remoteHost: "",
//     remoteKeyPath: "",
//   });

//   const {
//     isInstanceModalOpen,
//     selectedOption,
//     openInstanceModal,
//     closeInstanceModal,
//   } = useInstanceModal();

//   const handleSelectHost = (host: string) => {
//     setMonitoringSshHost(host);
//   };

//   return (
//     <div className="flex flex-col justify-start items-center w-full h-[310px] xs:h-[330px] sm:h-[340px] gap-2 xs:gap-2.5 sm:gap-3 px-3 xs:px-4 sm:px-5 py-1 overflow-y-scroll overflow-x-hidden custom-scrollbar">
//       {sshInfos.map((ssh) => (
//         <div
//           className="flex flex-row justify-start items-center w-full rounded-xl bg-[#F4F4F5] py-2 text-[12px] xs:text-[15px] sm:text-[18px] font-medium border border-transparent hover:border-gray-400 cursor-pointer"
//           key={`${ssh.remoteName}${ssh.remoteHost}`}
//           onClick={() => handleSelectHost(ssh.remoteHost)}
//         >
//           <div className="flex flex-row justify-center items-center w-[15%]">
//             <Image
//               src="/images/check.svg"
//               alt="check"
//               width={25}
//               height={27}
//               className={cls(
//                 "w-[18px] h-[20px] xs:w-[22px] xs:h-[24px] sm:w-[25px] sm:h-[27px]",
//                 ssh.remoteHost === monitoringSshHost ? "visible" : "hidden"
//               )}
//             />
//           </div>
//           <div className="w-[30%] truncate">{ssh.remoteName}</div>
//           <div className="w-[40%] truncate">{ssh.remoteHost}</div>
//           <div className="w-[15%]">
//             <Image
//               src="/images/info.svg"
//               alt="info"
//               width={26}
//               height={27}
//               className="w-[22px] h-[23px] xs:w-[26px] xs:h-[27px]"
//               onClick={(event) => {
//                 event.stopPropagation();
//                 setSelectedSSH(ssh);
//                 openInstanceModal("edit");
//               }}
//             />
//           </div>
//         </div>
//       ))}
//       {/* <InstanceModal
//         isOpen={isInstanceModalOpen}
//         onClose={closeInstanceModal}
//         option={selectedOption}
//         ssh={selectedSSH}
//       /> */}
//     </div>
//   );
// }
