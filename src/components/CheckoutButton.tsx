"use client";

import { useState, useTransition } from "react";
import { Show, SignInButton } from "@clerk/nextjs";
import { useCartStore } from "@/store/cartStore";
import { createCheckout } from "@/app/actions/checkout";

export function CheckoutButton() {
    const items = useCartStore((state) => state.items);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleCheckout() {
        setError(null);
        startTransition(async () => {
            try {
                // Envia SÓ id e quantidade. O servidor busca o preço no banco.
                await createCheckout(
                    items.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                    }))
                );
            } catch (e) {
                // Erro de redirect do Next não deve aparecer como erro
                if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
                setError(e instanceof Error ? e.message : "Erro ao finalizar a compra.");
            }
        });
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <Show when="signed-in">
                <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isPending}
                    className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                    {isPending ? "Redirecionando..." : "Finalizar compra"}
                </button>
            </Show>
            <Show when="signed-out">
                <SignInButton mode="modal">
                    <button
                        type="button"
                        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-80 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                        Entrar para finalizar
                    </button>
                </SignInButton>
            </Show>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
