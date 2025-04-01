"use client";
import React, { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import InviteMemberModal from "../modals/invite-member-modal";

function ModalProviders() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, []);

  if (!open) {
    return null;
  }
  return (
    <>
      <CreateServerModal />
      <CreateChannelModal />
      <InviteMemberModal />
    </>
  );
}

export default ModalProviders;
