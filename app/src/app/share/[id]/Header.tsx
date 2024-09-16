"use client";
import Logo from "@/components/common/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui";
import { useUserStore } from "@/store/user";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Header() {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      setUser();
    }
  }, [user, setUser]);

  return (
    <header className="bground z-50 h-[60px] flex items-center fixed top-0 left-0 right-0 border-b dark:border-zinc-600 border-zinc-200">
      <div className="px-6 flex justify-between items-center w-full">
        <div>
          <Logo />
        </div>
        <div className="flex items-center gap-2.5">
          <div>
            {!user && (
              <Button variant={"outline"} asChild>
                <Link href={"/login"}>Login</Link>
              </Button>
            )}
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
