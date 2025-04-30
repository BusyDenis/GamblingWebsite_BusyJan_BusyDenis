const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./common/auth/authRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for your frontend URL
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Use authentication routes
app.use('/auth', authRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 