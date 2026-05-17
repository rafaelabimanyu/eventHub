const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const visitorPassword = await bcrypt.hash('visitor123', 10);

  // Upsert Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventhub.com' },
    update: { password: adminPassword, role: 'admin' },
    create: {
      name: 'Admin EventHub',
      email: 'admin@eventhub.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Upsert Visitor
  const visitor = await prisma.user.upsert({
    where: { email: 'visitor@eventhub.com' },
    update: { password: visitorPassword, role: 'visitor' },
    create: {
      name: 'John Visitor',
      email: 'visitor@eventhub.com',
      password: visitorPassword,
      role: 'visitor',
    },
  });

  console.log('✅ Accounts generated successfully!');
  console.log('--------------------------------------------------');
  console.log('Role: ADMIN');
  console.log(`Email: ${admin.email}`);
  console.log('Password: admin123');
  console.log('--------------------------------------------------');
  console.log('Role: VISITOR');
  console.log(`Email: ${visitor.email}`);
  console.log('Password: visitor123');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
