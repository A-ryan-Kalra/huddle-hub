import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface AvatarIconProps {
  imageUrl: string;
  width: number;
  height: number;
  className?: string;
}
function AvatarIcon({ imageUrl, width, height, className }: AvatarIconProps) {
  return (
    <div
      style={{
        width,
        height,
      }}
      className={cn(className, "relative rounded-full")}
    >
      <Image
        fill
        draggable={false}
        src={imageUrl}
        className={cn(className, "object-cover rounded-full")}
        alt={imageUrl}
      />
    </div>
  );
}

export default AvatarIcon;
