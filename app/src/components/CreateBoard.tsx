"use client";
import React from "react";
import { Button, useToast } from "./ui";
import { useBoardsStore } from "@/store/boards";
import { useRouter } from "next/navigation";

export default function CreateBoard() {
  const { createBoard } = useBoardsStore();
  const router = useRouter();

  const { toast } = useToast();

  const onCreate = async () => {
    const res = await createBoard();
    if (typeof res !== "string" && res.data) {
      router.push("/boards/" + res.data.id);
      toast({
        title: "The board has been successfully created.",
        variant: "success",
      });
    } else {
      console.error(res);
    }
  };

  return <Button onClick={onCreate}>Create</Button>;
}
