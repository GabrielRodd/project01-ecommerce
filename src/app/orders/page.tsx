import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatters";

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
    PENDING: "Aguardando pagamento",
    PAID: "Pago",
    CANCELLED: "Cancelado",
} as const;

const STATUS_STYLE = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    CANCELLED: "bg-zinc-200 text-zinc-700",
} as const;

export default async function OrdersPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
    });

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
                Meus Pedidos
            </h1>

            {orders.length === 0 ? (
                <div className="text-zinc-500">
                    <p>Você ainda não fez nenhum pedido.</p>
                    <Link href="/" className="mt-2 inline-block underline hover:opacity-80">
                        Ver catálogo
                    </Link>
                </div>
            ) : (
                <ul className="flex flex-col gap-6">
                    {orders.map((order) => (
                        <li
                            key={order.id}
                            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-zinc-500">
                                    {order.createdAt.toLocaleDateString("pt-BR")}
                                </span>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[order.status]}`}
                                >
                                    {STATUS_LABEL[order.status]}
                                </span>
                            </div>

                            <ul className="flex flex-col gap-2">
                                {order.items.map((item) => (
                                    <li key={item.id} className="flex justify-between text-sm">
                                        <span className="text-zinc-900 dark:text-zinc-100">
                                            {item.quantity}x {item.product.name}
                                        </span>
                                        <span className="text-zinc-600 dark:text-zinc-400">
                                            {formatPrice(item.priceCents)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 flex justify-between border-t border-zinc-200 pt-3 font-semibold dark:border-zinc-800">
                                <span>Total</span>
                                <span>{formatPrice(order.totalCents)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}