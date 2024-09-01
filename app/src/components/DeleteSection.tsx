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
import { IData } from "@/app/(main)/boards/[id]/Kanban";

interface Props {
  id: string;
  title: string;
  data: IData[];
  setData: React.Dispatch<React.SetStateAction<IData[]>>;
}

export default function DeleteSection({ id, title, data, setData }: Props) {
  const removeSection = (id: string) => {
    const newData = [...data].filter((s) => s.id !== id);
    setData(newData);
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
