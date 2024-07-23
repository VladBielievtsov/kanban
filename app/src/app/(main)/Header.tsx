import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Soup } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="h-[60px] flex items-center fixed top-0 left-0 right-0 border-b dark:border-zinc-600 border-zinc-200">
      <div className="px-6 flex justify-between items-center w-full">
        <div>
          <Link
            href={"/"}
            className="flex items-center gap-2 text-zinc-800 dark:text-zinc-300"
          >
            <Soup size={24} />
            <span className="text-lg font-bold">Kanban</span>
          </Link>
        </div>
        <div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
