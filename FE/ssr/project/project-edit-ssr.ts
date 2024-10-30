import { verifyAccessToken } from "@/api/login/login-api";
import { fetchProjectInfo } from "@/api/project/project-api";
import { Nickname } from "@/types/login/login-type";
import { ProjectInfo } from "@/types/project/project-type";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";

export interface ProjectEditPageProps {
  NicknameSSR: Nickname | null;
  ProjectInfoSSR: ProjectInfo | null;
}

export interface Params extends ParsedUrlQuery {
  id: string;
}

export async function getProjectEditSSR(
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<GetServerSidePropsResult<ProjectEditPageProps>> {
  const { id } = context.params as Params;

  if (!id) {
    throw new Error("Missing pet ID");
  }
  const accessToken = context.req.cookies?.accessToken || "";

  const [NicknameSSR, ProjectInfoSSR] = await Promise.all([
    verifyAccessToken(accessToken),
    fetchProjectInfo(Number(id), accessToken),
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
      ProjectInfoSSR,
    },
  };
}
