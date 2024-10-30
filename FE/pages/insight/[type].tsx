import Container from "@/components/commons/container";
import DropdownMenu from "@/components/commons/dropdown-menu";
import EmptyBox from "@/components/commons/empty-box";
import Layout from "@/components/commons/layout";
import {
  InsightSummaryPageProps,
  getInsightSummarySSR,
} from "@/ssr/insight/insight-summary-ssr";
import type { InsightSummary } from "@/types/insight/insight-type";
import { Nickname } from "@/types/login/login-type";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

export const getServerSideProps: GetServerSideProps<InsightSummaryPageProps> =
  getInsightSummarySSR;

export default function InsightSummary({
  NicknameSSR,
  InsightSummarySSR,
}: InsightSummaryPageProps) {
  const router = useRouter();
  const { type } = router.query;
  const title = {
    performance: "성능 요약",
    daily: "일일 요약",
    trend: "장기 트렌드",
    recommendation: "추천",
  };
  const nicknameRef = useRef<Nickname | null>(NicknameSSR);
  const insightSummaryRef = useRef<InsightSummary | null>(InsightSummarySSR);

  return (
    <Layout nickname={nicknameRef.current?.nickName || null}>
      <div className="px-5 xs:px-7 sm:px-10 max-w-[1200px]">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center">
            <Link href="/insight">
              <Image
                src="/images/back.svg"
                alt="back"
                width={45}
                height={45}
                className="w-[35px] h-[35px] xs:w-[40px] xs:h-[40px] sm:w-[45px] sm:h-[45px]"
                priority
              />
            </Link>
            <span className="text-[24px] xs:text-[30px] sm:text-[36px] text-black font-bold pl-1">
              {title[type as keyof typeof title]}
            </span>
          </div>
          {/* <div className="flex flex-row justify-start items-center"> */}
          <div className="hidden">
            <div>
              <DropdownMenu options={["edit", "restart", "stop", "delete"]} />
            </div>
          </div>
        </div>
        {insightSummaryRef.current &&
        insightSummaryRef.current.summaries.length > 0 ? (
          insightSummaryRef.current?.summaries?.map((summary) => (
            <div key={summary.id}>
              <Container title={summary.time} link="" update="">
                <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                  {summary.content}
                </div>
              </Container>
            </div>
          ))
        ) : (
          <EmptyBox
            title={`title.${type}`}
            content={
              type === "trend"
                ? "트렌드 내역이 존재하지 않습니다."
                : type === "recommend"
                ? "추천 내역이 존재하지 않습니다."
                : "요약 내역이 존재하지 않습니다."
            }
          />
        )}
      </div>
    </Layout>
  );
}
