import React from "react";
import { Button, useToast } from "./ui";
import { Share2 } from "lucide-react";

export default function ShareTask() {
  const { toast } = useToast();

  const onShare = async () => {
    const currentUrl = window.location.href;
    const newUrl = currentUrl.replace("/task/", "/share/");
    try {
      await navigator.clipboard.writeText(newUrl);
      toast({
        title: "Link copied to clipboard!",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Failed to copy the link",
        variant: "destructive",
      });
      console.error("Failed to copy the link: ", err);
    }
  };

  return (
    <Button variant={"ghost"} onClick={onShare}>
      <Share2 size={18} />
    </Button>
  );
}
