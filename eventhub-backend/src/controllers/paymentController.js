const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleMidtransWebhook = async (req, res) => {
  try {
    const notification = req.body;

    const orderId = notification.order_id; // we will use ticket.id as orderId
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    if (!orderId) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    let status = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        status = 'PENDING';
      } else if (fraudStatus === 'accept') {
        status = 'SUCCESS';
      }
    } else if (transactionStatus === 'settlement') {
      status = 'SUCCESS';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      status = 'FAILED';
    } else if (transactionStatus === 'pending') {
      status = 'PENDING';
    }

    if (status === 'SUCCESS') {
      // Use transaction to ensure data integrity
      await prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.findUnique({ where: { id: orderId } });
        if (ticket && ticket.status !== 'SUCCESS') {
          // Update ticket status
          await tx.ticket.update({
            where: { id: orderId },
            data: { status: 'SUCCESS' }
          });
          
          // Decrement event quota
          await tx.event.update({
            where: { id: ticket.eventId },
            data: { quota: { decrement: 1 } }
          });
        }
      });
    } else {
      // Just update ticket status if not success
      await prisma.ticket.updateMany({
        where: { id: orderId, status: { not: 'SUCCESS' } },
        data: { status }
      });
    }

    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { handleMidtransWebhook };
