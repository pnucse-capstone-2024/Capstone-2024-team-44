import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-row justify-center items-center gap-2 xs:gap-2.5 sm:gap-3">
      <Image
        src="/images/logo.svg"
        alt="logo"
        width={46}
        height={54}
        className="w-[37px] xs:w-[41px] sm:w-[46px] h-[43px] xs:h-[49px] sm:h-[54px]"
        priority
      />
      <span className="text-[26px] xs:text-[28px] sm:text-[30px] font-semibold">
        LLMN
      </span>
    </div>
  );
}
