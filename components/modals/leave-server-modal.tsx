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

import { useOrigin } from "@/hooks/use-origin";

function LeaveServerModal() {
  const { type, onClose, data, onOpen } = useModal();
  const [loading, setLoading] = useState(false);
  const openModal = type === "leaveServer";
  const params = useParams();
  const origin = useOrigin();
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const router = useRouter();

  const onSubmit = async () => {
    const url = qs.stringifyUrl({
      url: `/api/servers/${params?.serverId}`,
    });

    await axios.delete(url);

    router.refresh();
    handleCancel();
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
        <DialogTitle className="text-2xl text-center">Leave Server</DialogTitle>

        <DialogDescription className="text-center">
          Are you sure you want to leave{" "}
          <span className="text-blue-800">{server?.name}</span>?
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

export default LeaveServerModal;
