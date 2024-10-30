import ButtonSmall from "@/components/commons/button-small";
import Layout from "@/components/commons/layout";
import {
  ValidateLoginProps,
  getValidateLoginSSR,
} from "@/ssr/commons/validate-login-ssr";
import { Nickname } from "@/types/login/login-type";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export const getServerSideProps: GetServerSideProps<ValidateLoginProps> =
  getValidateLoginSSR;

export default function License({ NicknameSSR }: ValidateLoginProps) {
  const nicknameRef = useRef<Nickname | null>(NicknameSSR);
  return (
    <Layout nickname={nicknameRef.current?.nickName || null}>
      <div className="px-5 xs:px-7 sm:px-10 max-w-[1200px]">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row justify-start items-center">
            <Link href="/setting">
              <Image
                src="/images/back.svg"
                alt="back"
                width={45}
                height={45}
                className="w-[35px] h-[35px] xs:w-[40px] xs:h-[40px] sm:w-[45px] sm:h-[45px] cursor-pointer"
                priority
              />
            </Link>
            <span className="text-[24px] xs:text-[30px] sm:text-[36px] text-black font-bold">
              오픈소스 라이센스
            </span>
          </div>
          <div className="flex flex-row justify-center items-center text-[12px] xs:text-[14px] sm:text-[16px] text-[#979797] font-medium">
            ver_1.00
          </div>
        </div>
        <div className="flex flex-col justify-start items-start w-full max-w-[1200px] rounded-md bg-[#F8F9FA] border border-[#E4E4E7] gap-2 xs:gap-3 sm:gap-4 pl-4 xs:pl-6 sm:pl-8 pr-8 xs:pr-12 sm:pr-16 py-2 xs:py-4 sm:py-6 mt-6 xs:mt-7 sm:mt-8">
          <div className="text-[12px] xs:text-[15px] sm:text-[18px] font-normal">
            Copyright (c) 2024 hoyaii
          </div>
          <div className="text-[11px] xs:text-[14px] sm:text-[17px] font-normal">
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the &quot;Software&quot;), to deal in the Software without
            restriction, including without limitation the rights to use, copy,
            modify, merge, publish, distribute, sublicense, and/or sell copies
            of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </div>
          <div className="text-[11px] xs:text-[14px] sm:text-[17px] font-normal">
            The above copyright notice and this permission notice shall be
            included in all copies or substantial portions of the Software.
          </div>
          <div className="text-[12px] xs:text-[15px] sm:text-[18px] font-normal">
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY
            KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </div>
        </div>
        <div className="flex flex-row justify-center items-center w-full mt-12 xs:mt-14 sm:mt-16">
          <ButtonSmall label="수정" />
        </div>
      </div>
    </Layout>
  );
}
