import { db } from "@/lib/db";
import { authOptions, getAuthSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { dir } from "console";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(req: NextRequest) {
    try {
        const session = await getAuthSession();
        const { searchParams } = new URL(req.url);

        const directMessageId = searchParams.get("directMessageId");
        const conversationId = searchParams.get("conversationId");
        const body = await req.json();
        const { content } = body;

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
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

        if (!conversation)
            return new NextResponse("Conversation not found", { status: 404 });

        const user =
            conversation.userOne.id === session.user.id
                ? conversation.userOne
                : conversation.userTwo;

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string,
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
            return new NextResponse("Message not found", { status: 404 });
        }

        const isMessageOwner = directMessage.userId === user.id;

        const canModify = isMessageOwner;

        if (!canModify) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!isMessageOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        directMessage = await db.directMessage.update({
            where: {
                id: directMessageId as string,
            },
            data: {
                content,
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

        const updateKey = `chat:${conversation.id}:messages:update`;

        return NextResponse.json(directMessage);
    } catch (error) {
        console.log("[MESSAGE_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getAuthSession();
        const { searchParams } = new URL(req.url);

        const directMessageId = searchParams.get("directMessageId");
        const conversationId = searchParams.get("conversationId");
        const body = await req.json();
        const { content } = body;

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
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

        if (!conversation)
            return new NextResponse("Conversation not found", { status: 404 });

        const user =
            conversation.userOne.id === session.user.id
                ? conversation.userOne
                : conversation.userTwo;

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string,
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
            return new NextResponse("Message not found", { status: 404 });
        }

        const isMessageOwner = directMessage.userId === user.id;

        const canModify = isMessageOwner;

        if (!canModify) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!isMessageOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        directMessage = await db.directMessage.update({
            where: {
                id: directMessageId as string,
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
            conversationId,
            "messages:update",
            directMessage,
        );

        return NextResponse.json(directMessage);
    } catch (error) {
        console.log("[MESSAGE_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
