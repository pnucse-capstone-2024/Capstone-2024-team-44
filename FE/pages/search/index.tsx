import EmptyBox from "@/components/commons/empty-box";
import InsightRecordContainer from "@/components/search/insight-record-container";
import Layout from "@/components/commons/layout";
import LogFileContainer from "@/components/search/log-file-container";
import SearchInput from "@/components/search/search-input";
import { useEffect, useRef, useState } from "react";
import {
  ValidateLoginProps,
  getValidateLoginSSR,
} from "@/ssr/commons/validate-login-ssr";
import { GetServerSideProps } from "next";
import { Nickname } from "@/types/login/login-type";
import useSearchInput from "@/hooks/search/use-search-input";
import { formatToLocalISOString } from "@/utils/date-utils";
import { fetchSearchResult } from "@/api/search/search-api";
import { SearchResult } from "@/types/search/search-type";

export const getServerSideProps: GetServerSideProps<ValidateLoginProps> =
  getValidateLoginSSR;

export default function Search({ NicknameSSR }: ValidateLoginProps) {
  const nicknameRef = useRef<Nickname | null>(NicknameSSR);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearched, setIsSearched] = useState(false);
  const { startDate, endDate, keyword, setStartDate, setEndDate, setKeyword } =
    useSearchInput();

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(keyword ? false : true);
  }, [startDate, endDate, keyword]);

  const handleSearchButton = async () => {
    if (disabled) return;
    const result = startDate
      ? await fetchSearchResult(
          formatToLocalISOString(startDate),
          formatToLocalISOString(endDate),
          keyword
        )
      : await fetchSearchResult("", "", keyword);
    setSearchResult(result);
    setIsSearched(true);
  };

  useEffect(() => {
    console.log("searchResult: ", searchResult);
  }, [searchResult]);

  return (
    <Layout nickname={nicknameRef.current?.nickName || null}>
      <div className="px-5 xs:px-7 sm:px-10 max-w-[1200px]">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center gap-2 xs:gap-5">
            <span className="text-[24px] xs:text-[30px] sm:text-[36px] text-black font-bold pl-1">
              검색
            </span>
          </div>
        </div>
        <SearchInput
          startDate={startDate}
          endDate={endDate}
          keyword={keyword}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setKeyword={setKeyword}
          disabled={disabled}
          handleSearchButton={handleSearchButton}
        />
        {isSearched ? (
          <>
            {searchResult && searchResult.logfiles.length > 0 ? (
              <LogFileContainer files={searchResult.logfiles} />
            ) : (
              <EmptyBox
                title="로그 파일"
                content="파일이 존재하지 않습니다"
                type="log"
              />
            )}{" "}
          </>
        ) : null}

        {isSearched ? (
          <>
            {searchResult && searchResult.insights.length > 0 ? (
              <InsightRecordContainer files={searchResult.insights} />
            ) : (
              <EmptyBox
                title="인사이트 기록"
                content="기록이 존재하지 않습니다"
              />
            )}
          </>
        ) : null}
      </div>
    </Layout>
  );
}
