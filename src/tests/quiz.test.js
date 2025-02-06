import { Quiz } from '../js/quiz';

describe('Quiz Class', () => {
    let quiz;

    beforeEach(() => {
        quiz = new Quiz();
    });

    test('should load questions correctly', () => {
        const questions = quiz.loadQuestions();
        expect(questions.length).toBeGreaterThan(0);
    });

    test('should track score correctly', () => {
        quiz.answerQuestion(0, 'correctAnswer');
        expect(quiz.score).toBe(1);
    });

    test('should determine difficulty level', () => {
        quiz.setDifficulty('Easy');
        expect(quiz.difficulty).toBe('Easy');
    });

    test('should return correct answer for a question', () => {
        const question = quiz.loadQuestions()[0];
        expect(quiz.checkAnswer(question, question.correctAnswer)).toBe(true);
    });
});