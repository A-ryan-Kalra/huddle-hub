import { Channel, Member, Profile, Server } from "@prisma/client";
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
  | "deleteServer";

interface ModalData {
  server?: Server;
  channel?: Channel;
  member?: Member | (Member & { profile: Profile })[];
  channelType?: string;
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
