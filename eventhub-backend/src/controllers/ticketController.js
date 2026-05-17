const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-YOUR_SERVER_KEY',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_CLIENT_KEY'
});

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
      let status = 'SUCCESS';
      if (event.price > 0) {
        status = 'PENDING';
      }

      const ticket = await tx.ticket.create({
        data: { userId, eventId, status }
      });

      // 3. Decrement quota only if success
      if (status === 'SUCCESS') {
        await tx.event.update({
          where: { id: eventId },
          data: { quota: { decrement: 1 } }
        });
      }

      return { ticket, event };
    });

    const { ticket, event } = result;

    if (ticket.status === 'PENDING' && event.price > 0) {
      // create snap token
      const parameter = {
        transaction_details: {
          order_id: ticket.id,
          gross_amount: event.price
        },
        credit_card: {
          secure: true
        }
      };
      
      const transaction = await snap.createTransaction(parameter);
      res.status(201).json({ message: 'Lanjut ke pembayaran', ticket, snapToken: transaction.token });
    } else {
      res.status(201).json({ message: 'Pendaftaran berhasil!', ticket });
    }

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

const checkIn = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.role !== 'admin' && req.user.role !== 'organizer') {
       return res.status(403).json({ message: 'Not authorized to check in tickets' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { user: true, event: true }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.status !== 'SUCCESS') {
       return res.status(400).json({ message: `Cannot check in ticket with status ${ticket.status}` });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status: 'CHECKED_IN' },
      include: { user: { select: { name: true } } }
    });

    res.status(200).json({ message: 'Check-in successful', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookTicket, checkRegistration, getMyTickets, checkIn };
