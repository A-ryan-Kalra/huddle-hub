import { Channel, Server } from "@prisma/client";
import { create } from "zustand";
export type ModalType = "createServer";

interface ModalData {
  server?: Server;
  channel?: Channel;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data?: ModalData;
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
