import Container from "@/components/commons/container";
import DropdownMenu from "@/components/commons/dropdown-menu";
import EmptyBox from "@/components/commons/empty-box";
import Layout from "@/components/commons/layout";
import Image from "next/image";
import { GetServerSideProps } from "next";
import MultiLineChart from "@/components/dashboard/multi-line-chart";
import {
  DashboardPageProps,
  getDashboardSSR,
} from "@/ssr/dashboard/dashboard-ssr";
import { useRef } from "react";
import type {
  CloudInstanceList,
  Dashboard,
} from "@/types/dashboard/dashboard-type";
import { Nickname } from "@/types/login/login-type";
import useShellModal from "@/hooks/project/use-shell-modal";
import ShellModal from "@/components/project/shell-modal";

export const getServerSideProps: GetServerSideProps<DashboardPageProps> =
  getDashboardSSR;

export default function Dashboard({
  NicknameSSR,
  DashboardSSR,
  CloudInstanceListSSR,
}: DashboardPageProps) {
  const {
    isShellModalOpen,
    openShellModal,
    closeShellModal,
    inputs,
    setInputs,
    handleCommandSubmit,
  } = useShellModal();

  const nicknameRef = useRef<Nickname | null>(NicknameSSR);
  const dashboardRef = useRef<Dashboard | null>(DashboardSSR);
  const cloudInstanceListRef = useRef<CloudInstanceList | null>(
    CloudInstanceListSSR
  );

  return (
    <Layout nickname={nicknameRef.current?.nickName || null}>
      <div className="px-5 xs:px-7 sm:px-10 max-w-[1200px]">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center gap-2 xs:gap-5">
            <span className="text-[24px] xs:text-[30px] sm:text-[36px] text-black font-bold pl-1">
              대시보드
            </span>
            <span className="text-[12px] xs:text-[15px] sm:text-[18px] text-[#979797] font-semibold">
              {dashboardRef.current?.ip}
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
            <DropdownMenu
              options={["change"]}
              cloudInstanceList={cloudInstanceListRef.current}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 xxs:grid-cols-2 lg:grid-cols-4 w-full rounded-lg border border-[#E5E7EB] shadow-md px-6 py-2 sm:px-10 sm:py-3 mt-5 xs:mt-7">
          <div className="flex flex-row justify-start items-center">
            <span className="text-[14px] xs:text-[16px] sm:text-[18px] font-bold w-[90px] xs:w-[100px] sm:w-[110px]">
              CPU 사용량
            </span>
            <span className="text-[11px] xs:text-[12px] sm:text-[14px] font-normal">
              {dashboardRef.current?.cpuUsage}
            </span>
          </div>
          <div className="flex flex-row justify-start items-center">
            <span className="text-[14px] xs:text-[16px] sm:text-[18px] font-bold w-[90px] xs:w-[100px] sm:w-[110px]">
              메모리 사용량
            </span>
            <span className="text-[11px] xs:text-[12px] sm:text-[14px] font-normal">
              {dashboardRef.current?.memoryUsage}
            </span>
          </div>
          <div className="flex flex-row justify-start items-center">
            <span className="text-[14px] xs:text-[16px] sm:text-[18px] font-bold w-[90px] xs:w-[100px] sm:w-[110px]">
              네트워크 수신
            </span>
            <span className="text-[11px] xs:text-[12px] sm:text-[14px] font-normal">
              {dashboardRef.current?.networkReceived}
            </span>
          </div>
          <div className="flex flex-row justify-start items-center">
            <span className="text-[14px] xs:text-[16px] sm:text-[18px] font-bold w-[90px] xs:w-[100px] sm:w-[110px]">
              네트워크 송신
            </span>
            <span className="text-[11px] xs:text-[12px] sm:text-[14px] font-normal">
              {dashboardRef.current?.networkSent}
            </span>
          </div>
        </div>
        {dashboardRef.current?.summary ? (
          <Container title="요약" link="">
            <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {dashboardRef.current?.summary}
            </div>
          </Container>
        ) : (
          <EmptyBox
            title="요약"
            content="인스턴스가 작동중이지 않거나 SSH 연결에 실패하였습니다."
            type="dashboard"
          />
        )}
        <div className="flex flex-wrap gap-x-[4%] gap-y-6 xs:gap-y-7 mt-6 xs:mt-7 sm:mt-8">
          <div className="md:w-[48%] flex flex-col justify-start items-start w-full rounded-lg border border-[#E5E7EB] shadow-md gap-2 p-[3%]">
            <span className="text-[21px] xs:text-[24px] sm:text-[27px] font-bold ml-[3%] mb-[2%]">
              CPU
            </span>
            {dashboardRef.current ? (
              <MultiLineChart
                data={dashboardRef.current.cpuHistory}
                lines={[
                  { key: "cpuUsage", color: "#374151", label: "CPU Usage" },
                ]}
              />
            ) : null}
          </div>
          <div className="md:w-[48%] flex flex-col justify-start items-start w-full rounded-lg border border-[#E5E7EB] shadow-md gap-2 p-[3%]">
            <span className="text-[21px] xs:text-[24px] sm:text-[27px] font-bold ml-[3%] mb-[2%]">
              Memory
            </span>
            {dashboardRef.current ? (
              <MultiLineChart
                data={dashboardRef.current.memoryHistory}
                lines={[
                  {
                    key: "memoryUsage",
                    color: "#374151",
                    label: "Memory Usage",
                  },
                ]}
              />
            ) : null}
          </div>
          <div className="md:w-[48%] flex flex-col justify-start items-start w-full rounded-lg border border-[#E5E7EB] shadow-md gap-2 p-[3%]">
            <span className="text-[21px] xs:text-[24px] sm:text-[27px] font-bold ml-[3%] mb-[2%]">
              Network - In
            </span>
            {dashboardRef.current ? (
              <MultiLineChart
                data={dashboardRef.current.networkInHistory}
                lines={[
                  {
                    key: "networkReceived",
                    color: "#374151",
                    label: "Network Received",
                  },
                ]}
                isNetworkData
              />
            ) : null}
          </div>
          <div className="md:w-[48%] flex flex-col justify-start items-start w-full rounded-lg border border-[#E5E7EB] shadow-md gap-2 p-[3%]">
            <span className="text-[21px] xs:text-[24px] sm:text-[27px] font-bold ml-[3%] mb-[2%]">
              Network - Out
            </span>
            {dashboardRef.current ? (
              <MultiLineChart
                data={dashboardRef.current.networkOutHistory}
                lines={[
                  {
                    key: "networkSent",
                    color: "#374151",
                    label: "Network Sent",
                  },
                ]}
                isNetworkData
              />
            ) : null}
          </div>
        </div>
      </div>
      <ShellModal
        isOpen={isShellModalOpen}
        onClose={closeShellModal}
        inputs={inputs}
        setInputs={setInputs}
        handleCommandSubmit={handleCommandSubmit}
      />
    </Layout>
  );
}
