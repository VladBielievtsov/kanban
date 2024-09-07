import {
  Button,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Textarea,
} from "@/components/ui";

import { cn } from "@/lib/utils";
import { Columns2, Fullscreen } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import Editor from "./Editor";

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
        !isSplit ? "max-w-6xl mx-auto" : "max-w-full",
        "prose lg:prose-xl"
      )}
    >
      <div className="border-input border rounded-md relative">
        <div className="absolute top-2 right-2">
          <Button variant={"ghost"} onClick={onPreview}>
            <Fullscreen size={20} />
          </Button>
          <Button variant={"ghost"} onClick={onSplit}>
            <Columns2 size={20} />
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

        {isPreview && !isSplit && <Preview content={content} />}

        {isSplit && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={20}>
              <Editor
                taskId={taskId}
                content={content}
                setContent={setContent}
                values={[isPreview, isSplit]}
                setLoading={setLoading}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={20}>
              <Preview content={content} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}

function Preview({ content }: { content: string }) {
  return <Markdown className="p-2 min-h-20">{content}</Markdown>;
}
