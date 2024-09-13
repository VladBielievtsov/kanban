import { Metadata } from "next";
import CreateBoard from "@/components/CreateBoard";

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center">
        <CreateBoard />
        <p className="mt-2">You don't have a board yet</p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Dashboard",
};
