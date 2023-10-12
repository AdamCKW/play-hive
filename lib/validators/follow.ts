import { z } from "zod";

export const FollowValidation = z.object({
    id: z
        .string({
            required_error: "User ID is required",
            invalid_type_error: "User ID must be a string",
        })
        .refine((value) => !/\s/.test(value), {
            message: "User ID cannot contain spaces",
        }),
});

export type FollowRequest = z.infer<typeof FollowValidation>;
