const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: { organizer: { select: { name: true } } }
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
      where: { id: id },
      include: { organizer: { select: { name: true } } }
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrganizerEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, date, location, description, category, quota } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        location,
        description,
        category,
        quota: parseInt(quota),
        userId: req.user.id
      }
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, location, description, category, quota } = req.body;
    
    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) return res.status(404).json({ message: 'Event not found' });
    
    // Check if user is the organizer
    if (existingEvent.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        date: new Date(date),
        location,
        description,
        category,
        quota: parseInt(quota)
      }
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) return res.status(404).json({ message: 'Event not found' });
    
    // Check if user is the organizer
    if (existingEvent.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await prisma.event.delete({ where: { id } });
    res.status(200).json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  getOrganizerEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
