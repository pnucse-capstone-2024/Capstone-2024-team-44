import { cls } from "@/utils/class-utils";
import Link from "next/link";

interface ButtonProps {
  label: string;
  kind: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function ButtonLarge({
  label,
  kind = "login",
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <div
      className={`flex flex-row justify-center items-center relative w-full max-w-[605px]`}
    >
      <button
        className={cls(
          "w-full h-[45px] xs:h-[50px] sm:h-[55px] text-[16px] xs:text-[18px] sm:text-[20px] rounded-md text-white font-semibold transition-colors",
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-800 cursor-pointer hover:bg-black"
        )}
        onClick={onClick}
      >
        {label}
      </button>
      {kind === "login" ? (
        <>
          <Link href="/login/signup-step1">
            <span className="absolute left-0.5 top-[50px] xs:top-[56px] sm:top-[62px] text-[14px] xs:text-[15px] sm:text-[16px] font-semibold text-[#717478] hover:text-black cursor-pointer">
              회원가입
            </span>
          </Link>
          <Link href="/login/find-account-step1">
            <span className="absolute right-0.5 top-[50px] xs:top-[56px] sm:top-[62px] text-[14px] xs:text-[15px] sm:text-[16px] font-semibold text-[#717478] hover:text-black cursor-pointer">
              비밀번호 찾기
            </span>
          </Link>
        </>
      ) : null}
    </div>
  );
}
