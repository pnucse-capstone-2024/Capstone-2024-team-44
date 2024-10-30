import React, { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

interface LayoutProps {
  nickname?: string | null;
  children: React.ReactNode;
}

export default function Layout({ nickname, children }: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Header nickname={nickname} toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="w-full h-[calc(100%-70px)] mt-[70px] pt-[20px] pb-[40px] xl:ml-[290px] xl:w-[calc(100%-290px)] overflow-y-auto overflow-x-hidden custom-scrollbar">
        {children}
      </div>
    </div>
  );
}
