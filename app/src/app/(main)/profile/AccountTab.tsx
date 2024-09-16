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
      <Card className="bground border-surface border-0 rounded-l-none border-l ">
        <CardHeader>
          <CardTitle className="text-text">Account Details</CardTitle>
          <CardDescription className="text-text/60">
            Manage your Kanban Profile
          </CardDescription>
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
