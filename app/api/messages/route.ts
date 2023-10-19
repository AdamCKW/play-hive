import { NextRequest, NextResponse } from "next/server";
import { DirectMessage } from "@prisma/client";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/display-config";
import { pusherServer } from "@/lib/pusher";

export async function GET(req: NextRequest) {
    try {
        const session = await getAuthSession();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: INFINITE_SCROLL_PAGINATION_RESULTS,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId,
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
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            messages = await db.directMessage.findMany({
                take: INFINITE_SCROLL_PAGINATION_RESULTS,
                where: {
                    conversationId,
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
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        let nextCursor = null;

        if (messages.length === INFINITE_SCROLL_PAGINATION_RESULTS) {
            nextCursor = messages[INFINITE_SCROLL_PAGINATION_RESULTS - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor,
        });
    } catch (error) {
        console.log("[MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // const session = await getAuthSession();
        const session = await getAuthSession();

        const body = await req.json();

        const { content, fileUrl } = body;
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get("conversationId");

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        if (!content) {
            return new NextResponse("Content missing", { status: 400 });
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

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        const user =
            conversation.userOne.id === session.user.id
                ? conversation.userOne
                : conversation.userTwo;

        const receiver =
            conversation.userOne.id === session.user.id
                ? conversation.userTwo
                : conversation.userOne;

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                userId: user.id,
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

        await pusherServer.trigger(conversationId, "messages:new", message);
        await pusherServer.trigger(receiver.id, "notify:user", {
            message: `${user.name} sent you a message`,
            pathName: `/messages/${user.username}`,
        });

        return NextResponse.json(message);
    } catch (error) {
        console.log("[DIRECT_MESSAGES_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
