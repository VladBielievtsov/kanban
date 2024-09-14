import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./markdown.css";
import CopyCode from "./CopyCode";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <Markdown
      children={content}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";

          return className ? (
            <CopyCode
              code={String(children).replace(/\n$/, "")}
              language={language}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
      className="p-2 min-h-20 bg-transparent markdown-style "
    />
  );
}
