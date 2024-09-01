import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { IData } from "./Kanban";
import SectionItem from "./SectionItem";

interface Props {
  data: IData[];
  setData: React.Dispatch<React.SetStateAction<IData[]>>;
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="flex items-start overflow-x-auto"
        style={{ width: "calc(100vw - 432px)" }}
      >
        {data.map((section) => (
          <SectionItem
            id={section.id}
            title={section.title}
            data={data}
            setData={setData}
            tasks={section.tasks}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
