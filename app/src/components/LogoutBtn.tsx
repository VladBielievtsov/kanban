"use client";

import React from "react";
import { Button } from "./ui";
import { LogOut } from "lucide-react";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "./icons/LoadingSpinner";
import { cn } from "@/lib/utils";

export default function LogoutBtn() {
  const { logout, loading } = useUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      const { user } = useUserStore.getState();
      if (!user) {
        router.push("/login");
      } else {
        console.error("Error during logout: user state is not null");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        !loading && "items-center justify-between",
        loading && "justify-center",
        "mt-auto h-auto bg-transparent text-foreground flex border border-zinc-200 dark:border-zinc-600 w-full rounded-lg p-3 hover:bg-zinc-200 dark:hover:bg-zinc-800"
      )}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="font-bold text-sm">Logout</p>
          <LogOut />
        </>
      )}
    </Button>
  );
}
