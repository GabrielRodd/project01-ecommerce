import Link from "next/link";

export default function CheckoutCancelPage() {
    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
                Pagamento cancelado
            </h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Nenhuma cobrança foi feita. Seu carrinho continua salvo.
            </p>
            <Link
                href="/cart"
                className="mt-8 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-80 dark:bg-zinc-100 dark:text-zinc-900"
            >
                Voltar ao carrinho
            </Link>
        </main>
    );
}
