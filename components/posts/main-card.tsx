import { experimental_useOptimistic as useOptimistic } from "react";
import Image from "next/image";
import { Post, Prisma } from "@prisma/client";

import { IPost } from "@/types/db";

import { UserAvatar } from "../user-avatar";
import Controls from "./controls";
import MoreMenu from "./more-menu";
import NameLink from "./name-link";
import Timestamp from "./timestamp";

import ImageComponent from "./image";
import { redirect } from "next/navigation";
import { nFormatter } from "@/lib/utils";
import Viewer from "./viewer";
import { useTranslations } from "next-intl";

interface MainCardProps {
    data: IPost;
    queryKey?: string[];
}

export default function MainCard({ data, queryKey }: MainCardProps) {
    const likesCount = nFormatter(data._count.likes, 1);
    const childrenCount = nFormatter(data._count.children, 1);
    const t = useTranslations("root.posts.card.display");

    return (
        <div className="flex flex-col space-y-3 border-b px-3 py-4 dark:border-neutral-900">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <UserAvatar
                        className="overflow-hidden"
                        user={{
                            name: data.author.name!,
                            image: data.author.image!,
                        }}
                    />
                    <NameLink author={data.author} />
                </div>
                <div className="flex items-center space-x-2">
                    <MoreMenu
                        name={data.author.name!}
                        id={data.id}
                        author={data.author.id!}
                    />
                </div>
            </div>
            <div className="w-full">
                {!data.text && data.communityId ? (
                    <Viewer content={data.content} />
                ) : (
                    <div className={`text-left text-base/relaxed`}>
                        {data.text}
                    </div>
                )}

                {data.images?.length > 0 ? (
                    <div
                        className={`grid ${
                            data.images.length >= 2 ? "grid-cols-2" : ""
                        } gap-2 pt-4 `}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <ImageComponent images={data.images} />
                    </div>
                ) : null}

                <Controls data={data} single={true} queryKey={queryKey} />

                <div className="text-muted-foreground flex items-center space-x-2 ">
                    {data._count.children > 0 && (
                        <div className="text-muted-foreground ">
                            {childrenCount}{" "}
                            {data._count.children === 1
                                ? t("reply")
                                : t("replies")}
                        </div>
                    )}

                    {data._count.children > 0 && data._count.likes > 0 && (
                        <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                    )}

                    {data._count.likes > 0 && (
                        <div className=" text-muted-foreground ">
                            {likesCount}{" "}
                            {data._count.likes === 1 ? t("like") : t("likes")}
                        </div>
                    )}

                    {(data._count.children > 0 || data._count.likes > 0) &&
                    data.communityId &&
                    data.community?.name ? (
                        <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                    ) : null}

                    {!data.text && data.communityId && data.community?.name ? (
                        <>
                            <div
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                    redirect(`/c/${data.community?.name}`);
                                }}
                            >
                                c/{data.community?.name}
                            </div>
                        </>
                    ) : null}

                    {data._count.children > 0 ||
                    data._count.likes > 0 ||
                    (data.communityId && data.community?.name) ? (
                        <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                    ) : null}

                    <Timestamp time={data.createdAt} />
                </div>
            </div>
        </div>
    );
}
