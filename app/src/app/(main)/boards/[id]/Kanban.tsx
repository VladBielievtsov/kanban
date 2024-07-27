"use client";

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
  Input,
  Separator,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Plus, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

interface KanbanProps {
  borderId: string;
}

interface IData {
  id: string;
  title: string;
  tasks: ITask[];
}

interface ITask {
  id: string;
  title: string;
}

export default function Kanban({ borderId }: KanbanProps) {
  const [data, setData] = useState<IData[]>([]);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;
    const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
    const destinationColIndex = data.findIndex(
      (e) => e.id === destination.droppableId
    );
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }

    setData(data);
  };

  const addSection = () => {
    setData((prev) => [
      ...prev,
      { id: new Date().toISOString(), title: "Untitled", tasks: [] },
    ]);
  };

  const removeSection = (id: string) => {
    const newData = [...data].filter((s) => s.id !== id);
    setData(newData);
  };

  const updateSectionTitle = (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionId: string
  ) => {
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex((e) => e.id === sectionId);
    newData[index].title = newTitle;
    setData(newData);
  };

  const addTask = (sectionId: string) => {
    const newData = [...data];
    const index = newData.findIndex((e) => e.id === sectionId);
    newData[index].tasks.push({
      id: new Date().toISOString(),
      title: "",
    });
    setData(newData);
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
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className="flex items-start overflow-x-auto"
          style={{ width: "calc(100vw - 432px)" }}
        >
          {data.map((section) => (
            <div key={section.id} className="w-[300px]">
              <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-[300px] p-2 mr-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Input
                        value={section.title}
                        onChange={(e) => updateSectionTitle(e, section.id)}
                        className="rounded-r-none"
                      />
                      <Button
                        variant={"outline"}
                        className="bg-transparent rounded-none"
                        onClick={() => addTask(section.id)}
                      >
                        <Plus size={18} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="bg-transparent rounded-l-none"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove section {section.title}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeSection(section.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    {section.tasks.map((task, idx) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <Link
                            href={"/task/" + task.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              snapshot.isDragging
                                ? "cursor-grab"
                                : "cursor-pointer",
                              "flex items-center justify-between px-3 py-2 mb-2 font-bold text-sm rounded-md bg-input border border-input"
                            )}
                          >
                            <span>
                              {task.title === "" ? "Untitled" : task.title}
                            </span>
                            <SquareArrowOutUpRight size={18} />
                          </Link>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
