"use client";

import ErrorText from "@/components/ErrorText";
import Github from "@/components/icons/Github";
import { LoadingSpinner } from "@/components/icons/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  useToast,
} from "@/components/ui";
import { useConnectedAccountsStore } from "@/store/connectedAccounts";
import React, { useEffect, useState } from "react";

export default function ConnectedAccounts() {
  const { connectedAccounts, getAccounts, loading, unlinkAccount } =
    useConnectedAccountsStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unlinkLoading, setUnlinkLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    getAccounts();
  }, []);

  const handleUnlink = async () => {
    setUnlinkLoading(true);
    setError(null);

    await unlinkAccount("github")
      .then(() => {
        toast({
          title: "GitHub has been unlinked",
          variant: "success",
        });
        setError(null);
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      })
      .finally(() => {
        setUnlinkLoading(false);
      });
  };

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
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button className="gap-2">
                <Github /> <span>{connectedAccounts[0].user_name}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will unlink your github account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <ErrorText error={error} />
              <AlertDialogFooter>
                <AlertDialogCancel disabled={unlinkLoading}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={unlinkLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    handleUnlink();
                  }}
                >
                  {unlinkLoading ? <LoadingSpinner /> : "Unlink"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
