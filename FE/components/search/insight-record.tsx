import useInsightRecordModal from "@/hooks/search/use-insight-record-modal";
import InsightRecordModal from "./insight-record-modal";

interface InsightRecordProps {
  name: string;
  type: string;
  date: string;
  content: string;
}

export default function InsightRecord({
  name,
  type,
  date,
  content,
}: InsightRecordProps) {
  const {
    isInsightRecordModalOpen,
    openInsightRecordModal,
    closeInsightRecordModal,
  } = useInsightRecordModal();
  return (
    <>
      <div
        className="flex flex-row justify-evenly items-center w-full rounded-xl bg-[#F4F4F5] px-2 xs:px-6 sm:px-10 py-1.5 font-medium border border-transparent hover:border-gray-400 cursor-pointer"
        onClick={openInsightRecordModal}
      >
        <div className="w-[25%] text-left text-[12px] xs:text-[15px] sm:text-[18px] font-medium">
          {name}
        </div>
        <div className="w-[20%] text-center text-[9px] xs:text-[12px] sm:text-[15px] font-normal">
          {type}
        </div>
        <div className="w-[55%] text-right text-[9px] xs:text-[12px] sm:text-[15px] font-extralight">
          {date}
        </div>
      </div>
      <InsightRecordModal
        isOpen={isInsightRecordModalOpen}
        onClose={closeInsightRecordModal}
        name={name}
        date={date}
        content={content}
      />
    </>
  );
}
