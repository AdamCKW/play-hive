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

import { CreatePost } from "./create-post";
import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal-store";

interface User extends NextAuthUser {
    username?: string | null;
}

interface PostModal {
    // user: Pick<User, "name" | "image" | "email" | "username" | "id">;
}

export function PostModal({}: PostModal) {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "createPost";
    const { user } = data;

    const t = useTranslations("root.posts.create.modal");

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            {/* <DialogTrigger asChild>
                <div>
                    <Edit className="h-6 w-6 cursor-pointer text-neutral-600 hover:text-current md:hidden" />
                    <div className="hidden md:block">
                        <Button
                            size="lg"
                            className="w-full justify-start text-lg font-bold"
                        >
                            <Edit className="mr-2 h-6 w-6" />
                            {t("button")}
                        </Button>
                    </div>
                </div>
            </DialogTrigger> */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-3">{t("title")}</DialogTitle>
                </DialogHeader>

                <CreatePost user={user!} setOpen={onClose} />
            </DialogContent>
        </Dialog>
    );
}
