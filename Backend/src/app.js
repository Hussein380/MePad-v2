const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://mepad.vercel.app'  // Add your frontend URL here
    ],
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler
app.use(errorHandler);

module.exports = app; 