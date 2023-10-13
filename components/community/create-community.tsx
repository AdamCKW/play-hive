"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal-store";

interface CreateCommunityCardProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export default function CreateCommunityCard({
    className,
}: CreateCommunityCardProps) {
    const t = useTranslations("communication.community");
    const { onOpen } = useModal();

    return (
        <div className={cn("py-2", className)}>
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-muted-foreground text-lg">
                        {t("heading")}
                    </CardTitle>
                </CardHeader>

                <CardFooter>
                    <div className="w-full">
                        <div className="hidden md:block">
                            <Button
                                className="w-full"
                                onClick={() => {
                                    onOpen("createCommunity");
                                }}
                            >
                                {t("create_button")}
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
