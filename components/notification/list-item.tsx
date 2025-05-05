import { cn } from "@/lib/utils";
import React from "react";
import AvatarIcon from "../ui/avatar-icon";

interface ListItemProps {
  title: string;
  imageUrl: string;
  className: string;
  children: React.ReactNode;
}

function ListItem({ imageUrl, title, className, children }: ListItemProps) {
  return (
    <div>
      <a
        className={cn(
          "flex  gap-x-3 p-2 cursor-pointer hover:bg-zinc-100 transition",
          className
        )}
      >
        <AvatarIcon
          imageUrl={imageUrl}
          width={35}
          height={35}
          className="!rounded-md !aspect-square"
        />
        <div className="flex flex-col gap-y-1">
          <div className="text-xs  line-clamp-2 text-zinc-800 leading-none font-semibold font-sans">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-neutral-500">
            {children}
          </p>
        </div>
      </a>
    </div>
  );
}

export default ListItem;
