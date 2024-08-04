"use client";

import ErrorText from "@/components/ErrorText";
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

const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmation_password: z.string(),
  })
  .refine((d) => d.password === d.confirmation_password, {
    message: "Passwords must match.",
    path: ["confirmation_password"],
  });

export default function NewPassword() {
  const { newPassword } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmation_password: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    await newPassword("", values.password)
      .then(() => {
        toast({
          title: "New password has been created",
          variant: "success",
        });
        form.reset();
        setError(null);
      })
      .catch((err) => {
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
