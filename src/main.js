import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game');
    if (canvas) {
        const game = new Game(canvas);
        game.start();
        console.log('ShapeAssault engine successfully started!');
    } else {
        console.error('Fatal: Canvas element with ID "game" was not found.');
    }
});
