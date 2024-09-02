import { Input, useToast } from "@/components/ui";
import { useBoardsStore } from "@/store/boards";
import { useState } from "react";
import { useDebounce } from "react-use";

interface Props {
  title: string;
  boardID: string;
  sectionID: string;
}

export default function SectionControls({ title, boardID, sectionID }: Props) {
  const [defaultTitle, setDefaultTitle] = useState(title);
  const [newTitle, setNewTitle] = useState(title);
  const [debouncedTitle, setDebouncedTitle] = useState(newTitle);
  const { updateSectionTitle } = useBoardsStore();

  const { toast } = useToast();

  useDebounce(
    () => {
      setDebouncedTitle(newTitle);
      updateTitle();
    },
    1000,
    [newTitle]
  );

  const updateTitle = async () => {
    if (newTitle.trim() != defaultTitle.trim() && title.trim() != "") {
      setDefaultTitle(newTitle);
      const res = await updateSectionTitle(boardID, sectionID, newTitle);
      if (res.status === 200) {
        toast({
          title: "Section has been updated successfully",
          variant: "success",
        });
      } else {
        toast({
          title: res.data || "An unknown error occurred.",
          variant: "success",
        });
      }
    }
  };

  return (
    <Input
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
      className="rounded-r-none"
    />
  );
}
