import { Input } from "@/components/ui";
import { TaskFull } from "./Task";

interface Props {
  task: TaskFull | null;
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}

export default function TaskInfo({ task }: Props) {
  return (
    <>
      <Input
        defaultValue={task?.title}
        className="p-0 my-2 text-4xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-0"
      />
      <div className="font-bold opacity-60">
        <p>Created at: {formatDate(task?.createdAt!)}</p>
      </div>
    </>
  );
}
