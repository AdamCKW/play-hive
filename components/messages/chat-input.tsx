"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { MessageFileModal } from "./message-file-modal";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { EmojiPicker } from "./emoji-picker";

interface ChatInputProps {
    id: string;
    // apiUrl: string;
    query: Record<string, any>;
    name: string;
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatInput = ({ id, name, query }: ChatInputProps) => {
    const { onOpen } = useModal();
    const router = useRouter();
    const { data: session } = useSession();

    // const apiUrl = "/api/socket/messages";

    const apiUrl = "/api/messages";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            await axios.post(url, values);

            form.reset();

            // router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onOpen("messageFile", {
                                                apiUrl,
                                                query,
                                            })
                                        }
                                        className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                                    >
                                        <Plus className="text-white dark:text-[#313338]" />
                                    </button>

                                    <Input
                                        disabled={isLoading}
                                        className=" bg-background px-14 py-6 shadow-md focus-visible:ring-0 focus-visible:ring-offset-0 "
                                        placeholder={`Message ${name}`}
                                        {...field}
                                    />

                                    <div className="absolute right-8 top-7">
                                        <EmojiPicker
                                            onChange={(emoji: string) =>
                                                field.onChange(
                                                    `${field.value} ${emoji}`,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};
