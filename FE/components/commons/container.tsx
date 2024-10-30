import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cls } from "@/utils/class-utils";

interface LayoutProps {
  title: string;
  link?: string;
  update?: string;
  type?: "log" | "insight" | "others";
  action?: () => void;
  children: React.ReactNode;
}

export default function Container({
  title,
  link,
  update,
  type = "others",
  action,
  children,
}: LayoutProps) {
  return (
    <div
      className={cls(
        "flex flex-col justify-start items-start w-full max-w-[1200px] min-h-[210px] xs:min-h-[260px] sm:min-h-[310px] rounded-lg border border-[#E5E7EB] shadow-md gap-2 px-6 xs:px-8 sm:px-10 pt-3 xs:pt-4 sm:pt-5 pb-6 xs:pb-7 sm:pb-8 mt-6 xs:mt-7 sm:mt-8",
        type === "log" || type === "insight"
          ? "min-h-[440px] xs:min-h-[520px] sm:min-h-[600px]"
          : "min-h-[210px] xs:min-h-[260px] sm:min-h-[310px]"
      )}
    >
      <div className="flex flex-row justify-between items-center relative w-full mb-1 xs:mb-2">
        <span className="text-[21px] xs:text-[24px] sm:text-[27px] font-bold">
          {title}
        </span>
        {link ? (
          <Link href={link} className="cursor-pointer">
            <Image
              src="/images/chevron-right.svg"
              alt="chevron-right"
              width={20}
              height={20}
              className="w-[16px] h-[16px] xs:w-[18px] xs:h-[18px] sm:w-[20px] sm:h-[20px]"
              priority
            />
          </Link>
        ) : null}
        {action ? (
          <Image
            src="/images/chevron-right.svg"
            alt="chevron-right"
            width={20}
            height={20}
            className="w-[16px] h-[16px] xs:w-[18px] xs:h-[18px] sm:w-[20px] sm:h-[20px] cursor-pointer"
            onClick={action}
            priority
          />
        ) : null}
        {update ? (
          <div className="absolute top-0.5 xs:top-0 right-[10%] text-[12px] xs:text-[14px] sm:text-[16px] text-[#979797] font-normal mt-1 xs:mt-2">
            {update}
          </div>
        ) : null}
      </div>
      <div className="w-full text-[13px] xs:text-[15px] sm:text-[17px] font-medium break-all">
        {children}
      </div>
    </div>
  );
}
