"use client";

import { CornerUpLeft, Star } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";
import Link from "next/link";
import { Button, Input, Textarea } from "@/components/ui";
import DeleteBoard from "@/components/DeleteBoard";

interface Props {
  borderId: string;
}

export default function BoardInfo({ borderId }: Props) {
  const [isFavorites, setIsFavorites] = useState(false);
  const [content, setContent] = useState("Add description here");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [icon, setIcon] = useState("📑");

  const toggleFav = () => {
    setIsFavorites(!isFavorites);
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

  const onIconChange = (newIcon: string) => {
    setIcon(newIcon);
  };

  return (
    <div>
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
          defaultValue={"Untitled"}
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
