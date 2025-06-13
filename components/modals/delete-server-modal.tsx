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
import { Loader2Icon } from "lucide-react";

function DeleteServerModal() {
  const { type, onClose, data, onOpen } = useModal();
  const openModal = type === "deleteServer";
  const params = useParams();
  const { server } = data;
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    setIsLoading(true);
    const url = qs.stringifyUrl({
      url: `/api/servers/${params?.serverId}`,
    });

    await axios.delete(url);
    await fetch("/api/socket/reload"); // reload pages
    setIsLoading(false);

    router.refresh();
    handleCancel();
  };

  const handleCancel = () => {
    onClose();
    setIsLoading(false);
  };

  return (
    <Dialog open={openModal} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          Delete Server
        </DialogTitle>

        <DialogDescription className="text-center">
          Are you sure you want to delete the server{" "}
          <span className="text-blue-800">{server?.name}</span>?
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

export default DeleteServerModal;
