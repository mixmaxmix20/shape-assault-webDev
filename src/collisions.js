import { CONFIG } from './config.js';

export class CollisionManager {
    constructor() {
        this.lastTimeHit = 0;
    }

    /**
     * Checks collisions between all game objects and triggers responses
     * @param {number} currentTime - performance.now() timestamp in ms
     * @param {Game} game - access to game state and entity lists
     */
    checkCollisions(currentTime, game) {
        const hero = game.hero;
        const enemies = game.enemies;
        const projectiles = game.projectiles;
        const pickups = game.pickups;

        for (const pickup of pickups) {
            if (!pickup.active) continue;

            const dx = hero.x - pickup.x;
            const dy = hero.y - pickup.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 25 && hero.hp < hero.maxHp) {
                pickup.active = false;
                const healAmount = Math.floor(0.25 * hero.maxHp);
                hero.hp = Math.min(hero.hp + healAmount, hero.maxHp);
            }
        }

        const canTakeDamage = (currentTime - this.lastTimeHit) > CONFIG.HIT_COOLDOWN;

        for (const enemy of enemies) {
            if (!enemy.active) continue;

            const dx = hero.x - enemy.x;
            const dy = hero.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= enemy.hitRadius) {
                if (canTakeDamage) {
                    hero.hp -= enemy.dmg;
                    this.lastTimeHit = currentTime;
                }
            }

            for (const projectile of projectiles) {
                if (!projectile.active) continue;

                const pdx = enemy.x - projectile.x;
                const pdy = enemy.y - projectile.y;
                const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);

                if (pDistance <= enemy.hitRadius) {
                    projectile.active = false;
                    enemy.takeDamage(hero.dmg);

                    if (!enemy.active) {
                        const levelUpTriggered = hero.addXp(enemy.xp);
                        if (levelUpTriggered) {
                            game.onLevelUpTriggered();
                        }

                        if (game.killedStats.hasOwnProperty(enemy.type)) {
                            game.killedStats[enemy.type]++;
                        }

                        game.trySpawnPickup(enemy.x, enemy.y);
                        
                        break;
                    }
                }
            }
        }
    }

    /**
     * Resets collision logic internal states (cooldowns)
     */
    reset() {
        this.lastTimeHit = 0;
    }
}
