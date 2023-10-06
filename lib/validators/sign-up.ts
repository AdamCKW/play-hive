import { z } from "zod";

export const RegisterValidation = (
    username_required?: string,
    username_type_error?: string,
    username_min?: string,
    username_refine?: string,
    email_required?: string,
    email_type_error?: string,
    email_invalid?: string,
    email_refine?: string,
    password_min?: string,
    password_max?: string,
    password_refine?: string,
) =>
    z.object({
        username: z
            .string({
                required_error: username_required || "Username is required",
                invalid_type_error:
                    username_type_error || "Username must be a string",
            })
            .min(8, {
                message:
                    username_min ||
                    "Username must be at least 8 characters long",
            })
            .refine((value) => /^[a-zA-Z0-9_-]+$/.test(value), {
                message:
                    username_refine ||
                    "Username can only contain alphanumeric characters, underscores, and hyphens",
            }),
        email: z
            .string({
                required_error: email_required || "Email is required",
                invalid_type_error:
                    email_type_error || "Email must be a string",
            })
            .email({ message: email_invalid || "Invalid email address" })
            .refine((value) => !/\s/.test(value), {
                message: email_refine || "Email cannot contain spaces",
            }),
        password: z
            .string()
            .min(8, {
                message:
                    password_min ||
                    "Password must be at least 8 characters long",
            })
            .max(20, {
                message:
                    password_max ||
                    "Password must be less than 20 characters long",
            })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]+$/,
                {
                    message:
                        password_refine ||
                        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (no space)",
                },
            ),
    });

export type RegisterRequest = z.infer<ReturnType<typeof RegisterValidation>>;
