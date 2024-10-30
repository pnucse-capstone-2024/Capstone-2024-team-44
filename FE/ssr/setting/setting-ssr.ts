import { verifyAccessToken } from "@/api/login/login-api";
import { fetchSetting } from "@/api/setting/setting-api";
import { Nickname } from "@/types/login/login-type";
import { Setting } from "@/types/setting/setting-type";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";

export interface SettingPageProps {
  NicknameSSR: Nickname | null;
  SettingSSR: Setting | null;
}

export async function getSettingSSR(
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<GetServerSidePropsResult<SettingPageProps>> {
  const accessToken = context.req.cookies?.accessToken || "";

  const [NicknameSSR, SettingSSR] = await Promise.all([
    verifyAccessToken(accessToken),
    fetchSetting(accessToken),
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
      SettingSSR,
    },
  };
}
