import { channel, member, message, profile, server } from "@prisma/client";
import { create } from "zustand";
export type ModalType =
  | "createServer"
  | "createChannel"
  | "invite"
  | "customizeServer"
  | "customizeMember"
  | "leaveServer"
  | "searchModal"
  | "customizeChannel"
  | "deleteChannel"
  | "deleteServer"
  | "deleteMessage"
  | "openThread"
  | "replyToMessage"
  | "showChannelMembers";

interface ModalData {
  server?: server;
  channel?: channel;
  member?: member | (member & { profile: profile })[];
  channelType?: string;
  message?: message & { member: member & { profile: profile } };
  [key: string]: any;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
