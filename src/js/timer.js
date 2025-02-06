export class Timer {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.remainingTime = duration;
        this.intervalId = null;
    }

    start() {
        this.intervalId = setInterval(() => {
            this.remainingTime -= 1;
            this.onTick(this.remainingTime);

            if (this.remainingTime <= 0) {
                this.stop();
                this.onComplete();
            }
        }, 2000);
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    reset() {
        this.remainingTime = this.duration;
        this.onTick(this.remainingTime);
    }
}

export { Timer as default };