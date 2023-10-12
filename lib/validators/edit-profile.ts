import z from "zod";

export const FullEditValidation = (
    name_required?: string,
    name_type_error?: string,
    name_min?: string,
    name_max?: string,
    username_required?: string,
    username_type_error?: string,
    username_min?: string,
    username_max?: string,
    username_refine?: string,
    email_required?: string,
    email_type_error?: string,
    email_invalid?: string,
    email_refine?: string,
    bio_max?: string,
    password_refine?: string,
) =>
    z.object({
        imageUrl: z.string().optional(),
        imageBanner: z.string().optional(),
        name: z
            .string({
                required_error: name_required || "Name is required",
                invalid_type_error: name_type_error || "Name must be a string",
            })
            .min(1, {
                message: name_min || "Name must be at least 2 characters long",
            })
            .max(30, {
                message: name_max || "Name cannot be longer than 30 characters",
            }),
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
            .max(
                20,
                username_max || "Username must be less than 20 characters long",
            )
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
            // .nullable()
            .refine(
                (val) => {
                    if (val === null) {
                        return true; // Allow null
                    }
                    return (
                        val.length === 0 || // Allow empty string
                        (val.length >= 8 && // Minimum length requirement
                            val.length <= 20 && // Maximum length requirement
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]+$/.test(
                                val,
                            ))
                    );
                },
                {
                    message:
                        password_refine ||
                        "Password must be at least 8 characters long and no more than 20 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (no space).",
                },
            ),
        bio: z.string().max(160, {
            message: bio_max || "Bio cannot be longer than 160 characters",
        }),
    });

export type FullEditRequest = z.infer<ReturnType<typeof FullEditValidation>>;
