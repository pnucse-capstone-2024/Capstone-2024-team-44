import Image from "next/image";
import { useRef } from "react";

interface InputProps {
  type: string;
  label: string;
  placeholder: string;
  maxWidth?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export default function Input({
  type,
  label,
  placeholder,
  maxWidth = "605px",
  value = "",
  onChange,
  readOnly = false,
  disabled = false,
}: InputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div
      className="flex flex-col justify-center items-center relative w-full"
      style={{ maxWidth: maxWidth }}
    >
      {label?.trim() ? (
        <label
          htmlFor={label}
          className="absolute -top-7 xs:-top-8 sm:-top-9 left-1 text-[18px] xs:text-[20px] sm:text-[22px]"
        >
          {label}
        </label>
      ) : null}
      <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={value === "" ? placeholder : ""}
        readOnly={readOnly}
        className="appearance-none w-full h-[45px] xs:h-[50px] sm:h-[55px] text-[15px] xs:text-[16px] sm:text-[17px] text-gray-600 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:ring-offset-0 focus:ring-1"
      />
      {label === "프라이빗 키" ? (
        <div className="flex flex-row justify-center items-center absolute top-2 xs:top-2.5 sm:top-3 right-3 xs:right-3.5 sm:right-4 cursor-pointer">
          <Image
            src="/images/upload.svg"
            alt="upload"
            width={36}
            height={33}
            className="w-[29px] h-[26px] xs:w-[32px] xs:h-[30px] sm:w-[36px] sm:h-[33px]"
            onClick={handleImageClick}
          />
          {disabled ? null : (
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onChange}
            />
          )}
        </div>
      ) : null}
      {/* label === "Open AI Key" ? (
        <div className="flex flex-row justify-center items-center absolute top-2 xs:top-2.5 sm:top-3 right-3 xs:right-3.5 sm:right-4 cursor-pointer">
          <Image
            src="/images/checkbox.svg"
            alt="checkbox"
            width={34}
            height={30}
            className="w-[24px] h-[24px] xs:w-[31px] xs:h-[27px] sm:w-[34px] sm:h-[30px]"
          />
        </div>
      ) : null} */}
    </div>
  );
}
