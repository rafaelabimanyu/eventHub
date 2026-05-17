const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (Organizer/Admin)
router.get('/organizer/my-events', protect, eventController.getOrganizerEvents);
router.post('/', protect, upload.single('image'), eventController.createEvent);
router.put('/:id', protect, upload.single('image'), eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);

module.exports = router;
