import { SSHInfo } from "@/types/login/login-type";

export const CheckEmailDuplication = async (
  email: string
): Promise<boolean> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts/check/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("email data : ", data);
    return data.result.isValid;
  } catch (error) {
    console.error("사용불가능한 이메일입니다.", error);
    throw error;
  }
};

export const VerifyEmailCode = async (
  email: string,
  code: string,
  type: string
): Promise<boolean | void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${baseURL}/accounts/verify/code?codeType=${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("code data : ", data);
    return data.result.isMatching;
  } catch (error) {
    console.error("쿼리문: 코드가 일치하지 않습니다.", error);
  }
};

export const ResendCode = async (
  email: string,
  type: string
): Promise<boolean | void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${baseURL}/accounts/resend/code?codeType=${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("email data : ", data);
    return data.success;
  } catch (error) {
    console.error("사용불가능한 이메일입니다.", error);
  }
};

export const CheckRegisteredEmail = async (email: string): Promise<boolean> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts/recovery/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("email data : ", data);
    return data.result.isValid;
  } catch (error) {
    console.error("사용불가능한 이메일입니다.", error);
    throw error;
  }
};

export const ResetNewPassword = async (
  code: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts/recovery/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, newPassword }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const { success }: { success: boolean } = await response.json();
    return success;
  } catch (error) {
    console.error("사용불가능한 이메일입니다.", error);
    throw error;
  }
};

interface ValidateSSHRequest {
  remoteName: string;
  remoteHost: string;
  remoteKeyPath: string;
}

export const SSHPemKeyUpload = async (file: File): Promise<string | null> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${baseURL}/accounts/ssh`, {
      method: "POST",
      body: formData,
    });

    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error uploading SSH key:", error);
    throw error;
  }
};

export const validateInstance = async (
  remoteValues: ValidateSSHRequest
): Promise<boolean> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts/validate/ssh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(remoteValues),
    });

    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }

    const data = await response.json();
    // return data.result.isValid;
    return true;
    // return false;
  } catch (error) {
    console.error("Error validating SSH:", error);
    throw error;
  }
};

export const checkNicknameDuplication = async (
  nickname: string
): Promise<{ isDuplicate: boolean }> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts/check/nick`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickName: nickname }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: { isDuplicate: boolean } = await response.json();
    console.log("nick data", data);
    return data; // 서버 응답 반환
  } catch (error) {
    console.error("닉네임 체크 중 오류 발생:", error);
    throw error; // 에러 처리를 호출한 곳으로 전파
  }
};

export const verifyOpenAIKey = async (apiKey: string): Promise<boolean> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts/validate/key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });

    const data = await response.json();
    return data.result.isValid;
  } catch (error) {
    console.error("Error verifying API key:", error);
    return false;
  }
};

export const submitSignup = async (
  receivingAlarm: boolean,
  email: string,
  nickName: string,
  password: string,
  passwordConfirm: string,
  sshInfos: SSHInfo[],
  monitoringSshHost: string,
  openAiKey: string
): Promise<boolean> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receivingAlarm,
        email,
        nickName,
        password,
        passwordConfirm,
        sshInfos,
        monitoringSshHost,
        openAiKey,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const { success }: { success: boolean } = await response.json();
    return success;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
