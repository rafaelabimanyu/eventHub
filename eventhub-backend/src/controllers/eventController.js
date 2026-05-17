const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: 'asc'
      }
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: {
        id: id
      }
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
};
