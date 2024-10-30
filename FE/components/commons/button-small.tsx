import { cls } from "@/utils/class-utils";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: string;
  isCloseButton?: boolean;
}

export default function ButtonSmall({
  label,
  disabled = false,
  onClick,
  type = "",
}: ButtonProps) {
  return (
    <div className="flex flex-row justify-center items-center relative flex-shrink-0">
      <button
        className={cls(
          "rounded-md font-semibold text-white transition-colors",
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-800 cursor-pointer hover:bg-black",
          type === "modal"
            ? "h-[35px] xs:h-[40px] sm:h-[45px] text-[14px] xs:text-[16px] sm:text-[18px] px-[16px] xs:px-[18px] sm:px-[20px]"
            : type === "search"
            ? "h-[30px] xs:h-[40px] sm:h-[50px] text-[16px] xs:text-[18px] sm:text-[20px] px-[14px] xs:px-[18px] sm:px-[22px]"
            : "h-[40px] xs:h-[45px] sm:h-[50px] text-[16px] xs:text-[18px] sm:text-[20px] px-[20px] xs:px-[22px] sm:px-[24px]"
        )}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
}
