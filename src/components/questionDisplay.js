class QuestionDisplay {
    constructor(element) {
        this.element = element;
    }

    displayQuestion(question) {
        this.element.textContent = question.text;
        this.flashEffect();
    }

    flashEffect() {
        this.element.classList.add('flash');
        setTimeout(() => {
            this.element.classList.remove('flash');
        }, 5000);
    }
}

export default QuestionDisplay;