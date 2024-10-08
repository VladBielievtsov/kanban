"use client";

import { CornerUpLeft } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";
import Link from "next/link";
import { Button, Input, Textarea, useToast } from "@/components/ui";
import DeleteBoard from "@/components/DeleteBoard";
import { useDebounce } from "react-use";
import { useBoardsStore } from "@/store/boards";
import { handleAxiosErrorMessage } from "@/lib/axios-client";
import ToggleBoardFavorite from "@/components/ToggleBoardFavorite";
import Loading from "@/components/common/Loading";

interface Props {
  boardId: string;
  description: string;
  title: string;
  icon: string;
  isFav: boolean;
  setIsFav: Dispatch<SetStateAction<boolean>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setIcon: Dispatch<SetStateAction<string>>;
}

export default function BoardInfo({
  boardId,
  description,
  title,
  icon,
  isFav,
  setIsFav,
  setDescription,
  setTitle,
  setIcon,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [defaultValues, setDefaultValues] = useState({
    title,
    description,
    icon,
  });
  const { updateBoard } = useBoardsStore();
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const onIconChange = (newIcon: string) => {
    setIcon(newIcon);
    Save(newIcon);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [description]);

  useDebounce(
    () => {
      Save(icon);
    },
    1000,
    [title]
  );

  useDebounce(
    () => {
      Save(icon);
    },
    1000,
    [description]
  );

  const Save = async (ic: string) => {
    if (
      (title.trim() != defaultValues.title.trim() && title.trim() != "") ||
      (description.trim() != defaultValues.description.trim() &&
        description.trim() != "") ||
      (ic.trim() != defaultValues.icon.trim() && ic.trim() != "")
    ) {
      try {
        setDefaultValues({ title, description, icon: ic });
        setLoading(true);
        const res = await updateBoard(boardId, title, description, ic);
        if (res.status === 200) {
          setLoading(false);
          toast({
            title: "Board has been updated successfully",
            variant: "success",
          });
        } else {
          setLoading(false);
          toast({
            title: res.data || "An unknown error occurred.",
            variant: "success",
          });
        }
      } catch (error) {
        setLoading(false);
        const errorMessage = handleAxiosErrorMessage(error);
        toast({
          title: errorMessage || "An unknown error occurred.",
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    }
  };

  return (
    <>
      <Loading loading={[loading]} />
      <div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <Button variant={"ghost"} asChild>
              <Link href={"/"}>
                <CornerUpLeft size={18} />
              </Link>
            </Button>
            <ToggleBoardFavorite
              isFav={isFav}
              setIsFav={setIsFav}
              boardId={boardId}
            />
          </div>

          <DeleteBoard id={boardId} />
        </div>
        <div className="px-10 pt-4">
          <div className="inline-block">
            <EmojiPicker icon={icon} onChange={onIconChange} />
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-0 my-2 text-4xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-0"
          />
          <Textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={1}
            className="p-0 mb-4 mt-4 overflow-hidden resize-none text-lg focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-0"
          />
        </div>
      </div>
    </>
  );
}
