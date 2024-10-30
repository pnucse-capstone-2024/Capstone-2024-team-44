import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { verifyAccessToken } from "@/api/login/login-api";
import { Nickname } from "@/types/login/login-type";

// 타입 가드: props가 존재하는지 확인
function isPropsResult<P>(
  result: GetServerSidePropsResult<P>
): result is { props: P } {
  return "props" in result;
}

export function withAuthSSR<P extends { nicknameSSR: Nickname | null }>(
  getServerSidePropsFunc?: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<P>> => {
    const accessToken = context.req.cookies?.accessToken || "";
    const nicknameSSR = await verifyAccessToken(accessToken);

    if (!nicknameSSR) {
      console.log("withAuthSSR: Not authenticated, redirecting to /login");
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const result = getServerSidePropsFunc
      ? await getServerSidePropsFunc(context)
      : { props: {} as P };

    if (isPropsResult(result)) {
      return {
        props: {
          ...result.props,
          nicknameSSR,
        },
      };
    }

    return result;
  };
}
