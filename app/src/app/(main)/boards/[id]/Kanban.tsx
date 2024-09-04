"use client";

import { Button, Separator, useToast } from "@/components/ui";

import React, { Dispatch, SetStateAction, useState } from "react";
import SectionList from "./SectionList";
import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";
import { LoadingSpinner } from "@/components/icons/LoadingSpinner";

interface Props {
  boardId: string;
  sections: Sections[];
  setSections: Dispatch<SetStateAction<Sections[]>>;
}

export interface Sections {
  id: string;
  title: string;
  user_id: string;
  board_id: string;
  tasks: ITask[];
  createdAt: string;
  updatedAt: string;
}

export interface ITask {
  id: string;
  title: string;
}

export default function Kanban({ boardId, sections, setSections }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const addSection = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.post(
        "/section/" + boardId,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        setLoading(false);
        setSections((prev) => [...prev, res.data]);
        toast({
          title: "The section has been successfully created.",
          variant: "success",
        });
      } else {
        setLoading(false);
        toast({
          title: res.data,
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
    <div className="px-10">
      <div className="flex items-center justify-between">
        <Button onClick={addSection} className="min-w-[111px]">
          {loading ? <LoadingSpinner /> : "Add section"}
        </Button>
        <div className="text-sm font-bold">{sections.length} Sections</div>
      </div>
      <div className="py-10">
        <Separator />
      </div>
      <SectionList sections={sections} setSections={setSections} />
    </div>
  );
}
