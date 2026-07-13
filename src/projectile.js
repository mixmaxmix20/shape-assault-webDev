import { CONFIG } from './config.js';

export class Projectile {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} angle
     */
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = CONFIG.PROJECTILE_SPEED;
        this.active = true;
    }

    /**
     * Updates the position of the projectile and deactivates it if out of bounds
     * @param {number} deltaTime - elapsed time in seconds
     */
    update(deltaTime) {
        this.x += Math.cos(this.angle) * this.speed * deltaTime;
        this.y += Math.sin(this.angle) * this.speed * deltaTime;

        if (
            this.x < 0 ||
            this.x > CONFIG.GAME_WIDTH ||
            this.y < 0 ||
            this.y > CONFIG.GAME_HEIGHT
        ) {
            this.active = false;
        }
    }

    /**
     * Renders the projectile on the canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = CONFIG.COLORS.PROJECTILE;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
