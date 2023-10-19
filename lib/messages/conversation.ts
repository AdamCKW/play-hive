import { db } from "@/lib/db";

export const getOrCreateConversation = async (
    userOneId: string,
    userTwoId: string,
) => {
    let conversation =
        (await findConversation(userOneId, userTwoId)) ||
        (await findConversation(userTwoId, userOneId));

    if (!conversation) {
        conversation = await createNewConversation(userOneId, userTwoId);
    }

    return conversation;
};

const findConversation = async (userOneId: string, userTwoId: string) => {
    return await db.conversation.findFirst({
        where: {
            AND: [
                {
                    userOneId,
                },
                {
                    userTwoId,
                },
            ],
        },
        include: {
            userOne: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
            userTwo: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
        },
    });
};

const createNewConversation = async (userOneId: string, userTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                userOneId,
                userTwoId,
            },
            include: {
                userOne: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
                userTwo: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
            },
        });
    } catch (error) {
        return null;
    }
};
