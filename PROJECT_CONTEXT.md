# PROJECT CONTEXT

## Objetivo

E-commerce fullstack para estudo e portfólio.

## Stack

Next.js
TypeScript
PostgreSQL
Prisma
Clerk
Zustand
Stripe
Resend
Vercel

## Status atual

ETAPA 01 — concluída

- Projeto Next.js criado
- TypeScript configurado
- App Router configurado
- Git configurado
- Primeiro commit realizado

ETAPA 02 — concluída

- PostgreSQL conectado via Neon
- Schema Prisma configurado com model Product (`price_cents`, `slug`, `stock`)
- Migration inicial aplicada
- Singleton do Prisma Client configurado em `src/lib/prisma.ts`
- Script de seed (`prisma/seed.ts`) configurado e validado

ETAPA 03 — concluída

- Catálogo de produtos na Home implementado via Server Component assíncrono buscando dados com Prisma
- Componente `ProductCard` criado com imagem remota, fallback e indicação de estoque
- Utilitário `formatPrice` criado em `src/lib/formatters.ts` para formatação em BRL a partir de centavos
- `next.config.ts` configurado com `remotePatterns` para imagens do Unsplash

ETAPA 04 — concluída

- Página de detalhes `/products/[slug]` implementada como Server Component assíncrono
- Busca por slug com `prisma.product.findUnique` e `notFound()` para slugs inexistentes
- `params` tratado como Promise (`await params`)
- `ProductCard` agora é um `Link` para a página de detalhes

ETAPA 05 — concluída

- `zustand` instalado; store do carrinho em `src/store/cartStore.ts` com `persist` (localStorage, chave `ecommerce-cart`)
- Ações: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `getTotalItems`, `getTotalPriceCents` (tudo em centavos, com limite de estoque)
- `AddToCartButton` (Client Component) integrado na página de detalhes
- `Header` global no `layout.tsx` com `CartButton` (link para `/cart` com badge de contagem)
- Padrão `mounted` (useState + useEffect) para evitar hydration mismatch com o localStorage
- Página `/cart` (Client Component) com alterar quantidade, remover, esvaziar e subtotal
- Ambiente: `.env` com `DATABASE_URL` (Neon) necessário localmente; `npx prisma generate` após `npm install`

ETAPA 06 — concluída

