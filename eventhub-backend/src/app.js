const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files (for uploaded images)
app.use(express.static('public'));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('EventHub API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  // If it's a Multer error or any other unhandled error
  res.status(500).json({ 
    message: err.message || 'Internal Server Error',
    success: false 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
