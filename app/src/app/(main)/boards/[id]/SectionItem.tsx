import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import SectionControls from "./SectionControls";
import { Sections } from "./Kanban";

interface Props {
  id: string;
  title: string;
  boardID: string;
  section: Sections;
  sections: Sections[];
  setSections: React.Dispatch<React.SetStateAction<Sections[]>>;
}

export default function SectionItem({
  id,
  title,
  section,
  sections,
  setSections,
}: Props) {
  return (
    <div className="w-[300px]">
      <Droppable key={id} droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-[300px] p-2 mr-2"
          >
            <div className="flex items-center justify-between mb-2">
              <SectionControls
                title={title}
                sectionID={id}
                sections={sections}
                setSections={setSections}
              />
            </div>
            {section.tasks &&
              section.tasks.map((task, idx) => (
                <Draggable key={task.id} draggableId={task.id} index={idx}>
                  {(provided, snapshot) => (
                    <Link
                      href={"/task/" + task.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        snapshot.isDragging ? "cursor-grab" : "cursor-pointer",
                        "flex items-center justify-between px-3 py-2 mb-2 font-bold text-sm rounded-md bg-surface/30 border border-surface"
                      )}
                    >
                      <span>{task.title === "" ? "Untitled" : task.title}</span>
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
  );
}
