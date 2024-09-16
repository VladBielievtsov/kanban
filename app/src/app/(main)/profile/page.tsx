import React from "react";
import { Card } from "@/components/ui";
import ProfileTabs from "./ProfileTabs";

export default function page() {
  return (
    <div className="p-4">
      <div className="max-w-[820px] mx-auto">
        <Card className="bground border-surface">
          <ProfileTabs />
        </Card>
      </div>
    </div>
  );
}
