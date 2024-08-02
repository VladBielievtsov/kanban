"use client";

import { useUserStore } from "@/store/user";
import React from "react";
import UserDetailsForm from "./UserDetailsForm";
import UserAvatar from "./UserAvatar";

export default function ProfileInfo() {
  const { user } = useUserStore();

  return (
    <div className="my-5">
      <h3 className="text-xl font-bold">Profile</h3>
      <UserAvatar
        avatar_url={user?.avatar_url}
        first_name={user?.first_name}
        userID={user?.id}
      />
      <div>
        <UserDetailsForm />
      </div>
    </div>
  );
}
