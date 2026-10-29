import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    // 1. Corpo BRUTO: a assinatura é calculada sobre os bytes exatos.
    //    Com req.json() o corpo seria reserializado e a verificação falharia.
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // 2. Só confie no evento depois que a assinatura for verificada.
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId;
                if (!orderId) break;

                await prisma.$transaction(async (tx) => {
                    // Idempotência: só o primeiro processamento encontra PENDING.
                    // Em evento duplicado, count será 0 e nada mais acontece.
                    const result = await tx.order.updateMany({
                        where: { id: orderId, status: "PENDING" },
                        data: { status: "PAID" },
                    });

                    if (result.count === 0) return;

                    const items = await tx.orderItem.findMany({
                        where: { orderId },
                    });

                    for (const item of items) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: { stock: { decrement: item.quantity } },
                        });
                    }
                });
                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId;
                if (!orderId) break;

                await prisma.order.updateMany({
                    where: { id: orderId, status: "PENDING" },
                    data: { status: "CANCELLED" },
                });
                break;
            }

            default:
                // Eventos que não tratamos: responda 200 para o Stripe não reenviar.
                break;
        }
    } catch (error) {
        console.error("Webhook processing failed", error);
        // 500 faz o Stripe tentar de novo mais tarde. A transação desfaz
        // tudo se algo falhar no meio, então o retry é seguro.
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
