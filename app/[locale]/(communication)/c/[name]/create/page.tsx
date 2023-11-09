import { PostEditor } from "@/components/community/create/post-editor";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTranslator } from "next-intl/server";
import { notFound } from "next/navigation";

interface CreatePostProps {
    params: {
        locale: string;
        name: string;
    };
}

interface DynamicMetadata {
    params: {
        locale: string;
        name: string;
    };
}

export async function generateMetadata({
    params: { locale, name },
}: DynamicMetadata) {
    const t = await getTranslator(locale, "metadata.community");

    return {
        title: t("title", { name }),
        description: t("description", { name }),
    };
}

export default async function CreatePost({ params }: CreatePostProps) {
    const session = await getAuthSession();

    const t = await getTranslator(
        params.locale,
        "communication.community.create_page",
    );

    const community = await db.community.findUnique({
        where: {
            name: params.name,
        },
    });

    if (!community) notFound();

    const subscription = !session?.user
        ? undefined
        : await db.subscription.findFirst({
              where: {
                  community: {
                      name: params.name,
                  },
                  user: {
                      id: session.user.id,
                  },
              },
          });

    const isSubscribed = !!subscription;

    if (!isSubscribed) notFound();

    return (
        <div className="flex flex-col items-start gap-6">
            {/* heading */}
            <div className="w-full border-b pb-5">
                <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                    <h3 className="ml-2 mt-2 text-xl font-semibold leading-6">
                        {t("heading")}
                    </h3>
                    <p className="text-muted-foreground ml-2 mt-1 truncate text-lg">
                        {t("in", { community_name: community.name })}
                    </p>
                </div>
            </div>

            {/* form */}
            <div className="bg-background w-full max-w-[1336px] rounded-lg border shadow">
                <PostEditor communityId={community.id} />
            </div>
        </div>
    );
}
