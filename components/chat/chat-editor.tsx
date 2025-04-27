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
import { ChannelVisibility } from "@prisma/client";
import queryString from "query-string";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  content: z.string().optional(),
  fileUrl: z.string().optional(),
});

interface ChatEditorProps {
  type: "channel" | "conversation";
  apiUrl: string;
  query: Record<string, any>;
  visibility?: "PUBLIC" | "PRIVATE";
  name: string;
}
const channelIconType = {
  [ChannelVisibility.PUBLIC]: "",
  [ChannelVisibility.PRIVATE]: "🔓️",
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
    console.log(values);
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

      await axios.post(url, { ...values, content: cleanContent(text) });
      form.reset();
      setImageFile(null);
      setText("");
    } catch (error) {
      console.error(error);

      toast("Error", {
        description: "Channel Created Successfully",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
    } finally {
      setIsLoading(false);
      setImageFile(null);
      setText("");
    }
  }
  console.log(image);
  console.log(imageFile);
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
  }, []);

  return (
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
                        : `Message ${name}`
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
            disabled={(getTextLength(text) === 0 && image === "") || isLoading}
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
  );
}
