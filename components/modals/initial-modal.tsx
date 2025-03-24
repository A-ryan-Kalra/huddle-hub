"use client";
import React, { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import FileUpload from "../ui/file-upload";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

function InitialModal() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      name: "",
    },
  });

  const onSubmit = () => {};
  const [open, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)}>click</button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="text-2xl text-center">
            Customize Your Server
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Let's bring your server to life with a unique name and a custom
            image!
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FileUpload />
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InitialModal;
