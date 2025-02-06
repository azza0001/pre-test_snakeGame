export default class ProgressBar {
    constructor(containerId, duration) {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.width = 300;
        this.canvas.height = 300;
        
        // Insert canvas into container
        const container = document.getElementById(containerId);
        container.appendChild(this.canvas);
        
        // Get context and initialize properties
        this.ctx = this.canvas.getContext('2d');
        this.duration = duration;
        this.remaining = duration;
        this.startTime = null;
        this.animationId = null;
        
        // Circle properties
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 10;
    }

    draw(progress) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 20;
        this.ctx.stroke();
        
        // Draw progress arc
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 
            -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * progress));
        this.ctx.strokeStyle = '#4caf50';
        this.ctx.lineWidth = 10;
        this.ctx.stroke();
    }

    animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        this.draw(progress);
        this.remaining = this.duration - elapsed;

        if (progress < 1) {
            this.animationId = requestAnimationFrame((t) => this.animate(t));
        }
    }

    start() {
        this.startTime = null;
        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    reset() {
        this.stop();
        this.draw(0);
    }

    getRemainingTime() {
        return Math.max(0, this.remaining);
    }
}