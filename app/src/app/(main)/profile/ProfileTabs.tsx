import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import AccountTab from "./AccountTab";
import SecurityTab from "./SecurityTab";

export default function ProfileTabs() {
  return (
    <Tabs defaultValue="account" className="max-w-[820px] flex items-start">
      <TabsList className="flex flex-col min-w-[200px] h-auto bg-transparent p-4">
        <TabsTrigger
          value="account"
          className="w-full justify-start data-[state=active]:bg-surface"
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className="w-full justify-start data-[state=active]:bg-surface"
        >
          Security
        </TabsTrigger>
      </TabsList>
      <AccountTab />
      <SecurityTab />
    </Tabs>
  );
}
