import React from "react";
import { Button } from "./ui";

export default function SearchBtn() {
  return (
    <Button
      variant={"outline"}
      className="flex items-center justify-between w-[243px]"
    >
      <span>Search...</span>
      <kbd className="pointer-events-none ml-auto flex h-5 flex-none select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-semibold opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
