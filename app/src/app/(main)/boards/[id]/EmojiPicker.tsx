"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface IEmojiPicker {
  icon: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ icon, onChange }: IEmojiPicker) {
  const [isShowPicker, setIsShowPicker] = useState(false);

  const selectEmoji = (emoji: { native: string }) => {
    setIsShowPicker(false);
    onChange(emoji.native);
  };

  const showPicker = () => {
    setIsShowPicker(!isShowPicker);
  };

  return (
    <div className="relative">
      <h3
        className="font-bold text-3xl cursor-pointer mb-3"
        onClick={showPicker}
      >
        {icon}
      </h3>
      <div
        className={cn(
          isShowPicker ? "block" : "hidden",
          "absolute top-[100%] z-50"
        )}
      >
        <Picker data={data} onEmojiSelect={selectEmoji} />
      </div>
    </div>
  );
}
