const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));

// Static file serving for uploads (videos, audio, reels)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('AI Testimonial Backend is running...');
});

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

module.exports = app;
