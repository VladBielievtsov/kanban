import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  TabsContent,
} from "@/components/ui";
import React from "react";
import ProfileInfo from "./ProfileInfo";
import ConnectedAccounts from "./ConnectedAccounts";

export default function AccountTab() {
  return (
    <TabsContent value="account" className="w-full mt-0">
      <Card className="bground dark:border-zinc-600 border-zinc-200 border-0 rounded-l-none border-l ">
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
    </TabsContent>
  );
}
