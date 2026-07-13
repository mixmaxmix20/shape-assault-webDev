import { CONFIG } from './config.js';

export class Hero {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = CONFIG.HERO_START_SPEED;
        this.hp = CONFIG.HERO_START_HP;
        this.maxHp = CONFIG.HERO_START_HP;
        this.xp = 0;
        this.lvl = 1;
        this.dmg = CONFIG.HERO_START_DMG;
        this.xpToNextLvl = CONFIG.HERO_START_XP_TO_LEVEL;
    }

    /**
     * Updates player position based on keyboard input and elapsed time
     * @param {number} deltaTime - elapsed time in seconds
     * @param {InputHandler} input - input status manager
     */
    update(deltaTime, input) {
        let dx = 0;
        let dy = 0;

        if (input.isDown('KeyA') || input.isDown('ArrowLeft')) dx -= 1;
        if (input.isDown('KeyD') || input.isDown('ArrowRight')) dx += 1;
        if (input.isDown('KeyW') || input.isDown('ArrowUp')) dy -= 1;
        if (input.isDown('KeyS') || input.isDown('ArrowDown')) dy += 1;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        this.x += dx * this.speed * deltaTime;
        this.y += dy * this.speed * deltaTime;

        this.x = Math.max(10, Math.min(CONFIG.GAME_WIDTH - 10, this.x));
        this.y = Math.max(10, Math.min(CONFIG.GAME_HEIGHT - 10, this.y));
    }

    /**
     * Renders the player rotating towards the mouse position
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} mouseX
     * @param {number} mouseY
     */
    draw(ctx, mouseX, mouseY) {
        const angle = Math.atan2(mouseY - this.y, mouseX - this.x);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);

        // Body
        ctx.fillStyle = CONFIG.COLORS.HERO_BODY;
        ctx.fillRect(-5, -15, 10, 30);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(-5, -15, 10, 30);

        // Head
        ctx.beginPath();
        ctx.arc(3, 0, 8, 0, 2 * Math.PI);
        ctx.fillStyle = CONFIG.COLORS.HERO_HEAD;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Gun
        ctx.fillStyle = 'black';
        ctx.fillRect(5, 15, 8, 1);

        ctx.restore();
    }

    /**
     * Adds XP and returns true if level up was triggered
     * @param {number} amount
     * @returns {boolean}
     */
    addXp(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLvl) {
            this.lvl++;
            this.xp -= this.xpToNextLvl;
            this.xpToNextLvl = Math.floor(this.xpToNextLvl * 1.5);
            return true;
        }
        return false;
    }

    /**
     * Applies level up statistics upgrade
     * @param {string} type - 'hp' | 'dmg' | 'speed'
     */
    applyUpgrade(type) {
        switch (type) {
            case 'hp':
                this.maxHp = Math.floor(this.maxHp * 1.25);
                this.hp = this.maxHp;
                break;
            case 'dmg':
                this.dmg += 1;
                break;
            case 'speed':
                this.speed += CONFIG.HERO_LEVEL_UP_SPEED_INC;
                break;
        }
    }

    /**
     * Resets hero back to initial state for game restarts
     */
    reset() {
        this.speed = CONFIG.HERO_START_SPEED;
        this.hp = CONFIG.HERO_START_HP;
        this.maxHp = CONFIG.HERO_START_HP;
        this.xp = 0;
        this.lvl = 1;
        this.dmg = CONFIG.HERO_START_DMG;
        this.xpToNextLvl = CONFIG.HERO_START_XP_TO_LEVEL;
    }
}
