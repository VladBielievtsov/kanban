"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmation_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {}

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
          <Button type="submit">Save password</Button>
        </div>
      </form>
    </Form>
  );
}
