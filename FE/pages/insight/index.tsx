import Container from "@/components/commons/container";
import DropdownMenu from "@/components/commons/dropdown-menu";
import EmptyBox from "@/components/commons/empty-box";
import Layout from "@/components/commons/layout";
import { InsightPageProps, getInsightSSR } from "@/ssr/insight/insight-ssr";
import type { Insight } from "@/types/insight/insight-type";
import { Nickname } from "@/types/login/login-type";
import { GetServerSideProps } from "next";
import { useRef } from "react";

export const getServerSideProps: GetServerSideProps<InsightPageProps> =
  getInsightSSR;

export default function Insight({ NicknameSSR, InsightSSR }: InsightPageProps) {
  const nicknameRef = useRef<Nickname | null>(NicknameSSR);
  const insightRef = useRef<Insight | null>(InsightSSR);

  return (
    <Layout nickname={nicknameRef.current?.nickName || null}>
      <div className="px-5 xs:px-7 sm:px-10 max-w-[1200px]">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center gap-2 xs:gap-5">
            <span className="text-[24px] xs:text-[30px] sm:text-[36px] text-black font-bold pl-1">
              인사이트
            </span>
          </div>
          {/* <div className="flex flex-row justify-start items-center"> */}
          <div className="hidden">
            <div>
              <DropdownMenu options={["edit", "restart", "stop", "delete"]} />
            </div>
          </div>
        </div>
        {insightRef.current?.performanceSummary ? (
          <Container
            title="성능 요약"
            link="/insight/performance"
            update={`${
              insightRef.current?.performanceUpdateTime?.split(" ")[0]
            } 업데이트`}
          >
            <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {insightRef.current?.performanceSummary}
            </div>
          </Container>
        ) : (
          <EmptyBox
            title={"성능 요약"}
            content={"요약 내역이 존재하지 않습니다."}
          />
        )}
        {insightRef.current?.dailySummary ? (
          <Container
            title="일일 요약"
            link="/insight/daily"
            update={`${
              insightRef.current?.dailyUpdateTime?.split(" ")[0]
            } 업데이트`}
          >
            <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {insightRef.current?.dailySummary}
            </div>
          </Container>
        ) : (
          <EmptyBox
            title={"일일 요약"}
            content={"요약 내역이 존재하지 않습니다."}
          />
        )}
        {insightRef.current?.trendSummary ? (
          <Container
            title="장기 트렌드 분석"
            link="/insight/trend"
            update={`${
              insightRef.current?.trendUpdateTime?.split(" ")[0]
            } 업데이트`}
          >
            <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {insightRef.current?.trendSummary}
            </div>
          </Container>
        ) : (
          <EmptyBox
            title={"장기 트렌드 분석"}
            content={"분석 내역이 존재하지 않습니다."}
          />
        )}
        {insightRef.current?.recommendation ? (
          <Container
            title="추천"
            link="/insight/recommendation"
            update={`${
              insightRef.current?.recommendUpdateTime?.split(" ")[0]
            } 업데이트`}
          >
            <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {insightRef.current?.recommendation}
            </div>
          </Container>
        ) : (
          <EmptyBox title={"추천"} content={"추천 내역이 존재하지 않습니다."} />
        )}
      </div>
    </Layout>
  );
}
