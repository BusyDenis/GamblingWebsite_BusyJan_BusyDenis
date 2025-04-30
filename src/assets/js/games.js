// Balance Management
let currentBalance = 1000.00; // Initial balance for demo purposes

function updateBalance(amount) {
    currentBalance = amount;
    document.getElementById('currentBalance').textContent = currentBalance.toFixed(2);
}

function handleDeposit() {
    // This would typically open a modal or redirect to a deposit page
    alert('Einzahlung-Funktion wird noch implementiert');
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize balance display
    updateBalance(currentBalance);

    // Add deposit button click handler
    const depositBtn = document.querySelector('.deposit-btn');
    if (depositBtn) {
        depositBtn.addEventListener('click', handleDeposit);
    }

    // Initialize games grid
    loadGames();
});

// Sample games data - This would typically come from a backend API
const games = [
    {
        id: 1,
        name: 'Poker',
        description: 'Texas Hold\'em Poker',
        minBet: 5.00,
        image: '../assets/images/poker.jpg'
    },
    {
        id: 2,
        name: 'Blackjack',
        description: 'Classic Casino Blackjack',
        minBet: 2.00,
        image: '../assets/images/blackjack.jpg'
    },
    {
        id: 3,
        name: 'Roulette',
        description: 'Europäisches Roulette',
        minBet: 1.00,
        image: '../assets/images/roulette.jpg'
    }
    // More games can be added here
];

function loadGames() {
    const gamesContainer = document.querySelector('.games-container');
    if (!gamesContainer) return;

    games.forEach(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
    });
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <div class="game-image">
            <img src="${game.image}" alt="${game.name}" onerror="this.src='../assets/images/placeholder.jpg'">
        </div>
        <div class="game-info">
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p class="min-bet">Minimum Einsatz: CHF ${game.minBet.toFixed(2)}</p>
            <button class="play-btn" onclick="startGame(${game.id})">
                Spielen
                <i class="fas fa-play"></i>
            </button>
        </div>
    `;
    return card;
}

function startGame(gameId) {
    // This function would handle starting the selected game
    // For now, we'll just show an alert
    const game = games.find(g => g.id === gameId);
    if (game) {
        alert(`${game.name} wird gestartet...`);
    }
} 