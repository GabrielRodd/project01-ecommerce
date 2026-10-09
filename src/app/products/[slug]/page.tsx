import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatters";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
        where: { slug },
    });
    if (!product) {
        notFound();
    }

    const imageUrl = product.images[0];
    const isOutOfStock = product.stock <= 0;
    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                href="/"
                className="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
                ← Voltar ao catálogo
            </Link>
            <div className="grid gap-8 md:grid-cols-2">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {product.name}
                    </h1>
                    <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                        {product.description}
                    </p>
                    <p className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {formatPrice(product.priceCents)}
                    </p>
                    <span
                        className={`mt-4 w-fit rounded-full px-3 py-1 text-sm font-medium ${isOutOfStock
                            ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                            }`}
                    >
                        {isOutOfStock ? "Esgotado" : `${product.stock} em estoque`}
                    </span>
                </div>
            </div>
        </main>
    );
}