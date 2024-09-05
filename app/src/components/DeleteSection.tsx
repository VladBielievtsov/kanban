import { Sections } from "@/app/(main)/boards/[id]/Kanban";
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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "./icons/LoadingSpinner";
import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";

interface Props {
  id: string;
  title: string;
  sections: Sections[];
  setSections: React.Dispatch<React.SetStateAction<Sections[]>>;
}

export default function DeleteSection({
  id,
  title,
  sections,
  setSections,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const removeSection = async (id: string) => {
    try {
      setLoading(true);
      const res = await axiosClient.delete("/section/" + id, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setLoading(false);
        const newData = [...sections].filter((s) => s.id !== id);
        setSections(newData);
        toast({
          title: "Section has been deleted successfully",
          variant: "success",
        });
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
        <Button
          variant={"outline"}
          onClick={onOpen}
          className="bg-transparent rounded-l-none"
        >
          <Trash2 size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove section {title}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeSection(id)}
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
