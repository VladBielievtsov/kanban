"use client";

import Link from "next/link";
import { Board, useBoardsStore } from "@/store/boards";
import { Skeleton } from "@/components/ui";
import ErrorText from "@/components/ErrorText";

interface Props {
  variant: "all" | "favorites";
  loading: boolean;
  error: string | null;
}

export default function BoardsList({ variant, loading, error }: Props) {
  const { boards } = useBoardsStore();

  let displayBoards: Board[] = [];

  if (variant === "favorites") {
    displayBoards = boards?.filter((b) => b.favorite) || [];
  } else if (variant === "all") {
    displayBoards = boards || [];
  }

  if (variant === "favorites" && displayBoards?.length === 0) {
    return null;
  }

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
        ) : displayBoards && displayBoards.length > 0 ? (
          displayBoards.map((b) => (
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
