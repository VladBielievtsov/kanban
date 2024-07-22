import React from "react";
import { Metadata } from "next";
import App from "./App";
import NavBar from "./NavBar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <App>
      <main className="flex">
        <nav className="h-screen w-[320px] fixed">
          <NavBar />
        </nav>
        <section className="w-full pl-[320px]">{children}</section>
      </main>
    </App>
  );
}

export const metadata: Metadata = {
  title: {
    template: "%s | Kanban",
    default: "Kanban",
  },
};
