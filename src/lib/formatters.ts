/**
 * Converte um valor em centavos para a representação monetária brasileira (BRL).
 * Exemplo: 29990 -> "R$ 299,90"
 */
export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}
