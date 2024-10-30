import { verifyAccessToken } from "@/api/login/login-api";
import {
  fetchLogFileList,
  fetchProjectSummaryList,
} from "@/api/project/project-api";
import { Nickname } from "@/types/login/login-type";
import { LogFileList, ProjectSummaryList } from "@/types/project/project-type";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";

export interface ProjectSummaryListPageProps {
  NicknameSSR: Nickname | null;
  ProjectSummaryListSSR: ProjectSummaryList | null;
  LogFileListSSR: LogFileList | null;
}

export interface Params extends ParsedUrlQuery {
  id: string;
}

export async function getProjectSummaryListSSR(
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<GetServerSidePropsResult<ProjectSummaryListPageProps>> {
  const { id } = context.params as Params;

  if (!id) {
    throw new Error("Missing project ID");
  }
  const accessToken = context.req.cookies?.accessToken || "";

  const [NicknameSSR, ProjectSummaryListSSR, LogFileListSSR] =
    await Promise.all([
      verifyAccessToken(accessToken),
      fetchProjectSummaryList(Number(id), 0, accessToken),
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
      ProjectSummaryListSSR,
      LogFileListSSR,
    },
  };
}
