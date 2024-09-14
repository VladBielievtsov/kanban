import React, { useState } from "react";
import { Button } from "../ui";

const CopyCode = ({ code, language }: { code: string; language: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative px-4 py-4">
      <Button
        onClick={handleCopy}
        className="absolute top-2 right-4 text-sm hover:bg-[#5c5f77]"
        variant={"ghost"}
      >
        {isCopied ? "Copied!" : language}
      </Button>
      <pre className="p-0 m-0">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default CopyCode;
