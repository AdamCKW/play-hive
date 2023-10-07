import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LeftItems } from "./left-items";

interface LeftBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export async function LeftBar({ className }: LeftBarProps) {
    const session = await getAuthSession();

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-4 py-2">
                    <div className="space-y-1">
                        <LeftItems />
                        {/* {session?.user && <PostModal user={session.user} />} */}
                    </div>
                </div>
            </div>
        </div>
    );
}
