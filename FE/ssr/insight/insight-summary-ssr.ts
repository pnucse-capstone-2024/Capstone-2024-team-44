import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";
import { fetchInsightSummary } from "@/api/insight/insight-api";
import { InsightSummary } from "@/types/insight/insight-type";
import { Nickname } from "@/types/login/login-type";
import { verifyAccessToken } from "@/api/login/login-api";

export interface InsightSummaryPageProps {
  NicknameSSR: Nickname | null;
  InsightSummarySSR: InsightSummary | null;
}

export async function getInsightSummarySSR(
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<GetServerSidePropsResult<InsightSummaryPageProps>> {
  const { type } = context.params as { type: string };
  const accessToken = context.req.cookies?.accessToken || "";

  const [NicknameSSR, InsightSummarySSR] = await Promise.all([
    verifyAccessToken(accessToken),
    fetchInsightSummary(type, accessToken),
  ]);

  if (!NicknameSSR) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      NicknameSSR,
      InsightSummarySSR,
    },
  };
}
