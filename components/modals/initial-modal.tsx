"use client";
import React, { useEffect, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../ui/file-upload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import qs from "query-string";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { SignOutButton, useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
});
function InitialModal() {
  const { sessionId } = useAuth();

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      name: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const url = qs.stringifyUrl({
      url: "/api/servers",
    });

    await axios.post(url, values);

    form.reset();
    router.refresh();
    router.push("/");
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          Customize Your Server
        </DialogTitle>
        <DialogDescription className="text-center text-zinc-500 text-sm">
          Let's bring your server to life with a unique name and a custom image!
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const isSignout =
                (e.nativeEvent as SubmitEvent).submitter?.id === "signOut";

              if (!isSignout) form.handleSubmit(onSubmit)();
            }}
          >
            <div className="flex items-center w-full gap-y-5 flex-col justify-center">
              <div className="flex items-center justify-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          {...field}
                          value={field.value}
                          endpoint="serverImage"
                          onChange={(imgUrl) => field.onChange(imgUrl)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold text-xs">
                        Server Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-400/30 border-none outline-none focus-visible:ring-0"
                          placeholder="Enter Server Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-3 flex items-center ">
              <div className="mr-auto">
                <SignOutButton
                  signOutOptions={{ sessionId: sessionId as string }}
                >
                  <Button
                    variant={"ghost"}
                    id="signOut"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:bg-red-500 hover:text-white bg-white border-[1px] duration-300 transition"
                  >
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
              <Button
                className="disabled:bg-slate-500 ml-auto"
                disabled={isLoading}
                type="submit"
                variant={"primary"}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default InitialModal;
