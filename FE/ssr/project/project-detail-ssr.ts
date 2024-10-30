import { verifyAccessToken } from "@/api/login/login-api";
import {
  fetchLogFileList,
  fetchProjectDetail,
} from "@/api/project/project-api";
import { Nickname } from "@/types/login/login-type";
import { LogFileList, ProjectDetail } from "@/types/project/project-type";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";

export interface ProjectDetailPageProps {
  NicknameSSR: Nickname | null;
  ProjectDetailSSR: ProjectDetail | null;
  LogFileListSSR: LogFileList | null;
}

export interface Params extends ParsedUrlQuery {
  id: string;
}

export async function getProjectDetailSSR(
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<GetServerSidePropsResult<ProjectDetailPageProps>> {
  const { id } = context.params as Params;

  if (!id) {
    throw new Error("Missing pet ID");
  }
  const accessToken = context.req.cookies?.accessToken || "";

  const [NicknameSSR, ProjectDetailSSR, LogFileListSSR] = await Promise.all([
    verifyAccessToken(accessToken),
    fetchProjectDetail(Number(id), accessToken),
    fetchLogFileList(Number(id), accessToken),
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
      ProjectDetailSSR,
      LogFileListSSR,
    },
  };
}
