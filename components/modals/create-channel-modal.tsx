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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../ui/file-upload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import qs from "query-string";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Icon, Loader2, Lock, PiIcon } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChannelType, ChannelVisibility } from "@prisma/client";
import { Switch } from "../ui/switch";

import { MultiSelect } from "../ui/multi-select";
import Image from "next/image";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Channel Name is required" })
      .refine((name) => name !== "general", {
        message: "Channel name cannot be 'general'",
      }),
    type: z.nativeEnum(ChannelType),
    visibility: z.nativeEnum(ChannelVisibility),
    members: z.array(z.string()),
  })
  .refine(
    (data) => {
      if (
        data.visibility === ChannelVisibility.PRIVATE &&
        data.members.length === 0
      ) {
        return false;
      }
      return true;
    },
    {
      path: ["members"],
      message: "Members cannot be empty when channel is private",
    }
  );

function CreateChannelModal() {
  const { type, onClose, data } = useModal();
  const openModal = type === "createChannel";
  const { member } = data;

  const params = useParams();
  const [showMember, setShowMember] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [allMembers, setAllMembers] = useState<
    {
      label: string;
      value: string;
      icon: React.ComponentType<{ className?: string }>;
    }[]
  >([]);

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: ChannelType.TEXT,
      name: "",
      visibility: ChannelVisibility.PUBLIC,
      members: [],
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      // console.log(values);
      // const url = qs.stringifyUrl({
      //   url: `/api/channels`,
      //   query: {
      //     serverId: params?.serverId,
      //   },
      // });
      // const res = await axios.post(url, values);
      // console.log(res.data);
      // close();
      // router.refresh();
      // onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const close = () => {
    form.reset();
    onClose();
    setShowMember(false);
  };

  useEffect(() => {
    if (Array.isArray(member) && member.length > 0) {
      setAllMembers(
        member.map((person) => ({
          label: person.profile.name,
          value: person.id,
          icon: () => (
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image
                fill
                className="object-cover"
                src={person.profile.imageUrl}
                alt="person.profile.imageUrl"
              />
            </div>
          ),
        }))
      );
    }
  }, [member]);

  return (
    <Dialog open={openModal} onOpenChange={close}>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          Create a new channel
        </DialogTitle>
        <DialogDescription className="text-center text-zinc-500 text-sm">
          Let's give your channel a unique name!
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center w-full gap-y-5 flex-col justify-center">
              <div className=" w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold text-xs">
                        channel Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-400/30 border-none outline-none focus-visible:ring-0"
                          placeholder="Enter a channel name"
                          {...field}
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold text-xs">
                        channel type
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-full bg-zinc-400/30 border-none outline-none focus-visible:ring-0">
                            <SelectValue placeholder="Select a channel type" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectGroup>
                              <SelectLabel>Select Type</SelectLabel>
                              <SelectItem value="TEXT">Text</SelectItem>
                              <SelectItem value="AUDIO">Audio</SelectItem>
                              <SelectItem value="VIDEO">Video</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center">
                          <Lock className="w-5 h-5 text-zinc-800" />
                          Private Channel
                        </FormLabel>
                        <FormDescription>
                          Only selected members will be able to view this
                          channel.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value !== "PUBLIC"}
                          onCheckedChange={(e) => {
                            field.onChange(e === true ? "PRIVATE" : "PUBLIC");
                            setShowMember(
                              form.getValues("visibility") === "PRIVATE"
                            );
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {showMember && (
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start ">
                        <FormControl>
                          <MultiSelect
                            modalPopover={true}
                            {...field}
                            placeholder="Select members"
                            className=" justify-between rounded-lg border  shadow-sm"
                            options={allMembers ?? []}
                            onValueChange={field.onChange}
                            maxCount={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <DialogFooter className="mt-3">
              <Button
                className="disabled:bg-slate-500"
                disabled={isLoading}
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

export default CreateChannelModal;
