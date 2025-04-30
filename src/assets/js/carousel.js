function initCarousel() {
    console.log('Carousel initialization started');
    
    const games = [
        { 
            name: 'Mine',     
            img: '../assets/images/Mines.png',
            instructions: 'Wähle Felder, vermeide Minen. Jeder sichere Klick erhöht deinen Multiplikator. Je weniger sichere Felder du wählst, desto höher dein potenzieller Gewinn!',
            maxWin: '10,000×',
            pagePath: 'mines.html'
        },
        { 
            name: 'Towers',   
            img: '../assets/images/Towers.png',
            instructions: 'Klettere die Türme hinauf und wähle deinen Weg weise. Jede richtige Entscheidung multipliziert deinen Einsatz. Cashout jederzeit möglich!',
            maxWin: '5,000×',
            pagePath: 'towers.html'
        },
        { 
            name: 'Dice',     
            img: '../assets/images/Dice.png',
            instructions: 'Setze auf höher oder niedriger als deine Zielzahl. Passe deine Gewinnchancen an - je riskanter dein Einsatz, desto höher der potenzielle Gewinn!',
            maxWin: '1,000×',
            pagePath: 'dice.html'
        },
        { 
            name: 'Roulette', 
            img: '../assets/images/Roulette.png',
            instructions: 'Klassisches Roulette mit modernem Touch. Setze auf Zahlen, Farben oder Kombinationen. Multiple Wetteinsätze für maximale Gewinnchancen!',
            maxWin: '35×',
            pagePath: 'roulette.html'
        },
        { 
            name: 'Coin Flip',
            img: '../assets/images/CoinFlip.png',
            instructions: 'Kopf oder Zahl? Klassische 50/50 Action! Schnelle Runden und sofortige Auszahlung. Perfekt für Spieler, die es einfach mögen!',
            maxWin: '2×',
            pagePath: 'coinflip.html'
        },
        { 
            name: 'Plinko',   
            img: '../assets/images/Plinko.png',
            instructions: 'Wähle deinen Einsatz und Risiko-Level, dann lass die Kugel fallen! Multiple Pfade und Multiplikatoren machen jedes Spiel einzigartig!',
            maxWin: '1,000×',
            pagePath: 'plinko.html'
        }
    ];

    // ... existing carousel initialization code ...

    function updateGameDescription(index) {
        const game = games[index];
        const descriptionContainer = document.querySelector('.game-description');
        
        // Create new content with animation
        descriptionContainer.innerHTML = `
            <h2>${game.name}</h2>
            <p>${game.instructions}</p>
            <div class="game-stats">
                <div class="max-win">${game.maxWin}</div>
                <div class="max-win-label">Max Win</div>
            </div>
            <a href="#" data-page="${game.pagePath}" class="play-now-btn">
                <span>Play Now</span>
                <i class="fas fa-play-circle"></i>
            </a>
        `;
        
        // Remove and add animation class
        descriptionContainer.classList.remove('animate');
        void descriptionContainer.offsetWidth; // Trigger reflow
        descriptionContainer.classList.add('animate');
    }

    // Update description when rotating carousel
    function rotateToIndex(index) {
        if (snapping) return;
        
        snapping = true;
        const targetRotation = -index * stepAngle;
        carousel.style.transition = 'transform 0.6s ease-out';
        carousel.style.transform = `rotateY(${targetRotation}deg)`;
        rotation = targetRotation;
        velocity = 0;
        
        // Update game description
        updateGameDescription(index);
        
        carousel.addEventListener('transitionend', () => {
            carousel.style.transition = '';
            snapping = false;
        }, { once: true });
    }

    // ... rest of the existing carousel code ...

    // Initialize first game description
    updateGameDescription(0);
} 