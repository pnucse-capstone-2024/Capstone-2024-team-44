import { ProjectList } from "@/types/project/project-type";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export interface ProjectTableProps {
  ProjectList: ProjectList | null;
}

export default function ProjectTable({ ProjectList }: ProjectTableProps) {
  const router = useRouter();
  const [isLargeScreen, setIsLargeScreen] = useState<boolean | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 900);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);
  return (
    <div className="log-table">
      {isLargeScreen === true && (
        <div className="overflow-x-hidden">
          <table
            className="table-auto w-full max-w-[1200px] border-separate bg-[#F6F6F6] rounded-3xl border border-[#E5E7EB] px-5 text-[16px] mt-3"
            style={{ borderSpacing: "0 5px", tableLayout: "fixed" }}
          >
            <thead>
              <tr className="text-center">
                <th className="w-[10%] px-4 py-1 truncate">상태</th>
                <th className="w-[15%] px-4 py-1 text-left truncate">이름</th>
                <th className="w-[20%] px-4 py-1 text-left truncate">설명</th>
                <th className="w-[13%] px-4 py-1 truncate">CPU</th>
                <th className="w-[27%] px-4 py-1 truncate">Mem</th>
                <th className="w-[15%] px-4 py-1 truncate">컨테이너</th>
              </tr>
            </thead>
            <tbody>
              {ProjectList ? (
                ProjectList.projects.map((project) => (
                  <tr
                    key={project.id}
                    className="text-center bg-white cursor-pointer"
                    onClick={() => router.push(`/project/${project.id}`)}
                  >
                    <td className="w-[10%] px-4 py-2 truncate rounded-l-3xl overflow-hidden border-l border-t border-b border-transparent">
                      <div className="flex flex-row justify-center items-center">
                        <Image
                          src={`/images/${
                            project.isUrgent ? "not-working" : "working"
                          }.svg`}
                          alt={`${
                            project.isUrgent ? "not-working" : "working"
                          }`}
                          width={23}
                          height={24}
                          priority
                        />
                      </div>
                    </td>
                    <td className="w-[15%] px-4 py-2 text-left truncate border-t border-b border-transparent">
                      {project.name}
                    </td>
                    <td className="w-[20%] px-4 py-2 text-left truncate border-t border-b border-transparent">
                      {project.description}
                    </td>
                    <td className="w-[13%] px-4 py-2 truncate border-t border-b border-transparent">
                      {project.cpuUsage}
                    </td>
                    <td className="w-[27%] px-4 py-2 truncate border-t border-b border-transparent">
                      {project.memoryUsage}
                    </td>
                    <td className="w-[15%] px-4 py-2 truncate rounded-r-3xl overflow-hidden border-r border-t border-b border-transparent">
                      {project.containerStatus === "WORKING"
                        ? "실행중"
                        : project.containerStatus === "NOT_WORKING"
                        ? "종료됨"
                        : "연결되지 않음"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center bg-white cursor-pointer">
                  <td
                    className="w-full px-4 py-2 truncate rounded-3xl overflow-hidden border border-transparent"
                    colSpan={6}
                  >
                    프로젝트가 존재하지 않습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {isLargeScreen === false && (
        <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-2 xs:gap-3 text-[14px] xs:text-[15px] mt-1 xs:mt-2">
          {ProjectList ? (
            ProjectList.projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col space-y-2 bg-[#F6F6F6] rounded-3xl border border-[#E5E7EB] pl-1 pr-2 py-2 cursor-pointer hover:border-gray-400"
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <div className="flex">
                  <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                    상태
                  </div>
                  <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl">
                    <div className="flex flex-row justify-start items-center w-full">
                      <Image
                        src={`/images/${
                          project.isUrgent ? "not-working" : "working"
                        }.svg`}
                        alt={`${project.isUrgent ? "not-working" : "working"}`}
                        width={23}
                        height={24}
                        className="w-[20px] h-[21px] xs:w-[23px] xs:h-[24px]"
                        priority
                      />
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                    이름
                  </div>
                  <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl">
                    {project.name}
                  </div>
                </div>
                <div className="flex">
                  <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                    설명
                  </div>
                  <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl truncate">
                    {project.description}
                  </div>
                </div>
                <div className="flex">
                  <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                    CPU
                  </div>
                  <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl truncate">
                    {project.cpuUsage}
                  </div>
                </div>
                <div className="flex">
                  <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                    Mem
                  </div>
                  <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl truncate">
                    {project.memoryUsage}
                  </div>
                </div>
                <div className="flex">
                  <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                    컨테이너
                  </div>
                  <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl truncate">
                    {project.containerStatus === "WORKING"
                      ? "실행중"
                      : project.containerStatus === "NOT_WORKING"
                      ? "종료됨"
                      : "연결되지 않음"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="flex flex-col space-y-2 bg-[#F6F6F6] rounded-3xl border border-[#E5E7EB] pl-1 pr-2 py-2 cursor-pointer hover:border-gray-400"
              onClick={() => router.push("/log/1")}
            >
              <div className="flex">
                <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                  상태
                </div>
                <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl">
                  <div className="flex flex-row justify-start items-center w-full"></div>
                </div>
              </div>
              <div className="flex">
                <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                  이름
                </div>
                <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl"></div>
              </div>
              <div className="flex">
                <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                  설명
                </div>
                <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl truncate text-center"></div>
              </div>
              <div className="flex">
                <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                  CPU
                </div>
                <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl truncate"></div>
              </div>
              <div className="flex">
                <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                  Mem
                </div>
                <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl truncate"></div>
              </div>
              <div className="flex">
                <div className="min-w-[80px] px-4 py-1 xs:py-2 font-bold">
                  컨테이너
                </div>
                <div className="flex-1 px-4 py-1 xs:py-2 bg-white rounded-3xl truncate"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
