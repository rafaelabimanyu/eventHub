const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.event.createMany({
    data: [
      {
        title: "Vite + React Workshop",
        date: new Date("2026-06-15T10:00:00Z"),
        location: "Online / Zoom",
        description: "Pelajari cara membangun aplikasi web modern dengan Vite dan React dengan performa luar biasa.",
        category: "Teknologi",
        quota: 100
      },
      {
        title: "Jakarta Tech Meetup 2026",
        date: new Date("2026-07-20T18:00:00Z"),
        location: "Jakarta, Indonesia",
        description: "Networking dan sesi berbagi tentang tren teknologi terkini di Indonesia, mulai dari AI hingga Cloud Computing.",
        category: "Teknologi",
        quota: 50
      },
      {
        title: "Surabaya Business Summit",
        date: new Date("2026-08-10T09:00:00Z"),
        location: "Surabaya, Indonesia",
        description: "Konferensi bisnis terbesar di Jawa Timur yang menghadirkan para pakar industri dan pengusaha sukses.",
        category: "Bisnis",
        quota: 200
      },
      {
        title: "Indie Music Festival",
        date: new Date("2026-09-05T16:00:00Z"),
        location: "Bandung, Indonesia",
        description: "Festival musik indie tahunan dengan lineup musisi lokal berbakat. Nikmati akhir pekan yang seru bersama teman-teman.",
        category: "Musik",
        quota: 500
      }
    ],
  });
  console.log("Seeding dummy events finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
