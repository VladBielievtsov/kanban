"use client";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CornerUpLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Separator } from "@/components/ui/separator";
import "./style.css";

export default function TaskInfo() {
  return (
    <div>
      <div className="mt-3 flex items-center justify-between">
        <Button variant={"ghost"} asChild>
          <Link href={"/"}>
            <CornerUpLeft />
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"ghost"}>
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="px-10 pt-4">
        <Input
          defaultValue={"Untitled"}
          className="p-0 my-2 text-4xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-0"
        />
        <span className="font-bold opacity-60">22 Jul, 2024</span>
        <div className="py-10">
          <Separator />
        </div>
        <div className="prose lg:prose-xl max-w-full">
          <CKEditor editor={ClassicEditor} data={"Hello"}></CKEditor>
        </div>
      </div>
    </div>
  );
}
