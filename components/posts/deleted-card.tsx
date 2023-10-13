import { nFormatter } from "@/lib/utils";
import { IPost } from "@/types/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import Timestamp from "./timestamp";
import { useTranslations } from "next-intl";

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
    const likesCount = nFormatter(data.likesCount, 1);
    const childrenCount = nFormatter(data.childrenCount, 1);

    if (noLink) {
        return (
            <div className="flex flex-col space-y-3 border-b px-3 py-4 dark:border-neutral-900">
                <div className="flex items-center justify-between">
                    <div className="bg-primary/40 h-10 w-10 rounded-full" />
                </div>
                <div className="w-full">
                    <div
                        className={`text-muted-foreground text-left text-base/relaxed italic`}
                    >
                        {t("deleted")}
                    </div>

                    <div className="text-muted-foreground flex items-center space-x-2 ">
                        {data.childrenCount > 0 && (
                            <div className="text-muted-foreground ">
                                {childrenCount}{" "}
                                {data.childrenCount === 1
                                    ? t("reply")
                                    : t("replies")}
                            </div>
                        )}

                        {data.childrenCount > 0 && data.likesCount > 0 && (
                            <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                        )}

                        {data.likesCount > 0 && (
                            <div className=" text-muted-foreground ">
                                {likesCount}{" "}
                                {data.likesCount === 1 ? t("like") : t("likes")}
                            </div>
                        )}

                        {(data.childrenCount > 0 || data.likesCount > 0) &&
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
                                    /c/{data.community?.name}
                                </div>
                            </>
                        ) : null}

                        {data.childrenCount > 0 ||
                        data.likesCount > 0 ||
                        (data.communityId && data.community?.name) ? (
                            <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                        ) : null}

                        <Timestamp time={data.createdAt} />
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
            </div>
            <div className="w-full space-y-1">
                <div
                    className={`text-muted-foreground text-left text-base/relaxed`}
                >
                    Deleted Post
                </div>

                {comment ? null : (
                    <>
                        <div className="text-muted-foreground flex items-center space-x-2 ">
                            {data.childrenCount > 0 && (
                                <div className="text-muted-foreground ">
                                    {childrenCount}{" "}
                                    {data.childrenCount === 1
                                        ? "reply"
                                        : "replies"}
                                </div>
                            )}

                            {data.childrenCount > 0 && data.likesCount > 0 && (
                                <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                            )}

                            {data.likesCount > 0 && (
                                <div className=" text-muted-foreground ">
                                    {likesCount}{" "}
                                    {data.likesCount === 1 ? "like" : "likes"}
                                </div>
                            )}

                            {(data.childrenCount > 0 || data.likesCount > 0) &&
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
                                        /c/{data.community?.name}
                                    </div>
                                </>
                            ) : null}

                            {data.childrenCount > 0 ||
                            data.likesCount > 0 ||
                            (data.communityId && data.community?.name) ? (
                                <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                            ) : null}

                            <Timestamp time={data.createdAt} />
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
}
