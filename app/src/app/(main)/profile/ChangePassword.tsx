"use client";

import ErrorText from "@/components/common/ErrorText";
import { LoadingSpinner } from "@/components/icons/LoadingSpinner";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@/components/ui";
import { useUserStore } from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = (has_password: boolean) => {
  return z
    .object({
      old_password: z.string().min(has_password ? 1 : 0, {
        message: "Old password is required.",
      }),
      password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
      }),
      confirmation_password: z.string(),
    })
    .refine((d) => d.password === d.confirmation_password, {
      message: "Passwords must match.",
      path: ["confirmation_password"],
    });
};

export default function ChangePassword() {
  const { updatePassword, user } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fSchema = formSchema(user?.has_password || false);

  const form = useForm<z.infer<typeof fSchema>>({
    resolver: zodResolver(fSchema),
    defaultValues: {
      old_password: "",
      password: "",
      confirmation_password: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof fSchema>) {
    setLoading(true);
    setError(null);
    await updatePassword(values.old_password, values.password)
      .then(() => {
        toast({
          title: user?.has_password
            ? "Password has been updated"
            : "New password has been created",
          variant: "success",
        });
        form.reset();
        setError(null);
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 mt-6">
        {user?.has_password && (
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                  Old password
                </FormLabel>
                <FormControl>
                  <Input placeholder="Old password" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                New password
              </FormLabel>
              <FormControl>
                <Input placeholder="New password" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmation_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                Confirm new password
              </FormLabel>
              <FormControl>
                <Input placeholder="Confirm new password" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : "Save password"}
          </Button>
        </div>
        <ErrorText error={error} />
      </form>
    </Form>
  );
}
