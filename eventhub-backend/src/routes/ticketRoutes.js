const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.post('/book', protect, ticketController.bookTicket);
router.get('/check/:eventId', protect, ticketController.checkRegistration);
router.get('/my-tickets', protect, ticketController.getMyTickets);

module.exports = router;
