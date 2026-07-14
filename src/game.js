import { CONFIG } from './config.js';
import { InputHandler } from './input.js';
import { Hero } from './hero.js';
import { Enemy } from './enemy.js';
import { Projectile } from './projectile.js';
import { Pickup } from './pickup.js';
import { UIManager } from './ui.js';
import { CollisionManager } from './collisions.js';

export class Game {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.width = CONFIG.GAME_WIDTH;
        this.canvas.height = CONFIG.GAME_HEIGHT;

        this.input = new InputHandler(this.canvas);
        this.ui = new UIManager();
        this.collisions = new CollisionManager();

        this.hero = new Hero(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 50);
        this.enemies = [];
        this.projectiles = [];
        this.pickups = [];

        this.state = 'WELCOME';

        this.killedStats = {
            basic: 0,
            fast: 0,
            tank: 0,
            boss: 0
        };

        this.spawnInterval = null;
        this.lastTime = 0;
        this.levelUpScreenOpenTime = 0;
        this.levelUpOptions = [];
    }

    /**
     * Starts the game loop
     */
    start() {
        this.state = 'WELCOME';
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    /**
     * Main animation frame loop
     * @param {number} timestamp - DOMHighResTimeStamp from requestAnimationFrame
     */
    gameLoop(timestamp) {
        let deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (deltaTime > 0.1) {
            deltaTime = 0.1;
        }

        this.update(deltaTime, timestamp);
        this.draw(timestamp);

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    /**
     * Updates game logic based on state
     * @param {number} deltaTime
     * @param {number} timestamp
     */
    update(deltaTime, timestamp) {
        switch (this.state) {
            case 'WELCOME':
                if (this.input.anyKeyPressed || this.input.mouseClicked) {
                    this.startGame();
                    this.input.clearKeyPressTrigger();
                    this.input.clearClick();
                }
                break;

            case 'PLAYING':
                if (this.input.isDown('Escape')) {
                    this.pauseGame();
                    this.input.keys['Escape'] = false;
                    break;
                }

                this.hero.update(deltaTime, this.input);

                if (this.input.mouseClicked) {
                    this.shoot();
                    this.input.clearClick();
                }

                for (const projectile of this.projectiles) {
                    projectile.update(deltaTime);
                }

                for (const enemy of this.enemies) {
                    enemy.update(deltaTime, this.hero.x, this.hero.y);
                }

                this.collisions.checkCollisions(timestamp, this);

                this.enemies = this.enemies.filter(e => e.active);
                this.projectiles = this.projectiles.filter(p => p.active);
                this.pickups = this.pickups.filter(p => p.active);

                if (this.hero.hp <= 0) {
                    this.gameOver();
                }
                break;

            case 'PAUSED':
                if (this.input.isDown('Escape')) {
                    this.resumeGame();
                    this.input.keys['Escape'] = false;
                }
                break;

            case 'LEVEL_UP':
                if (this.input.mouseClicked) {
                    this.handleLevelUpClick(this.input.lastClickedX, this.input.lastClickedY, timestamp);
                    this.input.clearClick();
                }
                break;

            case 'GAME_OVER':
                if (this.input.isDown('KeyR')) {
                    this.restartGame();
                    this.input.keys['KeyR'] = false;
                }
                break;
        }
    }

    /**
     * Renders game entities and UI overlays
     * @param {number} timestamp
     */
    draw(timestamp) {
        this.ctx.fillStyle = CONFIG.COLORS.CANVAS_BG;
        this.ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

        if (this.state === 'WELCOME') {
            this.hero.draw(this.ctx, this.input.mouseX, this.input.mouseY);
            this.ui.drawWelcomeScreen(this.ctx);
            return;
        }

        if (this.state === 'GAME_OVER') {
            this.ui.drawGameOverScreen(this.ctx, this.hero.lvl, this.killedStats);
            return;
        }

        for (const pickup of this.pickups) {
            pickup.draw(this.ctx);
        }

        this.hero.draw(this.ctx, this.input.mouseX, this.input.mouseY);

        for (const enemy of this.enemies) {
            enemy.draw(this.ctx, this.hero.x, this.hero.y);
        }

        for (const projectile of this.projectiles) {
            projectile.draw(this.ctx);
        }

        this.ui.drawHUD(this.ctx, this.hero);

        if (this.state === 'PAUSED') {
            this.ui.drawPauseScreen(this.ctx);
        } else if (this.state === 'LEVEL_UP') {
            this.ui.drawLevelUpScreen(this.ctx, this.levelUpOptions);
        }
    }

    /**
     * Fires a projectile from the player towards mouse coords
     */
    shoot() {
        const dx = this.input.mouseX - this.hero.x;
        const dy = this.input.mouseY - this.hero.y;
        const angle = Math.atan2(dy, dx);

        this.projectiles.push(new Projectile(this.hero.x, this.hero.y, angle));
    }

    /**
     * Transits state to PLAYING and resumes timers
     */
    startGame() {
        this.state = 'PLAYING';
        this.startSpawnTimer();
    }

    /**
     * Pauses the game
     */
    pauseGame() {
        this.state = 'PAUSED';
        this.stopSpawnTimer();
    }

    /**
     * Resumes the game from pause
     */
    resumeGame() {
        this.state = 'PLAYING';
        this.startSpawnTimer();
    }

    /**
     * Triggers Level Up upgrade selection screen
     */
    onLevelUpTriggered() {
        this.state = 'LEVEL_UP';
        this.levelUpScreenOpenTime = performance.now();
        this.stopSpawnTimer();

        this.levelUpOptions = [
            {
                id: 'hp',
                label: 'HP +25%',
                action: () => this.hero.applyUpgrade('hp')
            },
            {
                id: 'dmg',
                label: 'Obrażenia +1',
                action: () => this.hero.applyUpgrade('dmg')
            },
            {
                id: 'speed',
                label: 'Szybkość +25%',
                action: () => this.hero.applyUpgrade('speed')
            }
        ];
    }

    /**
     * Checks upgrade card clicks
     */
    handleLevelUpClick(clickX, clickY, timestamp) {
        if (timestamp - this.levelUpScreenOpenTime < CONFIG.LEVEL_UP_SCREEN_DELAY) {
            return;
        }

        this.levelUpOptions.forEach((option, i) => {
            const x = 145 + i * 185;
            const y = 200;
            const w = 140;
            const h = 220;

            if (clickX >= x && clickX <= x + w && clickY >= y && clickY <= y + h) {
                option.action();
                this.startGame();
            }
        });
    }

    /**
     * Triggers game over screen
     */
    gameOver() {
        this.state = 'GAME_OVER';
        this.stopSpawnTimer();
    }

    /**
     * Resets game elements to play again
     */
    restartGame() {
        this.hero.reset();
        this.hero.x = CONFIG.GAME_WIDTH / 2;
        this.hero.y = CONFIG.GAME_HEIGHT / 2 + 50;

        this.enemies = [];
        this.projectiles = [];
        this.pickups = [];

        this.killedStats = {
            basic: 0,
            fast: 0,
            tank: 0,
            boss: 0
        };

        this.collisions.reset();
        this.startGame();
    }

    /**
     * Checks if the number of active enemies is below the limit and spawns a new one
     */
    tickSpawning() {
        if (this.state !== 'PLAYING') return;

        if (this.enemies.length < this.getCurrentEnemyLimit()) {
            this.spawnEnemy();
        }
    }

    /**
     * Calculates the maximum number of active enemies based on hero level
     * @returns {number}
     */
    getCurrentEnemyLimit() {
        return CONFIG.ENEMY_BASE_LIMIT + Math.floor((this.hero.lvl - 1) / CONFIG.ENEMY_LIMIT_LEVEL_STEP);
    }

    /**
     * Spawns a single enemy on a random screen border
     */
    spawnEnemy() {
        let x, y;

        let edge = Math.floor(Math.random() * 4);

        switch (edge) {
            case 0: // Top
                x = Math.random() * CONFIG.GAME_WIDTH;
                y = -20;
                break;

            case 1: // Right
                x = CONFIG.GAME_WIDTH + 20;
                y = Math.random() * CONFIG.GAME_HEIGHT;
                break;

            case 2: // Down
                x = Math.random() * CONFIG.GAME_WIDTH;
                y = CONFIG.GAME_HEIGHT + 20;
                break;

            case 3: // Left
                x = -20;
                y = Math.random() * CONFIG.GAME_HEIGHT;
        }

        const type = this.getEnemyType();
        this.enemies.push(new Enemy(x, y, type));
    }

    /**
     * Calculates spawn probabilities based on player level
     * @returns {string} type - basic | fast | tank | boss
     */
    getEnemyType() {
        const weights = this.getSpawnWeights();
        const types = Object.keys(CONFIG.ENEMY_TYPES);

        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let randomNum = Math.random() * totalWeight;

        for (let i = 0; i < types.length; i++) {
            randomNum -= weights[i];
            if (randomNum <= 0) {
                return types[i];
            }
        }
        return types[0];
    }

    /**
     * Helper calculation for enemy weights based on level
     * @returns {Array<number>}
     */
    getSpawnWeights() {
        const lvl = this.hero.lvl;
        const rules = CONFIG.SPAWN_RULES;
        return [
            Math.max(0, 100 - lvl * rules.BASIC_DECAY),
            Math.max(0, (lvl - rules.FAST_START + 1) * rules.FAST_GROW),
            Math.max(0, (lvl - rules.TANK_START + 1) * rules.TANK_GROW),
            Math.max(0, (lvl - rules.BOSS_START + 1) * rules.BOSS_GROW)
        ];
    }

    /**
     * Spawns a pickup item with a low chance
     * @param {number} x
     * @param {number} y
     */
    trySpawnPickup(x, y) {
        if (Math.random() < 0.01) {
            this.pickups.push(new Pickup(x, y, 'hp'));
        }
    }

    startSpawnTimer() {
        this.stopSpawnTimer();
        this.spawnInterval = setInterval(() => this.tickSpawning(), CONFIG.ENEMY_SPAWN_COOLDOWN);
    }

    stopSpawnTimer() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
    }
}
