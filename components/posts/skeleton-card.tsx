import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
    main?: boolean;
}

export function SkeletonCard({ main = false }: SkeletonCardProps) {
    if (main) {
        <div className="flex flex-col space-y-3 border-b px-3 py-4 dark:border-neutral-900">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="w-full space-y-1">
                <div className="flex w-full items-center justify-between">
                    <Skeleton className="h-6 w-52" />
                </div>
                <div className={`text-left text-base/relaxed `}>
                    <Skeleton className="h-6 w-full" />
                </div>

                <Skeleton className="h-6 w-36" />
            </div>
        </div>;
    }

    return (
        <div className="flex space-x-2 border-b px-3 py-4 ">
            <div className="flex flex-col items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="bg-primary/40 relative w-0.5 grow" />
            </div>

            <div className="w-full space-y-1">
                <div className="flex w-full items-center justify-between">
                    <Skeleton className="h-6 w-52" />
                </div>
                <div className={`text-left text-base/relaxed `}>
                    <Skeleton className="h-6 w-full" />
                </div>

                <Skeleton className="h-6 w-36" />
            </div>
        </div>
    );
}
