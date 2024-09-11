import { DragDropContext, DropResult } from "react-beautiful-dnd";
import SectionItem from "./SectionItem";
import { Sections } from "./Kanban";
import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";
import { useToast } from "@/components/ui";

interface Props {
  sections: Sections[];
  setSections: React.Dispatch<React.SetStateAction<Sections[]>>;
}

export default function SectionList({ sections, setSections }: Props) {
  const { toast } = useToast();

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;
    const sourceColIndex = sections.findIndex(
      (e) => e.id === source.droppableId
    );
    const destinationColIndex = sections.findIndex(
      (e) => e.id === destination.droppableId
    );

    const sourceCol = sections[sourceColIndex];
    const destinationCol = sections[destinationColIndex];

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    let movedTask;

    if (source.droppableId !== destination.droppableId) {
      [movedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);
    } else {
      [movedTask] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);
    }

    const updatedSections = [...sections];
    updatedSections[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
    updatedSections[destinationColIndex] = {
      ...destinationCol,
      tasks: destinationTasks,
    };

    setSections(updatedSections);
    updatePosition(
      movedTask.id,
      destination.droppableId,
      destination.index,
      sourceCol.id
    );
  };

  const updatePosition = async (
    taskID: string,
    destinationSectionId: string,
    destinationPosition: number,
    sourceSectionId: string
  ) => {
    try {
      const res = await axiosClient.patch(
        "/task/" + taskID + "/position",
        {
          destination_section_id: destinationSectionId,
          destination_position: destinationPosition,
          source_section_id: sourceSectionId,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast({
          title: "Task position has been updated",
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
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="flex items-start overflow-x-auto"
        style={{ width: "calc(100vw - 432px)" }}
      >
        {sections.map((section) => (
          <SectionItem
            key={section.id}
            id={section.id}
            title={section.title}
            boardID={section.board_id}
            sections={sections}
            setSections={setSections}
            section={section}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
