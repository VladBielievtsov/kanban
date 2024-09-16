import React from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Logo from "@/components/common/Logo";
import CreateBoard from "@/components/CreateBoard";

export default function Header() {
  return (
    <header className="bground z-50 h-[60px] flex items-center fixed top-0 left-0 right-0 border-b  border-surface">
      <div className="px-6 flex justify-between items-center w-full">
        <div>
          <Logo />
        </div>
        <div className="flex items-center gap-2.5">
          <div>
            <CreateBoard
              variant={"outline"}
              className="min-w-none"
              content="Create a board"
            />
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
