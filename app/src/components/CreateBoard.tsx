"use client";
import React from "react";
import { Button } from "./ui";
import { useBoardsStore } from "@/store/boards";
import { useRouter } from "next/navigation";

export default function CreateBoard() {
  const { createBoard } = useBoardsStore();
  const router = useRouter();

  const onCreate = async () => {
    const res = await createBoard();
    if (typeof res !== "string" && res.data) {
      router.push("/boards/" + res.data.id);
    } else {
      console.error(res);
    }
  };

  return <Button onClick={onCreate}>Create</Button>;
}
