import { z } from "zod";

export const EmailValidation = (
    email_required?: string,
    email_type_error?: string,
    email_invalid?: string,
    email_refine?: string,
) =>
    z.object({
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
    });

export const NewPasswordValidation = (
    password_min?: string,
    password_max?: string,
    password_refine?: string,
) =>
    z.object({
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

export type ResetRequest = z.infer<ReturnType<typeof EmailValidation>>;
export type NewPasswordRequest = z.infer<
    ReturnType<typeof NewPasswordValidation>
>;
