"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import React, { useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark");

  const setDarkTheme = () => {
    setTheme("dark");
  };

  const setLightTheme = () => {
    setTheme("light");
  };

  return (
    <div className="border border-zinc-600 rounded-md flex items-center relative">
      <div
        className={cn(
          theme === "dark" ? "translate-x-[42px]" : "translate-x-[2px]",
          "w-[40px] h-[30px] bg-indigo-500 absolute transform rounded-sm transition"
        )}
      ></div>
      <button className="py-2 px-3 z-20" onClick={setLightTheme}>
        <Sun size={18} className={cn(theme === "dark" ? "opacity-50" : "")} />
      </button>
      <button className="py-2 px-3 z-20" onClick={setDarkTheme}>
        <Moon size={18} className={cn(theme === "light" ? "opacity-50" : "")} />
      </button>
    </div>
  );
}
