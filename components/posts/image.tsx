"use client";

import { Prisma } from "@prisma/client";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { rgbDataURL } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import { useTranslations } from "next-intl";

interface ImageComponentProps {
    images: Prisma.ImagesGetPayload<{}>[];
}

export default function ImageComponent({ images }: ImageComponentProps) {
    const { onOpen } = useModal();

    const tImage = useTranslations("root.image");
    return (
        <>
            {images.map((image: Prisma.ImagesGetPayload<{}>, index: number) => (
                <div
                    key={image.id}
                    className={`flex max-w-[35.938rem] hover:cursor-pointer ${
                        images.length === 3
                            ? index === 0
                                ? "row-span-2"
                                : "max-h-[23.438rem]"
                            : ""
                    }`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onOpen("imageModal", {
                            imageUrl: image.url,
                        });
                    }}
                >
                    <AspectRatio ratio={16 / 9}>
                        <Image
                            alt={tImage("alt")}
                            fill
                            placeholder="blur"
                            blurDataURL={rgbDataURL(220, 220, 220)}
                            src={image.url}
                            className={`
                                        object-cover
                                        ${images.length === 1 && "rounded-lg"}
                                            ${
                                                images.length === 2
                                                    ? index === 0
                                                        ? "rounded-l-lg"
                                                        : "rounded-r-lg"
                                                    : ""
                                            } ${
                                                images.length === 3
                                                    ? index === 0
                                                        ? "rounded-l-lg"
                                                        : index === 1
                                                        ? "rounded-tr-lg"
                                                        : "rounded-br-lg"
                                                    : ""
                                            } ${
                                                images.length === 4
                                                    ? index === 0
                                                        ? "rounded-tl-lg"
                                                        : index === 1
                                                        ? "rounded-tr-lg"
                                                        : index === 2
                                                        ? "rounded-bl-lg"
                                                        : "rounded-br-lg"
                                                    : ""
                                            }`}
                            sizes="(max-width: 640px) 100vw,
                                            (max-width: 1280px) 50vw,
                                            (max-width: 1536px) 33vw,
                                            25vw"
                        />
                    </AspectRatio>
                </div>
            ))}
        </>
    );
}
