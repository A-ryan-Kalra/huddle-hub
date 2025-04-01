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
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

import { useOrigin } from "@/hooks/use-origin";

function InviteMemberModal() {
  const { type, onClose, data } = useModal();
  const openModal = type === "invite";
  const params = useParams();
  const origin = useOrigin();
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  console.log(server);
  const router = useRouter();

  const onSubmit = async () => {
    const url = qs.stringifyUrl({
      url: `/api/channels`,
      query: {
        serverId: params?.serverId,
      },
    });

    const res = await axios.post(url);

    console.log(res.data);
    router.refresh();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={openModal} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          Invite Friends
        </DialogTitle>

        <form onSubmit={onSubmit}>
          <div className="flex items-center w-full gap-y-5 flex-col justify-center">
            <Input
              // disabled={isLoading}
              value={inviteUrl}
              className="bg-zinc-400/30 border-none outline-none focus-visible:ring-0"
              placeholder="Enter a server Link"
            />
          </div>
          <DialogFooter className="mt-3">
            <Button
              className="disabled:bg-slate-500"
              // disabled={isLoading}
              variant={"primary"}
            ></Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteMemberModal;
