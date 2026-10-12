import Link from "next/link";
import { CartButton } from "@/components/CartButton";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";


export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight text-zinc-900 hover:opacity-80 transition dark:text-zinc-100"
                >
                    GameStore
                </Link>
                <div className="flex items-center gap-4">
                    <CartButton />

                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <button className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition dark:text-zinc-300 dark:hover:text-zinc-100">
                                Entrar
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-80 transition dark:bg-zinc-100 dark:text-zinc-900">
                                Cadastrar
                            </button>
                        </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                </div>
            </div>
        </header>
    );
}
