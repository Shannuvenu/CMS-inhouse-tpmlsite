import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HEADER_ITEMS = [
  { label: 'Home', url: '/', sortOrder: 0 },
  { label: 'Brands', url: '/brands', sortOrder: 1 },
  { label: 'Legacy', url: '/legacy', sortOrder: 2 },
  { label: 'Team', url: '/team', sortOrder: 3 },
  { label: 'Careers', url: '/careers', sortOrder: 4 },
  { label: 'Contact', url: '/contact', sortOrder: 5 },
  { label: 'Testimonials', url: '/testimonials', sortOrder: 6 },
];

const FOOTER_ITEMS = [
  { label: 'Contact us', url: '/contact', sortOrder: 0 },
  { label: 'Careers', url: '/careers', sortOrder: 1 },
];

async function main() {
  await prisma.menuItem.createMany({
    data: HEADER_ITEMS.map((item) => ({ ...item, location: 'HEADER' })),
  });
  await prisma.menuItem.createMany({
    data: FOOTER_ITEMS.map((item) => ({ ...item, location: 'FOOTER' })),
  });
  console.log('Menu items seeded.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());