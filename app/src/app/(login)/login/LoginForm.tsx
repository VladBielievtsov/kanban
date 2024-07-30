"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Input,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { LoadingSpinner } from "@/components/icons/LoadingSpinner";
import { Soup } from "lucide-react";
import { useUserStore } from "@/store/user";
import Link from "next/link";
import Github from "@/components/icons/Github";

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
      const { error: storeError } = useUserStore.getState();

      if (!storeError) {
        await router.push("/");
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
          <div className="flex justify-center relative">
            <span className="h-[1px] w-full bg-foreground absolute top-1/2"></span>
            <span className="dark:bg-zinc-900 bg-white z-10 px-4 text-sm font-bold">
              OR
            </span>
          </div>
          <div className="w-full">
            <Button type="button" className="w-full" asChild>
              <Link
                href={process.env.NEXT_PUBLIC_BACKEND + "/github/login"}
                className="flex items-start gap-2"
              >
                <Github />
                <span>Log in with Github</span>
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
