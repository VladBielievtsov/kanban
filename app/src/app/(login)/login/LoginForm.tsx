"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Soup } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "mail@mail.com",
      password: "password",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    try {
      const res = await axios.post("/api/user", { email, password });

      if (res.status === 200) {
        router.push("/");
        console.log(res.data);
      } else {
        console.log(res.data.message || "Login failed");
      }
    } catch (error: unknown) {
      console.error("Error logging in:", error);
      if (axios.isAxiosError(error)) {
        console.error(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } else {
        console.error("An unexpected error occurred");
      }
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
          className="flex flex-col max-w-[300px] w-full mx-auto gap-9"
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
