import React from "react";
import { Textarea, useToast } from "@/components/ui";
import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "react-use";

interface Props {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  values: boolean[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: string;
}

export default function Editor({
  content,
  setContent,
  values,
  setLoading,
  taskId,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [defaultContent, setDefaultContent] = useState(content);

  const { toast } = useToast();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content, values]);

  useDebounce(
    () => {
      update();
    },
    1000,
    [content]
  );

  const update = async () => {
    if (content.trim() != defaultContent.trim() && content.trim() != "") {
      try {
        setLoading(true);

        const res = await axiosClient.patch(
          "/task/" + taskId,
          { content },
          { withCredentials: true }
        );

        if (res.status === 200) {
          setLoading(false);
          setDefaultContent(content);
        } else {
          setLoading(false);
          toast({
            title: res.data || "An unknown error occurred.",
            variant: "destructive",
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
    <Textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      rows={1}
      placeholder="# Hello"
      className="border-0 overflow-hidden resize-none text-lg focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
    />
  );
}
