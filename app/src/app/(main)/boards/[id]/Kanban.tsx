"use client";

import { Button, Separator, useToast } from "@/components/ui";

import React, { useEffect, useState } from "react";
import SectionList from "./SectionList";
import { Sections, useBoardsStore } from "@/store/boards";

interface Props {
  boardId: string;
}

export default function Kanban({ boardId }: Props) {
  const [data, setData] = useState<Sections[]>([]);
  const { createSection, getAllSections } = useBoardsStore();

  const { toast } = useToast();

  const addSection = async () => {
    const res = await createSection(boardId);
    if (res.status === 200) {
      toast({
        title: "The section has been successfully created.",
        variant: "success",
      });
      setData((prev) => [...prev, res.data]);
    } else {
      toast({
        title: res.data,
        variant: "destructive",
      });
      console.log(res);
    }
  };

  useEffect(() => {
    const sections = getAllSections(boardId);
    sections.then((res) => {
      setData(res);
    });
  });

  return (
    <div className="px-10">
      <div className="flex items-center justify-between">
        <Button onClick={addSection}>Add section</Button>
        <div className="text-sm font-bold">{data.length} Sections</div>
      </div>
      <div className="py-10">
        <Separator />
      </div>
      <SectionList data={data} setData={setData} />
    </div>
  );
}
