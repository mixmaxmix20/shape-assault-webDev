import { CONFIG } from './config.js';

export class Enemy {
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} type - 'basic' | 'fast' | 'tank' | 'boss'
     */
    constructor(x, y, type) {
        const stats = CONFIG.ENEMY_TYPES[type];
        if (!stats) {
            throw new Error(`Invalid enemy type: ${type}`);
        }

        this.x = x;
        this.y = y;
        this.type = type;
        this.color = stats.color;
        this.speed = stats.speed;
        this.hp = stats.hp;
        this.xp = stats.xp;
        this.dmg = stats.dmg;
        this.hitRadius = stats.hitRadius;
        this.active = true;
    }

    /**
     * Moves the enemy towards the player position using delta-time
     * @param {number} deltaTime - time in seconds
     * @param {number} playerX
     * @param {number} playerY
     */
    update(deltaTime, playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.x += (dx / distance) * this.speed * deltaTime;
            this.y += (dy / distance) * this.speed * deltaTime;
        }
    }

    /**
     * Renders the enemy oriented towards the player
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} playerX
     * @param {number} playerY
     */
    draw(ctx, playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const angle = Math.atan2(dy, dx);

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);

        switch (this.type) {
            case 'basic':
                ctx.fillRect(-10, -10, 20, 20);
                break;

            case 'fast':
                ctx.beginPath();
                ctx.moveTo(15, 0);
                ctx.lineTo(-10, -8);
                ctx.lineTo(-10, 8);
                ctx.closePath();
                ctx.fill();
                break;

            case 'tank':
                ctx.fillRect(-15, -15, 30, 30);
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.strokeRect(-15, -15, 30, 30);
                break;

            case 'boss':
                const r = 60;
                const sides = 6;
                ctx.beginPath();
                for (let i = 0; i < sides; i++) {
                    const fAngle = (i / sides) * Math.PI * 2;
                    const px = Math.cos(fAngle) * r;
                    const py = Math.sin(fAngle) * r;
                    if (i === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
                ctx.closePath();
                ctx.fill();
                break;
        }

        ctx.restore();
    }

    /**
     * Inflicts damage on the enemy. Sets active=false if hp <= 0.
     * @param {number} amount
     */
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.active = false;
        }
    }
}
