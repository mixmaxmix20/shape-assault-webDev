import { CONFIG } from './config.js';

export class UIManager {
    /**
     * Renders the welcome screen
     * @param {CanvasRenderingContext2D} ctx
     */
    drawWelcomeScreen(ctx) {
        ctx.save();
        ctx.textAlign = 'center';

        // Title Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.font = 'bold 54px sans-serif';
        ctx.fillText('SHAPE ASSAULT', CONFIG.GAME_WIDTH / 2 + 3, CONFIG.GAME_HEIGHT / 2 - 37);

        // Title Left part: "SHAPE"
        ctx.font = 'bold 54px sans-serif';
        ctx.fillStyle = 'rgb(255, 60, 60)';
        ctx.fillText('SHAPE', CONFIG.GAME_WIDTH / 2 - 120, CONFIG.GAME_HEIGHT / 2 - 40);

        // Title Right part: "ASSAULT"
        ctx.fillStyle = 'rgb(61, 255, 76)';
        ctx.fillText('ASSAULT', CONFIG.GAME_WIDTH / 2 + 100, CONFIG.GAME_HEIGHT / 2 - 40);

        // Subtitle
        ctx.fillStyle = CONFIG.COLORS.TEXT_DARK;
        ctx.font = '24px sans-serif';
        ctx.fillText('Naciśnij dowolny przycisk, aby rozpocząć', CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 10);
        
        ctx.restore();
    }

    /**
     * Renders the pause overlay
     * @param {CanvasRenderingContext2D} ctx
     */
    drawPauseScreen(ctx) {
        ctx.save();
        ctx.fillStyle = CONFIG.COLORS.PAUSE_OVERLAY;
        ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

        ctx.fillStyle = CONFIG.COLORS.TEXT_LIGHT;
        ctx.textAlign = 'center';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText('PAUZA', CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 30);
        
        ctx.font = '20px sans-serif';
        ctx.fillText('Naciśnij ESC aby kontynuować', CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 30);
        ctx.restore();
    }

    /**
     * Renders the game over screen
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} level
     * @param {object} stats
     */
    drawGameOverScreen(ctx, level, stats) {
        ctx.save();
        ctx.clearRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

        ctx.fillStyle = CONFIG.COLORS.TEXT_DARK;
        ctx.textAlign = 'center';
        
        ctx.font = 'bold 56px sans-serif';
        ctx.fillText('GAME OVER', CONFIG.GAME_WIDTH / 2, 170);

        ctx.font = '24px sans-serif';
        ctx.fillText(`Poziom: ${level}`, CONFIG.GAME_WIDTH / 2, 230);
        
        ctx.font = '20px sans-serif';
        ctx.fillText(`Pokonani zwykli przeciwnicy: ${stats.basic}`, CONFIG.GAME_WIDTH / 2, 280);
        ctx.fillText(`Pokonani szybcy przeciwnicy: ${stats.fast}`, CONFIG.GAME_WIDTH / 2, 320);
        ctx.fillText(`Pokonani twardzi przeciwnicy: ${stats.tank}`, CONFIG.GAME_WIDTH / 2, 360);
        ctx.fillText(`Pokonani Bossowie: ${stats.boss}`, CONFIG.GAME_WIDTH / 2, 400);

        ctx.font = 'bold 22px sans-serif';
        ctx.fillStyle = 'rgb(255, 60, 60)';
        ctx.fillText('Naciśnij R aby zagrać ponownie', CONFIG.GAME_WIDTH / 2, 470);
        ctx.restore();
    }

    /**
     * Renders the level up card options menu
     * @param {CanvasRenderingContext2D} ctx
     * @param {Array} options
     */
    drawLevelUpScreen(ctx, options) {
        ctx.save();
        
        // Modal Container
        ctx.fillStyle = CONFIG.COLORS.LEVEL_UP_BG;
        ctx.fillRect(100, 100, 600, 400);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 100, 600, 400);

        // Title
        ctx.fillStyle = CONFIG.COLORS.TEXT_DARK;
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Wybierz ulepszenie:', CONFIG.GAME_WIDTH / 2, 150);

