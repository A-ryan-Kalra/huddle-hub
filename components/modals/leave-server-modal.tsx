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

    const res = await axios.delete(url);

    // onOpen("invite", { server: res.data });
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
