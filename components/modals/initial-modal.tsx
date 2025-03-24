"use client";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "../ui/dialog";

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

  return (
    <Dialog open>
      <DialogContent>Customize Your Server</DialogContent>
    </Dialog>
  );
}

export default InitialModal;
