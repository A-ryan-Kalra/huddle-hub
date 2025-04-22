import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import qs from "query-string";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";
import {
  Channel,
  ChannelOnMember,
  Member,
  Message,
  Profile,
} from "@prisma/client";

function DeleteMessageModal() {
  const { type, onClose, data, onOpen } = useModal();
  const openModal = type === "deleteMessage";
  const params = useParams();
  const { message } = data as {
    message?: Message & { member: Member & { profile: Profile } };
  };

  const router = useRouter();

  const onSubmit = async () => {
    const url = qs.stringifyUrl({
      url: `/api/socket/messages/${message?.id}`,
      query: {
        serverId: params?.serverId,
        channelId: message?.channelId,
      },
    });

    await axios.delete(url);

    handleCancel();
    router.refresh();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={openModal} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          Delete Message
        </DialogTitle>

        <DialogDescription className="text-center">
          Are you sure you want to delete this Message? <br />
          The message will be permanently deleted.
        </DialogDescription>
        <div className=" mt-3 flex items-center justify-between w-full">
          <Button className="" onClick={handleCancel} variant={"default"}>
            Cancel
          </Button>
          <Button className="" variant={"primary"} onClick={onSubmit}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteMessageModal;
