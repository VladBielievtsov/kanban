import { DragDropContext, DropResult } from "react-beautiful-dnd";
import SectionItem from "./SectionItem";
import { Sections } from "@/store/boards";

interface Props {
  data: Sections[];
  setData: React.Dispatch<React.SetStateAction<Sections[]>>;
}

export default function SectionList({ data, setData }: Props) {
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

  const tasks = data.map((d) => ({ ...d, tasks: [] }));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="flex items-start overflow-x-auto"
        style={{ width: "calc(100vw - 432px)" }}
      >
        {data.map((section, key) => (
          <SectionItem
            key={section.id}
            id={section.id}
            title={section.title}
            boardID={section.board_id}
            data={data}
            setData={setData}
            tasks={tasks[key].tasks}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
