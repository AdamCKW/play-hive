import ChatBody from "@/components/messages/chat-body";
import { ChatHeader } from "@/components/messages/chat-header";
import { ChatInput } from "@/components/messages/chat-input";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/messages/conversation";
import { getTranslator } from "next-intl/server";
import { redirect } from "next/navigation";

interface ConversationPageProps {
    params: {
        username: string;
        locale: string;
    };
}

export async function generateMetadata({
    params: { locale, username },
}: ConversationPageProps) {
    const t = await getTranslator(locale, "metadata.conversation");

    return {
        title: t("title"),
        description: t("description", { username }),
    };
}

export default async function ConversationPage({
    params,
}: ConversationPageProps) {
    const session = await getAuthSession();

    const currentUser = await db.user.findFirst({
        where: {
            id: session?.user.id,
        },
        select: {
            id: true,
            name: true,
            username: true,
            image: true,
            following: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
            followedBy: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
        },
    });

    const conversationUser = await db.user.findFirst({
        where: {
            username: params.username,
        },
        select: {
            id: true,
            name: true,
            username: true,
            image: true,
            following: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
            followedBy: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
        },
    });

    if (!currentUser || !conversationUser) return redirect("/");

    if (
        !currentUser.following.some(
            (user) => user.id === conversationUser.id,
        ) &&
        !currentUser.followedBy.some((user) => user.id === conversationUser.id)
    ) {
        // If currentUser is neither following nor followed by conversationUser
        redirect("/");
    }

    const conversation = await getOrCreateConversation(
        currentUser.id,
        conversationUser.id,
    );

    if (!conversation) return redirect("/messages");

    const { userOne, userTwo } = conversation;

    const otherUser = userOne.id === currentUser.id ? userTwo : userOne;

    return (
        <div className="flex h-full flex-col">
            <ChatHeader user={otherUser} />
            <ChatBody
                user={otherUser}
                currentUser={currentUser}
                chatId={conversation.id}
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: conversation.id,
                }}
            />
            <ChatInput
                id={otherUser.id!}
                name={otherUser.name!}
                query={{
                    conversationId: conversation.id,
                }}
            />
        </div>
    );
}
