"use client";

import Github from "@/components/icons/Github";
import { LoadingSpinner } from "@/components/icons/LoadingSpinner";
import { Button } from "@/components/ui";
import { useConnectedAccountsStore } from "@/store/connectedAccounts";
import React, { useEffect } from "react";

export default function ConnectedAccounts() {
  const { connectedAccounts, getAccounts, loading } =
    useConnectedAccountsStore();

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <div className="mt-5 flex items-start justify-between">
      <div>
        <h3 className="text-xl font-bold">Connected accounts</h3>
        {connectedAccounts ? (
          <p className="opacity-50">Your account is connected to Github</p>
        ) : (
          <p className="opacity-50">Connect your account to Github</p>
        )}
      </div>
      {connectedAccounts ? (
        <div>
          <Button className="gap-2">
            <Github /> <span>{connectedAccounts[0].user_name}</span>
          </Button>
        </div>
      ) : (
        <div>
          <Button disabled={loading}>
            {loading ? <LoadingSpinner /> : "Connect account"}
          </Button>
        </div>
      )}
    </div>
  );
}
