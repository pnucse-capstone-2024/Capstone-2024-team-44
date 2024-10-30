import { Setting, SshInfoEdit } from "@/types/setting/setting-type";
import Cookies from "js-cookie";

export async function fetchSetting(
  accessToken: string
): Promise<Setting | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts/info`, {
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

    const { result }: { result: Setting | null } = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch pets data with auth:", error);
    return null;
  }
}

export async function editSetting(
  nickName: string,
  receivingAlarm: boolean,
  monitoringSshHost: string,
  sshInfos: SshInfoEdit[]
): Promise<boolean> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({
        nickName,
        receivingAlarm,
        monitoringSshHost,
        sshInfos,
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

export async function withdrawAccount(): Promise<boolean> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts/withdraw`, {
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
