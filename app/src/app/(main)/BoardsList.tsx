"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useBoardsStore } from "@/store/boards";

interface Props {
  variant: "all" | "favorites";
}

export default function BoardsList({ variant }: Props) {
  const { boards, loading } = useBoardsStore();

  return (
    <div>
      <h2 className="font-bold">
        {variant === "all" ? "Boards" : "Favorites"}
      </h2>
      <div className="flex flex-col mt-2">
        {!loading &&
          boards &&
          boards.map((b) => (
            <Link
              key={b.id}
              href={"/boards/" + b.id}
              className="dark:hover:border-zinc-600 border border-transparent hover:border-zinc-200 rounded-lg p-3"
            >
              {b.icon} {b.title}
            </Link>
          ))}
      </div>
    </div>
  );
}
