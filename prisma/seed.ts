import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initialProducts = [
  {
    name: 'Teclado Mecânico RGB',
    slug: 'teclado-mecanico-rgb',
    description: 'Teclado mecânico switch blue com iluminação RGB personalizável.',
    priceCents: 29990, // R$ 299,90
    stock: 15,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'],
  },
  {
    name: 'Mouse Gamer 16000 DPI',
    slug: 'mouse-gamer-16000-dpi',
    description: 'Mouse óptico de alta precisão com botões programáveis.',
    priceCents: 15990, // R$ 159,90
    stock: 25,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'],
  },
  {
    name: 'Headset Gamer 7.1',
    slug: 'headset-gamer-7-1',
    description: 'Headset surround 7.1 com microfone antirruído e almofadas confortáveis.',
    priceCents: 24990, // R$ 249,90
    stock: 10,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'],
  },
]

async function main() {
  console.log('Iniciando o seeding de produtos...')

  for (const product of initialProducts) {
    const upserted = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
    console.log(`Produto processado: ${upserted.name} (${upserted.slug})`)
  }

  console.log('Seeding concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
