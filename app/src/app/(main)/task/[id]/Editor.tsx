import { Textarea } from "@/components/ui";
import { useEffect, useRef } from "react";

interface Props {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  values: boolean[];
}

export default function Editor({ content, setContent, values }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content, ...values]);

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
