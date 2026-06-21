import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Seed Games
  const games = [
    {
      id: 'coinflip',
      name: 'Coinflip',
      enabled: true,
      houseEdge: 2,
      minBet: 0.01,
      maxBet: 100,
      autoPlayLimit: 100,
      difficulty: 'normal'
    },
    {
      id: 'mines',
      name: 'Mines',
      enabled: true,
      houseEdge: 3,
      minBet: 0.01,
      maxBet: 50,
      autoPlayLimit: 100,
      difficulty: 'normal'
    },
    {
      id: 'chicks',
      name: 'Chicks',
      enabled: true,
      houseEdge: 3,
      minBet: 0.01,
      maxBet: 50,
      autoPlayLimit: 100,
      difficulty: 'normal'
    },
    {
      id: 'latina-tower',
      name: 'Latina Tower',
      enabled: true,
      houseEdge: 4,
      minBet: 0.05,
      maxBet: 100,
      autoPlayLimit: 100,
      difficulty: 'normal'
    }
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: {},
      create: game
    });
  }
  console.log('Games seeded');

  // Seed Settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Leaf Blox',
      siteUrl: 'https://leafblox.com',
      maintenanceMode: false,
      minDeposit: 0.01,
      maxDeposit: 1000,
      minWithdrawal: 0.1,
      maxWithdrawal: 1000,
      withdrawalFee: 0.5,
      twoFactorAuth: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      rateLimiting: 60,
      emailNotifications: true,
      supportEmail: 'support@leafblox.com'
    }
  });
  console.log('Settings seeded');

  // Seed Levels
  const levels = [
    { level: 1, title: 'Newbie', xpRequired: 0, reward: '0.01 SOL' },
    { level: 5, title: 'Bronze', xpRequired: 500, reward: '0.05 SOL' },
    { level: 10, title: 'Silver', xpRequired: 1500, reward: '0.1 SOL' },
    { level: 25, title: 'Gold', xpRequired: 5000, reward: '0.5 SOL' },
    { level: 50, title: 'Platinum', xpRequired: 15000, reward: '1.0 SOL' },
    { level: 100, title: 'Diamond', xpRequired: 50000, reward: '5.0 SOL' }
  ];

  for (const level of levels) {
    await prisma.level.upsert({
      where: { level: level.level },
      update: {},
      create: level
    });
  }
  console.log('Levels seeded');

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
