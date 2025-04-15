import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  setText: (emoji: string) => void;
}

function EmojiPicker({ setText }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger className="">
        <Smile className="text-black hover:text-blue-400 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={-50}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <Picker
          data={data}
          theme={"light"}
          onEmojiSelect={(emoji: any) => setText(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default EmojiPicker;
