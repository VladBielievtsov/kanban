import React from "react";
import {
  Button,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui";

import { cn } from "@/lib/utils";
import { Columns2, Fullscreen } from "lucide-react";
import { useState } from "react";
import Editor from "./Editor";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";

export default function TaskContent({
  setLoading,
  taskId,
  doc,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: string;
  doc: string;
}) {
  const [content, setContent] = useState(doc);

  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isSplit, setIsSplit] = useState<boolean>(false);

  const onPreview = () => {
    setIsSplit(false);
    setIsPreview(!isPreview);
  };

  const onSplit = () => {
    setIsPreview(false);
    setIsSplit(!isSplit);
  };

  return (
    <div
      className={cn(
        !isSplit ? "max-w-6xl mx-auto pb-6" : "max-w-full",
        "prose lg:prose-xl"
      )}
    >
      <div className="border-surface border rounded-md relative">
        <div className="absolute top-2 right-2">
          <Button variant={isPreview ? "outline" : "ghost"} onClick={onPreview}>
            <Fullscreen size={18} />
          </Button>
          <Button variant={isSplit ? "outline" : "ghost"} onClick={onSplit}>
            <Columns2 size={18} />
          </Button>
        </div>
        {!isPreview && !isSplit && (
          <Editor
            taskId={taskId}
            content={content}
            setContent={setContent}
            values={[isPreview, isSplit]}
            setLoading={setLoading}
          />
        )}

        {isPreview && !isSplit && <MarkdownRenderer content={content} />}

        {isSplit && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={18}>
              <Editor
                taskId={taskId}
                content={content}
                setContent={setContent}
                values={[isPreview, isSplit]}
                setLoading={setLoading}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={18}>
              <MarkdownRenderer content={content} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
