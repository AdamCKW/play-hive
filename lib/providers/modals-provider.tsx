"use client";

const CreateCommunityModal = dynamic(
    () => import("@/components/community/community-modal"),
    { ssr: false },
);
const EditCommunityModal = dynamic(
    () => import("@/components/community/edit-community-modal"),
    { ssr: false },
);
const ImageModal = dynamic(() => import("@/components/models/image-modal"), {
    ssr: false,
});
const PostModal = dynamic(
    () => import("@/components/posts/create/post-modal"),
    {
        ssr: false,
    },
);
const MessageFileModal = dynamic(
    () => import("@/components/messages/message-file-modal"),
    { ssr: false },
);

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <ImageModal />
            <PostModal />
            <CreateCommunityModal />
            <EditCommunityModal />
            <MessageFileModal />
        </>
    );
};
