import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";
import { fetchInsight } from "@/api/insight/insight-api";
import { Insight } from "@/types/insight/insight-type";
import { Nickname } from "@/types/login/login-type";
import { verifyAccessToken } from "@/api/login/login-api";

export interface InsightPageProps {
  NicknameSSR: Nickname | null;
  InsightSSR: Insight | null;
}

export async function getInsightSSR(
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<GetServerSidePropsResult<InsightPageProps>> {
  const accessToken = context.req.cookies?.accessToken || "";

  const [NicknameSSR, InsightSSR] = await Promise.all([
    verifyAccessToken(accessToken),
    fetchInsight(accessToken),
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
      InsightSSR,
    },
  };
}
