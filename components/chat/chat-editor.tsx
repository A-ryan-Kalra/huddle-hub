"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { ImageUpIcon, Send, XIcon } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/lib/utils";

export default function TemplateDemo() {
  const [text, setText] = useState<string>("<p></p>");
  const [show, setShow] = useState(false);
  const imageReference = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>("");
  // const [wordLimit,setWordLimit]=useState
  console.log(image);

  const { uploadFiles } = generateReactHelpers<OurFileRouter>();
  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
    if (!file) return;
    console.log(file);
    // 1. Upload image to UploadThing
    const res = await uploadFiles("messageFile", {
      files: [file],
    });

    console.log(res[0].ufsUrl);
  }
  console.log(text);
  const renderHeader = () => {
    return (
      <div id="toolbar-containe">
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
                  className=""
                >
                  <ImageUpIcon />
                </button>
              </span>
            </div>

            <button style={{ width: "100px" }} className="">
              {getTextLength(text) + ` / 1000`}
            </button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setShow(true);
  }, []);
  const getTextLength = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.innerText.length;
  };
  const header = renderHeader();
  // console.log(text);
  return (
    <div className="flex flex-1 flex-col w-full bg-blac relative   rounded-lg   overflow-hidden max-h-fit">
      <Editor
        className="ql-tooltip relative ql-editing  mx-4 my-2 rounded-lg overflow-hidden border-[1px] border-gray-400 mt-aut"
        value={text}
        maxLength={1000}
        onTextChange={(e: EditorTextChangeEvent) =>
          setText(e.htmlValue as string)
        }
        headerTemplate={header}
        style={{
          maxHeight: "225px",
          minHeight: "100px",
          paddingBottom: image && "100px",
          fontSize: "16px",
          overflowY: "auto",
        }}
      />
      <button
        disabled={!text}
        className="disabled:bg-zinc-300 hover:bg-opacity-70 transition bg-green-700 rounded-md absolute bottom-4 right-6  p-2"
      >
        <Send className={cn("w-3 h-3 text-white", !text && "text-zinc-400")} />
      </button>
      {image && (
        <div className="absolute bottom-5 left-7 ">
          <div className="relative">
            <img
              src={image}
              alt="file-img"
              className="w-[80px] h-[80px] rounded-2xl  object-cover"
            />
            <div
              onClick={() => setImage("")}
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
