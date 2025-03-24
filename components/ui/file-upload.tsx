"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import React from "react";
import "@uploadthing/react/styles.css";

function FileUpload() {
  return <UploadDropzone endpoint={"serverImage"}></UploadDropzone>;
}

export default FileUpload;
