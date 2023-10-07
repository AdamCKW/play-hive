import Link from "next/link";

export default function NotFound() {
    return (
        <main className="bg-foreground flex h-screen w-full flex-col items-center justify-center">
            <h1 className="text-primary-foreground text-9xl font-extrabold tracking-widest">
                404
            </h1>
            <div className="bg-background absolute rotate-12 rounded px-2 text-sm">
                Page Not Found
            </div>
            <button className="mt-5">
                <a className="text-primary-foreground active:text-primary-foreground group relative inline-block text-sm font-medium focus:outline-none focus:ring">
                    <span className="bg-background absolute inset-0 translate-x-0.5 translate-y-0.5 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />

                    <span className="bg-foreground relative block border border-current px-8 py-3">
                        <Link href="/">Go Home</Link>
                    </span>
                </a>
            </button>
        </main>
    );
}
