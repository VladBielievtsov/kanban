"use client";

import { axiosClient } from "@/lib/axios-client";
import BoardInfo from "./BoardInfo";
import Kanban, { Sections } from "./Kanban";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "@/components/Alert";
import { LoadingSpinner } from "@/components/icons/LoadingSpinner";

interface Props {
  id: string;
}

export default function Board({ id }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [sections, setSections] = useState<Sections[]>([]);

  const getBoard = async () => {
    try {
      const res = await axiosClient.get("/board/" + id, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setLoading(false);
        setDescription(res.data.description);
        setTitle(res.data.title);
        setIcon(res.data.icon);
        const newArr: Sections[] = res.data.sections.map(
          (section: Sections) => ({
            ...section,
            tasks: section.tasks.map((task) => ({
              id: task.id,
              title: task.title,
            })),
          })
        );
        setSections(newArr);
      } else {
        console.log(res);

        setLoading(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.request.status === 404) {
          setError("failed to find the board: record not found");
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    getBoard();
  }, []);

  useEffect(() => {
    sections;
  }, [sections]);

  return (
    <div className="p-4 relative">
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error ? (
        <>
          <BoardInfo
            boardId={id}
            description={description}
            title={title}
            icon={icon}
            setDescription={setDescription}
            setTitle={setTitle}
            setIcon={setIcon}
          />
          <Kanban boardId={id} sections={sections} setSections={setSections} />
        </>
      ) : (
        !error && (
          <div className="p-4 flex items-center justify-center">
            <LoadingSpinner size={32} />
          </div>
        )
      )}
    </div>
  );
}
