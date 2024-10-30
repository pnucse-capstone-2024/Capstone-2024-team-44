interface InputMediumProps {
  type: string;
  label: string;
  placeholder: string;
  maxWidth?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function InputSmall({
  type,
  label,
  placeholder,
  maxWidth = "605px",
  value = "",
  onChange,
  readOnly = false,
  onClick,
}: InputMediumProps) {
  // const fileInputRef = useRef<HTMLInputElement | null>(null);

  // const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
  //   event.preventDefault();
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     console.log("Selected file:", file.name);
  //     // 추가로 파일을 처리하는 로직 작성
  //   }
  // };
  return (
    <div
      className="flex flex-col justify-center items-center relative w-full"
      style={{ maxWidth: maxWidth }}
    >
      {label?.trim() ? (
        <label
          htmlFor={label}
          className="absolute -top-6 xs:-top-6.5 sm:-top-7 left-1 text-[16px] xs:text-[17px] sm:text-[18px]"
        >
          {label}
        </label>
      ) : null}
      <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        onClick={onClick}
        placeholder={value === "" ? placeholder : ""}
        readOnly={readOnly}
        className="appearance-none w-full h-[30px] xs:h-[40px] sm:h-[50px] text-[12px] xs:text-[14px] sm:text-[16px] text-gray-600 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:ring-offset-0 focus:ring-1"
      />
    </div>
  );
}
