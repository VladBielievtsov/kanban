"use client";

import { CornerUpLeft, Star } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";
import Link from "next/link";
import { Button, Input, Textarea } from "@/components/ui";
import DeleteBoard from "@/components/DeleteBoard";
import { axiosClient } from "@/lib/axios-client";
import Alert from "@/components/Alert";
import axios from "axios";

interface Props {
  borderId: string;
}

export default function BoardInfo({ borderId }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorites, setIsFavorites] = useState(false);
  const [content, setContent] = useState("Add description here");
  const [title, setTitle] = useState("Untitled");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [icon, setIcon] = useState("📑");
  const [error, setError] = useState<string | null>(null);

  const toggleFav = () => {
    setIsFavorites(!isFavorites);
  };

  const onIconChange = (newIcon: string) => {
    setIcon(newIcon);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  const handleChangeDesc = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const getBoard = async () => {
    try {
      const res = await axiosClient.get("/board/" + borderId, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setLoading(false);
        setContent(res.data.description);
        setTitle(res.data.title);
        setIcon(res.data.icon);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.request.status === 404) {
          setError("failed to find the board: record not found");
        }
      }
    }
  };

  useEffect(() => {
    getBoard();
  }, []);

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mt-3 flex items-center justify-between">
        <div>
          <Button variant={"ghost"} asChild>
            <Link href={"/"}>
              <CornerUpLeft />
            </Link>
          </Button>
          <Button variant={"ghost"} onClick={toggleFav}>
            {isFavorites ? <Star fill="#FBBF24" stroke="#FBBF24" /> : <Star />}
          </Button>
        </div>

        <DeleteBoard id={borderId} />
      </div>
      <div className="px-10 pt-4">
        <div className="inline-block">
          <EmojiPicker icon={icon} onChange={onIconChange} />
        </div>
        <Input
          value={title}
          onChange={handleChangeTitle}
          className="p-0 my-2 text-4xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-0"
        />
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChangeDesc}
          rows={1}
          className="p-0 mb-2 mt-4 overflow-hidden resize-none text-lg focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-0"
        />
      </div>
    </div>
  );
}
