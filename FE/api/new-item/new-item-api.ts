import { CloudInstanceList } from "@/types/new-item/new-item-type";
import Cookies from "js-cookie";

export async function fetchCloudInstanceList(
  accessToken: string
): Promise<CloudInstanceList | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/project/cloud`, {
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

    const { result }: { result: CloudInstanceList | null } =
      await response.json();

    return result;
  } catch (error) {
    console.error("Failed to fetch pets data with auth:", error);
    return null;
  }
}

export async function CreateNewProject(
  projectName: string,
  description: string,
  sshInfoId: number,
  containerName: string
): Promise<boolean> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({
        projectName,
        description,
        sshInfoId,
        containerName,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const { success }: { success: boolean } = await response.json();
    return success;
  } catch (error) {
    console.error("Failed to fetch pets data with auth:", error);
    return false;
  }
}
