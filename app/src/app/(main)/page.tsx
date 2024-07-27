import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import React from "react";

export default function () {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center">
        <Button>Create</Button>
        <p className="mt-2">You don't have a board yet</p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Dashboard",
};
