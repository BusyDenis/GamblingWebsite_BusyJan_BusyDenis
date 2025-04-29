class TowersGame {
    constructor() {
        this.grid = document.getElementById('towers-grid');
        this.betInput = document.getElementById('bet-amount');
        this.startButton = document.querySelector('.start-button');
        this.difficultyButtons = document.querySelectorAll('.difficulty-button');
        this.profitDisplay = document.querySelector('.profit-container .stat-value');
        this.nextMultiplierDisplay = document.querySelector('.next-container .stat-value');
        
        this.currentRow = 7; // Start from bottom
        this.gameActive = false;
        this.selectedDifficulty = 'easy';
        this.cells = [];
        this.bombs = new Set();
        this.revealedCells = new Set();
        this.currentMultiplier = 1;
        this.currentBet = 0;
        this.gameOverDisplay = null;
        
        this.difficulties = {
            easy: {
                columns: 4,
                bombs: 1,
                multipliers: [1.28, 1.64, 2.10, 2.68, 3.44, 4.40, 5.63, 7.21]
            },
            medium: {
                columns: 3,
                bombs: 1,
                multipliers: [1.44, 2.07, 2.99, 4.30, 6.19, 8.92, 12.84, 18.49]
            },
            hard: {
                columns: 2,
                bombs: 1,
                multipliers: [1.92, 3.69, 7.08, 13.59, 26.09, 50.10, 96.19, 184.68]
            },
            expert: {
                columns: 4,
                bombs: 3,
                multipliers: [2.88, 8.29, 23.89, 68.80, 198.14, 570.63, 1643.42, 4733.04]
            }
        };

        this.setupEventListeners();
        this.initializeGrid();
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.gameActive) return;
                
                this.difficultyButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Animate grid removal
                this.grid.style.opacity = '0';
                this.grid.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    this.selectedDifficulty = button.textContent.toLowerCase();
                    
                    // Clear existing grid and cells
                    this.grid.innerHTML = '';
                    this.cells = [];
                    this.bombs.clear();
                    this.revealedCells.clear();
                    
                    // Update grid attribute
                    this.grid.setAttribute('data-difficulty', this.selectedDifficulty);
                    
                    // Initialize new grid
                    this.initializeGrid();
                    
                    // Animate grid appearance
                    requestAnimationFrame(() => {
                        this.grid.style.opacity = '1';
                        this.grid.style.transform = 'scale(1)';
                    });
                }, 300);
            });
        });
    }

    initializeGrid() {
        this.grid.innerHTML = '';
        const difficulty = this.difficulties[this.selectedDifficulty];
        
        for (let row = 0; row < 8; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'tower-row';
            rowDiv.setAttribute('data-multiplier', difficulty.multipliers[7 - row].toFixed(2) + 'x');
            rowDiv.style.setProperty('--row-index', row);
            
            const rowCells = [];
            for (let col = 0; col < difficulty.columns; col++) {
                const cell = document.createElement('div');
                cell.className = 'tower-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.style.setProperty('--cell-index', col);
                
                // Display multiplier in cell
                cell.textContent = difficulty.multipliers[7 - row].toFixed(2) + 'x';
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                rowDiv.appendChild(cell);
                rowCells.push(cell);
            }
            this.cells.push(rowCells);
            this.grid.appendChild(rowDiv);
        }
        this.updateCurrentRow();
    }

    startGame() {
        if (this.gameActive) return;
        
        this.currentBet = parseFloat(this.betInput.value) || 0;
        this.gameActive = true;
        this.currentRow = 7;
        this.revealedCells.clear();
        this.bombs.clear();
        this.cells = [];
        
        if (this.gameOverDisplay) {
            this.gameOverDisplay.remove();
            this.gameOverDisplay = null;
        }
        
        this.initializeGrid();
        
        const difficulty = this.difficulties[this.selectedDifficulty];
        
        for (let i = 0; i < difficulty.bombs; i++) {
            let col;
            do {
                col = Math.floor(Math.random() * difficulty.columns);
            } while (this.bombs.has(`${this.currentRow},${col}`));
            this.bombs.add(`${this.currentRow},${col}`);
        }
        
        this.currentMultiplier = 1;
        this.updateMultipliers();
        this.updateProfit();
        this.startButton.textContent = 'Cash Out';
    }

    handleCellClick(row, col) {
        if (!this.gameActive || row !== this.currentRow || this.revealedCells.has(`${row},${col}`)) return;
        
        const cell = this.cells[row][col];
        const isBomb = this.bombs.has(`${row},${col}`);
        
        if (isBomb) {
            this.cells[row].forEach((rowCell, colIndex) => {
                if (this.bombs.has(`${row},${colIndex}`)) {
                    this.revealCell(row, colIndex, true);
                }
            });
            
            this.showGameOverDisplay(row);
            this.gameOver(false);
        } else {
            this.revealCell(row, col, false);
            this.currentMultiplier = this.difficulties[this.selectedDifficulty].multipliers[7 - row];
            this.updateMultipliers();
            this.updateProfit();
            
            if (row > 0) {
                this.currentRow--;
                this.updateCurrentRow();
                this.bombs.clear();
                const difficulty = this.difficulties[this.selectedDifficulty];
                for (let i = 0; i < difficulty.bombs; i++) {
                    let newCol;
                    do {
                        newCol = Math.floor(Math.random() * difficulty.columns);
                    } while (this.bombs.has(`${this.currentRow},${newCol}`));
                    this.bombs.add(`${this.currentRow},${newCol}`);
                }
            } else {
                this.gameOver(true);
            }
        }
    }

    revealCell(row, col, isBomb) {
        const cell = this.cells[row][col];
        this.revealedCells.add(`${row},${col}`);
        
        if (isBomb) {
            cell.className = 'tower-cell revealed-mine';
            
            // Create explosion effect
            const explosion = document.createElement('div');
            explosion.className = 'explosion';
            
            // Add flash effect
            const flash = document.createElement('div');
            flash.className = 'flash';
            explosion.appendChild(flash);
            
            // Add explosion ring
            const ring = document.createElement('div');
            ring.className = 'explosion-ring';
            explosion.appendChild(ring);
            
            // Add explosion particles
            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.className = 'explosion-particle';
                
                // Calculate random angles and distances for particles
                const angle = (i / 12) * 360 + (Math.random() * 30 - 15);
                const distance = 20 + Math.random() * 20;
                const tx = Math.cos(angle * Math.PI / 180) * distance;
                const ty = Math.sin(angle * Math.PI / 180) * distance;
                
                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);
                
                explosion.appendChild(particle);
            }
            
            cell.innerHTML = '';
            cell.appendChild(explosion);
            
            // Add bomb after a short delay
            setTimeout(() => {
                const bomb = document.createElement('div');
                bomb.className = 'bomb';
                cell.appendChild(bomb);
            }, 300);
        } else {
            cell.className = 'tower-cell revealed-safe';
            
            // Create crystal container
            const crystalContainer = document.createElement('div');
            crystalContainer.className = 'crystal-container';
            
            // Create initial crystal (will be hidden after shattering)
            const crystal = document.createElement('div');
            crystal.className = 'crystal';
            
            // Add flash effect
            const flash = document.createElement('div');
            flash.className = 'crystal-flash';
            crystal.appendChild(flash);
            
            // Define shard shapes
            const shardShapes = [
                // Top triangle
                'polygon(50% 0%, 100% 25%, 50% 50%, 0% 25%)',
                // Right top
                'polygon(100% 25%, 100% 75%, 50% 50%, 50% 25%)',
                // Right bottom
                'polygon(100% 75%, 50% 100%, 50% 50%, 100% 50%)',
                // Bottom triangle
                'polygon(50% 50%, 50% 100%, 0% 75%)',
                // Left bottom
                'polygon(0% 75%, 0% 25%, 50% 50%, 50% 75%)',
                // Left top
                'polygon(0% 25%, 50% 0%, 50% 50%, 25% 25%)'
            ];
            
            // Create shards
            shardShapes.forEach((clipPath, index) => {
                const shard = document.createElement('div');
                shard.className = 'crystal-shard';
                shard.style.setProperty('--clip', clipPath);
                
                // Calculate random direction for each shard
                const angle = (index / shardShapes.length) * 360 + (Math.random() * 30 - 15);
                const distance = 30 + Math.random() * 20;
                const tx = Math.cos(angle * Math.PI / 180) * distance;
                const ty = Math.sin(angle * Math.PI / 180) * distance;
                const rotation = (Math.random() - 0.5) * 360;
                
                shard.style.setProperty('--tx', `${tx}px`);
                shard.style.setProperty('--ty', `${ty}px`);
                shard.style.setProperty('--tr', `${rotation}deg`);
                
                // Stagger the animations slightly
                shard.style.animationDelay = `${index * 0.05}s`;
                
                crystalContainer.appendChild(shard);
            });
            
            crystalContainer.appendChild(crystal);
            cell.appendChild(crystalContainer);
            
            // Hide the original crystal after a short delay
            setTimeout(() => {
                crystal.style.opacity = '0';
            }, 100);
        }
    }

    updateCurrentRow() {
        this.cells.forEach((rowCells, rowIndex) => {
            const rowElement = rowCells[0].parentElement;
            if (rowIndex === this.currentRow) {
                rowElement.classList.add('current-row');
                // Smooth scroll to current row if needed
                rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                rowElement.classList.remove('current-row');
            }
        });
    }

    showGameOverDisplay(row) {
        if (this.gameOverDisplay) {
            this.gameOverDisplay.remove();
        }

        this.gameOverDisplay = document.createElement('div');
        this.gameOverDisplay.className = 'game-over-display';
        
        const multiplier = this.difficulties[this.selectedDifficulty].multipliers[7 - row];
        const amount = (this.currentBet * multiplier).toFixed(2);
        
        this.gameOverDisplay.innerHTML = `
            <div class="game-over-multiplier">${multiplier.toFixed(2)}x</div>
            <div class="game-over-amount">$${amount}</div>
        `;
        
        this.grid.appendChild(this.gameOverDisplay);
    }

    gameOver(won) {
        this.gameActive = false;
        this.startButton.textContent = 'Start Game';
    }

    updateMultipliers() {
        if (this.nextMultiplierDisplay && this.currentRow > 0) {
            const nextMultiplier = this.difficulties[this.selectedDifficulty].multipliers[7 - (this.currentRow - 1)];
            this.nextMultiplierDisplay.textContent = nextMultiplier.toFixed(2) + 'x';
        } else if (this.nextMultiplierDisplay) {
            this.nextMultiplierDisplay.textContent = 'MAX';
        }
    }

    updateProfit() {
        if (this.profitDisplay) {
            const profit = (this.currentBet * (this.currentMultiplier - 1)).toFixed(2);
            this.profitDisplay.textContent = profit;
        }
    }
} 