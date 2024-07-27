"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Soup } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .email({ message: "Invalid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const { login, error, loading, user } = useUserStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "mail@mail.com",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    try {
      await login(email, password);
      const { error: storeError, user: storeUser } = useUserStore.getState();

      if (!storeError) {
        await router.push("/");
        console.log(storeUser);
      } else {
        console.error("Error during login:", storeError);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      form.resetField("password");
    }
  }

  return (
    <div className="max-w-[400px] w-full">
      <div className="text-zinc-800 dark:text-zinc-300 flex flex-col items-center">
        <Soup size={32} strokeWidth={2} />
        <span className="text-2xl py-[30px] font-bold">Kanban</span>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col max-w-[300px] w-full mx-auto gap-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                  Email
                </FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                  Password
                </FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="w-full">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <LoadingSpinner /> : "Submit"}
            </Button>
            {error ? (
              <p className="mt-2 text-red-500 font-bold text-sm">{error}</p>
            ) : (
              false
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
