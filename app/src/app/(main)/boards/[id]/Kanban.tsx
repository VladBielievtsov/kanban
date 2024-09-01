"use client";

import { Button, Separator } from "@/components/ui";

import React, { useState } from "react";
import SectionList from "./SectionList";

interface KanbanProps {
  borderId: string;
}

export interface IData {
  id: string;
  title: string;
  tasks: ITask[];
}

export interface ITask {
  id: string;
  title: string;
}

export default function Kanban({ borderId }: KanbanProps) {
  const [data, setData] = useState<IData[]>([]);

  const addSection = () => {
    setData((prev) => [
      ...prev,
      { id: new Date().toISOString(), title: "Untitled", tasks: [] },
    ]);
  };

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
