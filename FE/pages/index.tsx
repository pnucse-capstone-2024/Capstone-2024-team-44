import Logo from "@/components/commons/logo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsFocused(true), 500);
    setTimeout(() => router.push("/login"), 2500);
  }, [router]);

  return (
    <div
      className={`flex flex-col justify-center items-center w-screen h-screen overflow-hidden transition-all duration-1000 ${
        isFocused ? "blur-0" : "blur-md"
      }`}
    >
      <Logo />
    </div>
  );
}
