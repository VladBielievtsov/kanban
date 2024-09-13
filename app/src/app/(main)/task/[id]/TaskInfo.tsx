import React from "react";
import { Input, useToast } from "@/components/ui";
import { TaskFull } from "./Task";
import { useState } from "react";
import { useDebounce } from "react-use";
import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";
import { formatDate } from "@/utils/utils";

interface Props {
  taskId: string;
  task: TaskFull;
  setTask: React.Dispatch<React.SetStateAction<TaskFull | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TaskInfo({ taskId, task, setTask, setLoading }: Props) {
  const [defaultTitle, setDefaultTitle] = useState(task.title);
  const [newTitle, setNewTitle] = useState(task.title);

  const { toast } = useToast();

  useDebounce(
    () => {
      updateTitle();
    },
    1000,
    [newTitle]
  );

  const updateTitle = async () => {
    if (newTitle.trim() != defaultTitle.trim() && task.title.trim() != "") {
      try {
        setLoading(true);
        const res = await axiosClient.patch(
          "/task/" + taskId,
          { title: newTitle },
          { withCredentials: true }
        );

        if (res.status === 200) {
          setDefaultTitle(newTitle);
          setLoading(false);
          setTask({
            ...task,
            title: newTitle,
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
    }
  };

  return (
    <>
      <Input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="p-0 my-2 text-4xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-0"
      />
      <div className="font-bold opacity-60">
        <p>Created at: {formatDate(task?.createdAt!)}</p>
      </div>
    </>
  );
}
