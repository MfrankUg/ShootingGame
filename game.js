class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.player = null;
        this.enemies = [];
        this.score = 0;
        this.gameOver = false;
        
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };
        
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.setupEventListeners();
        this.showStartScreen();
    }
    
    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() in this.keys) {
                this.keys[e.key.toLowerCase()] = true;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() in this.keys) {
                this.keys[e.key.toLowerCase()] = false;
            }
        });
        
        // Mouse controls
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', () => {
            if (!this.gameOver) {
                this.player.shoot();
            }
        });
    }
    
    showStartScreen() {
        document.getElementById('startScreen').style.display = 'flex';
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
    }
    
    startGame() {
        document.getElementById('startScreen').style.display = 'none';
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.enemies = [];
        this.score = 0;
        this.gameOver = false;
        this.spawnEnemies();
        this.gameLoop();
    }
    
    spawnEnemies() {
        if (this.gameOver) return;
        
        // Spawn new enemy every 2 seconds
        setInterval(() => {
            if (this.enemies.length < 10) { // Maximum 10 enemies
                const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
                let x, y;
                
                switch(side) {
                    case 0: // top
                        x = Utils.random(0, this.canvas.width);
                        y = -50;
                        break;
                    case 1: // right
                        x = this.canvas.width + 50;
                        y = Utils.random(0, this.canvas.height);
                        break;
                    case 2: // bottom
                        x = Utils.random(0, this.canvas.width);
                        y = this.canvas.height + 50;
                        break;
                    case 3: // left
                        x = -50;
                        y = Utils.random(0, this.canvas.height);
                        break;
                }
                
                this.enemies.push(new Enemy(x, y));
            }
        }, 2000);
    }
    
    update() {
        if (this.gameOver) return;
        
        // Update player
        this.player.update(this.keys, this.mouseX, this.mouseY);
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(this.player);
            
            // Check bullet collisions
            for (let j = this.player.weapon.bullets.length - 1; j >= 0; j--) {
                const bullet = this.player.weapon.bullets[j];
                if (Utils.checkCollision(
                    {x: bullet.x - 3, y: bullet.y - 3, width: 6, height: 6},
                    {x: enemy.x - enemy.width/2, y: enemy.y - enemy.height/2, width: enemy.width, height: enemy.height}
                )) {
                    if (enemy.takeDamage(bullet.damage)) {
                        this.enemies.splice(i, 1);
                        this.score += 100;
                        document.getElementById('scoreValue').textContent = this.score;
                    }
                    this.player.weapon.bullets.splice(j, 1);
                    break;
                }
            }
        }
        
        // Update weapon
        this.player.weapon.update(this.mouseX, this.mouseY);
        
        // Update HUD
        document.getElementById('healthValue').textContent = this.player.health;
        document.getElementById('ammoValue').textContent = this.player.ammo;
        
        // Check game over
        if (this.player.health <= 0) {
            this.gameOver = true;
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw game objects
        this.player.draw(this.ctx);
        this.player.weapon.draw(this.ctx);
        
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx);
        }
        
        // Draw game over screen
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 40);
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    restartGame() {
        this.startGame();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 