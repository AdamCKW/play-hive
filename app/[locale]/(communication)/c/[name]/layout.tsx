import { LeftBar } from "@/components/layout/left-bar";
import { NavBar } from "@/components/layout/nav-bar";
import { RightBar } from "@/components/layout/right-bar";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface DynamicCommunityLayoutProps {
    params: {
        id: string;
    };
    children: React.ReactNode;
}

export default async function DynamicCommunityLayout({
    children,
    params,
}: DynamicCommunityLayoutProps) {
    const session = await getAuthSession();

    const community = await db.community.findFirst({
        where: {
            name: params.id,
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
        },
    });

    const subscription = !session?.user
        ? undefined
        : await db.subscription.findFirst({
              where: {
                  community: {
                      name: params.id,
                  },
                  user: {
                      id: session.user.id,
                  },
              },
          });

    const isSubscribed = !!subscription;

    const memberCount = await db.subscription.count({
        where: {
            community: {
                name: params.id,
            },
        },
    });

    if (!community) notFound();

    return (
        <>
            <section className=" flex min-h-screen flex-1 flex-col items-center px-6 pb-10 pt-28 max-md:pb-32 sm:px-10">
                <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightBar
                className="w-[25rem]"
                individual
                communityInfo={{
                    community,
                    isSubscribed,
                    memberCount,
                }}
            />
        </>
    );
}
