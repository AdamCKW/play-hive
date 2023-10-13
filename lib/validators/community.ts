import { z } from "zod";

export const CommunityValidator = (
    name_required?: string,
    name_type_error?: string,
    name_min?: string,
    name_max?: string,
    name_refine?: string,
) =>
    z.object({
        name: z
            .string({
                required_error: name_required || "Community name is required",
                invalid_type_error:
                    name_type_error || "Community name must be a string",
            })
            .min(4, {
                message:
                    name_min ||
                    "Community name must be at least 4 characters long",
            })
            .max(21, {
                message:
                    name_max ||
                    "Community name cannot be longer than 21 characters",
            })
            .refine((value) => /^[a-zA-Z0-9_-]+$/.test(value), {
                message:
                    name_refine ||
                    "Community name can only contain alphanumeric characters, underscores, and hyphens",
            }),
        imageUrl: z.string(),
    });

export const CommunitySubscriptionValidator = z.object({
    communityId: z.string(),
});

export type CreateCommunityPayload = z.infer<
    ReturnType<typeof CommunityValidator>
>;
export type SubscribeToCommunityPayload = z.infer<
    typeof CommunitySubscriptionValidator
>;
