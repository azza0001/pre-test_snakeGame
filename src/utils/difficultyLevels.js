// difficultyLevels.js

const difficultyLevels = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard'
};

const filterQuestionsByDifficulty = (questions, difficulty) => {
    return questions.filter(question => question.difficulty === difficulty);
};

export { difficultyLevels, filterQuestionsByDifficulty };