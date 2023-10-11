import { z } from "zod";

export const PostValidation = (content_min?: string, content_max?: string) =>
    z.object({
        content: z
            .string()
            .min(1, {
                message:
                    content_min || "Comment must be at least 1 characters long",
            })
            .max(200, {
                message:
                    content_max ||
                    "Comment cannot be longer than 250 characters",
            }),
        files: z.any().optional(),
    });

export type PostRequest = z.infer<ReturnType<typeof PostValidation>>;