- `@clerk/nextjs` instalado; aplicação criada no dashboard do Clerk
- Chaves em `.env.local` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`); nomes documentados em `.env.example`
- `src/proxy.ts` com `clerkMiddleware()` (Next 16 usa `proxy.ts`, não `middleware.ts`); não protege nenhuma rota por padrão
- `ClerkProvider` dentro do `<body>` em `src/app/layout.tsx`
- `Header` com `Show` (signed-in/signed-out), `SignInButton`/`SignUpButton` (mode modal) e `UserButton`
- Autorização real deve ser feita no servidor com `await auth()` (UI condicional não é segurança)
- Ainda não há rotas protegidas nem sincronização do usuário com o banco (guardar `userId` do Clerk nos pedidos)

ETAPA 07 — concluída

- Modelagem de pedidos no Prisma:
  - `enum OrderStatus` (`PENDING`, `PAID`, `CANCELLED`);
  - `model Order`: `userId` (referência ao Clerk com `@@index([userId])`), `status`, `totalCents`, `stripeSessionId` único;
  - `model OrderItem`: chave estrangeira para `Order` (`onDelete: Cascade`) e para `Product` (`onDelete: Restrict`), `quantity` e snapshot de preço `priceCents`;
  - Relação reversa `orderItems` adicionada ao `model Product`;
- Migration `20261013130441_add_orders_and_order_items` gerada e aplicada com sucesso no PostgreSQL (Neon);
- Prisma Client atualizado com os novos tipos (`Order`, `OrderItem`, `OrderStatus`).

ETAPA 08 — concluída

- `stripe` instalado; client server-only em `src/lib/stripe.ts` (`STRIPE_SECRET_KEY` em `.env.local`, falha se ausente)
- Server Action `createCheckout` em `src/app/actions/checkout.ts`: valida `auth()`, recebe só `productId` e `quantity`, busca preço/estoque no banco, cria `Order` PENDING com `OrderItem` (snapshot de preço), cria Stripe Checkout Session (`metadata.orderId`), salva `stripeSessionId` e redireciona
- `CheckoutButton` no carrinho; páginas de retorno do checkout e `/checkout/cancel`
- Pedido permanece `PENDING` após o pagamento; só o webhook (etapa 09) pode marcar `PAID`
- Gotcha: após alterar o schema, rodar `npx prisma generate` e reiniciar o `npm run dev` (singleton em `globalThis` mantém o client antigo; sintoma: `prisma.order` undefined)

ETAPA 09 — concluída

- Webhook em `src/app/api/webhooks/stripe/route.ts` (Route Handler `POST`):
  - lê o corpo BRUTO (`req.text()`) e valida a assinatura (`stripe-signature`) com `stripe.webhooks.constructEvent` e `STRIPE_WEBHOOK_SECRET`; assinatura ausente/inválida retorna 400;
  - `checkout.session.completed`: dentro de `prisma.$transaction`, `updateMany` de `PENDING` para `PAID` (idempotência: em evento duplicado `count === 0` e nada mais acontece) e `decrement` do estoque de cada `OrderItem`;
  - `checkout.session.expired`: `updateMany` de `PENDING` para `CANCELLED`;
  - outros eventos: responde 200 e ignora; erro de processamento: responde 500 (Stripe reenvia; a transação desfaz tudo, então o retry é seguro);
  - eventos atrasados/fora de ordem: protegidos pelo filtro `status: "PENDING"` (uma sessão ou foi paga ou expirou).
- `ClearCartOnMount` (Client Component, `src/components/ClearCartOnMount.tsx`) incluído em `src/app/checkout/success/page.tsx` para chamar `clearCart()` ao voltar do Stripe; a página continua sendo Server Component.
- `STRIPE_WEBHOOK_SECRET` em `.env.local` (nome documentado em `.env.example`); o valor `whsec_...` vem do `stripe listen` em desenvolvimento (em produção virá do endpoint cadastrado no dashboard do Stripe).
- Testes realizados (Stripe CLI + cartão `4242 4242 4242 4242`): pedido passou de `PENDING` para `PAID`, estoque diminuiu, e o reenvio do mesmo evento (`stripe events resend evt_...`) retornou 200 sem baixar o estoque de novo (idempotência validada); carrinho zerado após a compra.
- Como testar localmente:
  1. `npm run dev`;
  2. em outro terminal: `stripe listen --events checkout.session.completed,checkout.session.expired --forward-to localhost:3000/api/webhooks/stripe`;
  3. copiar o `whsec_...` impresso para `STRIPE_WEBHOOK_SECRET` no `.env.local` e reiniciar o `npm run dev`;
  4. fazer uma compra de teste e conferir no Prisma Studio.
- Gotchas do Stripe CLI:
  - o CLI só encaminha eventos que ocorrem enquanto o `stripe listen` está rodando e só da conta em que está logado; se a conta for diferente da `STRIPE_SECRET_KEY`, nada chega ao webhook (sintoma: `stripe events list` vazio e pedido preso em `PENDING`). Conferir o `acct_...` exibido pelo CLI;
  - o login nesta versão tem duas etapas: `stripe login` (gera link/código) e `stripe login --complete-device`; escolher a sandbox correta no navegador;
  - `stripe listen` exige `--events` (ou `--all-snapshot`);
  - o `resend` precisa do ID de um evento do tipo tratado (`checkout.session.completed`), não de `charge.updated`;
  - reiniciar o `npm run dev` após mudar o `.env.local`.

ETAPA 10 — concluída

- Página `/orders` em `src/app/orders/page.tsx` (Server Component assíncrono, `force-dynamic`):
  - `await auth()` no servidor; sem `userId` faz `redirect("/")`;
  - `prisma.order.findMany` com `where: { userId }`, `orderBy: { createdAt: "desc" }` e `include` aninhado (`items` → `product`); o filtro por `userId` impede ver pedidos de outros usuários;
  - mostra data, status (`STATUS_LABEL`/`STATUS_STYLE` com `as const`), itens com o snapshot `item.priceCents` e total; estado vazio com link para o catálogo.
- Link "Meus Pedidos" no `Header`, dentro de `<Show when="signed-in">`.
- Pedidos `PENDING` (checkout abandonado) aparecem como "Aguardando pagamento" até a sessão do Stripe expirar.
- Testes realizados: redirect quando deslogado, listagem dos pedidos do usuário e estado vazio.
- Gotcha (Clerk): `CLERK_SECRET_KEY` truncada/inválida no `.env.local` faz o login funcionar no navegador (chave pública), mas o servidor rejeita a sessão. Sintomas: `Header` mostra Entrar/Cadastrar, `auth()` devolve `null` e o erro `cannot_render_single_session_enabled` aparece ao clicar em "Entrar". Solução: copiar a chave completa em Clerk Dashboard → API Keys e reiniciar o `npm run dev`. O `.env.local` não vai para o Git, então confira em cada máquina.
## Decisões arquiteturais

### Banco

PostgreSQL + Prisma.

### Dinheiro

Inteiros em centavos.

### Autenticação

Clerk: sessão via cookie validado no `proxy.ts`; usuários e senhas ficam no Clerk, não no Postgres. Proteção de rotas/ações com `await auth()` no servidor. `userId` do Clerk salvo em `orders` para vincular pedidos ao usuário logado.

### Pagamento

Stripe Checkout + webhook.

### Carrinho

Zustand persistido em `localStorage`.

## Próximo passo

Aguardando definição da ETAPA 11 (sugestões: e-mail de confirmação com Resend, deploy na Vercel com webhook cadastrado no dashboard do Stripe). Opcionalmente, resolver antes o ponto de estoque descrito em "Problemas conhecidos".

## Problemas conhecidos

- **Estoque pode ficar negativo (overselling):** o webhook faz `decrement` do estoque sem verificar se há quantidade suficiente. Se dois clientes pagarem o último item quase ao mesmo tempo, o pagamento já foi cobrado e o estoque fica negativo (o webhook não pode recusar, senão o Stripe reenvia indefinidamente). Nada é registrado hoje.
  - Mitigação simples (não implementada): após o `decrement`, verificar `stock < 0` e registrar `console.error` para reembolso manual.
  - Solução completa (futura): reservar estoque ao criar o checkout, com expiração e liberação da reserva em `checkout.session.expired`.
- **Carrinho limpo ao carregar `/checkout/success`:** o `clearCart()` roda ao montar a página, mesmo que o webhook ainda não tenha confirmado o pagamento (o pedido continua `PENDING` no banco). Melhoria futura: usar o `session_id` da URL de retorno para confirmar o pedido antes de limpar o carrinho.

## Decisões que NÃO devem ser alteradas

Não migrar para outra stack sem decisão explícita.

Não substituir Prisma por outro ORM.

Não adicionar backend separado em Spring Boot neste projeto.