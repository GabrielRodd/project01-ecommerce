import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
    matcher: [
        // Ignora arquivos internos do Next.js e estáticos
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Sempre roda para rotas de API
        '/(api|trpc)(.*)',
        // Sempre roda para as rotas internas do Clerk
        '/__clerk/(.*)',
    ],
}
