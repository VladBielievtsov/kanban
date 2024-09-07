"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from "@/components/ui";
import { CornerUpLeft, EllipsisVertical, FileDown, Share2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./style.css";
import DeleteTask from "@/components/DeleteTask";
import TaskInfo from "./TaskInfo";
import axios from "axios";
import { axiosClient } from "@/lib/axios-client";
import Alert from "@/components/Alert";
import { LoadingSpinner } from "@/components/icons/LoadingSpinner";
import { ITask } from "../../boards/[id]/Kanban";
import Loading from "@/components/Loading";
import TaskContent from "./TaskContent";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export interface TaskFull extends ITask {
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Task({ id }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<TaskFull | null>(null);
  const [loadingTitle, setLoadingTitle] = useState<boolean>(false);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const router = useRouter();

  const getTask = async () => {
    try {
      const res = await axiosClient.get("/task/" + id, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setLoading(false);
        setTask({
          id: res.data.id,
          title: res.data.title,
          content: res.data.content,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
        });
      } else {
        console.log(res);
        setLoading(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError("Failed to find the task: record not found");
        } else if (error.response?.status === 500) {
          setError("Internal Server Error occurred");
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  return (
    <div className="relative">
      <Loading loading={[loadingTitle, loadingContent, loading]} />
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <>
          <div className="mt-3 flex items-center justify-between">
            <Button variant={"ghost"} onClick={() => router.back()}>
              <CornerUpLeft />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  <EllipsisVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex justify-between cursor-pointer">
                  <span>Share</span> <Share2 size={16} />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between cursor-pointer">
                  <span>Download</span> <FileDown size={16} />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DeleteTask title={task?.title!} id={id} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="px-10 pt-4">
            <TaskInfo
              task={task!}
              setTask={setTask}
              taskId={id}
              setLoading={setLoadingTitle}
            />
            <div className="py-10">
              <Separator />
            </div>
            <TaskContent
              doc={task?.content!}
              taskId={id}
              setLoading={setLoadingContent}
            />
          </div>
        </>
      )}
    </div>
  );
}
