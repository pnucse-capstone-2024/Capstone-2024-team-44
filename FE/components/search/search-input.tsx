import { useState } from "react";
import InputSmall from "../commons/input-small";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ButtonSmall from "../commons/button-small";

interface SearchInputProps {
  startDate: Date | null;
  endDate: Date | null;
  keyword: string;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setKeyword: (keyword: string) => void;
  disabled?: boolean;
  handleSearchButton: () => void;
}

export default function SearchInput({
  startDate,
  endDate,
  keyword,
  setStartDate,
  setEndDate,
  setKeyword,
  disabled = true,
  handleSearchButton,
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleKeywordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputKeyword = event.target.value;
    setKeyword(inputKeyword.trim());
  };

  // 날짜 변경 시 실행되는 함수
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (Array.isArray(value)) {
      const [newStartDate, newEndDate] = value;
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    } else {
      setStartDate(value); // 단일 날짜 선택 시에는 시작일로만 설정
      setEndDate(null); // 종료일 초기화
    }
  };

  // 날짜를 YYYY-MM-DD 포맷으로 변환하는 함수
  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString("ko-KR") : ""; // 한국식 날짜 포맷
  };

  return (
    <>
      <div className="flex flex-row justify-start items-center w-full mt-5 xs:mt-6 sm:mt-8">
        <div className="w-[60px] xs:w-[70px] sm:w-[80px] text-[16px] xs:text-[18px] sm:text-[20px] font-bold flex-shrink-0">
          기간
        </div>
        {/* <div className="flex flex-row justify-start items-center w-full gap-1 xs:gap-2 sm:gap-3 pr-[65px] xs:pr-[83px] sm:pr-[102px] max-w-[800px]"> */}
        <div className="flex flex-row justify-start items-center w-full gap-1 xs:gap-2 sm:gap-3 max-w-[800px]">
          <InputSmall
            type="text"
            label=""
            placeholder="시작일"
            value={formatDate(startDate)}
            maxWidth="282px"
            onClick={openModal}
            readOnly
          />
          <span className="text-[16px] xs:text-[18px] sm:text-[20px]">~</span>
          <InputSmall
            type="text"
            label=""
            placeholder="종료일"
            value={formatDate(endDate)}
            maxWidth="282px"
            onClick={openModal}
            readOnly
          />
        </div>
        <div className="flex flex-row justify-center items-center relative flex-shrink-0 w-[80px] h-[50px]"></div>
      </div>
      <div className="flex flex-row justify-start items-center w-full mt-3 xs:mt-4 sm:mt-5">
        <div className="w-[60px] xs:w-[70px] sm:w-[80px] text-[16px] xs:text-[18px] sm:text-[20px] font-bold flex-shrink-0">
          키워드
        </div>
        <div className="flex flex-row justify-start items-center w-full gap-3 xs:gap-4 sm:gap-5 max-w-[600px]">
          <InputSmall
            type="text"
            label=""
            placeholder="검색할 단어를 입력하세요."
            maxWidth="600px"
            value={keyword}
            onChange={handleKeywordChange}
          />
        </div>
        <div className="flex flex-row justify-start items-center relative flex-shrink-0 pl-3 xs:pl-4 sm:pl-5 w-[80px]">
          <ButtonSmall
            label="검색"
            onClick={handleSearchButton}
            disabled={disabled}
            type="search"
          />
        </div>
      </div>

      {/* 모달창 */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-[300px] h-[385px] xs:w-[344px] xs:h-[440px] bg-white p-5 border border-black rounded-3xl shadow-lg relative">
            <Calendar
              onChange={handleDateChange}
              className="custom-calendar"
              calendarType="gregory"
              selectRange={true}
              showFixedNumberOfWeeks={true}
              formatDay={(locale, date) => date.getDate().toString()}
            />
            <div className="flex flex-row justify-center items-center gap-2 xs:gap-3 mt-1 xs:mt-2">
              <button
                className="h-[30px] xs:h-[35px] bg-white rounded-lg text-[13px] xs:text-[15px] text-black font-bold px-3 xs:px-4"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  closeModal();
                }}
              >
                취소
              </button>
              <button
                className="h-[30px] xs:h-[35px] bg-black rounded-lg text-[13px] xs:text-[15px] text-white font-bold px-3 xs:px-4"
                onClick={() => {
                  if (startDate != null && endDate != null) closeModal();
                }}
              >
                선택
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
