import { Suspense } from "react";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn, getInitials, nFormatter } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

import FollowButton from "@/components/profile/follow";
import SelfShare from "@/components/profile/self-share";

import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { getTranslator } from "next-intl/server";
import { UserRole } from "@prisma/client";
import { linksConfig, siteConfig } from "@/config/site";
import { ProfileLoading } from "@/components/profile/loading";

interface ProfilePageLayoutProps {
    children: React.ReactNode;
    params: { username: string; locale: string };
}

export default async function ProfilePageLayout({
    children,
    params,
}: ProfilePageLayoutProps) {
    const session = await getAuthSession();
    if (!session) return redirect("/sign-in");
    const t = await getTranslator(params.locale, "root.profile.layout");

    const getSelf = await db.user.findUnique({
        where: {
            id: session?.user?.id,
        },
    });

    if (!getSelf) {
        notFound();
    }

    const getUser = await db.user.findUnique({
        where: { username: decodeURI(params.username) },
        include: {
            followedBy: true,
            following: true,
        },
    });

    if (!getUser) {
        notFound();
    }

    // const self = getSelf.username === params.id;
    const self = getSelf ? getSelf.username === params.username : null;

    const isFollowing = getUser.followedBy.some(
        (follow) => follow.id === getSelf.id,
    );

    return (
        <>
            <Suspense fallback={<ProfileLoading />}>
                <div className="relative mb-6 flex w-full">
                    {getUser?.cover && (
                        <div className="bg-muted h-52">
                            <Image
                                alt={t("cover_alt", { name: getUser.name })}
                                fill
                                src={getUser.cover}
                                className="object-cover"
                                loading="lazy"
                                sizes="(max-width: 640px) 100vw,
                                    (max-width: 1280px) 50vw,
                                    (max-width: 1536px) 33vw,
                                    25vw"
                            />
                        </div>
                    )}
                </div>

                <div className=" flex w-full items-start justify-between px-3 xl:px-10">
                    <div className="grow">
                        <div className="text-2xl font-semibold">
                            {getUser?.name}
                        </div>

                        <div className="mt-1 flex items-center">
                            @{getUser.username}
                            {getUser?.role === UserRole.BANNED && (
                                <Badge
                                    variant="destructive"
                                    className="ml-2 text-xs"
                                >
                                    {t(getUser.role)}
                                </Badge>
                            )}
                        </div>

                        {getUser.bio ? (
                            <div className="pt-4 leading-relaxed">
                                {getUser.bio}
                            </div>
                        ) : null}

                        <div className="flex gap-2 py-4">
                            <div className="text-muted-foreground">
                                <span className="text-foreground">
                                    {nFormatter(getUser.following.length, 1)}
                                </span>{" "}
                                {t("following")}
                            </div>

                            <div className="text-muted-foreground">
                                <span className="text-foreground">
                                    {nFormatter(getUser.followedBy.length, 1)}
                                </span>{" "}
                                {getUser.followedBy.length === 1
                                    ? t("follower")
                                    : t("followers")}
                            </div>
                        </div>
                    </div>

                    <UserAvatar
                        className="h-14 w-14 overflow-hidden"
                        user={{
                            name: getUser.name!,
                            image: getUser.image!,
                        }}
                    />
                </div>

                {self ? (
                    <div className="flex w-full space-x-2 px-3 xl:px-10">
                        <Link
                            className={cn(
                                "w-full",
                                buttonVariants({
                                    variant: "outline",
                                }),
                            )}
                            href={`/${session.user.username}${linksConfig.settings.href}`}
                        >
                            {t("edit_profile")}
                        </Link>

                        <SelfShare
                            name={getUser.name!}
                            username={getUser.username!}
                        />
                    </div>
                ) : (
                    <div className="w-full px-3 xl:px-10">
                        <FollowButton
                            id={getSelf.id}
                            followingId={getUser.id}
                            name={getUser.name!}
                            isFollowing={isFollowing}
                        />
                    </div>
                )}
            </Suspense>
            {children}
        </>
    );
}
