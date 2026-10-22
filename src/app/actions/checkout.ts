"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// O cliente envia APENAS id e quantidade. Preço e estoque vêm do banco.
export interface CheckoutItemInput {
    productId: string;
    quantity: number;
}

export async function createCheckout(items: CheckoutItemInput[]) {
    // 1. Autorização no servidor
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Você precisa estar logado para finalizar a compra.");
    }

    // 2. Validação básica da entrada (nunca confie no cliente)
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Carrinho vazio.");
    }
    for (const item of items) {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            throw new Error("Quantidade inválida.");
        }
    }

    // 3. Busca os produtos reais no banco
    const products = await prisma.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
    });

    // 4. Monta as linhas do pedido com preço do BANCO e valida estoque
    const orderLines = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            throw new Error("Produto não encontrado.");
        }
        if (item.quantity > product.stock) {
            throw new Error(`Estoque insuficiente para "${product.name}".`);
        }
        return { product, quantity: item.quantity };
    });

    const totalCents = orderLines.reduce(
        (sum, line) => sum + line.product.priceCents * line.quantity,
        0
    );

    // 5. Cria o pedido PENDING com os itens (snapshot do preço)
    const order = await prisma.order.create({
        data: {
            userId,
            totalCents,
            items: {
                create: orderLines.map((line) => ({
                    productId: line.product.id,
                    quantity: line.quantity,
                    priceCents: line.product.priceCents,
                })),
            },
        },
    });

    // 6. Cria a sessão do Stripe Checkout
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: orderLines.map((line) => ({
            quantity: line.quantity,
            price_data: {
                currency: "brl",
                unit_amount: line.product.priceCents, // já em centavos
                product_data: { name: line.product.name },
            },
        })),
        metadata: { orderId: order.id },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    });

    // 7. Guarda o id da sessão para o webhook localizar o pedido depois
    await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
    });

    // 8. Redireciona para a página de pagamento do Stripe
    redirect(session.url!);
}
