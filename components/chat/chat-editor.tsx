"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import {
  ImageUpIcon,
  Loader2Icon,
  Send,
  XCircleIcon,
  XIcon,
  XSquareIcon,
} from "lucide-react";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import EmojiPicker from "../ui/emoji-picker";
import { channelVisibility, member, message, profile } from "@prisma/client";
import queryString from "query-string";
import axios from "axios";
import { toast } from "sonner";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import AvatarIcon from "../ui/avatar-icon";
import ActionToolTip from "../ui/action-tooltip";

const formSchema = z.object({
  content: z.string().optional(),
  fileUrl: z.string().optional(),
});

interface ChatEditorProps {
  type: "channel" | "conversation" | "threads";
  apiUrl: string;
  query: Record<string, any>;
  visibility?: "PUBLIC" | "PRIVATE";
  name: string;
}
const channelIconType = {
  [channelVisibility.PUBLIC]: "",
  [channelVisibility.PRIVATE]: "🔓️",
};

export default function ChatEditor({
  apiUrl,
  query,
  type,
  visibility,
  name,
}: ChatEditorProps) {
  const [text, setText] = useState<string>("");
  const [show, setShow] = useState(false);
  const imageReference = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const quillRef = useRef<any>(null);
  const {
    data,
    onClose,
    type: modalType,
  } = useModal() as {
    data: {
      message?: message & { member: member & { profile: profile } };
      member?: member & { profile: profile };
    };
    onClose: () => void;
    type: ModalType;
  };
  const { message, member } = data;
  const isOpen = modalType === "replyToMessage";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
    shouldFocusError: false,
  });
  const { uploadFiles } = generateReactHelpers<OurFileRouter>();
  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setImageFile(file as File);
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  }

  const renderHeader = () => {
    return (
      <div id="toolbar-container">
        {show && (
          <div className="flex">
            <div className=" w-fit">
              <span className="ql-formats">
                {/* <select className="ql-size"></select> */}
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
                <button className="ql-strike"></button>
              </span>
              <span className="ql-formats">
                <button className="ql-list" value="ordered"></button>
                <button className="ql-list" value="bullet"></button>
                <button className="ql-indent" value="-1"></button>
                <button className="ql-indent" value="+1"></button>
              </span>
              <span className="ql-formats">
                <button className="ql-link"></button>
                <input
                  ref={imageReference}
                  accept="image/*"
                  type="file"
                  className="hidden"
                  onChange={handleImage}
                />
                <button
                  onClick={() => imageReference.current?.click()}
                  type="button"
                  className=""
                >
                  <ImageUpIcon />
                </button>
                <EmojiPicker
                  setText={(emoji: string) =>
                    setText((prev: string) => {
                      const safePrev =
                        prev && prev !== "<p><br></p>"
                          ? prev.replace(/<\/p>$/, "")
                          : "<p>";
                      return `${safePrev}${emoji}</p>`;
                    })
                  }
                />
              </span>
            </div>

            <button
              type="button"
              style={{ width: "100px", color: "black" }}
              className=""
            >
              {getTextLength(text)}
              <span>/1000</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const getTextLength = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.innerText.trim();

    const length = text !== "null" ? text?.length : 0;
    return length;
  };
  const header = renderHeader();

  const cleanContent = (content: string) => {
    return content
      .replace(/^(?:<p>(?:<br>|\s)*<\/p>)+/g, "")
      .replace(/(?:<p>(?:<br>|\s)*<\/p>)+$/g, "");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const replyToMessage = modalType === "replyToMessage";
    if (replyToMessage) onClose();

    if (!cleanContent(text)?.trim() && !image) {
      return null;
    }
    const quill = quillRef.current?.getQuill?.();
    if (quill) {
      const range = quill.getSelection();

      if (range) {
        quill.deleteText(range.index, 1, "user");
        quill.setText("");
      }
    }
    try {
      setIsLoading(true);
      if (imageFile) {
        setImage("");
        const res = await uploadFiles("messageFile", {
          files: [imageFile],
        });

        values.fileUrl = res[0].ufsUrl;
      }

      const url = queryString.stringifyUrl(
        {
          url: apiUrl,
          query,
        },
        {
          skipNull: true,
        }
      );

      await axios.post(url, {
        ...values,
        content: cleanContent(text),
        ...(replyToMessage && { replyToMessageId: message?.id }),
      });
      form.reset();
      setImageFile(null);
      setText("");
    } catch (error: Error | any) {
      toast("Error", {
        description: error?.response?.data?.error ?? "Something went wrong",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
    } finally {
      setIsLoading(false);
      setImageFile(null);
      setText("");
    }
  }

  function clearAllImages() {
    setImage("");
    setImageFile(null);
  }

  useEffect(() => {
    setShow(true);
    const interval = setInterval(() => {
      const quill = quillRef.current?.getQuill?.();
      if (quill) {
        quill.focus();
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="w-full mt-auto relative">
      {message && isOpen && (
        <div className="z-10 mt-2 bg-blac group -mb-1 w-full px-2">
          <div
            onClick={() => {
              onClose();
            }}
            className={cn(
              "gap-x-1 z-10 absolute right-6 p-1 bg-zinc-300 -top-2 invisible rounded-md  flex",
              "group-hover:visible"
            )}
          >
            <ActionToolTip
              label="Reply in thread"
              className="px-2 py-1 hover:bg-zinc-200 rounded-md"
            >
              <XCircleIcon className="!w-4 !h-4" />
            </ActionToolTip>
          </div>
          <div className="p-1 flex flex-col overflow-hidden rounded-lg gap-x-2 w-full border-[2px] border-teal-400  items-start">
            <h1 className="text-teal-700 text-sm font-semibold my-1">
              Replying To :
            </h1>
            <div className="relative p-1 flex overflow-hidden rounded-lg gap-x-2 w-full border-[1px] border-slate-400  items-start">
              <AvatarIcon
                imageUrl={message?.member?.profile?.imageUrl as string}
                width={40}
                height={40}
                className="!rounded-md aspect-square border-[1px] border-current"
              />
              <div className="flex flex-col gap-y-1 justify-start">
                <h1 className="text-sm capitalize font-semibold hover:underline cursor-pointer transition">
                  {message?.member?.profile?.id === member?.profile?.id
                    ? "You"
                    : message?.member?.profile?.name}
                </h1>
                <div
                  className="w-full break-all line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: message?.content as string,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex  flex-col w-full mt-auto relative rounded-lg overflow-hidden max-h-fit">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      {...field}
                      placeholder={
                        type === "channel"
                          ? visibility &&
                            `Message ${channelIconType[visibility]} ${name}`
                          : type === "conversation"
                          ? `Message ${name}`
                          : "Reply..."
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSubmit(form.getValues());
                          const quill = quillRef.current?.getQuill?.();
                          if (quill) {
                            const range = quill.getSelection();

                            if (range) {
                              quill.deleteText(range.index, 1, "user");
                              quill.setText("");
                            }
                          }
                        }
                      }}
                      ref={quillRef}
                      className="ql-tooltip relative ql-editing  mx-2 mt-2 mb-1 rounded-lg overflow-hidden border-[1px] border-slate-400"
                      maxLength={999}
                      value={text}
                      onTextChange={(e: EditorTextChangeEvent) => {
                        if (e.source === "api") {
                          return null;
                        }

                        setText(e.htmlValue as string);
                        field.onChange(e.htmlValue !== null ? e.htmlValue : "");
                      }}
                      headerTemplate={header}
                      style={{
                        maxHeight: "225px",
                        minHeight: "100px",
                        paddingBottom: image && "100px",
                        fontSize: "16px",
                        overflowY: "auto",
                        wordBreak: "break-word",
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              disabled={
                (getTextLength(text) === 0 && image === "") || isLoading
              }
              className={cn(
                "disabled:bg-zinc-300 hover:bg-opacity-70 transition bg-green-700 rounded-md absolute right-10 bottom-4 p-2",
                text && " bottom-8"
              )}
            >
              {isLoading ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <Send
                  className={cn(
                    "w-3 h-3 text-white",
                    getTextLength(text) === 0 && image === "" && "text-zinc-400"
                  )}
                />
              )}
            </button>
          </form>
        </FormProvider>
        {image && (
          <div className="absolute bottom-6 left-7 ">
            <div className="relative">
              <img
                src={image}
                loading="lazy"
                alt="file-img"
                className="w-[80px] h-[80px] rounded-2xl  object-cover"
              />
              <div
                onClick={clearAllImages}
                className="w-5 h-5 bg-black absolute hover:bg-zinc-400 transition cursor-pointer flex items-center justify-center top-0 right-0 rounded-full"
              >
                <XCircleIcon size={48} className=" text-white " />
              </div>
            </div>
          </div>
        )}
        {text && (
          <span className="text-xs text-slate-600 ml-2">
            Press Shift + Enter to start a new line
          </span>
        )}
      </div>
    </div>
  );
}
