"use client";
import { ServerSchema } from "@/type";
import { ChevronDown } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  RedirectToSignIn,
  SignInButton,
  SignOutButton,
  useAuth,
} from "@clerk/nextjs";
import AvatarIcon from "../ui/avatar-icon";
import { useModal } from "@/hooks/use-modal-store";
import { MemberRole } from "@prisma/client";

interface ServerDropDownProps {
  server: ServerSchema;
  role: MemberRole;
}

function ServerDropDown({ server, role }: ServerDropDownProps) {
  const { onOpen } = useModal();
  const { sessionId } = useAuth();
  const admin = role === MemberRole.ADMIN;
  const moderator = role === MemberRole.MODERATOR || admin;

  useEffect(() => {
    function keyPress(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen("searchModal", { server });
      }
    }
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="px-2 py-1 cursor-pointer hover:bg-zinc-300 duration-300 transition w-fit rounded-md">
          <h1 className="truncate  font-semibold text-lg flex items-center   ">
            {server?.name.split(" ")?.join("-")}
            <ChevronDown className="w-4 h-4" />
          </h1>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-72 cursor-pointer"
      >
        <DropdownMenuLabel className="cursor-default flex justify-start items-center gap-x-2">
          <AvatarIcon imageUrl={server?.imageUrl} width={40} height={40} />
          <div className="mb-auto flex flex-col gap-y-0">
            <h2 className="text-sm font-semibold">
              {server?.name.split(" ")?.join("-")}
            </h2>
            <h3 className="text-xs font-semibold">
              {server?.members?.length}{" "}
              {server?.members?.length !== 1 ? "Members" : "Member"}
            </h3>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => onOpen("searchModal", { server })}
            className="cursor-pointer"
          >
            Search
            <DropdownMenuShortcut>⇧⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="cursor-pointer"
          >
            Invite People
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {admin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onOpen("customizeServer", { server })}
              >
                Server Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onOpen("customizeMember", { server })}
                className="cursor-pointer"
              >
                Manage Members
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {admin ? (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onOpen("createServer")}
            >
              Create Server
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onOpen("leaveServer", { server })}
            >
              Leave Server
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="cursor-pointer">
            <SignOutButton signOutOptions={{ sessionId: sessionId as string }}>
              Sign Out
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ServerDropDown;
