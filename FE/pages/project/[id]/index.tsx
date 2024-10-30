import Container from "@/components/commons/container";
import DropdownMenu from "@/components/commons/dropdown-menu";
import EmptyBox from "@/components/commons/empty-box";
import Layout from "@/components/commons/layout";
import LogFileModal from "@/components/project/log-file-modal";
import ShellModal from "@/components/project/shell-modal";
import useLogFileModal from "@/hooks/project/use-log-file-modal";
import useShellModal from "@/hooks/project/use-shell-modal";
import {
  ProjectDetailPageProps,
  getProjectDetailSSR,
} from "@/ssr/project/project-detail-ssr";
import { Nickname } from "@/types/login/login-type";
import type { LogFileList, ProjectDetail } from "@/types/project/project-type";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export const getServerSideProps: GetServerSideProps<ProjectDetailPageProps> =
  getProjectDetailSSR;

export default function ProjectDetail({
  NicknameSSR,
  ProjectDetailSSR,
  LogFileListSSR,
}: ProjectDetailPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const {
    isShellModalOpen,
    openShellModal,
    closeShellModal,
    inputs,
    setInputs,
    handleCommandSubmit,
  } = useShellModal();

  const nicknameRef = useRef<Nickname | null>(NicknameSSR);
  const projectDetailRef = useRef<ProjectDetail | null>(ProjectDetailSSR);
  const logFileListRef = useRef<LogFileList | null>(LogFileListSSR);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const { isLogFileModalOpen, openLogFileModal, closeLogFileModal } =
    useLogFileModal();

  return (
    <Layout nickname={nicknameRef.current?.nickName || null}>
      <div className="px-5 xs:px-7 sm:px-10 max-w-[1200px]">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center">
            <Link href="/project">
              <Image
                src="/images/back.svg"
                alt="back"
                width={45}
                height={45}
                className="w-[35px] h-[35px] xs:w-[40px] xs:h-[40px] sm:w-[45px] sm:h-[45px] cursor-pointer"
                priority
              />
            </Link>
            <span className="text-[24px] xs:text-[30px] sm:text-[36px] text-black font-bold">
              {projectDetailRef.current?.name}
            </span>
          </div>
          <div className="flex flex-row justify-start items-center gap-0.5">
            <Image
              src="/images/shell.svg"
              alt="shell"
              width={33}
              height={24}
              className="w-[26px] h-[19px] xs:w-[30px] xs:h-[22px] sm:w-[33px] sm:h-[24px] cursor-pointer"
              onClick={openShellModal}
              priority
            />
            <div>
              <Image
                src="/images/chatbot.svg"
                alt="chatbot"
                width={44}
                height={44}
                className="w-[35px] h-[35px] xs:w-[40px] xs:h-[40px] sm:w-[44px] sm:h-[44px] ml-3 xs:ml-4 cursor-pointer"
                onClick={() => {
                  setSelectedOption("chatbot");
                  openLogFileModal();
                }}
                priority
              />
            </div>
            <DropdownMenu options={["edit", "restart", "stop", "delete"]} />
          </div>
        </div>
        <div className="text-[12px] xs:text-[15px] sm:text-[18px] text-[#979797] font-semibold mt-1 xs:mt-2 pl-1">
          {projectDetailRef.current?.description}
        </div>
        {projectDetailRef.current?.summaryContent ? (
          <Container
            title="요약"
            link={`/project/${id}/summary`}
            update={`${
              projectDetailRef.current?.summaryUpdateDate?.split(" ")[0]
            } 업데이트`}
          >
            <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {projectDetailRef.current?.summaryContent}
            </div>
          </Container>
        ) : (
          <EmptyBox title={"요약"} content={"요약 내역이 존재하지 않습니다."} />
        )}
        {projectDetailRef.current?.logContent ? (
          <Container
            title="최근 로그"
            link=""
            update=""
            action={() => {
              setSelectedOption("log");
              openLogFileModal();
            }}
          >
            <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {ProjectDetailSSR?.logContent}
            </div>
          </Container>
        ) : (
          <EmptyBox title={"최근 로그"} content={"로그가 존재하지 않습니다."} />
        )}
      </div>
      <ShellModal
        isOpen={isShellModalOpen}
        onClose={closeShellModal}
        inputs={inputs}
        setInputs={setInputs}
        handleCommandSubmit={handleCommandSubmit}
      />
      <LogFileModal
        isOpen={isLogFileModalOpen}
        onClose={closeLogFileModal}
        logFileList={logFileListRef.current}
        option={selectedOption}
      />
    </Layout>
  );
}
