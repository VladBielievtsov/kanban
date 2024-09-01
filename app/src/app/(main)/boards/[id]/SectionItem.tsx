import { Draggable, Droppable } from "react-beautiful-dnd";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Plus, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import DeleteSection from "@/components/DeleteSection";
import { IData, ITask } from "./Kanban";

interface Props {
  id: string;
  title: string;
  data: IData[];
  setData: React.Dispatch<React.SetStateAction<IData[]>>;
  tasks: ITask[];
}

export default function SectionItem({
  id,
  title,
  data,
  setData,
  tasks,
}: Props) {
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
    <div key={id} className="w-[300px]">
      <Droppable key={id} droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-[300px] p-2 mr-2"
          >
            <div className="flex items-center justify-between mb-2">
              <Input
                value={title}
                onChange={(e) => updateSectionTitle(e, id)}
                className="rounded-r-none"
              />
              <Button
                variant={"outline"}
                className="bg-transparent rounded-none"
                onClick={() => addTask(id)}
              >
                <Plus size={18} />
              </Button>
              <DeleteSection
                id={id}
                title={title}
                data={data}
                setData={setData}
              />
            </div>
            {tasks.map((task, idx) => (
              <Draggable key={task.id} draggableId={task.id} index={idx}>
                {(provided, snapshot) => (
                  <Link
                    href={"/task/" + task.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      snapshot.isDragging ? "cursor-grab" : "cursor-pointer",
                      "flex items-center justify-between px-3 py-2 mb-2 font-bold text-sm rounded-md bg-input border border-input"
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
