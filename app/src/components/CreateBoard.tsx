"use client";
import React from "react";
import { Button } from "./ui";
import { axiosClient } from "@/lib/axios-client";

export default function CreateBoard() {
  const createBoard = async () => {
    const data = await axiosClient.post(
      "/board",
      {},
      { withCredentials: true }
    );

    if (data.status === 200) {
      console.log(data);
    } else {
      console.log("Err: " + data);
    }
  };
  return <Button onClick={createBoard}>Create</Button>;
}
