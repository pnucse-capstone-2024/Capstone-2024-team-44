import ButtonSmall from "@/components/commons/button-small";
import DropdownMenu from "@/components/commons/dropdown-menu";
import Input from "@/components/commons/input";
import Layout from "@/components/commons/layout";
import useOpenAIKeyCheck from "@/hooks/commons/use-open-ai-key-check";
import {
  ValidateLoginProps,
  getValidateLoginSSR,
} from "@/ssr/commons/validate-login-ssr";
import { Nickname } from "@/types/login/login-type";
import { cls } from "@/utils/class-utils";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export const getServerSideProps: GetServerSideProps<ValidateLoginProps> =
  getValidateLoginSSR;

export default function ApiKey({ NicknameSSR }: ValidateLoginProps) {
  const nicknameRef = useRef<Nickname | null>(NicknameSSR);
  const { openAIKey, isVaildOpenAIKey, openAIKeyMsg, handleOpenAIKeyChange } =
    useOpenAIKeyCheck();
  return (
    <Layout nickname={nicknameRef.current?.nickName || null}>
      <div className="px-5 xs:px-7 sm:px-10 max-w-[1200px]">
        <div className="h-[640px] xs:h-[670px] sm:h-[700px]">
          <div className="flex flex-row justify-between items-center">
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
                API 키 관리
              </span>
            </div>
            <div className="flex flex-row justify-start items-center">
              <DropdownMenu options={["license", "key", "withdraw"]} />
            </div>
          </div>
          <div className="flex flex-col justify-start items-center relative w-full mt-12 xs:mt-16 sm:mt-20">
            <Input
              type="text"
              label="Open AI Key"
              placeholder="***************************"
              value={openAIKey}
              onChange={handleOpenAIKeyChange}
              maxWidth="1200px"
            />
            <div
              className={cls(
                "w-full max-w-[1200px] absolute top-[44px] xs:top-[49px] sm:top-[54px] text-[11px] xs:text-[12px] sm:text-[13px] font-semibold px-1 mt-0.5",
                isVaildOpenAIKey ? "text-blue-400" : "text-red-400"
              )}
            >
              {openAIKeyMsg}
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full rounded-md bg-[#F8F9FA] border border-[#E4E4E7] gap-2 xs:gap-3 sm:gap-4 px-3 xs:px-4 sm:px-5 py-2 xs:py-3 sm:py-4 mt-8 xs:mt-9 sm:mt-10">
            <ul className="list-disc pl-5">
              <li>OpenAI API 키는 openai.com에서 발급받으세요.</li>
              <li>API 키를 입력하지 않으면 일부 기능이 제한될 수 있습니다.</li>
              <li>
                과도한 API 사용은 추가 요금이 발생할 수 있으니 주의하세요.
              </li>
              <li>
                장기간 사용하지 않을 경우, 키를 비활성화하는 것을 권장합니다.
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-row justify-end items-center w-full">
          <ButtonSmall label="수정" />
        </div>
      </div>
    </Layout>
  );
}
