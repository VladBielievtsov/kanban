"use client";

import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  useToast,
} from "./ui";
import { useState } from "react";
import { useBoardsStore } from "@/store/boards";
import ErrorText from "./ErrorText";
import { LoadingSpinner } from "./icons/LoadingSpinner";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export default function DeleteBoard({ id }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { deleteBoard } = useBoardsStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { toast } = useToast();

  const onDelete = async () => {
    setLoading(true);
    const res = await deleteBoard(id);
    if (res.status === 200) {
      setLoading(false);
      setOpen(false);
      router.push("/");
      toast({
        title: res.data,
        variant: "success",
      });
    } else {
      setLoading(false);
      setError(res.data || "An unknown error occurred.");
    }
  };

  const onOpen = () => {
    setError(null);
    setOpen(true);
  };

  const onClose = () => {
    setError(null);
    setOpen(false);
  };

  return (
    <AlertDialog defaultOpen={open} open={open}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} onClick={onOpen}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            board.
            <ErrorText error={error} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            {loading ? <LoadingSpinner /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
