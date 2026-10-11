"use client"

import { useCartStore } from "@/store/cartStore";
interface AddToCartButtonProps {
    product: {
        id: string;
        name: string;
        slug: string;
        priceCents: number;
        image: string;
        stock: number;
    };
}
export function AddToCartButton({ product }: AddToCartButtonProps) {
    // Pegamos a ação de adicionar e a lista atual de itens da nossa store
    const addItem = useCartStore((state) => state.addItem);
    const items = useCartStore((state) => state.items);
    // Verifica quantos desse produto já estão no carrinho
    const currentInCart = items.find((item) => item.id === product.id)?.quantity ?? 0;

    const isOutOfStock = product.stock <= 0;
    const isMaxReached = currentInCart >= product.stock;
    function handleAddToCart() {
        addItem({
            id: product.id,
            name: product.name,
            slug: product.slug,
            priceCents: product.priceCents,
            image: product.image,
            stock: product.stock,
        });
    }
    return (
        <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isMaxReached}
            className={`mt-6 w-full rounded-lg px-6 py-3 font-semibold transition ${isOutOfStock || isMaxReached
                    ? "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.99] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                }`}
        >
            {isOutOfStock
                ? "Produto Esgotado"
                : isMaxReached
                    ? "Limite em estoque atingido"
                    : currentInCart > 0
                        ? `Adicionar mais um (${currentInCart} no carrinho)`
                        : "Adicionar ao Carrinho"}
        </button>
    );
}

