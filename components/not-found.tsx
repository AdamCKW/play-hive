import Image from "next/image";

export function NotFound() {
    return (
        <>
            <div className="flex w-full items-center justify-center py-5">
                <div className="h-9 w-9 bg-cover">
                    <Image
                        src={"/"}
                        alt="Threads logo"
                        className="min-h-full min-w-full object-cover invert"
                    />
                </div>
            </div>
            <div className="mt-24 text-center font-semibold">
                Sorry, this page isn&apos;t available
            </div>
            <div className="mt-4 text-center text-neutral-600">
                The link you followed may be broken, or the page may have been
                removed.
            </div>
        </>
    );
}
