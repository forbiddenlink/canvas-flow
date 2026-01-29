import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default user if doesn't exist
  const defaultUser = await prisma.user.upsert({
    where: { email: 'default@pixelforge.app' },
    update: {},
    create: {
      id: 'default-user',
      email: 'default@pixelforge.app',
      name: 'Default User',
      subscriptionTier: 'free',
      apiUsageLimit: 100,
      isActive: true,
    },
  });

  console.log('Default user created/updated:', defaultUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
