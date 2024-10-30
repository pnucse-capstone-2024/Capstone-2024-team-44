import { verifyAccessToken } from "@/api/login/login-api";
import { fetchCloudInstanceList } from "@/api/new-item/new-item-api";
import { Nickname } from "@/types/login/login-type";
import { CloudInstanceList } from "@/types/new-item/new-item-type";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";

export interface NewItemPageProps {
  NicknameSSR: Nickname | null;
  CloudInstanceListSSR: CloudInstanceList | null;
}

export async function getNewItemSSR(
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<GetServerSidePropsResult<NewItemPageProps>> {
  const accessToken = context.req.cookies?.accessToken || "";

  const [NicknameSSR, CloudInstanceListSSR] = await Promise.all([
    verifyAccessToken(accessToken),
    fetchCloudInstanceList(accessToken),
  ]);

  if (NicknameSSR === null) {
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
      CloudInstanceListSSR,
    },
  };
}
