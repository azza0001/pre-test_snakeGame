const questions = [
  // Easy questions
  {
    difficulty: "Easy",
    question: "71 - 158",
    answer: -87,
    timeLimit: 30, 
  },
  {
    difficulty: "Easy",
    question: "89 - 55",
    answer: 34,
    timeLimit: 30,
  },
  {
    difficulty: "Easy",
    question: "39 + 99",
    answer: 138,
  },
  {
    difficulty: "Easy",
    question: "92 - 36",
    answer: 56,
  },
  {
    difficulty: "Easy",
    question: "52 - 39",
    answer: 13,
  },
  {
    difficulty: "Easy",
    question: "39 + 105",
    answer: 144,
  },
  {
    difficulty: "Easy",
    question: "61 + 75",
    answer: 136,
  },
  {
    difficulty: "Easy",
    question: "71 - 158",
    answer: -87,
  },
  {
    difficulty: "Easy",
    question: "173 - 96",
    answer: 77,
  },
  {
    difficulty: "Easy",
    question: "17 - 9",
    answer: 8,
  },
  {
    difficulty: "Easy",
    question: "63 + 59",
    answer: 122,
  },
  {
    difficulty: "Easy",
    question: "61 + 83",
    answer: 144,
  },
  {
    difficulty: "Easy",
    question: "115 - 98",
    answer: 17,
  },
  {
    difficulty: "Easy",
    question: "41 - 85",
    answer: -44,
  },
  {
    difficulty: "Easy",
    question: "37 + 92",
    answer: 129,
  },

  // Medium questions (fractions)
  {
    difficulty: "Medium",
    question: "3/10 + 7/8",
    answer: "47/30",
    timeLimit: 45,
    isFraction: true,
  },
  {
    difficulty: "Medium",
    question: "6/15 - 9/10",
    answer: "-1/2",
    timeLimit: 45,
    isFraction: true,
  },
  {
    difficulty: "Medium",
    question: "38 x 3",
    answer: 114,
    timeLimit: 45,
  },
  {
    difficulty: "Medium",
    question: "132 ÷ 11",
    answer: 12,
    timeLimit: 45,
  },
  {
    difficulty: "Medium",
    question: "192 ÷ 24",
    answer: 8,
    timeLimit: 45,
  },
  {
    difficulty: "Medium",
    question: "19 x 4",
    answer: 76,
    timeLimit: 45,
  },
  {
    difficulty: "Medium",
    question: "245 ÷ 7",
    answer: 35,
    timeLimit: 45,
  },
  {
    difficulty: "Medium",
    question: "23 x 7",
    answer: 161,
    timeLimit: 45,
  },
  {
    difficulty: "Medium",
    question: "5/13 + 2/3",
    answer: "31/39",
    timeLimit: 45,
    isFraction: true,
  },
  {
    difficulty: "Medium",
    question: "114 ÷ 3",
    answer: "38",
    timeLimit: 45,
  },

  // Hard questions with sequential steps

  // Hard questions with sequential steps
  {
    difficulty: "Hard",
    steps: [
      { value: "4", operation: "" },
      { value: "4", operation: "x " },
      { value: "8", operation: "+ " },
      { value: "6", operation: "+ " },
      { value: "8", operation: "- " },
      { value: "14", operation: "- " },
      { value: "2", operation: "÷ " },
      { value: "9", operation: "+ " },
      { value: "7", operation: "- " },
      { value: "4", operation: "+ " },
    ],
    finalAnswer: 13,
    timeLimit: 60,
  },
  {
    difficulty: "Hard",
    steps: [
      { value: "15", operation: "" },
      { value: "10", operation: "+ " },
      { value: "4", operation: "- " },
      { value: "7", operation: "+ " },
      { value: "2", operation: "x " },
      { value: "4", operation: "÷ " },
      { value: "2", operation: "÷ " },
      { value: "2", operation: "- " },
      { value: "5", operation: "+ " },
      { value: "5", operation: "x " },
    ],
    finalAnswer: 85,
    timeLimit: 60,
  },
  {
    difficulty: "Hard",
    steps: [
      { value: "1", operation: "" },
      { value: "7", operation: "- " },
      { value: "4", operation: "- " },
      { value: "2", operation: "÷ " },
      { value: "1", operation: "- " },
      { value: "1", operation: "+ " },
      { value: "1", operation: "x " },
      { value: "9", operation: "+ " },
      { value: "7", operation: "- " },
      { value: "3", operation: "+ " },
    ],
    finalAnswer: 0,
    timeLimit: 60,
  },
  {
    difficulty: "Hard",
    steps: [
      { value: "2", operation: "" },
      { value: "9", operation: "x " },
      { value: "20", operation: "+ " },
      { value: "2", operation: "÷ " },
      { value: "4", operation: "+ " },
      { value: "8", operation: "- " },
      { value: "5", operation: "+ " },
      { value: "12", operation: "+ " },
      { value: "2", operation: "x " },
      { value: "5", operation: "- " },
    ],
    finalAnswer: 59,
    timeLimit: 60,
  },
  {
    difficulty: "Hard",
    steps: [
      { value: "1", operation: "" },
      { value: "5", operation: "- " },
      { value: "11", operation: "+ " },
      { value: "13", operation: "- " },
      { value: "2", operation: "x " },
      { value: "2", operation: "- " },
      { value: "7", operation: "+ " },
      { value: "2", operation: "+ " },
      { value: "3", operation: "- " },
      { value: "7", operation: "x " },
    ],
    finalAnswer: -56,
    timeLimit: 60,
  },
];

// Function to shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to get random questions for a specific difficulty
function getRandomQuestions(difficulty) {
  const difficultyQuestions = questions.filter(
    (q) => q.difficulty === difficulty
  );
  return shuffleArray([...difficultyQuestions]);
}

// Add metadata for statistics tracking
questions.forEach((q) => {
  q.stats = {
    attempts: 0,
    correctAnswers: 0,
    totalTimeSpent: 0,
    averageTimeSpent: 0,
  };
});

export { questions as default, getRandomQuestions };
