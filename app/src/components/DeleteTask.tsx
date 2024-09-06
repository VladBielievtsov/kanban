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
} from "@/components/ui";
import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingSpinner } from "./icons/LoadingSpinner";

interface Props {
  id: string;
  title: string;
}

export default function DeleteTask({ id, title }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { toast } = useToast();

  const removeTask = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.delete("/task/" + id, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setLoading(false);
        router.back();
      } else {
        setLoading(false);
        toast({
          title: res.data || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = handleAxiosErrorMessage(error);
      toast({
        title: errorMessage || "An unknown error occurred.",
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  };

  const onOpen = () => {
    setLoading(false);
    setOpen(true);
  };

  return (
    <AlertDialog open={open} defaultOpen={open}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} onClick={onOpen}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove task {title}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeTask()}
            className="min-w-[92px]"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
