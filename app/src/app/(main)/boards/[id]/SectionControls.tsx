import React from "react";
import { Input, useToast } from "@/components/ui";
import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";
import { useState } from "react";
import { useDebounce } from "react-use";
import { Sections } from "./Kanban";
import CreateTask from "@/components/CreateTask";
import DeleteSection from "@/components/DeleteSection";

interface Props {
  title: string;
  sectionID: string;
  sections: Sections[];
  setSections: React.Dispatch<React.SetStateAction<Sections[]>>;
}

export default function SectionControls({
  title,
  sectionID,
  sections,
  setSections,
}: Props) {
  const [defaultTitle, setDefaultTitle] = useState(title);
  const [newTitle, setNewTitle] = useState(title);

  const { toast } = useToast();

  useDebounce(
    () => {
      updateTitle();
    },
    1000,
    [newTitle]
  );

  const updateTitle = async () => {
    if (newTitle.trim() != defaultTitle.trim() && title.trim() != "") {
      try {
        setDefaultTitle(newTitle);
        const res = await axiosClient.patch(
          "/section/" + sectionID,
          { title: newTitle },
          { withCredentials: true }
        );

        if (res.status === 200) {
          const updatedTitle = sections.map((s) =>
            s.id === sectionID ? { ...s, title: title } : s
          );
          setSections(updatedTitle);
          toast({
            title: "Section has been updated successfully",
            variant: "success",
          });
        } else {
          toast({
            title: res.data || "An unknown error occurred.",
            variant: "destructive",
          });
        }
      } catch (error) {
        const errorMessage = handleAxiosErrorMessage(error);
        toast({
          title: errorMessage || "An unknown error occurred.",
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    }
  };

  return (
    <>
      <Input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="rounded-r-none"
      />
      <CreateTask
        sectionID={sectionID}
        sections={sections}
        setSections={setSections}
      />
      <DeleteSection
        id={sectionID}
        title={title}
        sections={sections}
        setSections={setSections}
      />
    </>
  );
}
