const express = require('express');
const router = express.Router();
const { verifyGoogleToken } = require('./googleAuth');
const { findOrCreateUser, getUser, setUsername } = require('../models/User');

router.post('/google/callback', async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token) {
            return res.status(400).json({ success: false, message: 'No ID token provided' });
        }

        // Verify the Google token
        const googleData = await verifyGoogleToken(id_token);
        
        // Find or create user in our system
        const user = findOrCreateUser(googleData);
        
        // Store user in session
        req.session.userId = user.id;
        
        res.json({ 
            success: true, 
            user: {
                name: user.name,
                email: user.email,
                picture: user.picture,
                coins: user.coins,
                hasSetUsername: user.hasSetUsername,
                username: user.username
            },
            requireUsername: !user.hasSetUsername
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Authentication failed' 
        });
    }
});

// New route for setting username
router.post('/set-username', (req, res) => {
    const { username } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authenticated' 
        });
    }

    const result = setUsername(userId, username);
    
    if (result.valid) {
        res.json({
            success: true,
            user: {
                name: result.user.name,
                email: result.user.email,
                picture: result.user.picture,
                coins: result.user.coins,
                username: result.user.username,
                hasSetUsername: true
            }
        });
    } else {
        res.status(400).json({
            success: false,
            message: result.message
        });
    }
});

// Route to check if user is authenticated
router.get('/check', (req, res) => {
    if (req.session.userId) {
        const user = getUser(req.session.userId);
        if (user) {
            res.json({ 
                authenticated: true, 
                user: {
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    coins: user.coins,
                    username: user.username,
                    hasSetUsername: user.hasSetUsername
                },
                requireUsername: !user.hasSetUsername
            });
            return;
        }
    }
    res.json({ authenticated: false });
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

module.exports = router; 