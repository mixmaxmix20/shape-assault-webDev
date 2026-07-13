/**
 * Handles all keyboard and mouse inputs, resolving canvas scaling dynamically
 */
export class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseClicked = false;
        this.lastClickedX = 0;
        this.lastClickedY = 0;
        this.anyKeyPressed = false;

        window.addEventListener('keydown', (e) => this._onKeyDown(e));
        window.addEventListener('keyup', (e) => this._onKeyUp(e));
        window.addEventListener('mousemove', (e) => this._onMouseMove(e));
        window.addEventListener('click', (e) => this._onClick(e));
    }

    /**
     * Checks if a key is currently held down
     * @param {string} key - The event.code (e.g. 'KeyW', 'ArrowLeft')
     * @returns {boolean}
     */
    isDown(key) {
        return !!this.keys[key];
    }

    /**
     * Resets single-frame click flags
     */
    clearClick() {
        this.mouseClicked = false;
    }

    /**
     * Resets key press trigger flag
     */
    clearKeyPressTrigger() {
        this.anyKeyPressed = false;
    }

    _onKeyDown(e) {
        this.keys[e.code] = true;
        this.anyKeyPressed = true;
    }

    _onKeyUp(e) {
        this.keys[e.code] = false;
    }

    _onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.mouseX = (e.clientX - rect.left) * scaleX;
        this.mouseY = (e.clientY - rect.top) * scaleY;
    }

    _onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.lastClickedX = (e.clientX - rect.left) * scaleX;
        this.lastClickedY = (e.clientY - rect.top) * scaleY;
        this.mouseClicked = true;
    }
}
