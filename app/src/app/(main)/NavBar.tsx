"use client";

import LogoutBtn from "@/components/LogoutBtn";
import UserCard from "@/components/UserCard";
import React, { useCallback, useEffect, useState } from "react";
import BoardsList from "./BoardsList";
import { useBoardsStore } from "@/store/boards";

export default function NavBar() {
  const { boards, allBoards } = useBoardsStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAllBoards = useCallback(async () => {
    setLoading(true);
    const res = await allBoards();
    if (res.status === 200) {
      setLoading(false);
    } else {
      setError(res.data || "An unknown error occurred.");
    }
  }, [allBoards]);

  useEffect(() => {
    if (!boards) {
      getAllBoards();
    } else {
      setLoading(false);
    }
  }, [boards, getAllBoards]);

  return (
    <div className="h-full border-r border-surface surface">
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
