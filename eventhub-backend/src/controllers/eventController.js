// In a real app, you would import prisma from ../config/prisma
// const prisma = require('../config/prisma');

// Dummy data for initial setup
const dummyEvents = [
  {
    id: "1",
    title: "Vite + React Workshop",
    date: new Date("2026-06-15T10:00:00Z"),
    location: "Online / Zoom",
    description: "Learn how to build modern web apps with Vite and React."
  },
  {
    id: "2",
    title: "Jakarta Tech Meetup",
    date: new Date("2026-07-20T18:00:00Z"),
    location: "Jakarta, Indonesia",
    description: "Networking and sharing about latest tech trends."
  }
];

const getEvents = async (req, res) => {
  try {
    // When DB is ready: const events = await prisma.event.findMany();
    res.status(200).json(dummyEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
};
