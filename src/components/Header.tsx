import Link from "next/link";
import { CartButton } from "@/components/CartButton";

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight text-zinc-900 hover:opacity-80 transition dark:text-zinc-100"
                >
                    DevStore
                </Link>
                <div className="flex items-center gap-4">
                    <CartButton />
                </div>
            </div>
        </header>
    );
}
