import React from "react";
import { Metadata } from "next";
import App from "./App";
import NavBar from "./NavBar";
import Header from "./Header";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <App>
      <main>
        <Header />
        <div className="flex pt-[60px]">
          <nav
            className="w-[320px] fixed"
            style={{ height: "calc(100vh - 60px)" }}
          >
            <NavBar />
          </nav>
          <section className="w-full pl-[320px]">{children}</section>
        </div>
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
