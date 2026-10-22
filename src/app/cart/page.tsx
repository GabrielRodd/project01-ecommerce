"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/formatters";
import { CheckoutButton } from "@/components/CheckoutButton";


export default function CartPage() {
    const [mounted, setMounted] = useState(false);

    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const clearCart = useCartStore((state) => state.clearCart);
    const totalPriceCents = useCartStore((state) => state.getTotalPriceCents());

    useEffect(() => {
        setMounted(true);
    }, []);

    // Antes de montar, não sabemos o conteúdo real do carrinho
    if (!mounted) {
        return (
            <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <p className="text-zinc-500">Carregando carrinho...</p>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Seu carrinho está vazio
                </h1>
                <Link
                    href="/"
                    className="mt-4 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    ← Voltar ao catálogo
                </Link>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
                Carrinho
            </h1>

            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4">
                        <Link
                            href={`/products/${item.slug}`}
                            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                        >
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        </Link>

                        <div className="flex flex-1 flex-col justify-between">
                            <div className="flex justify-between gap-4">
                                <Link
                                    href={`/products/${item.slug}`}
                                    className="font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
                                >
                                    {item.name}
                                </Link>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                    {formatPrice(item.priceCents * item.quantity)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        aria-label="Diminuir quantidade"
                                    >
                                        −
                                    </button>
                                    <span className="min-w-8 text-center text-sm">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.stock}
                                        className="px-3 py-1 text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        aria-label="Aumentar quantidade"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    Esvaziar carrinho
                </button>
                <div className="text-right">
                    <p className="text-sm text-zinc-500">Subtotal</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {formatPrice(totalPriceCents)}
                    </p>
                    <div className="mt-4">
                        <CheckoutButton />
                    </div>
                </div>
            </div>
        </main>
    );
}
