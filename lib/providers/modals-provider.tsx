"use client";

import { ImageModal } from "@/components/models/image-modal";
import { PostModal } from "@/components/posts/create/post-modal";
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
        </>
    );
};
