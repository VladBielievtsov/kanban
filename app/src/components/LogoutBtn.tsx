"use client";

import React, { useState } from "react";
import { Button } from "./ui";
import { LogOut } from "lucide-react";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "./icons/LoadingSpinner";
import { cn } from "@/lib/utils";
import ErrorText from "./common/ErrorText";

export default function LogoutBtn() {
  const { logout } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    await logout()
      .then(() => {
        router.push("/login");
        setError(null);
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="mt-auto">
      <ErrorText error={error} />
      <Button
        onClick={handleLogout}
        disabled={loading}
        className={cn(
          !loading && "items-center justify-between",
          loading && "justify-center",
          "mt-2 h-auto bg-transparent text-text flex border border-surface w-full rounded-lg p-3 dark:hover:bg-[#1e1e2e] hover:bg-[#cdd6f4]"
        )}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <p className="font-bold text-sm">Logout</p>
            <LogOut size={18} />
          </>
        )}
      </Button>
    </div>
  );
}
