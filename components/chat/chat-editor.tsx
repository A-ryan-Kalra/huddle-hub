"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { ImageUpIcon } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

export default function TemplateDemo() {
  const [text, setText] = useState<string>("");
  const [show, setShow] = useState(false);
  const imageReference = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  console.log(image);

  const { uploadFiles } = generateReactHelpers<OurFileRouter>();
  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    console.log(file);
    // 1. Upload image to UploadThing
    const res = await uploadFiles("messageFile", {
      files: [file],
    });

    console.log(res[0].ufsUrl);

    // Example: Upload file to your backend or storage

    setImage(event.target.files![0]);
  }

  const renderHeader = () => {
    return (
      <div id="toolbar-containe">
        {show && (
          <>
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
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    setShow(true);
  }, []);
  const header = renderHeader();
  // console.log(text);
  return (
    <div className="flex flex-1 w-full bg-   px-4 py-2  overflow-hidden max-h-fit">
      <Editor
        className="ql-tooltip ql-editing w-full rounded-lg overflow-hidden border-[1px] border-gray-400 mt-auto"
        value={text}
        onTextChange={(e: EditorTextChangeEvent) =>
          setText(e.htmlValue as string)
        }
        headerTemplate={header}
        style={{
          maxHeight: "125px",
          minHeight: "100px",
          fontSize: "16px",
          overflowY: "auto",
        }}
      />
    </div>
  );
}
