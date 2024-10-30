import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useState } from "react";
import { cls } from "@/utils/class-utils";

interface HeaderProps {
  nickname?: string | null;
  toggleSidebar: () => void;
}

export default function Header({ nickname = "", toggleSidebar }: HeaderProps) {
  const router = useRouter();
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);

  const handleAlarmButton = () => {
    setIsAlarmOpen((prev) => !prev);
  };

  const handleLogoutButton = () => {
    sessionStorage.clear();
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    router.push("/login");
  };

  return (
    <div className="flex flex-row justify-between items-center h-[70px] fixed top-0 w-full z-20 bg-white border-b border-[#717478] pt-5 pb-3 pl-8 pr-1">
      <div className="flex flex-row justify-start items-center gap-3 w-full relative xs:w-[120px]">
        <div className="absolute -left-7 xl:hidden cursor-pointer">
          <Image
            src="/images/menu.svg"
            alt="menu"
            width={40}
            height={40}
            onClick={toggleSidebar}
            priority
          />
        </div>
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="ml-4 cursor-pointer"
          onClick={() => router.push("/dashboard")}
          priority
        />
        <span
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          LLMN
        </span>
      </div>
      <div className="flex flex-row justify-center items-center gap-3 xs:gap-5 absolute right-3 xs:relative">
        <div className="flex flex-row justify-start items-center sm:pr-1">
          <Link href="/search">
            <Image
              src="/images/search.svg"
              alt="search"
              width={25}
              height={25}
              className="w-[20px] h-[20px] xs:w-[25px] xs:h-[25px] cursor-pointer"
              priority
            />
          </Link>
        </div>
        <div className="flex flex-row justify-start items-center relative xs:gap-2">
          <Image
            src="/images/alarm.svg"
            alt="alarm"
            width={25}
            height={28}
            className="w-[20px] h-[23px] xs:w-[25px] xs:h-[28px] cursor-pointer"
            onClick={handleAlarmButton}
            priority
          />
          <span className="text-[18px] font-medium hidden sm:inline">1</span>
          <div
            className={cls(
              "flex flex-col justify-start items-center absolute top-[42.9px] xs:top-[45.5px] -left-[100px] xs:-left-[165px] sm:-left-[125px] w-[200px] xs:w-[300px] sm:w-[400px] h-[300px] xs:h-[450px] sm:h-[600px] border border-t-0 border-[#717478] bg-white overflow-hidden transition-all duration-500 ease-in-out overflow-y-auto overflow-x-hidden custom-scrollbar",
              isAlarmOpen
                ? "max-h-[300px] xs:max-h-[450px] sm:max-h-[600px] border-b-1"
                : "max-h-0 border-b-0"
            )}
          >
            <div className="flex flex-row justify-start items-center w-full text-[12px] xs:text-[14px] sm:text-[16px] font-bold px-5 xs:px-6 sm:px-7 py-3 xs:py-4 sm:py-5 border-b border-[#717478]">
              알림
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-start items-center gap-2">
          <Image
            src="/images/profile.svg"
            alt="profile"
            width={30}
            height={30}
            className="w-[25px] h-[25px] xs:w-[30px] xs:h-[30px] cursor-pointer"
            priority
          />
          <span className="text-[18px] font-medium hidden sm:inline">
            {nickname}
          </span>
          {/* <Image
            src="/images/chevron-down.svg"
            alt="chevron-down"
            width={16}
            height={10}
            className="hidden sm:inline"
            priority
          /> */}
        </div>
        <div
          className="flex flex-row justify-start items-center gap-2"
          onClick={handleLogoutButton}
        >
          <Image
            src="/images/logout.svg"
            alt="logout"
            width={27}
            height={26}
            className="w-[22px] h-[21px] xs:w-[27px] xs:h-[26px] cursor-pointer"
            priority
          />
          <span className="text-[18px] font-medium hidden sm:inline cursor-pointer">
            로그아웃
          </span>
        </div>
      </div>
    </div>
  );
}
