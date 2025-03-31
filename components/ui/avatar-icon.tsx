import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface AvatarIconProps {
  imageUrl: string;
  width: number;
  height: number;
}
function AvatarIcon({ imageUrl, width, height }: AvatarIconProps) {
  return (
    <div
      style={{
        width,
        height,
      }}
      className={cn("relative rounded-full")}
    >
      <Image
        fill
        src={imageUrl}
        className="object-cover rounded-full"
        alt={imageUrl}
      />
    </div>
  );
}

export default AvatarIcon;
