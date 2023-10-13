import { create } from "zustand";
import { User as NextAuthUser } from "next-auth";

export type ModalType =
    | "users"
    | "messageFile"
    | "deleteMessage"
    | "imageModal"
    | "createPost"
    | "createCommunity";

interface User extends NextAuthUser {
    username?: string | null;
}

interface ModalData {
    apiUrl?: string;
    query?: Record<string, any>;
    imageUrl?: string;
    user?: Pick<User, "name" | "image" | "email" | "username" | "id">;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));
