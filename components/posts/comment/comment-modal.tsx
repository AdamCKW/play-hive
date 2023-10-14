"use client";

import { useState } from "react";
import { Prisma } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";

import { IPost } from "@/types/db";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// import CreateComment from "./create-comment";
import PostCard from "../post-card";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import CreateComment from "./create-comment";
// const CreateComment = dynamic(() => import("./create-comment"));

interface CommentModalProps {
    data: IPost;
    single?: boolean;
    queryKey?: string[];
}
export default function CommentModal({
    data,
    single,
    queryKey,
}: CommentModalProps) {
    const [open, setOpen] = useState<boolean>(false);
    const { data: session } = useSession();
    const tComments = useTranslations("root.comments");

    if (!session || !session.user) return null;

    const handleParentClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        // Move e.stopPropagation() to a more specific element identified by its id
        let target = e.target as HTMLElement | null;
        while (target) {
            if (target.id === "reply-modal") {
                e.stopPropagation();
                break;
            }
            target = target.parentElement;
        }
    };

    return (
        <>
            <button
                className="group rounded-full hover:text-blue-600 hover:dark:text-blue-500"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-full group-hover:bg-blue-600/5 dark:group-hover:bg-blue-300/20">
                    <span className="sr-only">
                        {tComments("comment_button")}
                    </span>
                    <MessageCircle className="h-5 w-5" />
                </span>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent id="reply-modal" onClick={handleParentClick}>
                    <DialogHeader>
                        <DialogTitle className="mb-3">
                            {tComments("heading")}
                        </DialogTitle>
                    </DialogHeader>
                    {open && (
                        <>
                            <PostCard data={data} noLink comment />
                            <CreateComment
                                setOpen={setOpen}
                                itemData={data}
                                single={single}
                                queryKey={queryKey}
                            />
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
