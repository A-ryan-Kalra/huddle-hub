"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import React, { useState } from "react";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { FileCheck2Icon, FileIcon, X, XCircleIcon } from "lucide-react";
import Link from "next/link";

interface FileUploadProps {
  onChange: (value: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}
function FileUpload({ onChange, endpoint, value }: FileUploadProps) {
  const [type, setType] = useState("");

  if (value && !type.includes("pdf")) {
    return (
      <div className="w-20 border-2 border-purple-500 shadow-md shadow-zinc-400 rounded-full relative h-20 ">
        <div
          onClick={() => onChange("")}
          className="absolute rounded-full p-0.5 top-1 -right-[2px] hover:opacity-90 cursor-pointer transition bg-black z-20"
        >
          <XCircleIcon className="w-4 h-4 text-white" />
        </div>
        <Image
          draggable={"false"}
          src={value}
          fill
          alt={value}
          className="rounded-full object-cover"
        />
      </div>
    );
  }

  if (value && type.includes("pdf")) {
    return (
      <div className="w-20 border-2 items-center flex justify-center border-purple-500 shadow-md shadow-zinc-400 rounded-full relative h-20 ">
        <div
          onClick={() => onChange("")}
          className="absolute rounded-full p-0.5 top-1 -right-[2px] hover:opacity-90 cursor-pointer transition bg-black z-20"
        >
          <XCircleIcon className="w-4 h-4 text-white" />
        </div>
        <Link href={value} target="_blank">
          <FileIcon className="text-indigo-700 h-14 w-14" />
        </Link>
      </div>
    );
  }

  return (
    <UploadDropzone
      className="cursor-pointer hover:bg-zinc-100 transition"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0]?.ufsUrl);
        setType(res[0]?.type);
      }}
    ></UploadDropzone>
  );
}

export default FileUpload;
