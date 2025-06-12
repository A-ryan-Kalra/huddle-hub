"use client";
import { ServerSchema } from "@/type";
import { ChevronDown, ShieldAlert, ShieldCheck } from "lucide-react";
import React, { Fragment, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import { member, memberRole } from "@prisma/client";
import { toast } from "sonner";
import Link from "next/link";
import ActionToolTip from "../ui/action-tooltip";
interface ServerDropDownProps {
  server: ServerSchema;
  role: memberRole;
  allServers: ServerSchema[];
  currentMember: member;
}
const memberRoleIcon = {
  [memberRole.ADMIN]: <ShieldAlert className="w-5 h-5 text-red-500" />,
  [memberRole.MODERATOR]: <ShieldCheck className="w-5 h-5 text-blue-500" />,
  [memberRole.GUEST]: null,
};

function ServerDropDown({
  server,
  role,
  allServers,
  currentMember,
}: ServerDropDownProps) {
  const { onOpen } = useModal();
  const { sessionId } = useAuth();
  const admin = role === memberRole.ADMIN;
  const moderator = role === memberRole.MODERATOR || admin;
  useEffect(() => {
    function keyPress(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen("searchModal", { server, member: currentMember });
      }
    }
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, []);

  function moreServerReq() {
    if (allServers?.length <= 1) {
      toast("Attention!", {
        description:
          "At least more than one server are required to unlock this feature",
        richColors: true,

        style: {
          backgroundColor: "white",
        },
      });
    }
  }

  return (
    <DropdownMenu modal={false}>
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
          <div className="ml-auto">
            <ActionToolTip label={role}>{memberRoleIcon[role]}</ActionToolTip>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={(e) => {
              onOpen("searchModal", { server, member: currentMember });
            }}
            className="cursor-pointer"
          >
            Search
            <DropdownMenuShortcut>⇧⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onOpen("invite", { server, member: currentMember })}
            className="cursor-pointer"
          >
            Invite People
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onOpen("createServer")}
          >
            Create Server
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              onClick={moreServerReq}
              disabled={allServers?.length <= 1}
              className="border-none focus-visible:ring-offset-0 outline-none"
            >
              Switch Server
              <span className="ml-3">(Total: {allServers?.length})</span>
            </DropdownMenuSubTrigger>
            {allServers?.length > 1 && (
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {allServers?.map((server, index) => (
                    <Fragment key={index}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link
                          href={`/servers/${server.id}`}
                          className="w-full cursor-pointer"
                        >
                          {server?.name}
                        </Link>
                      </DropdownMenuItem>
                    </Fragment>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            )}
          </DropdownMenuSub>
          {admin ? (
            <>
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={() => onOpen("deleteServer", { server })}
              >
                Delete Server
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer text-red-500 focus:text-red-500"
              onClick={() => onOpen("leaveServer", { server })}
            >
              Leave Server
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />

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
