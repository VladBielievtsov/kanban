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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .refine((v) => v.trim().split(" ").length === 1, {
      message: "First name should contain only one word",
    }),
  lastName: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters.",
    })
    .refine((v) => v.trim().split(" ").length === 1, {
      message: "First name should contain only one word",
    }),
});

export default function UserDetailsForm() {
  const { user, editUser } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
      });
    }
  }, [user, form]);

  const formValues = form.watch();

  useEffect(() => {
    const hasChnages =
      formValues.firstName.trim() !== user?.first_name ||
      formValues.lastName.trim() !== user?.last_name;

    setIsDisabled(!hasChnages);
  }, [formValues, user]);

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    editUser(values.firstName, values.lastName)
      .then(() => {
        toast({
          title: "User datails has been updated",
          variant: "success",
        });
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 flex flex-col w-full gap-6"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                First Name
              </FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                Last Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" disabled={loading || isDisabled}>
            {loading ? <LoadingSpinner /> : "Save changes"}
          </Button>
        </div>
        <ErrorText error={error} />
      </form>
    </Form>
  );
}
