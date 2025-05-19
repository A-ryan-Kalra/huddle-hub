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
import { channel, channelOnMember } from "@prisma/client";
import { LoaderCircle } from "lucide-react";

function DeleteChannelModal() {
  const { type, onClose, data, onOpen } = useModal();
  const openModal = type === "deleteChannel";
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { channel } = data as {
    channel: channel & { members: channelOnMember[] };
  };

  const router = useRouter();

  const onSubmit = async () => {
    setIsLoading(true);
    const url = qs.stringifyUrl({
      url: `/api/channels/${channel.id}`,
      query: {
        serverId: params?.serverId,
      },
    });

    await axios.delete(url);
    setIsLoading(false);
    handleCancel();

    // router.refresh();
    window.location.reload();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={openModal} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          Delete Channel
        </DialogTitle>

        <DialogDescription className="text-center">
          Are you sure you want to delete the channel{" "}
          <span className="text-blue-800">{channel?.name}</span>?
        </DialogDescription>
        <div className=" mt-3 flex items-center justify-between w-full">
          <Button className="" onClick={handleCancel} variant={"default"}>
            Cancel
          </Button>
          <Button className="" variant={"primary"} onClick={onSubmit}>
            {!isLoading ? (
              "Confirm"
            ) : (
              <div>
                <LoaderCircle className="w-4 h-4 animate-spin" />
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteChannelModal;
