import { db } from "@/lib/db";
import { authOptions, getAuthSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { dir } from "console";
import { pusherServer } from "@/lib/pusher";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getAuthSession();
        const messageId = params.id;

        if (!session) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        if (!messageId) {
            return new NextResponse("messages.failed.missing_id", {
                status: 400,
            });
        }

        const directMessage = await db.directMessage.findFirst({
            where: {
                id: messageId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        if (!directMessage || directMessage.deleted) {
            return new NextResponse("404.not_found", { status: 404 });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: directMessage.conversationId,
                OR: [
                    {
                        userOne: {
                            id: session.user.id,
                        },
                    },
                    {
                        userTwo: {
                            id: session.user.id,
                        },
                    },
                ],
            },
            include: {
                userOne: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        image: true,
                    },
                },
                userTwo: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        if (!conversation) {
            return new NextResponse("404.not_found", { status: 404 });
        }

        const user =
            conversation.userOne.id === session.user.id
                ? conversation.userOne
                : conversation.userTwo;

        const isMessageOwner = directMessage.userId === user.id;

        const canModify = isMessageOwner;

        if (!canModify) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        if (!isMessageOwner) {
            return new NextResponse("401.unauthorized", { status: 401 });
        }

        const newDirectMessage = await db.directMessage.update({
            where: {
                id: directMessage.id,
            },
            data: {
                fileUrl: null,
                content: "This message has been deleted.",
                deleted: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        await pusherServer.trigger(
            conversation.id,
            "messages:update",
            newDirectMessage,
        );

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        console.log("ERROR in /api/messages/[id]/route.ts: ", error);
        return new NextResponse("500.internal_error", { status: 500 });
    }
}
