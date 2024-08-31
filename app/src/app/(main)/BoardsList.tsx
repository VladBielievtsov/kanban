"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useBoardsStore } from "@/store/boards";
import { Skeleton } from "@/components/ui";
import ErrorText from "@/components/ErrorText";

interface Props {
  variant: "all" | "favorites";
}

export default function BoardsList({ variant }: Props) {
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
    <div>
      <h2 className="font-bold">
        {variant === "all" ? "Boards" : "Favorites"}
      </h2>
      <div className="flex flex-col mt-2">
        {loading ? (
          <div className="flex items-center dark:border-zinc-600 border border-transparent border-zinc-200 rounded-lg p-3">
            <Skeleton className="w-5 h-6 mr-2" />
            <Skeleton className="w-20 h-3" />
          </div>
        ) : error ? (
          <ErrorText error={error} />
        ) : boards && boards.length > 0 ? (
          boards.map((b) => (
            <Link
              key={b.id}
              href={"/boards/" + b.id}
              className="dark:hover:border-zinc-600 border border-transparent hover:border-zinc-200 rounded-lg p-3"
            >
              {b.icon} {b.title}
            </Link>
          ))
        ) : (
          <div>No boards yet</div>
        )}
      </div>
    </div>
  );
}
