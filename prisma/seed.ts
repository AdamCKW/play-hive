import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const generateRandomJsonObject = () => {
    return {
        id: faker.string.uuid(),
        type: faker.helpers.arrayElement(["h1", "p", "h2", "h3"]),
        children: [
            {
                text: faker.lorem.paragraph(),
            },
        ],
    };
};

function generateRandomPlateContent() {
    // Generate a random number of elements (paragraphs, headings, etc.) in the content
    const contentLength = faker.number.int({ min: 1, max: 5 });
    const content = [];

    for (let i = 0; i < contentLength; i++) {
        content.push(generateRandomJsonObject());
    }

    return content;
}

async function generateUser() {
    const rawPassword = "Abc123!@#";
    for (let i = 0; i < 100; i++) {
        const salt = await bcrypt.genSalt(11);

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const number = faker.number.int({ min: 1, max: 50 });
        const username = `${firstName}-${lastName}-${number}`;

        const bio = faker.lorem.sentences(3);
        const password = await bcrypt.hash(rawPassword, salt);

        const user = await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email: username.toLowerCase() + "@inboxkitten.com",
                username: username.toLowerCase(),
                bio,
                password,
                image: faker.image.avatar(),
                cover: faker.image.urlPicsumPhotos(),
            },
        });

        console.log(`No ${i + 1}: Created user with ${user.name}`);
    }
}

async function generateFollowing() {
    const users = await prisma.user.findMany();
    let num = 1;
    for (const user of users) {
        const numOfFollowing = faker.number.int({ min: 5, max: 50 });

        for (let i = 0; i < numOfFollowing; i++) {
            const randomUserIndex = faker.number.int({
                min: 0,
                max: users.length - 1,
            });

            if (users[randomUserIndex].id !== user.id) {
                const followUserExist = await prisma.user.findUnique({
                    where: {
                        id: users[randomUserIndex].id,
                    },
                    include: {
                        followedBy: true,
                    },
                });

                const isFollowing = followUserExist?.followedBy.some(
                    (follow) => follow.id === user.id,
                );

                if (!isFollowing) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            following: {
                                connect: { id: users[randomUserIndex].id },
                            },
                        },
                    });
                }
            }
        }

        console.log(`No ${num++}: Created following for ${user.name}`);
    }
}

async function createCommunities() {
    const users = await prisma.user.findMany();
    const communities = [];
    const subscriptions = [];

    const numOfCommunities = faker.number.int({ min: 1, max: 20 });

    for (let i = 0; i < numOfCommunities; i++) {
        const rawCommunityName = faker.company.catchPhraseNoun();

        const communityName = rawCommunityName.replace(/[^a-zA-Z0-9_-]/g, "");
        const creatorId = users[i % users.length].id;

        const community = await prisma.community.create({
            data: {
                name: `${communityName}-${i}`,
                creatorId, // Assign a random creator from the users array
            },
        });

        // creator also has to be subscribed
        const subscribe = await prisma.subscription.create({
            data: {
                userId: creatorId,
                communityId: community.id,
            },
        });

        communities.push(community);
        subscriptions.push(subscribe);

        console.log(`Created community "${community.name}"`);
    }
}

async function generateSubscriptions() {
    const users = await prisma.user.findMany();
    const communities = await prisma.community.findMany();
    let num = 1;

    for (const user of users) {
        const availableCommunityIds = communities
            .filter((community) => community.creatorId !== user.id) // Exclude communities created by the user
            .map((community) => community.id);

        const numOfSub = faker.number.int({
            min: 1,
            max: availableCommunityIds.length,
        });

        const subscribedCommunityIds = faker.helpers.arrayElements(
            availableCommunityIds,
            numOfSub,
        );

        for (const communityId of subscribedCommunityIds) {
            const subscribe = await prisma.subscription.create({
                data: {
                    userId: user.id,
                    communityId: communityId,
                },
            });

            console.log(
                `No ${num++}: User "${
                    user.name
                }" subscribed to community with ID "${communityId}"`,
            );
        }
    }
}

async function generatePosts() {
    const users = await prisma.user.findMany();
    const subscriptions = await prisma.subscription.findMany();

    for (let i = 0; i < 5; i++) {
        let cNum = 1;
        let pNum = 1;
        for (const user of users) {
            const availableCommunityIds = subscriptions
                .filter((community) => community.userId === user.id) // Exclude communities created by the user
                .map((community) => community.communityId);

            for (const communityId of availableCommunityIds) {
                const randomPlateContent = generateRandomPlateContent();

                const post = await prisma.post.create({
                    data: {
                        content: randomPlateContent,
                        authorId: user.id,
                        communityId: communityId,
                    },
                });
            }

            console.log(`No ${cNum++}: Generate Community Post for ${user.id}`);
        }

        for (const user of users) {
            const images = [];

            const text = faker.lorem.paragraph();
            const post = await prisma.post.create({
                data: {
                    text,
                    authorId: user.id,
                },
            });

            const numOfImages = faker.number.int(4);
            for (let k = 0; k < numOfImages; k++) {
                const image = await prisma.images.create({
                    data: {
                        url: faker.image.urlPicsumPhotos(),
                        post: {
                            connect: {
                                id: post.id,
                            },
                        },
                    },
                });

                images.push(image.id);
            }

            await prisma.post.update({
                where: {
                    id: post.id,
                },
                data: {
                    images: {
                        connect: images.map((image) => ({
                            id: image,
                        })),
                    },
                },
            });

            console.log(`No ${pNum++}: Generate Post for ${user.id}`);
        }

        console.log(`No ${i + 1}: Generate ${users.length} Posts`);
    }
}

async function generateReplies() {
    let num = 1;
    const users = await prisma.user.findMany();
    const posts = await prisma.post.findMany({
        where: {
            parent: null,
        },
    });

    for (const post of posts) {
        const numOfReplies = faker.number.int({ min: 1, max: 5 });

        for (let i = 0; i < numOfReplies; i++) {
            const user =
                users[faker.number.int({ min: 0, max: users.length - 1 })];
            const images = [];
            const userId = user.id;
            const text = faker.lorem.paragraph();

            const createdComments = await prisma.post.create({
                data: {
                    text,
                    author: {
                        connect: {
                            id: userId,
                        },
                    },
                    parent: {
                        connect: {
                            id: post.id,
                        },
                    },
                },
            });

            const numOfImages = faker.number.int(4);
            for (let k = 0; k < numOfImages; k++) {
                const image = await prisma.images.create({
                    data: {
                        url: faker.image.urlPicsumPhotos(),
                        post: {
                            connect: {
                                id: createdComments.id,
                            },
                        },
                    },
                });

                images.push(image.id);
            }

            await prisma.post.update({
                where: {
                    id: createdComments.id,
                },
                data: {
                    images: {
                        connect: images.map((image) => ({
                            id: image,
                        })),
                    },
                },
            });
        }

        console.log(
            `No ${num++}: Generate ${numOfReplies} Replies for ${post.id}`,
        );
    }
}

async function seedDatabase() {
    // await generateUser();
    // await generateFollowing();
    // await createCommunities();
    // await generateSubscriptions();
    // await generatePosts();
    // await generateReplies();
}

seedDatabase()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
