import { Member, MemberRole, Message, Profile } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import AvatarIcon from "./avatar-icon";
import { Edit, TrashIcon } from "lucide-react";
import ActionToolTip from "./action-tooltip";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "./form";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import queryString from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { format } from "date-fns";

interface UserCommentProps {
  message: Message & { member: Member & { profile: Profile } };
  createdAt: Date;
  socketQuery: Record<string, any>;
  currentMember: Member & { profile: Profile };
  type: "channel" | "conversation";
}

const formSchema = z.object({
  content: z.string().min(1, { message: "Content is required!" }),
});
const TIME_FORMAT = "hh:mm a";
const DATE_FORMAT = "d/MM/yyyy, hh:mm a";

function UserComment({
  message,
  createdAt,
  socketQuery,
  type,
  currentMember,
}: UserCommentProps) {
  const [messageId, setMessageId] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const { onOpen } = useModal();
  const isUpdated = message.createdAt !== message.updatedAt;
  const isAdmin = type === "channel" && currentMember.role === MemberRole.ADMIN;
  const isModerator = isAdmin || currentMember.role === MemberRole.MODERATOR;
  const ownerOfMessage = message.memberId === currentMember.id;
  const isDeleted = message.deleted;
  const showTime = format(new Date(message?.createdAt), TIME_FORMAT);
  const showDate = format(new Date(message?.createdAt), DATE_FORMAT);

  const cleanContent = (html: string) => {
    return html
      .replace(/^(?:\s*<p>(?:<br\s*\/?>|\s|&nbsp;)*<\/p>\s*)+/gi, "")
      .replace(/^((<br\s*\/?>|\s|&nbsp;)+)+/gi, "")
      .replace(/((<br\s*\/?>|\s|&nbsp;)+)+$/gi, "")
      .replace(/(?:\s*<p>(?:<br\s*\/?>|\s|&nbsp;)*<\/p>\s*)+$/gi, "")
      .replace(
        /(<p>[\s\S]*?)(<br\s*\/?>\s*)+(<\/p>)/gi,
        (_, start, _brs, end) => {
          return start + end;
        }
      );
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const url = queryString.stringifyUrl({
      url: `/api/socket/${
        type === "channel" ? "messages" : "direct-messages"
      }/${message.id}`,
      query: socketQuery,
    });

    await axios.patch(url, values);
    setIsEditing(false);
    setMessageId("");
  };
  const isLoading = form.formState.isSubmitting;
  useEffect(() => {
    function closeEditor(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsEditing(false);
        setMessageId("");
      }
    }

    window.addEventListener("keyup", closeEditor);

    return () => window.removeEventListener("keyup", closeEditor);
  }, []);

  useEffect(() => {
    if (contentRef.current && message.content) {
      contentRef.current.innerHTML = message.content;
    }
  }, [message.content, isEditing]);

  return (
    <div className="flex px-4 h-full ">
      <div className="relative flex gap-x-2 w-full  items-start">
        <AvatarIcon
          imageUrl={message?.member?.profile?.imageUrl}
          width={40}
          height={40}
          className="!rounded-md border-[1px] border-current mt-auto !sticky bottom-0"
        />
        <div
          className={cn(
            "flex flex-col w-full  group rounded-md relative",
            message.id !== messageId && "hover:bg-neutral-50  transition"
          )}
        >
          {!isDeleted && ownerOfMessage && (
            <div className="gap-x-1 z-10 absolute right-3 p-1 bg-zinc-300 -top-4 invisible rounded-md group-hover:visible flex">
              {ownerOfMessage && (
                <ActionToolTip
                  label="Edit"
                  onClick={() => {
                    setMessageId(message.id);
                    setIsEditing(true);
                  }}
                  className="px-2 py-1 hover:bg-zinc-200 "
                >
                  <Edit className="!w-4 !h-4" />
                </ActionToolTip>
              )}
              {(isAdmin || isModerator || ownerOfMessage) && (
                <ActionToolTip
                  label="Delete"
                  onClick={() => onOpen("deleteMessage", { message })}
                  className="px-2 py-1 hover:bg-zinc-200 "
                >
                  <TrashIcon className="!w-4 !h-4" />
                </ActionToolTip>
              )}
            </div>
          )}
          <div className="flex items-center justify-start">
            <h1 className="text-sm font-semibold hover:underline cursor-pointer transition">
              {message?.member?.profile?.name}
            </h1>

            <ActionToolTip
              label={showDate}
              className="text-xs ml-3 text-zinc-500 hover:underline"
            >
              {showTime}
            </ActionToolTip>
            {isUpdated && !isDeleted && (
              <span className="text-xs mt-aut text-zinc-700 ml-2">
                (edited)
              </span>
            )}
          </div>
          {isEditing && message.id === messageId ? (
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.setValue("content", cleanContent(content));
                  form.handleSubmit(onSubmit)(e);
                }}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div
                          ref={contentRef}
                          contentEditable
                          onInput={(e) =>
                            setContent((e.target as HTMLElement).innerHTML)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              form.setValue(
                                "content",
                                cleanContent(
                                  contentRef.current?.innerHTML || ""
                                )
                              );
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                          className="border-none focus-visible:ring-0 outline-none rounded-md p-2 bg-neutral-100 min-h-20 max-h-32 overflow-auto"
                          suppressContentEditableWarning
                        ></div>
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500 font-semibold py-1">
                          Press escape to cancel, enter to save
                        </span>
                        <Button
                          disabled={isLoading}
                          size={"sm"}
                          type="submit"
                          variant={"primary"}
                        >
                          Save
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : (
            <div
              className={cn(
                "w-full  min-h-[40px]",
                isDeleted && "text-xs text-zinc-600 tracking-wide"
              )}
              dangerouslySetInnerHTML={{ __html: message?.content }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserComment;
