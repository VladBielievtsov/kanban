"use client";

import { useUserStore } from "@/store/user";
import React from "react";
import UserDetailsForm from "./UserDetailsForm";
import UserAvatar from "./UserAvatar";
import { Input, Separator } from "@/components/ui";
import { Label } from "@/components/ui";

export default function ProfileInfo() {
  const { user } = useUserStore();

  return (
    <div className="my-5">
      <h3 className="text-xl font-bold text-text">Profile</h3>
      <UserAvatar
        avatar_url={user?.avatar_url}
        first_name={user?.first_name}
        userID={user?.id}
      />

      <div className="pb-6">
        <UserDetailsForm />
      </div>
      <Separator />
      <div className="pt-6">
        <Label className="text-sm font-bold text-text">Email</Label>
        <Input
          disabled
          defaultValue={user?.email}
          placeholder="Email"
          className="mt-2"
        />
      </div>
    </div>
  );
}
