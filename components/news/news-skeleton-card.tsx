import { removeHtmlTags, rgbDataURL, splitDate } from "@/lib/utils";
import { ExtendedMetadata } from "@/types";
import { Article } from "@/types/article";
import { useTranslations } from "next-intl";
import { getTranslator } from "next-intl/server";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

interface NewsSkeletonCardProps {}

export default function NewsSkeletonCard({}: NewsSkeletonCardProps) {
    return (
        <article className="flex border-b">
            <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
                <Skeleton className="w-full rotate-180 p-2" />
            </div>

            <div className="hidden sm:block sm:basis-56">
                <Skeleton className="h-56 w-56 rounded-none" />
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-1/2" />
                    <Skeleton className="mt-4 h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-10/12" />
                    <Skeleton className="mt-2 h-4 w-1/2" />
                </div>

                <div className="sm:flex sm:items-end sm:justify-end">
                    <Skeleton className="h-10 w-28 rounded-none" />
                </div>
            </div>
        </article>
    );
}
