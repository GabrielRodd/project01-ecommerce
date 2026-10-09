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

## Decisões arquiteturais

### Banco

PostgreSQL + Prisma.

### Dinheiro

Inteiros em centavos.

### Autenticação

Clerk.

### Pagamento

Stripe Checkout + webhook.

### Carrinho

Zustand.

## Próximo passo

ETAPA 05 — Carrinho com Zustand (escopo a definir antes de implementar).

## Problemas conhecidos

Nenhum.

## Decisões que NÃO devem ser alteradas

Não migrar para outra stack sem decisão explícita.

Não substituir Prisma por outro ORM.

Não adicionar backend separado em Spring Boot neste projeto.