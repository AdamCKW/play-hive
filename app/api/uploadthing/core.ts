import { getAuthSession } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
    const session = await getAuthSession();

    if (!session) throw new Error("401.unauthorized");

    return { userId: session.user.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    imageUploader: f({
        image: { maxFileSize: "8MB", maxFileCount: 4 },
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),

    communityImage: f({
        image: { maxFileSize: "8MB", maxFileCount: 1 },
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),

    userAvatar: f({
        image: { maxFileSize: "8MB", maxFileCount: 1 },
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),

    userBanner: f({
        image: { maxFileSize: "8MB", maxFileCount: 1 },
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),

    messageFile: f(["image", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
