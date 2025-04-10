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
import {
  Channel,
  ChannelOnMember,
  ChannelType,
  ChannelVisibility,
  Member,
  Profile,
} from "@prisma/client";
import { Switch } from "../ui/switch";

import { MultiSelect } from "../ui/multi-select";
import Image from "next/image";
import { toast } from "sonner";

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

function CustomizeChannelModal() {
  const { type, onClose, data } = useModal();
  const openModal = type === "customizeChannel";
  const { channel, member } = data as {
    channel: Channel & {
      members: (ChannelOnMember & { member: Member & { profile: Profile } })[];
    };
    member: (Member & { profile: Profile })[];
  };

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
  const [selectedMembers, setSelectedMembers] = useState([""]);

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
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel.id}`,
        query: {
          serverId: params?.serverId,
        },
      });
      const res = await axios.patch(url, values);
      console.log(res.data);

      toast("Success", {
        description: "Channel Created Successfully",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
      // close();
      router.refresh();
    } catch (error: Error | any) {
      toast("Error", {
        description:
          "Something went wrong please check console for more details" +
          error.message,
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
      console.error(error);
    }
  };

  const close = () => {
    onClose();
    setShowMember(false);
    setAllMembers([]);
    setSelectedMembers([]);
  };
  const channelOwnerMemberId = channel?.members?.find(
    (member) => member.member.profileId === channel.profileId
  );

  useEffect(() => {
    if (channel?.members?.length > 0) {
      let memberId: string[] = [""];
      setAllMembers(
        member?.map((profile) => {
          memberId.push(profile.id);
          return {
            label: profile.profile.name,
            value: profile.id,
            icon: () => (
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  fill
                  className="object-cover"
                  src={profile.profile.imageUrl}
                  alt={profile.profile.imageUrl}
                />
              </div>
            ),
          };
        })
      );
      setSelectedMembers(
        channel.members
          .filter((member) => memberId.includes(member.memberId))
          .map((id) => id.memberId)
      );
    }
    if (channel) {
      setShowMember(channel.visibility === "PRIVATE" ? true : false);
      form.setValue("name", channel.name);
      form.setValue("visibility", channel.visibility);
      form.setValue("type", channel.type);
      form.setValue(
        "members",
        channel.members.map((member) => member.memberId)
      );
      channel.members;
    }
  }, [data, type]);

  return (
    <Dialog open={openModal} onOpenChange={close}>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          Customize a channel
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
                            defaultValue={selectedMembers}
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
                {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CustomizeChannelModal;
