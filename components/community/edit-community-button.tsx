"use client";

import { useModal } from "@/hooks/use-modal-store";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ICommunity } from "@/types/db";

interface EditCommunityButtonProps {
    community: ICommunity;
}

export default function EditCommunityButton({
    community,
}: EditCommunityButtonProps) {
    const t = useTranslations("communication.community");
    const { onOpen, data } = useModal();
    return (
        <Button
            onClick={() => {
                onOpen("editCommunity", { community });
            }}
            className="w-full"
            variant="outline"
        >
            {t("edit_button")}
        </Button>
    );
}
