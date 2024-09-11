import React from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui";
import Logo from "@/components/Logo";

export default function Header() {
  return (
    <header className="bground z-50 h-[60px] flex items-center fixed top-0 left-0 right-0 border-b dark:border-zinc-600 border-zinc-200">
      <div className="px-6 flex justify-between items-center w-full">
        <div>
          <Logo />
        </div>
        <div className="flex items-center gap-2.5">
          <div>
            <Button
              variant={"outline"}
              className="flex items-center justify-between w-[243px]"
            >
              <span>Search...</span>
              <kbd className="pointer-events-none ml-auto flex h-5 flex-none select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-semibold opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
