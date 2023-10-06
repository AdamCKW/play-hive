import { z } from "zod";

export const LoginValidation = (
    username_required?: string,
    username_refine?: string,
    password_required?: string,
) =>
    z.object({
        username: z
            .string()
            .min(2, {
                message:
                    username_required ||
                    "Username or email must be at least 2 characters long",
            })
            .refine((value) => !/\s/.test(value), {
                message:
                    username_refine ||
                    "Username or email cannot contain spaces",
            }),
        password: z.string().min(1, {
            message: password_required || "Password cannot be empty",
        }),
    });

export type LoginRequest = z.infer<ReturnType<typeof LoginValidation>>;
