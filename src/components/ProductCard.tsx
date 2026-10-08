import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/formatters";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800"; // fallback

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <span className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Esgotado
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <span className="text-xs text-zinc-400 block">Preço</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {formatPrice(product.priceCents)}
            </span>
          </div>

          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isOutOfStock
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
