import { verifyAccessToken } from "@/api/login/login-api";
import { Nickname } from "@/types/login/login-type";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";

export interface ValidateLoginProps {
  NicknameSSR: Nickname | null;
}

export async function getValidateLoginSSR(
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<GetServerSidePropsResult<ValidateLoginProps>> {
  const accessToken = context.req.cookies?.accessToken || "";

  const NicknameSSR = await verifyAccessToken(accessToken);

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
    },
  };
}
