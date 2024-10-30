import Image from "next/image";

interface LogFileProps {
  fileName: string;
  redirectURL: string;
}

export default function LogFile({ fileName, redirectURL }: LogFileProps) {
  const handledLogFile = () => {
    if (redirectURL === "") return;
    window.open(redirectURL, "_blank");
  };
  return (
    <>
      <Image
        src="/images/log-file.svg"
        alt="log-file"
        width={65}
        height={64}
        className="w-[40px] h-[39px] xs:w-[52px] xs:h-[51px] sm:w-[65px] sm:h-[64px] cursor-pointer"
        onClick={handledLogFile}
        priority
      />
      <span className="text-[10px] xs:text-[12px] sm:text-[14px] line-clamp-2 text-center px-4">
        {fileName}
      </span>
    </>
  );
}
