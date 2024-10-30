import { useState } from "react";
import Container from "../commons/container";
import LogFile from "./log-file";
import { cls } from "@/utils/class-utils";
import { LogFiles } from "@/types/search/search-type";

interface LogFileContainerProps {
  files: LogFiles[];
}

export default function LogFileContainer({ files }: LogFileContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 9;
  const maxPageButtons = 5;

  const totalPages = Math.ceil(files.length / filesPerPage);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const filledFiles = [...currentFiles];
  while (filledFiles.length < filesPerPage) {
    filledFiles.push({ fileName: "", redirectURL: "" });
  }

  const getPageNumbers = () => {
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container title="로그 파일" type="log">
      <div className="grid grid-cols-3 w-full gap-0 border-[#E9ECEF] pb-1 xs:pb-2 sm:pb-3">
        {filledFiles.map((file, index) => (
          <div
            key={index}
            className={cls(
              "flex flex-col justify-start items-center h-[110px] xs:h-[130px] sm:h-[155px] gap-1 xs:gap-2 sm:gap-3 pt-5 xs:pt-5.5 sm:pt-6",
              index < 6 ? "border-b" : "",
              index % 3 !== 2 ? "border-r" : ""
            )}
          >
            {file.fileName ? (
              <LogFile
                fileName={file.fileName}
                redirectURL={file.redirectURL}
              />
            ) : (
              <div className="w-[65px] h-[64px]" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-1 xs:gap-2 sm:gap-3 text-[10px] xs:text-[12px] sm:text-[14px]">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-[6px] py-[2px] xs:px-[9px] xs:py-[3px] sm:px-[12px] sm:py-[4px] border-[0.5px] xs:border border-black rounded-md disabled:opacity-50"
          // className="px-[6px] py-[2px] xs:px-[9px] xs:py-[3px] sm:px-[12px] sm:py-[4px] disabled:opacity-50"
        >
          이전
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={cls(
              "px-[6px] py-[2px] xs:px-[9px] xs:py-[3px] sm:px-[12px] sm:py-[4px] border-[0.5px] xs:border border-black rounded-md",
              currentPage === page
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-300"
            )}
            // className={cls(
            //   "px-[6px] py-[2px] xs:px-[9px] xs:py-[3px] sm:px-[12px] sm:py-[4px] text-[12px] xs:text-[14px] sm:text-[16px]",
            //   currentPage === page
            //     ? "text-black font-bold"
            //     : "text-gray-500 hover:text-black"
            // )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-[6px] py-[2px] xs:px-[9px] xs:py-[3px] sm:px-[12px] sm:py-[4px] border-[0.5px] xs:border border-black rounded-md disabled:opacity-50"
          // className="px-[6px] py-[2px] xs:px-[9px] xs:py-[3px] sm:px-[12px] sm:py-[4px] disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </Container>
  );
}
