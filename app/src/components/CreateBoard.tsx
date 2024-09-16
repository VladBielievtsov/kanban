"use client";
import React, { useState } from "react";
import { Button, useToast } from "./ui";
import { useBoardsStore } from "@/store/boards";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "./icons/LoadingSpinner";

interface Props {
  content: string;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export default function CreateBoard({ variant, className, content }: Props) {
  const { createBoard } = useBoardsStore();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { toast } = useToast();

  const onCreate = async () => {
    setLoading(true);
    const res = await createBoard();
    if (typeof res !== "string" && res.data) {
      router.push("/boards/" + res.data.id);
      toast({
        title: "The board has been successfully created.",
        variant: "success",
      });
      setLoading(false);
    } else {
      setLoading(false);
      console.error(res);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={onCreate}
      disabled={loading}
      className={className}
    >
      {loading ? <LoadingSpinner /> : content}
    </Button>
  );
}
