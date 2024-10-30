import { useState, useRef, useEffect } from "react";
import Input from "@/components/commons/input";

interface InputWithDropdownProps {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onSelect: (selected: string) => void;
  maxWidth?: string;
  disabled?: boolean;
}

export default function InputWithDropdown({
  label,
  placeholder,
  value,
  options,
  onSelect,
  maxWidth = "1000px",
  disabled = false,
}: InputWithDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(true);
  };

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative w-full" style={{ maxWidth }} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        <Input
          type="text"
          label={label}
          value={value}
          placeholder={placeholder}
          readOnly={true}
          maxWidth={maxWidth}
        />
      </div>
      {isDropdownOpen && !disabled && (
        <div className="absolute top-full mt-2 w-full max-w-[1200px] max-h-[140px] text-[14px] xs:text-[15px] sm:text-[16px] text-gray-600 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white z-10 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 sm:space-y-2">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
