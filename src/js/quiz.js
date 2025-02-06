export class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.timer = null;
        this.timeRemaining = 0;
        this.isActive = false;
        this.results = [];
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    startQuiz() {
        this.isActive = true;
        this.currentQuestionIndex = 0;
        this.startTimer();
    }

    startTimer() {
        const question = this.getCurrentQuestion();
        this.timeRemaining = question.timeLimit;
        
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    submitAnswer(userAnswer) {
        if (!this.isActive) return;

        const question = this.getCurrentQuestion();
        const timeSpent = question.timeLimit - this.timeRemaining;
        const isCorrect = this.checkAnswer(userAnswer, question);

        // Update statistics
        question.stats.attempts++;
        question.stats.totalTimeSpent += timeSpent;
        question.stats.averageTimeSpent = question.stats.totalTimeSpent / question.stats.attempts;
        if (isCorrect) question.stats.correctAnswers++;

        clearInterval(this.timer);
        return {
            isCorrect,
            timeSpent,
            stats: question.stats
        };
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.startTimer();
            return true;
        }
        this.isActive = false;
        return false;
    }

    checkAnswer(userAnswer, question) {
        if (question.difficulty === 'Hard') {
            return Number(userAnswer) === question.finalAnswer;
        }
        return Number(userAnswer) === question.answer;
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `Time remaining: ${this.timeRemaining}s`;
        }
    }

    handleTimeUp() {
        clearInterval(this.timer);
        this.submitAnswer(null); // Record as an incorrect attempt
        // Trigger UI update to show time's up message
    }

    getStatistics() {
        return this.questions.map(q => ({
            difficulty: q.difficulty,
            attempts: q.stats.attempts,
            correctAnswers: q.stats.correctAnswers,
            averageTimeSpent: q.stats.averageTimeSpent,
            successRate: q.stats.attempts > 0 
                ? (q.stats.correctAnswers / q.stats.attempts * 100).toFixed(1) 
                : 0
        }));
    }

    reset() {
        this.currentQuestionIndex = 0;
        this.timeRemaining = 0;
        this.isActive = false;
        this.results = [];
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    hasNextQuestion() {
        return this.currentQuestionIndex < this.questions.length - 1;
    }
}

export { Quiz as default };