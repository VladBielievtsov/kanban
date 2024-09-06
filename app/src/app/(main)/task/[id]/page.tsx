import { Metadata } from "next";
import Task from "./Task";

export default function page({ params }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <Task id={params.id} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Task",
};
