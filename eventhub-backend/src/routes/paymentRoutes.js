const express = require('express');
const { handleMidtransWebhook } = require('../controllers/paymentController');

const router = express.Router();

router.post('/webhook', handleMidtransWebhook);

module.exports = router;
