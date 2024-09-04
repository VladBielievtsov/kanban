import { DragDropContext, DropResult } from "react-beautiful-dnd";
import SectionItem from "./SectionItem";
import { Sections } from "./Kanban";

interface Props {
  sections: Sections[];
  setSections: React.Dispatch<React.SetStateAction<Sections[]>>;
}

export default function SectionList({ sections, setSections }: Props) {
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

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      sections[sourceColIndex].tasks = sourceTasks;
      sections[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      sections[destinationColIndex].tasks = destinationTasks;
    }

    setSections(sections);
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
            tasks={section.tasks}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
