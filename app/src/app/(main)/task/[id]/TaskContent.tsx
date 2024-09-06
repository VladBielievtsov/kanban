import { Textarea } from "@/components/ui";
import { useEffect, useRef, useState } from "react";

export default function TaskContent() {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="prose lg:prose-xl max-w-full">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={1}
        placeholder="# Hello"
        className="overflow-hidden resize-none text-lg focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
      />
    </div>
  );
}
