"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Icons } from "@/components/icons";
import { useModal } from "@/hooks/use-modal-store";
import { useTranslations } from "next-intl";

interface ImageModalProps {}

export function ImageModal({}: ImageModalProps) {
    const { isOpen, onClose, type, data } = useModal();
    const tImage = useTranslations("root.image");

    const isModalOpen = isOpen && type === "imageModal";
    const { imageUrl } = data;

    const handleClose = () => {
        onClose();
    };

    if (isModalOpen)
        return (
            <>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
                    <div className="relative h-screen w-screen">
                        <div className="relative z-20 m-5 flex">
                            <button
                                className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                                onClick={handleClose}
                            >
                                <span className="sr-only">
                                    {tImage("close")}
                                </span>
                                <Icons.close />
                            </button>
                        </div>

                        <div className="absolute inset-0 my-5">
                            <div className="flex h-screen items-center justify-center">
                                <div className="w-1/2">
                                    <Image
                                        fill
                                        src={imageUrl!}
                                        className="rounded object-contain"
                                        sizes="(max-width: 640px) 100vw,
                                        (max-width: 1280px) 50vw,
                                        (max-width: 1536px) 33vw"
                                        alt={tImage("enlarged_alt")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
}
