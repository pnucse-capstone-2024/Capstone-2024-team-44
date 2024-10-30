import { useState, useEffect } from "react";

export default function useIsMobile(breakpoint: number): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= breakpoint);
      };

      setIsMobile(window.innerWidth <= breakpoint);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [breakpoint]);

  return isMobile;
}
