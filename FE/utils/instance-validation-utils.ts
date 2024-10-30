import { validateIPv4, validateIPv6 } from "@/utils/ip-utils";
import { validateRemoteName } from "@/utils/validation-utils";

export function validateName(input: string, initial: string) {
  if (input.trim() === "") return { isValid: false, message: "" };
  if (initial !== "" && initial === input)
    return { isValid: true, message: "현재 사용 중인 닉네임입니다." };
  if (validateRemoteName(input)) {
    return { isValid: true, message: "사용 가능한 사용자명입니다." };
  }
  return {
    isValid: false,
    message: "3-32자의 영어, 숫자, 하이픈(-), 밑줄(_)을 입력해주세요.",
  };
}

export function validateHost(
  input: string,
  initial: string,
  isMobile: boolean
) {
  if (input.trim() === "") return { isValid: false, message: "" };
  if (initial !== "" && initial === input)
    return { isValid: true, message: "현재 사용 중인 IP입니다." };

  const isIPv6 = input.includes(":");
  if (!input.includes(".") && !isIPv6) {
    return {
      isValid: false,
      message: "IPv4 또는 IPv6 형식 중 하나만 입력하세요.",
    };
  }

  if (isIPv6) {
    return validateIPv6(input)
      ? { isValid: true, message: "유효한 IPv6 주소입니다." }
      : {
          isValid: false,
          message: isMobile
            ? "IPv6 형식에 맞춰 입력하세요. 예: 2001:db8::1"
            : "IPv6 형식에 맞춰 입력하세요. 예: 2001:0db8:85a3:0000:0000:8a2e:0370:7334",
        };
  }

  return validateIPv4(input)
    ? { isValid: true, message: "유효한 IPv4 주소입니다." }
    : {
        isValid: false,
        message: "IPv4 형식에 맞춰 입력하세요. 예: 192.168.0.1",
      };
}
