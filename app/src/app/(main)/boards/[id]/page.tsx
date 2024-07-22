import { Metadata } from "next";
import React from "react";
import BoardInfo from "./BoardInfo";
import Kanban from "./Kanban";

export default function page({ params }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <BoardInfo />
      <Kanban borderId={params.id} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Board",
};
