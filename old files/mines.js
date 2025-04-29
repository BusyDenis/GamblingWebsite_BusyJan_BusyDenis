class MinesGame {
    constructor() {
        this.grid = document.getElementById('mines-grid');
        this.betInput = document.getElementById('bet-amount');
        this.startButton = document.querySelector('.start-button');
        this.nextMultiplierContainer = document.querySelector('.next-container');
        this.profitDisplay = document.querySelector('.profit-value');
        
        this.isGameActive = false;
        this.mines = [];
        this.revealedCells = [];
        this.multiplierHistory = [];
        this.mineCount = 10;
        this.gridSize = 25;
        this.currentBet = 0;
        this.currentProfit = 0;
        this.houseEdge = 0.05; // 5% Hausvorteil
        
        this.assets = {
            coin: '<img src="coin.png" style="width: 100%; height: 100%; object-fit: contain;">',
            bomb: '<img src="bomb.png" style="width: 100%; height: 100%; object-fit: contain;">'
        };
        
        this.setupEventListeners();
        this.initializeGrid();
        this.updateMultiplier(); // Initial multiplier display
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => {
            if (this.isGameActive) {
                this.cashout();
            } else {
                this.startGame();
            }
        });
        
        // Bet amount controls
        document.querySelector('.bet-input button:nth-child(2)').addEventListener('click', () => this.adjustBet('half'));
        document.querySelector('.bet-input button:nth-child(3)').addEventListener('click', () => this.adjustBet('double'));
        document.querySelector('.bet-input button:nth-child(4)').addEventListener('click', () => this.adjustBet('max'));

        // Grid size buttons
        const gridButtons = document.querySelectorAll('.grid-button');
        gridButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.isGameActive) return;
                gridButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                this.gridSize = parseInt(button.textContent);
                this.initializeGrid();
                this.updateMultiplier();
            });
        });

        // Mines count buttons
        const minesButtons = document.querySelectorAll('.mines-button');
        minesButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.isGameActive) return;
                minesButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                
                if (button.textContent === 'Custom') {
                    this.showCustomMinesInput();
                } else {
                    this.mineCount = parseInt(button.textContent);
                    this.updateMultiplier();
                }
            });
        });
    }

    showCustomMinesInput() {
        // Create custom input container if it doesn't exist
        let customInputContainer = document.querySelector('.custom-mines-input');
        if (!customInputContainer) {
            customInputContainer = document.createElement('div');
            customInputContainer.className = 'custom-mines-input';
            customInputContainer.style.marginTop = '10px';
            
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.max = (this.gridSize - 1).toString();
            input.value = this.mineCount;
            input.style.width = '80px';
            input.style.padding = '8px';
            input.style.background = 'var(--dark-bg)';
            input.style.border = 'none';
            input.style.borderRadius = '8px';
            input.style.color = 'var(--text-primary)';
            input.style.marginRight = '10px';

            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Set';
            confirmButton.style.padding = '8px 16px';
            confirmButton.style.background = 'var(--accent-purple)';
            confirmButton.style.border = 'none';
            confirmButton.style.borderRadius = '8px';
            confirmButton.style.color = 'var(--text-primary)';
            confirmButton.style.cursor = 'pointer';

            confirmButton.addEventListener('click', () => {
                const value = parseInt(input.value);
                if (this.validateMineCount(value)) {
                    this.mineCount = value;
                    this.updateMultiplier();
                    customInputContainer.style.display = 'none';
                } else {
                    input.style.borderColor = '#ff4444';
                    setTimeout(() => {
                        input.style.borderColor = 'transparent';
                    }, 2000);
                }
            });

            customInputContainer.appendChild(input);
            customInputContainer.appendChild(confirmButton);
            
            // Insert after mines buttons
            const minesButtons = document.querySelector('.mines-buttons');
            minesButtons.parentNode.insertBefore(customInputContainer, minesButtons.nextSibling);
        } else {
            customInputContainer.style.display = 'flex';
        }
    }

    validateMineCount(count) {
        // Check if count is a valid number
        if (isNaN(count)) return false;
        
        // Check if count is within valid range (1 to gridSize-1)
        if (count < 1 || count >= this.gridSize) return false;
        
        return true;
    }

    initializeGrid() {
        this.grid.innerHTML = '';
        this.grid.className = `mines-grid grid-${Math.sqrt(this.gridSize)}x${Math.sqrt(this.gridSize)}`;
        
        for (let i = 0; i < this.gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.addEventListener('click', () => this.revealCell(i));
            this.grid.appendChild(cell);
        }

        // Update custom input max value if it exists
        const customInput = document.querySelector('.custom-mines-input input');
        if (customInput) {
            customInput.max = (this.gridSize - 1).toString();
            // Validate current value with new grid size
            if (!this.validateMineCount(parseInt(customInput.value))) {
                customInput.value = Math.min(this.mineCount, this.gridSize - 1);
            }
        }
    }

    adjustBet(action) {
        let currentBet = parseFloat(this.betInput.value) || 0;
        switch(action) {
            case 'half':
                this.betInput.value = (currentBet / 2).toFixed(2);
                break;
            case 'double':
                this.betInput.value = (currentBet * 2).toFixed(2);
                break;
            case 'max':
                this.betInput.value = '100.00'; // Example max bet
                break;
        }
    }

    calculateMultiplier(step) {
        // Berechne verbleibende Felder und Minen
        const remainingFields = this.gridSize - step;
        const remainingMines = this.mineCount;
        
        // Berechne sichere Felder
        const safeFields = remainingFields - remainingMines;
        
        // Berechne Wahrscheinlichkeit für sicheres Feld
        const probabilitySafe = safeFields / remainingFields;
        
        // Berechne fairen Multiplikator
        const fairMultiplier = 1 / probabilitySafe;
        
        // Ziehe Hausvorteil ab
        const offeredMultiplier = fairMultiplier * (1 - this.houseEdge);
        
        // Runde auf 2 Dezimalstellen
        const finalMultiplier = Math.floor(offeredMultiplier * 100) / 100;
        
        return finalMultiplier;
    }

    updateMultiplier() {
        const nextMultiplier = this.calculateMultiplier(this.revealedCells.length);
        
        // Update Next display
        const nextContainer = document.querySelector('.next-container');
        if (nextContainer) {
            const nextValue = nextContainer.querySelector('.next-value');
            if (nextValue) {
                nextValue.textContent = nextMultiplier;
            }
        }
    }

    updateProfit() {
        if (this.revealedCells.length === 0) {
            this.currentProfit = 0;
        } else {
            const lastMultiplier = this.multiplierHistory[this.multiplierHistory.length - 1];
            this.currentProfit = (this.currentBet * lastMultiplier - this.currentBet).toFixed(2);
        }
        
        // Update Profit display
        const profitContainer = document.querySelector('.profit-container');
        if (profitContainer) {
            const profitValue = profitContainer.querySelector('.profit-value');
            if (profitValue) {
                profitValue.textContent = this.currentProfit;
            }
        }
    }

    startGame() {
        if (this.isGameActive) return;
        
        const betAmount = parseFloat(this.betInput.value);
        
        this.currentBet = betAmount;
        this.currentProfit = 0;
        this.isGameActive = true;
        this.mines = [];
        this.revealedCells = [];
        this.multiplierHistory = [];
        this.startButton.textContent = 'Cashout';
        
        // Hide custom mines input if visible
        const customInput = document.querySelector('.custom-mines-input');
        if (customInput) {
            customInput.style.display = 'none';
        }
        
        this.placeMines();
        
        // Reset grid appearance
        Array.from(this.grid.children).forEach(cell => {
            cell.className = 'cell';
            cell.innerHTML = '';
            cell.style.background = 'var(--dark-bg)';
            cell.style.borderColor = 'transparent';
        });

        this.updateMultiplier();
        this.updateProfit();
    }

    placeMines() {
        while (this.mines.length < this.mineCount) {
            const position = Math.floor(Math.random() * this.gridSize);
            if (!this.mines.includes(position)) {
                this.mines.push(position);
            }
        }
    }

    revealCell(index) {
        if (!this.isGameActive || this.revealedCells.includes(index)) return;

        const cell = this.grid.children[index];
        
        if (this.mines.includes(index)) {
            this.gameOver(false);
            cell.className = 'cell revealed-mine';
            cell.innerHTML = this.assets.bomb;
        } else {
            this.revealedCells.push(index);
            
            // Calculate current step multiplier
            const stepMultiplier = parseFloat(this.calculateMultiplier(this.revealedCells.length));
            this.multiplierHistory.push(stepMultiplier);
            
            cell.className = 'cell revealed-safe';
            
            // Add coin with multiplier badge
            cell.innerHTML = `
                <div style="position: relative; width: 100%; height: 100%;">
                    ${this.assets.coin}
                    <div style="
                        position: absolute;
                        top: -10px;
                        right: -10px;
                        background: #FFD700;
                        color: #000;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-weight: bold;
                        font-size: 0.8em;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        z-index: 2;
                    ">
                        ${stepMultiplier}x
                    </div>
                </div>
            `;
            
            this.updateMultiplier();
            this.updateProfit();
            
            if (this.revealedCells.length === this.gridSize - this.mineCount) {
                this.gameOver(true);
            }
        }
    }

    cashout() {
        if (!this.isGameActive || this.revealedCells.length === 0) return;
        this.gameOver(true);
    }

    gameOver(won) {
        this.isGameActive = false;
        this.startButton.textContent = 'Start Game';
        
        // Reveal all mines
        this.mines.forEach(mineIndex => {
            if (!this.revealedCells.includes(mineIndex)) {
                const cell = this.grid.children[mineIndex];
                cell.className = 'cell revealed-mine';
                cell.innerHTML = this.assets.bomb;
            }
        });

        if (!won) {
            this.profitDisplay.textContent = (-this.currentBet).toFixed(2);
        }
    }
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.minesGame = new MinesGame();
}); 