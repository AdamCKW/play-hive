"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import NSFWFilter from "@/lib/nsfw";
import { UploadDropzone } from "@/lib/uploadthing";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "userAvatar" | "userBanner" | "communityImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
    const fileType = value?.split(".").pop();
    const tToast = useTranslations("toast");

    if (value && fileType !== "pdf") {
        if (endpoint === "messageFile" || endpoint === "userBanner") {
            return (
                <div className="relative h-40 w-52">
                    <Image
                        fill
                        src={value}
                        alt="Upload"
                        className="object-cover"
                    />
                    <button
                        onClick={() => onChange("")}
                        className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            );
        } else
            return (
                <div className="flex items-center justify-center">
                    <div className="relative h-32 w-32">
                        <Image
                            fill
                            src={value}
                            alt="upload"
                            className="rounded-full"
                        />
                        <button
                            onClick={() => onChange("")}
                            className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            );
    }

    if (value && fileType === "pdf") {
        return (
            <div className="bg-background/10 relative mt-2 flex items-center rounded-md p-2">
                <FileIcon className="fill-background stroke-foreground h-10 w-10" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm  hover:underline "
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange("")}
                    className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={async (res) => {
                const { data } = await axios.get(res?.[0].url!, {
                    responseType: "blob",
                });

                const isSafe = await NSFWFilter.isSafe(data);

                if (isSafe) {
                    onChange(res?.[0].url);
                } else {
                    toast({
                        title: tToast("upload.nsfw.title"),
                        description: tToast("upload.nsfw.description"),
                        variant: "destructive",
                    });
                }
            }}
            onUploadError={(error: Error) => {
                console.log(error);
            }}
        />
    );
};
