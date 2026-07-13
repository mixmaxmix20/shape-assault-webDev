export class Pickup {
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} type - 'hp'
     */
    constructor(x, y, type = 'hp') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
    }

    /**
     * Renders the pickup icon on the canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'rgb(255,0,0)';

        // Inner Red Cross
        ctx.fillRect(-8, -3, 16, 6);
        ctx.fillRect(-3, -8, 6, 16);

        // Outer outline
        ctx.beginPath();
        ctx.moveTo(-8, -3);
        ctx.lineTo(-3, -3);
        ctx.lineTo(-3, -8);
        ctx.lineTo(3, -8);
        ctx.lineTo(3, -3);
        ctx.lineTo(8, -3);
        ctx.lineTo(8, 3);
        ctx.lineTo(3, 3);
        ctx.lineTo(3, 8);
        ctx.lineTo(-3, 8);
        ctx.lineTo(-3, 3);
        ctx.lineTo(-8, 3);
        ctx.closePath();

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }
}
