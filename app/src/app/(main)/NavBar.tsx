import LogoutBtn from "@/components/LogoutBtn";
import UserCard from "@/components/UserCard";
import React from "react";
import BoardsList from "./BoardsList";

export default function NavBar() {
  return (
    <div className="h-full border-r dark:border-zinc-600 border-zinc-200">
      <div className="p-4 h-full flex flex-col">
        <UserCard />
        <div className="grid gap-10">
          <BoardsList variant="all" />
        </div>
        <LogoutBtn />
      </div>
    </div>
  );
}
