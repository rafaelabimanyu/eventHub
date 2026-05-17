const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (Organizer/Admin)
router.get('/organizer/my-events', protect, eventController.getOrganizerEvents);
router.post('/', protect, eventController.createEvent);
router.put('/:id', protect, eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);

module.exports = router;
