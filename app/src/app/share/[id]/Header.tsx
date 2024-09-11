import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui";
import { Soup } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="bground z-50 h-[60px] flex items-center fixed top-0 left-0 right-0 border-b dark:border-zinc-600 border-zinc-200">
      <div className="px-6 flex justify-between items-center w-full">
        <div>
          <Logo />
        </div>
        <div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
