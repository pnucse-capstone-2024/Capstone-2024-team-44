import {
  LogFileList,
  LogFiles,
  LogMessage,
  ProjectDetail,
  ProjectInfo,
  ProjectList,
  ProjectSummaryList,
} from "@/types/project/project-type";
import Cookies from "js-cookie";

export async function fetchProjectList(
  accessToken: string
): Promise<ProjectList | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/project`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const { result }: { result: ProjectList | null } = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch pets data with auth:", error);
    return null;
  }
}

export async function refreshProjectList(): Promise<ProjectList | null> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/project/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const { result }: { result: ProjectList | null } = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch pets data with auth:", error);
    return null;
  }
}

export async function fetchProjectDetail(
  projectId: number,
  accessToken: string
): Promise<ProjectDetail | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/project/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const { result }: { result: ProjectDetail | null } = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch pets data with auth:", error);
    return null;
  }
}

export async function fetchLogFileList(
  projectId: number,
  accessToken: string
): Promise<LogFileList | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/project/${projectId}/logs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const { result }: { result: LogFileList | null } = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch pets data with auth:", error);
    return null;
  }
}

export async function fetchProjectSummaryList(
  projectId: number,
  page: number,
  accessToken: string
): Promise<ProjectSummaryList | null> {
  try {
    console.log("Fetching project summary list");
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${baseURL}/project/${projectId}/summaries?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    // const { result }: { result: ProjectSummaryList | null } =
    const { result }: { result: any } = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
    return null;
  }
}

export async function fetchLogMessage(
  projectId: number,
  logFileName: string,
  accessToken: string
): Promise<LogMessage | null> {
  try {
    console.log("Fetching project summary list");
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${baseURL}/project/${projectId}/logs/${logFileName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const { result }: { result: LogMessage | null } = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
    return null;
  }
}

export async function fetchProjectInfo(
  projectId: number,
  accessToken: string
): Promise<ProjectInfo | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/project/${projectId}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const { result }: { result: ProjectInfo | null } = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
    return null;
  }
}

export async function editProjectInfo(
  projectId: number,
  projectName: string,
  description: string,
  containerName: string
): Promise<boolean> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/project/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({
        projectName,
        containerName,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const { success }: { success: boolean } = await response.json();
    return success;
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
    return false;
  }
}

export async function restartContainer(
  projectId: number,
  name: string
): Promise<boolean> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${baseURL}/project/${projectId}/container/restart`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name,
        }),
      }
    );

    const { success }: { success: boolean } = await response.json();
    return success;
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
    return false;
  }
}

export async function stopContainer(
  projectId: number,
  name: string
): Promise<boolean> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${baseURL}/project/${projectId}/container/stop`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name,
        }),
      }
    );

    const { success }: { success: boolean } = await response.json();
    return success;
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
    return false;
  }
}

export async function deleteContainer(projectId: number): Promise<boolean> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/project/${projectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const { success }: { success: boolean } = await response.json();
    return success;
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
    return false;
  }
}

export async function submitSSHCommand(command: string): Promise<void> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/command/home`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ command }),
    });
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
  }
}

export async function initSSHCommand(): Promise<boolean> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/command/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { success }: { success: boolean } = await response.json();
    return success;
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
    return false;
  }
}
