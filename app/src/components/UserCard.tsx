"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@/components/ui";
import Link from "next/link";
import { useUserStore } from "@/store/user";

export default function UserCard() {
  const { user, loading } = useUserStore();

  return (
    <>
      <Link
        href={"/profile"}
        className="mb-10 flex items-center gap-4 border border-surface w-full rounded-lg p-3 dark:hover:bg-[#1e1e2e] hover:bg-[#cdd6f4]"
      >
        {!user || loading ? (
          <>
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex gap-1">
              <Skeleton className="w-10 h-3 rounded-full" />
              <Skeleton className="w-20 h-3 rounded-full" />
            </div>
          </>
        ) : (
          <>
            <Avatar>
              <AvatarImage
                src={
                  user?.avatar_url?.startsWith("http")
                    ? user?.avatar_url
                    : process.env.NEXT_PUBLIC_BACKEND + "/" + user?.avatar_url
                }
                className="object-cover"
              />
              <AvatarFallback>{user?.first_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm">
                {user?.first_name} {user?.last_name}
              </p>
            </div>
          </>
        )}
      </Link>
    </>
  );
}
