import UserCard from "@/components/UserCard";
import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NavBar() {
  return (
    <div className="h-full border-r dark:border-zinc-600 border-zinc-200">
      <div className="p-4 h-full flex flex-col">
        <UserCard />
        <div>
          <div>
            <h2 className="font-bold">Favorites</h2>
            <div className="flex flex-col mt-2">
              <Link
                href={"/boards/123"}
                className="dark:hover:border-zinc-600 border border-transparent hover:border-zinc-200 rounded-lg p-3"
              >
                😙 Learn Rust
              </Link>
              <Link
                href={"/boards/123"}
                className="dark:hover:border-zinc-600 border border-transparent hover:border-zinc-200 rounded-lg p-3"
              >
                😼 Learn Golang
              </Link>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="font-bold">Boards</h2>
            <div className="flex flex-col mt-2">
              <Link
                href={"/boards/123"}
                className="dark:hover:border-zinc-600 border border-transparent hover:border-zinc-200 rounded-lg p-3"
              >
                😙 Learn Rust
              </Link>
              <Link
                href={"/boards/123"}
                className="dark:hover:border-zinc-600 border border-transparent hover:border-zinc-200 rounded-lg p-3"
              >
                😼 Learn Golang
              </Link>
            </div>
          </div>
        </div>
        <Link
          href={"/login"}
          className="flex items-center justify-between mt-auto border border-zinc-200 dark:border-zinc-600 w-full rounded-lg p-3 hover:bg-zinc-200 dark:hover:bg-zinc-800"
        >
          <p className="font-bold text-sm">Logout</p>
          <LogOut />
        </Link>
      </div>
    </div>
  );
}
