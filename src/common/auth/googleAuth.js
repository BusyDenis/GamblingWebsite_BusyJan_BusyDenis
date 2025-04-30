const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
});

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            sub: payload.sub // Google's unique identifier for the user
        };
    } catch (error) {
        console.error('Error verifying Google token:', error);
        throw error;
    }
}

module.exports = { verifyGoogleToken }; 