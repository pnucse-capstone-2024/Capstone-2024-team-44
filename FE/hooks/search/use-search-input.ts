import { useEffect, useState } from "react";

interface UseNicknameCheckReturn {
  startDate: Date | null;
  endDate: Date | null;
  keyword: string;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setKeyword: (keyword: string) => void;
}

export default function useSearchInput(): UseNicknameCheckReturn {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [keyword, setKeyword] = useState<string>("");

  return {
    startDate,
    endDate,
    keyword,
    setStartDate,
    setEndDate,
    setKeyword,
  };
}
