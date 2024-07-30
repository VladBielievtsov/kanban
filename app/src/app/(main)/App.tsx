"use client";
import React, { useEffect } from "react";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setUser();
    }
  }, [router]);

  return <div>{children}</div>;
}
