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
    <li>
      <div>
        <a className={cn("flex flex-col gap-y-2 p-2", className)}>
          <div className="text-xs  line-clamp-2 text-black leading-none">
            {title}
          </div>
          <div className="flex gap-x-1">
            <AvatarIcon
              imageUrl={imageUrl}
              width={30}
              height={30}
              className="!aspect-square"
            />
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </a>
      </div>
    </li>
  );
}

export default ListItem;
