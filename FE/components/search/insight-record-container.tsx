import { useState } from "react";
import Container from "../commons/container";
import { cls } from "@/utils/class-utils";
import InsightRecord from "./insight-record";
import { Insights } from "@/types/search/search-type";

interface InsightRecordContainerProps {
  files: Insights[];
}

export default function InsightRecordContainer({
  files,
}: InsightRecordContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 9;
  const maxPageButtons = 5;

  const totalPages = Math.ceil(files.length / filesPerPage);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

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
    <Container title="인사이트 기록" type="insight">
      <div className="flex flex-col justify-start items-center h-[340px] xs:h-[400px] sm:h-[460px] gap-1.5 xs:gap-2 sm:gap-2.5">
        {currentFiles.map((file, index) => (
          <div key={index} className="w-full">
            <InsightRecord
              name={file.projectName}
              type={file.type === "GENERAL" ? "일반요약" : "이상탐지"}
              date={file.date}
              content={file.content}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-1 xs:gap-2 sm:gap-3 text-[10px] xs:text-[12px] sm:text-[14px]">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-[6px] py-[2px] xs:px-[9px] xs:py-[3px] sm:px-[12px] sm:py-[4px] border-[0.5px] xs:border border-black rounded-md disabled:opacity-50"
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
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-[6px] py-[2px] xs:px-[9px] xs:py-[3px] sm:px-[12px] sm:py-[4px] border-[0.5px] xs:border border-black rounded-md disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </Container>
  );
}
