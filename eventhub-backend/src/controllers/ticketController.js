const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bookTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    // Check if user already registered
    const existingTicket = await prisma.ticket.findFirst({
      where: { userId, eventId }
    });

    if (existingTicket) {
      return res.status(400).json({ message: 'Anda sudah terdaftar di event ini.' });
    }

    // Use transaction to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check event quota
      const event = await tx.event.findUnique({ where: { id: eventId } });
      
      if (!event) {
        throw new Error('Event tidak ditemukan');
      }

      if (event.quota <= 0) {
        throw new Error('Mohon maaf, kuota event sudah penuh');
      }

      // 2. Create ticket
      const ticket = await tx.ticket.create({
        data: { userId, eventId }
      });

      // 3. Decrement quota
      await tx.event.update({
        where: { id: eventId },
        data: { quota: { decrement: 1 } }
      });

      return ticket;
    });

    res.status(201).json({ message: 'Pendaftaran berhasil!', ticket: result });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const ticket = await prisma.ticket.findFirst({
      where: { userId, eventId },
      include: { event: true }
    });

    if (ticket) {
      res.status(200).json({ isRegistered: true, ticket });
    } else {
      res.status(200).json({ isRegistered: false });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookTicket, checkRegistration, getMyTickets };
