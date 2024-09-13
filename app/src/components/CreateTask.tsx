import React from "react";
import { Plus } from "lucide-react";
import { Button, useToast } from "./ui";
import { useState } from "react";
import { LoadingSpinner } from "./icons/LoadingSpinner";
import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";
import { Sections } from "@/app/(main)/boards/[id]/Kanban";

interface Props {
  sectionID: string;
  sections: Sections[];
  setSections: React.Dispatch<React.SetStateAction<Sections[]>>;
}

export default function CreateTask({
  sectionID,
  sections,
  setSections,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const addTask = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.post(
        "/task/" + sectionID,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        setLoading(false);
        const newArr = sections.map((section) =>
          section.id === sectionID
            ? {
                ...section,
                tasks: [
                  ...(section.tasks || []),
                  {
                    id: res.data.id,
                    title: res.data.title,
                    position: res.data.position,
                  },
                ],
              }
            : section
        );
        setSections(newArr);
        toast({
          title: "Task has been created successfully",
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

  return (
    <Button
      variant={"outline"}
      className="bg-transparent rounded-none"
      onClick={() => addTask()}
      disabled={loading}
    >
      {loading ? <LoadingSpinner size={18} /> : <Plus size={18} />}
    </Button>
  );
}
