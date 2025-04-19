"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { Hash, ImageUpIcon, Lock, Send, XIcon } from "lucide-react";
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

const formSchema = z.object({
  content: z.string().optional(),
  fileUrl: z.string().optional(),
});

interface ChatEditorProps {
  type: "channel" | "conversation";
  apiUrl: string;
  query: Record<string, any>;
  visibility: "PUBLIC" | "PRIVATE";
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
  const isLoading = form.formState.isSubmitting;
  console.log(isLoading);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (imageFile) {
      console.log(imageFile);
      const res = await uploadFiles("messageFile", {
        files: [imageFile],
      });

      console.log(res[0].ufsUrl);
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

    await axios.post(url, { ...values, content: text });
    form.reset();
    setImageFile(null);
    setText("");
    setImage("");
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
  }, []);

  return (
    <div className="flex flex-1 flex-col w-full bg-blac relative   rounded-lg   overflow-hidden max-h-fit">
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
                        ? `Message ${channelIconType[visibility]} ${name}`
                        : ``
                    }
                    ref={quillRef}
                    className="ql-tooltip relative ql-editing  mx-4 my-2 rounded-lg overflow-hidden border-[1px] border-gray-400 mt-aut"
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
            disabled={getTextLength(text) === 0 || isLoading}
            className="disabled:bg-zinc-300 hover:bg-opacity-70 transition bg-green-700 rounded-md absolute bottom-4 right-10  p-2"
          >
            <Send
              className={cn(
                "w-3 h-3 text-white",
                getTextLength(text) === 0 && "text-zinc-400"
              )}
            />
          </button>
        </form>
      </FormProvider>
      {image && (
        <div className="absolute bottom-6 left-7 ">
          <div className="relative">
            <img
              src={image}
              alt="file-img"
              className="w-[80px] h-[80px] rounded-2xl  object-cover"
            />
            <div
              onClick={clearAllImages}
              className="w-5 h-5 bg-black absolute hover:bg-zinc-400 transition cursor-pointer flex items-center justify-center top-0 right-0 rounded-full"
            >
              <XIcon className="w-3 h-3 text-white " />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
