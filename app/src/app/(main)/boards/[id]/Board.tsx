"use client";

import { axiosClient } from "@/lib/axios-client";
import BoardInfo from "./BoardInfo";
import Kanban, { Sections } from "./Kanban";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Alert from "@/components/common/Alert";
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
  const [isFav, setIsFav] = useState<boolean>(false);
  const [sections, setSections] = useState<Sections[]>([]);

  const getBoard = useCallback(async () => {
    try {
      const res = await axiosClient.get("/board/" + id, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setLoading(false);
        setDescription(res.data.description);
        setTitle(res.data.title);
        setIcon(res.data.icon);
        setIsFav(res.data.favorite);
        const newArr: Sections[] = res.data.sections.map(
          (section: Sections) => ({
            ...section,
            tasks: section.tasks.map((task) => ({
              id: task.id,
              title: task.title,
              position: task.position,
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
        if (error.response?.status === 404) {
          setError("failed to find the board: record not found");
        } else if (error.response?.status === 500) {
          setError("Internal Server Error occurred");
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

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
            isFav={isFav}
            setIsFav={setIsFav}
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
