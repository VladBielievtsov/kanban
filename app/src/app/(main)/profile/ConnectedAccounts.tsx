"use client";

import Github from "@/components/icons/Github";
import { Button } from "@/components/ui";
import { useUserStore } from "@/store/user";
import React, { useState } from "react";

export default function ConnectedAccounts() {
  const [connected, setConnected] = useState(true);
  const { user } = useUserStore();

  return (
    <div className="mt-5 flex items-start justify-between">
      <div>
        <h3 className="text-xl font-bold">Connected accounts</h3>
        {connected ? (
          <p className="opacity-50">Your account is connected to Github</p>
        ) : (
          <p className="opacity-50">Connect your account to Github</p>
        )}
      </div>
      {connected ? (
        <div>
          <Button className="gap-2">
            <Github /> <span>{user?.first_name}</span>
          </Button>
        </div>
      ) : (
        <div>
          <Button>Connect account</Button>
        </div>
      )}
    </div>
  );
}
