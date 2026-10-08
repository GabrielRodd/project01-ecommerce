import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header simples */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
              ⚡
            </span>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              DevStore
            </span>
          </div>

          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Catálogo de Produtos
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Confira nossos periféricos e equipamentos para desenvolvedores.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-400">
              Nenhum produto cadastrado no catálogo.
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Execute o script de seed para popular a base de dados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer simples */}
      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} DevStore. Projeto para estudo e portfólio.</p>
      </footer>
    </div>
  );
}
