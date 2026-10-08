import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
        Catálogo de Produtos
      </h1>
      {products.length === 0 ? (
        <p className="text-zinc-500">Nenhum produto cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}