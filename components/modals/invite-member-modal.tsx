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
import { Check, Copy, Loader2, RefreshCcw } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

import { useOrigin } from "@/hooks/use-origin";
import { memberRole } from "@prisma/client";

function InviteMemberModal() {
  const { type, onClose, data, onOpen } = useModal();
  const [loading, setLoading] = useState(false);
  const openModal = type === "invite";
  const params = useParams();
  const origin = useOrigin();
  const { server, member } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const router = useRouter();

  const onSubmit = async () => {
    const url = qs.stringifyUrl({
      url: `/api/servers/${params?.serverId}/invite-code`,
      query: {
        serverId: params?.serverId,
      },
    });

    const res = await axios.put(url);

    onOpen("invite", { server: res.data });
    router.refresh();
  };

  const handleCancel = () => {
    onClose();
  };

  const onCopy = () => {
    setLoading(true);
    navigator.clipboard.writeText(inviteUrl);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={openModal} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          Invite People
        </DialogTitle>

        <div className="flex items-center w-full gap-x-3 justify-center">
          <Input
            value={inviteUrl}
            className="bg-zinc-400/30 border-none outline-none focus-visible:ring-0"
            placeholder="Enter a server Link"
          />
          <button
            type="button"
            onClick={onCopy}
            className="bg-zinc-100 hover:bg-zinc-200 transition flex items-center p-2 rounded-md"
          >
            {!loading ? (
              <Copy className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
        </div>

        <DialogFooter className="mt-3 flex flex-col gap-y-0">
          <Button
            className="mr-auto text-zinc-500 flex items-center"
            variant={"link"}
            onClick={onSubmit}
            disabled={(member as any)?.role !== memberRole.ADMIN}
          >
            Generate a new link <RefreshCcw className="w-4 h-4" />
          </Button>
          {(member as any)?.role !== memberRole.ADMIN && (
            <p className="text-xs text-red-500">
              Only admins are allowed to generate a new link.
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InviteMemberModal;
