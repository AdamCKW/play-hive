import { Loader2 } from "lucide-react";

export function PostLoading() {
    return (
        <div className="2xl:mx-4">
            <div className="flex w-full justify-center py-4">
                <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            </div>
        </div>
    );
}
