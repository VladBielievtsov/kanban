"use client";

import LogoutBtn from "@/components/LogoutBtn";
import UserCard from "@/components/UserCard";
import React, { useEffect, useState } from "react";
import BoardsList from "./BoardsList";
import { useBoardsStore } from "@/store/boards";

export default function NavBar() {
  const { boards, allBoards } = useBoardsStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAllBoards = async () => {
    setLoading(true);
    const res = await allBoards();
    if (res.status === 200) {
      setLoading(false);
    } else {
      setError(res.data || "An unknown error occurred.");
    }
  };

  useEffect(() => {
    if (!boards) {
      getAllBoards();
    } else {
      setLoading(false);
    }
  }, [boards, allBoards]);

  return (
    <div className="h-full border-r dark:border-zinc-600 border-zinc-200">
      <div className="p-4 h-full flex flex-col">
        <UserCard />
        <div className="grid gap-5">
          <BoardsList variant="favorites" loading={loading} error={error} />
          <BoardsList variant="all" loading={loading} error={error} />
        </div>
        <LogoutBtn />
      </div>
    </div>
  );
}
