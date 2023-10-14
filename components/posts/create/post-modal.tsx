"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { User as NextAuthUser } from "next-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal-store";
import dynamic from "next/dynamic";

const CreatePost = dynamic(() => import("./create-post"), {});

interface User extends NextAuthUser {
    username?: string | null;
}

interface PostModal {
    user?: Pick<User, "name" | "image" | "email" | "username" | "id">;
}

export default function PostModal({}: PostModal) {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "createPost";
    const { user } = data;

    const t = useTranslations("root.posts.create.modal");

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-3">{t("title")}</DialogTitle>
                </DialogHeader>

                {isModalOpen && <CreatePost user={user!} setOpen={onClose} />}
            </DialogContent>
        </Dialog>
    );
}
