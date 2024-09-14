"use client";

import { Separator } from "@/components/ui";
import "./style.css";
import { axiosClient } from "@/lib/axios-client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/common/Loading";
import Alert from "@/components/common/Alert";
import { formatDate } from "@/utils/utils";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";

interface Props {
  taskId: string;
}

interface ITask {
  title: string;
  content: string;
  createdAt: string;
}

export default function SharedTask({ taskId }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<ITask | null>(null);

  const getTask = useCallback(async () => {
    try {
      const res = await axiosClient.get("/task/" + taskId);

      if (res.status === 200) {
        setLoading(false);
        setTask({
          title: res.data.title,
          content: res.data.content,
          createdAt: res.data.createdAt,
        });
      } else {
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
  }, [taskId]);

  useEffect(() => {
    getTask();
  }, [getTask]);

  return (
    <div className="pt-[60px]">
      <Loading loading={[loading]} className="pl-0" />
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <>
          <div className="pt-14">
            <h1 className="text-4xl font-bold">{task?.title}</h1>
            <div className="font-bold opacity-60 py-3">
              <p>Created at: {formatDate(task?.createdAt!)}</p>
            </div>
          </div>
          <div className="py-10">
            <Separator />
          </div>
          <div className="prose lg:prose-xl max-w-full">
            <MarkdownRenderer content={task?.content!} />
          </div>
        </>
      )}
    </div>
  );
}
