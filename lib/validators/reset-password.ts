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

export type ResetRequest = z.infer<ReturnType<typeof EmailValidation>>;
