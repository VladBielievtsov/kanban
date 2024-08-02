import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import ProfileInfo from "./ProfileInfo";
import ConnectedAccounts from "./ConnectedAccounts";

export default function page() {
  return (
    <div className="p-4">
      <div className="max-w-[820px] mx-auto">
        <Card className="bground dark:border-zinc-600 border-zinc-200">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Manage your Kanban Profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Separator />
            <ProfileInfo />
            <Separator />
            <ConnectedAccounts />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
