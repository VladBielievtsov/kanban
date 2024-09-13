"use client";
import React, { useEffect } from "react";
import { useUserStore } from "@/store/user";

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      setUser();
    }
  }, [user, setUser]);

  return <div>{children}</div>;
}
