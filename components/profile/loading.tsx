import { Skeleton } from "@/components/ui/skeleton";

export function ProfileLoading() {
    return (
        <>
            <div className=" flex w-full items-start justify-between px-3 xl:px-10">
                <div className="grow">
                    <Skeleton className="h-8 w-60" />

                    <Skeleton className="mt-1 flex h-6 w-48" />

                    <Skeleton className="flex h-24 w-full pt-4" />

                    <Skeleton className="h-6 w-48 py-4" />
                </div>

                <Skeleton className="h-14 w-14 rounded-full" />
            </div>
        </>
    );
}
