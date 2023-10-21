import { nFormatter } from "@/lib/utils";
import { IPost } from "@/types/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import Timestamp from "./timestamp";
import { useTranslations } from "next-intl";
import Others from "./others";

interface DeletedCardProps {
    data: IPost;
    comment?: boolean;
    noLink?: boolean;
    parent?: boolean;
    single?: boolean;
}

export default function DeletedCard({
    data,
    comment = false,
    noLink = false,
    parent = false,
    single = false,
}: DeletedCardProps) {
    const mainClass = parent
        ? "flex space-x-2 px-3 pt-4"
        : comment
        ? `flex space-x-2 ${noLink && "pointer-events-none"}`
        : `flex space-x-2 border-b px-3 py-4 dark:border-neutral-900 ${
              noLink && "pointer-events-none"
          }`;
    const t = useTranslations("root.posts.card.display");
    const likesCount = nFormatter(data._count.likes, 1);
    const childrenCount = nFormatter(data._count.children, 1);

    if (noLink) {
        return (
            <div className="flex flex-col space-y-3 border-b px-3 py-4 dark:border-neutral-900">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/40 h-10 w-10 rounded-full" />
                    <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                    <Timestamp time={data.createdAt} />
                </div>

                <div className="w-full">
                    <div
                        className={`text-muted-foreground text-left text-base/relaxed italic`}
                    >
                        {t("deleted")}
                    </div>

                    <div className="relative h-[1.125rem]" />
                    <div className="text-muted-foreground flex items-center space-x-2 text-sm md:text-base">
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
                                {data._count.likes === 1
                                    ? t("like")
                                    : t("likes")}
                            </div>
                        )}

                        {(data._count.children > 0 || data._count.likes > 0) &&
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
                                        redirect(`/c/${data.community?.name}`);
                                    }}
                                >
                                    c/{data.community?.name}
                                </div>
                            </>
                        ) : null}

                        {/* {data._count.children > 0 ||
                        data._count.likes > 0 ||
                        (data.communityId && data.community?.name) ? (
                            <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                        ) : null}

                        <Timestamp time={data.createdAt} /> */}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link href={`/p/${data.id}`} className={mainClass}>
            <div className="flex flex-col items-center justify-between">
                <div className="bg-primary/40 h-10 w-10 rounded-full" />
                <div className="bg-primary/40 relative w-0.5 grow" />
                {comment || parent ? null : <Others others={data.children} />}
            </div>
            <div className="w-full space-y-1">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <div className="h-6 w-0.5" />
                            <div className="h-4 w-0.5" />
                        </div>

                        <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                        <Timestamp time={data.createdAt} />
                    </div>
                </div>

                <div
                    className={`text-muted-foreground text-left text-base/relaxed italic`}
                >
                    {t("deleted")}
                </div>

                {comment ? null : (
                    <>
                        <div className="relative h-[1.125rem]" />
                        <div className="text-muted-foreground flex items-center space-x-2 text-sm md:text-base">
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

                            {/* {data._count.children > 0 ||
                            data._count.likes > 0 ||
                            (data.communityId && data.community?.name) ? (
                                <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                            ) : null} */}

                            {/* <Timestamp time={data.createdAt} /> */}
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
}
