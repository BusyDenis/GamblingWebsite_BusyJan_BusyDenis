function initCarousel() {
    console.log('Carousel initialization started');
    
    const games = [
        { 
            name: 'Mine',     
            img: '../assets/images/Mines.png',
            description: 'Test your luck and strategy in our thrilling Mines game! Choose how many mines to play with and reveal tiles to win. Each safe tile increases your multiplier, but hit a mine and it\'s game over. The fewer safe tiles you select, the higher your potential winnings!',
            maxWin: '10,000x',
            rtp: '97%',
            features: [
                'Adjustable risk levels',
                'Auto cashout option',
                'Live multiplier tracking',
                'Instant results'
            ],
            path: 'mines.html'
        },
        { 
            name: 'Towers',   
            img: '../assets/images/Towers.png',
            description: 'Scale the Towers of Fortune in this exciting climbing game! Choose your path wisely as you ascend through multiple levels. Each correct choice takes you higher and multiplies your winnings. Will you play it safe and cash out, or risk it all for the maximum prize?',
            maxWin: '5,000x',
            rtp: '96.5%',
            features: [
                'Multiple tower levels',
                'Progressive multipliers',
                'Safe route tracking',
                'Quick play option'
            ],
            path: 'towers.html'
        },
        { 
            name: 'Dice',     
            img: '../assets/images/Dice.png',
            description: 'Roll the dice and win big in this classic game of chance! Set your target number and bet on whether the roll will be higher or lower. Adjust your odds for bigger potential wins - the riskier the bet, the higher the payout!',
            maxWin: '1,000x',
            rtp: '98%',
            features: [
                'Adjustable odds',
                'Custom bet amounts',
                'Hot and cold numbers',
                'Quick roll feature'
            ],
            path: 'dice.html'
        },
        { 
            name: 'Roulette', 
            img: '../assets/images/Roulette.png',
            description: 'Experience the thrill of classic Roulette! Place your bets on single numbers, combinations, or colors. Our beautiful 3D wheel provides a premium casino experience. Multiple betting options give you complete control over your risk and potential rewards.',
            maxWin: '35x',
            rtp: '97.3%',
            features: [
                'European roulette wheel',
                'Multiple bet types',
                'Bet history tracking',
                'Statistics and hot numbers'
            ],
            path: 'roulette.html'
        },
        { 
            name: 'Coin Flip',
            img: '../assets/images/CoinFlip.png',
            description: 'Simple yet exciting - our Coin Flip game offers pure 50/50 action! Choose heads or tails and watch the coin spin. With instant results and quick betting options, you can play multiple rounds in seconds. Perfect for those who love straightforward gambling!',
            maxWin: '2x',
            rtp: '99%',
            features: [
                'Fair 50/50 odds',
                'Quick play mode',
                'Streak tracking',
                'Double or nothing option'
            ],
            path: 'coinflip.html'
        },
        { 
            name: 'Plinko',   
            img: '../assets/images/Plinko.png',
            description: 'Watch your chips bounce their way to big wins in Plinko! Choose your risk level and drop point, then watch as physics determines your prize. With multiple paths and prize multipliers, every drop is an exciting journey to potential riches!',
            maxWin: '1,000x',
            rtp: '97%',
            features: [
                'Multiple drop points',
                'Risk level selection',
                'Real-time physics',
                'Auto-drop feature'
            ],
            path: 'plinko.html'
        }
    ];
    const count     = games.length;
    const radius    = 400;
    const stepAngle = 360 / count;
    let rotation    = 0, velocity = 0, snapping = false;
    const friction  = 0.95, minVel = 0.2;
    let isMouseOver = false;
    let currentGameIndex = 0;

    const carousel = document.getElementById('carousel');
    if (!carousel) {
        console.error('Carousel element not found!');
        return;
    }

    // Create games container and description
    const gamesContainer = document.createElement('div');
    gamesContainer.className = 'games-container';
    carousel.parentElement.parentElement.appendChild(gamesContainer);

    const carouselContainer = carousel.parentElement;
    gamesContainer.appendChild(carouselContainer);

    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'game-description';
    gamesContainer.appendChild(descriptionContainer);
    
    function calculateCurrentGame(rotation) {
        // Normalize the rotation to 0-360 degrees
        let normalizedRotation = -rotation % 360;
        if (normalizedRotation < 0) normalizedRotation += 360;
        
        // Calculate which game is at the front
        let index = Math.round(normalizedRotation / stepAngle) % count;
        return index;
    }

    function updateGameDescription(index) {
        const game = games[index];
        console.log('Updating description for game:', game.name); // Debug log
        
        descriptionContainer.innerHTML = `
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <div class="game-features">
                <h3>Key Features:</h3>
                <ul>
                    ${game.features.map(feature => `<li><i class="fas fa-check"></i>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="game-stats">
                <div class="stat-item">
                    <div class="stat-value">${game.maxWin}</div>
                    <div class="stat-label">Max Win</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${game.rtp}</div>
                    <div class="stat-label">RTP</div>
                </div>
            </div>
            <a href="#" data-page="${game.path}" class="play-now-btn">
                <span>Play Now</span>
                <i class="fas fa-play-circle"></i>
            </a>
        `;
        
        // Remove and add active class with a slight delay for animation
        descriptionContainer.classList.remove('active');
        setTimeout(() => {
            descriptionContainer.classList.add('active');
        }, 50);
    }

    console.log('Creating carousel cards...');
    carousel.innerHTML = ''; // Clear existing content
    
    // Create and position cards
    games.forEach((g, i) => {
        const c = document.createElement('div');
        c.className = 'card';
        c.style.backgroundImage = `url(${g.img})`;
        c.textContent = g.name;
        c.style.transform = `rotateY(${i*stepAngle}deg) translateZ(${radius}px)`;
        
        // Add click handler for each card
        c.addEventListener('click', () => {
            const targetRotation = -i * stepAngle;
            carousel.style.transition = 'transform 0.6s ease-out';
            carousel.style.transform = `rotateY(${targetRotation}deg)`;
            rotation = targetRotation;
            velocity = 0;
            updateGameDescription(i);
        });
        
        carousel.appendChild(c);
    });

    // Initialize first game description
    updateGameDescription(0);

    carousel.addEventListener('mouseenter', () => {
        isMouseOver = true;
    });

    carousel.addEventListener('mouseleave', () => {
        isMouseOver = false;
        velocity = 0;
    });

    carousel.addEventListener('wheel', e => {
        if (!snapping) {
            e.preventDefault();
            velocity += e.deltaY * 0.02;
        }
    }, { passive: false });

    function animate() {
        if (!snapping && isMouseOver) {
            if (Math.abs(velocity) > 0.001) {
                rotation += velocity;
                carousel.style.transform = `rotateY(${rotation}deg)`;
                velocity *= friction;
                
                // Update current game based on rotation
                const newIndex = calculateCurrentGame(rotation);
                if (newIndex !== currentGameIndex) {
                    currentGameIndex = newIndex;
                    updateGameDescription(newIndex);
                }

                if (Math.abs(velocity) < minVel) {
                    snapping = true;
                    const target = Math.round(rotation/stepAngle)*stepAngle;
                    carousel.style.transition = 'transform 0.6s ease-out';
                    carousel.style.transform = `rotateY(${target}deg)`;
                    rotation = target;
                    velocity = 0;
                    
                    // Update description after snapping
                    const finalIndex = calculateCurrentGame(target);
                    if (finalIndex !== currentGameIndex) {
                        currentGameIndex = finalIndex;
                        updateGameDescription(finalIndex);
                    }
                    
                    carousel.addEventListener('transitionend', () => {
                        carousel.style.transition = '';
                        snapping = false;
                    }, { once:true });
                }
            }
        }
        requestAnimationFrame(animate);
    }
    
    console.log('Starting carousel animation...');
    animate();
} 