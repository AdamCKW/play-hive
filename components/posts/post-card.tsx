import Link from "next/link";
import { Prisma } from "@prisma/client";

import { IPost } from "@/types/db";
import { cn, nFormatter } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import NameLink from "./name-link";
import Others from "./others";
import MoreMenu from "./more-menu";
// import ImageComponent from "./image";
import Controls from "./controls";
import { redirect } from "next/navigation";
import Timestamp from "./timestamp";
import Viewer from "./viewer";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";

const ImageComponent = dynamic(() => import("./image"), {
    loading: () => <Skeleton className="h-full w-full" />,
});

interface PostCardProps {
    data: IPost;
    comment?: boolean;
    noLink?: boolean;
    parent?: boolean;
    single?: boolean;
    queryKey?: string[];
}

export default function PostCard({
    data,
    comment = false,
    noLink = false,
    parent = false,
    single = false,
    queryKey,
}: PostCardProps) {
    const mainClass = parent
        ? "flex space-x-2 px-3 pt-4"
        : comment
        ? `flex space-x-2 ${noLink && "pointer-events-none"}`
        : `flex space-x-2 border-b px-3 py-4 dark:border-neutral-900 ${
              noLink && "pointer-events-none"
          }`;

    const likesCount = nFormatter(data._count.likes, 1);
    const childrenCount = nFormatter(data._count.children, 1);
    const t = useTranslations("root.posts.card.display");

    return (
        <>
            <Link href={`/p/${data.id}`} className={mainClass}>
                <div className="flex flex-col items-center justify-between">
                    <UserAvatar
                        user={{
                            name: data.author.name!,
                            image: data.author.image!,
                        }}
                    />

                    <div className="bg-primary/40 relative w-0.5 grow" />
                    {comment || parent ? null : (
                        <Others others={data.children} />
                    )}
                </div>

                <div className="w-full space-y-1">
                    <div className="flex w-full items-center justify-between">
                        <NameLink author={data.author} />
                        {comment ? null : (
                            <div className="flex items-center space-x-2">
                                <MoreMenu
                                    name={data.author.name!}
                                    id={data.id}
                                    author={data.author.id!}
                                />
                            </div>
                        )}
                    </div>
                    {!data.text && data.communityId ? (
                        <div
                            style={{ overflow: "clip" }}
                            className={`relative max-h-40 text-sm ${
                                comment ? "w-80" : "w-full"
                            }`}
                        >
                            <Viewer content={data.content} />

                            <div className="from-background absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t to-transparent" />
                        </div>
                    ) : (
                        <div
                            className={`text-left text-base/relaxed ${
                                comment && "pb-3"
                            }`}
                        >
                            {data.text}
                        </div>
                    )}

                    {comment ? null : data.images?.length > 0 ? (
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

                    {comment ? null : (
                        <>
                            <Controls
                                data={data}
                                single={single}
                                queryKey={queryKey}
                            />

                            <div className="text-muted-foreground flex items-center space-x-2 ">
                                {data._count.children > 0 && (
                                    <div className="text-muted-foreground ">
                                        {childrenCount}{" "}
                                        {data._count.children === 1
                                            ? t("reply")
                                            : t("replies")}
                                    </div>
                                )}

                                {data._count.children > 0 &&
                                    data._count.likes > 0 && (
                                        <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                                    )}

                                {data._count.likes > 0 && (
                                    <div className=" text-muted-foreground ">
                                        {likesCount}{" "}
                                        {data._count.likes === 1
                                            ? t("like")
                                            : t("likes")}
                                    </div>
                                )}

                                {(data._count.children > 0 ||
                                    data._count.likes > 0) &&
                                data.communityId &&
                                data.community?.name ? (
                                    <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                                ) : null}

                                {!data.text &&
                                data.communityId &&
                                data.community?.name ? (
                                    <>
                                        <div
                                            className="text-muted-foreground hover:text-foreground"
                                            onClick={() => {
                                                redirect(
                                                    `/c/${data.community?.name}`,
                                                );
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
                        </>
                    )}
                </div>
            </Link>
        </>
    );
}
