import Image from "next/image";
import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/formatters";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.images[0];
    const isOutOfStock = product.stock <= 0;
    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 font-semibold text-zinc-900 dark:text-zinc-100">
                    {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        {formatPrice(product.priceCents)}
                    </span>
                    <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${isOutOfStock
                                ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                            }`}
                    >
                        {isOutOfStock ? "Esgotado" : `${product.stock} un.`}
                    </span>
                </div>
            </div>
        </article>
    );
}

