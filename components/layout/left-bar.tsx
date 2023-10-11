import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LeftItems } from "@/components/layout/left-items";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Edit } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface LeftBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export async function LeftBar({ className }: LeftBarProps) {
    const session = await getAuthSession();
    const { onOpen, data } = useModal();
    const { t } = GetPageTranslation();

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-4 py-2">
                    <div className="space-y-1">
                        <LeftItems />

                        {session?.user && (
                            <Button
                                size="lg"
                                className="w-full justify-start text-lg font-bold"
                                onClick={() => {
                                    onOpen("createPost", {
                                        user: session.user,
                                    });
                                }}
                            >
                                <Edit className="mr-2 h-6 w-6" />
                                {t("button")}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function GetPageTranslation() {
    const t = useTranslations("root.posts.create.modal");
    return { t };
}
