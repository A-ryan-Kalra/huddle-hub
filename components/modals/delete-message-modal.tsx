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
import { member, message, profile } from "@prisma/client";
import { Loader2Icon } from "lucide-react";

function DeleteMessageModal() {
  const { type, onClose, data, onOpen } = useModal();
  const openModal = type === "deleteMessage";
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const { message } = data as {
    message?: message & { member: member & { profile: profile } } & {
      conversationId: string;
    };
  };
  const router = useRouter();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const type = window.location.pathname?.split("/")[3];
      const url = qs.stringifyUrl({
        url: `/api/socket/${
          type === "conversations" ? "direct-messages" : "messages"
        }/${message?.id}`,
        query: {
          serverId: params?.serverId,
          ...(type === "channels" && {
            channelId: message?.channelId,
          }),
          ...(type === "conversations" && {
            conversationId: message?.conversationId,
          }),
        },
      });

      await axios.delete(url);

      handleCancel();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
          <Button
            disabled={isLoading}
            className=""
            variant={"primary"}
            onClick={onSubmit}
          >
            {isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteMessageModal;
