"use client";
import React, { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import InviteMemberModal from "../modals/invite-member-modal";
import ServerSettingsModal from "../modals/server-settings-modal";
import ManageMemberModal from "../modals/manage-member-modal";
import LeaveServerModal from "../modals/leave-server-modal";
import { SearchModal } from "../modals/search-modal";
import CustomizeChannelModal from "../modals/customize-channel-modal";
import DeleteServerModal from "../modals/delete-server-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";
import DeleteMessageModal from "../modals/delete-message-modal";

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
      <ServerSettingsModal />
      <ManageMemberModal />
      <LeaveServerModal />
      <SearchModal />
      <CustomizeChannelModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <DeleteMessageModal />
    </>
  );
}

export default ModalProviders;
