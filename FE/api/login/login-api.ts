import { AccessToken, LoginResponse, Nickname } from "@/types/login/login-type";

export const requestLoginToken = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const {
      success,
      message,
      result,
    }: { success: boolean; message: string; result: AccessToken | null } =
      await response.json();
    return { success, message, result };
  } catch (error) {
    console.error("Failed to fetch login request, accessToken:", error);
    throw error;
  }
};

export const verifyAccessToken = async (
  accessToken: string
): Promise<Nickname | null> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log(
      `verifyAccessToken: Fetching from ${baseURL}/validate/accessToken with token ${accessToken}`
    );

    const response = await fetch(`${baseURL}/validate/accessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.log("verifyAccessToken: Response not OK");
      throw new Error("Token is invalid");
    }

    const data: { result: Nickname | null } = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error verifying access token:", error);
    return null;
  }
};
