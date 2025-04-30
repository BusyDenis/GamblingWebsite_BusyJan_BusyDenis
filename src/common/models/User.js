class User {
    constructor(data) {
        this.id = data.sub;           // Google's unique user ID
        this.email = data.email;
        this.name = data.name;        // Google display name
        this.username = null;         // Custom username (for leaderboard)
        this.picture = data.picture;
        this.createdAt = new Date();
        this.lastLogin = new Date();
        this.coins = 10000;           // Starting coins for new users
        this.hasSetUsername = false;  // Flag to check if username was set
    }
}

// In-memory storage for development
const users = new Map();

// List of forbidden words for username validation
const forbiddenWords = [
    'admin', 'moderator', 'fuck', 'shit', 'ass', 'nigger', 'nigga', 'nig'
    // Add more forbidden words here
];

function isValidUsername(username) {
    // Convert to lowercase for checking
    const lowerUsername = username.toLowerCase();
    
    // Check length (3-20 characters)
    if (username.length < 3 || username.length > 20) {
        return { valid: false, message: 'Username must be between 3 and 20 characters' };
    }
    
    // Check for forbidden words
    if (forbiddenWords.some(word => lowerUsername.includes(word))) {
        return { valid: false, message: 'Username contains inappropriate words' };
    } 

function updateUser(id, updates) {
    const user = users.get(id);
    if (user) {
        Object.assign(user, updates);
        return user;
    }
    return null;
}

function setUsername(userId, username) {
    const validation = isValidUsername(username);
    if (!validation.valid) {
        return validation;
    }
    
    const user = getUser(userId);
    if (user) {
        user.username = username;
        user.hasSetUsername = true;
        return { valid: true, user };
    }
    
    return { valid: false, message: 'User not found' };
}

module.exports = {
    findOrCreateUser,
    getUser,
    updateUser,
    setUsername,
    isValidUsername
}; 