/**
 * Game Configuration Constants
 */
export const CONFIG = Object.freeze({
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,

    PROJECTILE_SPEED: 1125,
    HIT_COOLDOWN: 500,
    ENEMY_SPAWN_COOLDOWN: 200,
    ENEMY_BASE_LIMIT: 5,
    ENEMY_LIMIT_LEVEL_STEP: 3,
    LEVEL_UP_SCREEN_DELAY: 750,

    HERO_START_SPEED: 225,
    HERO_START_HP: 50,
    HERO_START_DMG: 1,
    HERO_START_XP_TO_LEVEL: 100,
    HERO_LEVEL_UP_SPEED_INC: 56,

    SPAWN_RULES: {
        FAST_START: 2,
        TANK_START: 6,
        BOSS_START: 11,

        BASIC_DECAY: 2,
        FAST_GROW: 3,
        TANK_GROW: 1,
        BOSS_GROW: 0.5
    },

    ENEMY_TYPES: {
        basic: {
            type: 'basic',
            color: 'rgb(255, 60, 60)',
            speed: 225,
            hp: 1,
            xp: 10,
            dmg: 10,
            hitRadius: 20
        },
        fast: {
            type: 'fast',
            color: 'rgb(255, 150, 0)',
            speed: 450,
            hp: 10,
            xp: 35,
            dmg: 20,
            hitRadius: 25
        },
        tank: {
            type: 'tank',
            color: 'rgb(140, 20, 252)',
            speed: 160,
            hp: 50,
            xp: 100,
            dmg: 30,
            hitRadius: 30
        },
        boss: {
            type: 'boss',
            color: 'rgb(30, 30, 30)',
            speed: 80,
            hp: 250,
            xp: 500,
            dmg: 75,
            hitRadius: 40
        }
    },

    COLORS: {
        CANVAS_BG: '#ffebcd',
        HERO_BODY: 'rgb(18, 104, 1)',
        HERO_HEAD: 'rgb(246, 201, 201)',
        PROJECTILE: '#0f0f13',
        HEALTH_BAR_BG: 'rgb(255, 0, 0)',
        HEALTH_BAR_FG: 'rgb(0, 255, 0)',
        XP_BAR_FG: 'rgb(160, 0, 255)',
        TEXT_DARK: '#000000',
        TEXT_LIGHT: '#ffffff',
        LEVEL_UP_BG: 'rgb(150, 255, 159)',
        CARD_BG: 'rgb(220, 220, 220)',
        PAUSE_OVERLAY: 'rgba(0, 0, 0, 0.5)'
    }
});
