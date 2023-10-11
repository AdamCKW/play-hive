"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Edit } from "lucide-react";
import { User as NextAuthUser } from "next-auth";
import { useTranslations } from "next-intl";

interface User extends NextAuthUser {
    username?: string | null;
}

interface CreatePostButtonProps {
    user: Pick<User, "name" | "image" | "email" | "username" | "id">;
}

export function CreatePostButton({ user }: CreatePostButtonProps) {
    const { onOpen, data } = useModal();
    const t = useTranslations("root.posts.create.modal");

    return (
        <Button
            size="lg"
            className="w-full justify-start text-lg font-bold"
            onClick={() => {
                onOpen("createPost", {
                    user,
                });
            }}
        >
            <Edit className="mr-2 h-6 w-6" />
            {t("button")}
        </Button>
    );
}