        // Draw Options Cards
        options.forEach((option, i) => {
            // Card layout math for 800x600 resolution
            const x = 145 + i * 185;
            const y = 200;
            const w = 140;
            const h = 220;

            // Card Background
            ctx.fillStyle = CONFIG.COLORS.CARD_BG;
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);

            // Card Title Label
            ctx.fillStyle = CONFIG.COLORS.TEXT_DARK;
            ctx.font = 'bold 15px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(option.label, x + w / 2, y + 35);

            // Draw Icon inside card
            const cx = x + w / 2;
            const cy = y + h / 2 + 15;

            ctx.save();
            if (option.id === 'hp') {
                // HP Red Cross Icon
                ctx.fillStyle = 'rgb(255, 0, 0)';
                ctx.fillRect(cx - 15, cy - 5, 30, 10);
                ctx.fillRect(cx - 5, cy - 15, 10, 30);

                ctx.beginPath();
                ctx.moveTo(cx - 15, cy - 5);
                ctx.lineTo(cx - 5,  cy - 5);
                ctx.lineTo(cx - 5,  cy - 15);
                ctx.lineTo(cx + 5,  cy - 15);
                ctx.lineTo(cx + 5,  cy - 5);
                ctx.lineTo(cx + 15, cy - 5);
                ctx.lineTo(cx + 15, cy + 5);
                ctx.lineTo(cx + 5,  cy + 5);
                ctx.lineTo(cx + 5,  cy + 15);
                ctx.lineTo(cx - 5,  cy + 15);
                ctx.lineTo(cx - 5,  cy + 5);
                ctx.lineTo(cx - 15, cy + 5);
                ctx.closePath();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.stroke();
            } else if (option.id === 'dmg') {
                // Damage Sword Icon
                ctx.fillStyle = 'rgb(180, 180, 180)';
                ctx.fillRect(cx - 5, cy - 5, 10, 20);

                ctx.beginPath();
                ctx.moveTo(cx - 5, cy - 5);
                ctx.lineTo(cx,     cy - 20);
                ctx.lineTo(cx + 5, cy - 5);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = 'rgb(200, 150, 0)';
                ctx.fillRect(cx - 6, cy - 5, 12, 20);

                ctx.beginPath();
                ctx.moveTo(cx - 5, cy - 5);
                ctx.lineTo(cx,     cy - 20);
                ctx.lineTo(cx + 5, cy - 5);
                ctx.lineTo(cx + 6, cy + 5);
                ctx.lineTo(cx + 6, cy + 15);
                ctx.lineTo(cx - 6, cy + 15);
                ctx.lineTo(cx - 6, cy + 5);
                ctx.closePath();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.stroke();
            } else if (option.id === 'speed') {
                // Speed Lightning Bolt Icon
                ctx.fillStyle = 'rgb(255, 200, 0)';
                ctx.beginPath();
                ctx.moveTo(cx,  cy - 20);
                ctx.lineTo(cx + 15, cy - 20);
                ctx.lineTo(cx,      cy - 5);
                ctx.lineTo(cx + 15, cy - 5);
                ctx.lineTo(cx - 10, cy + 20);
                ctx.lineTo(cx - 5,  cy);
                ctx.lineTo(cx - 15, cy);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.restore();
        });
        
        ctx.restore();
    }

    /**
     * Renders HUD health and experience bars
     * @param {CanvasRenderingContext2D} ctx
     * @param {Hero} hero
     */
    drawHUD(ctx, hero) {
        ctx.save();

        // 1. Draw HP Bar
        ctx.fillStyle = CONFIG.COLORS.HEALTH_BAR_BG;
        ctx.fillRect(40, 10, 120, 12);
        
        const hpPercent = Math.max(0, hero.hp / hero.maxHp);
        ctx.fillStyle = CONFIG.COLORS.HEALTH_BAR_FG;
        ctx.fillRect(40, 10, hpPercent * 120, 12);
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, 10, 120, 12);

        // Labels
        ctx.fillStyle = CONFIG.COLORS.TEXT_DARK;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('HP', 15, 21);
        
        ctx.font = '12px sans-serif';
        ctx.fillText(`${hero.hp} / ${hero.maxHp}`, 175, 21);

        // 2. Draw XP Bar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // soft background
        ctx.fillRect(40, 28, 120, 12);

        const xpPercent = Math.max(0, hero.xp / hero.xpToNextLvl);
        ctx.fillStyle = CONFIG.COLORS.XP_BAR_FG;
        ctx.fillRect(40, 28, xpPercent * 120, 12);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, 28, 120, 12);

        // Label
        ctx.fillStyle = CONFIG.COLORS.TEXT_DARK;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('XP', 15, 39);

        // 3. Draw Level Label
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`LVL ${hero.lvl}`, 15, 56);

        ctx.restore();
    }
}
