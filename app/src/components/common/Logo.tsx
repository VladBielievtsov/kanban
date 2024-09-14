import { Soup } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="flex items-center gap-2 text-zinc-800 dark:text-zinc-300"
    >
      <Soup size={24} />
      <span className="text-lg font-bold">Kanban</span>
    </Link>
  );
}
