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
} from "./ui";
import { Trash2 } from "lucide-react";

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
  const removeSection = (id: string) => {
    const newData = [...sections].filter((s) => s.id !== id);
    setSections(newData);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className="bg-transparent rounded-l-none">
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => removeSection(id)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
