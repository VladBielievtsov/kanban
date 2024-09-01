import { Metadata } from "next";
import React from "react";
import Board from "./Board";

export default function page({ params }: { params: { id: string } }) {
  return <Board id={params.id} />;
}

export const metadata: Metadata = {
  title: "Board",
};
