"use client";

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
import ChangePassword from "./ChangePassword";

export default function SecurityTab() {
  return (
    <TabsContent value="security" className="w-full mt-0">
      <Card className="bground dark:border-zinc-600 border-zinc-200 border-0 rounded-l-none border-l ">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your Kanban Security</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator />
          <div className="my-5">
            <h3 className="text-xl font-bold">Password</h3>
            <p className="opacity-50">Enter your new password</p>
            <ChangePassword />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
