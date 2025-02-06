// src/js/app.js

import { Timer } from "./timer.js";
import { Quiz } from "./quiz.js";
import ProgressBar from "../components/progressBar.js"; // Changed to default import
import questions, { getRandomQuestions } from "./questions.js";

// Initialize quiz state
const difficulties = ["Easy", "Medium", "Hard"];
const questionsPerDifficulty = {
    Easy: 5,
    Medium: 3,
    Hard: 2
};

let currentDifficulty = "Easy";
let currentQuiz = null;
let difficultyIndex = 0;
let timer = null;
let startTime = null;
let progressBar = null;
let studentInfo = {
    name: '',
    section: ''
};
let difficultyStatus = {
    Easy: false,
    Medium: false,
    Hard: false
};

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", startQuizFlow);

  // Prevent form submission on Enter key
  const startScreen = document.getElementById("start-screen");
  const inputs = startScreen.querySelectorAll('input[type="text"]');
  
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission
        if (input.nextElementSibling && input.nextElementSibling.tagName === 'INPUT') {
          // Move to next input if exists
          input.nextElementSibling.focus();
        } else {
          // If it's the last input, trigger start button click
          startButton.click();
        }
      }
    });
  });
});

function startQuizFlow() {
  const nameInput = document.getElementById("student-name");
  const sectionInput = document.getElementById("student-section");
  const privacyConsent = document.getElementById("privacy-consent");
  const privacyPolicy = document.querySelector(".privacy-policy");

  if (!nameInput.value.trim() || !sectionInput.value.trim()) {
      alert("Please enter both your name and section");
      return;
  }

  if (!privacyConsent.checked) {
      alert("Please read and agree to the data privacy policy to continue");
      return;
  }

  studentInfo.name = nameInput.value.trim();
  studentInfo.section = sectionInput.value.trim();

  // Remove privacy policy with fade out
  if (privacyPolicy) {
      privacyPolicy.style.opacity = '0';
      setTimeout(() => {
          privacyPolicy.remove();
      }, 300); // Match transition duration
  }

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";

  startNextDifficulty();
}
function startNextDifficulty() {
    // Save the current results before moving to next difficulty
    const savedResults = currentQuiz ? [...currentQuiz.results] : [];
    if (currentDifficulty) {
        difficultyStatus[currentDifficulty] = true;
    }
    if (difficultyIndex < difficulties.length) {
        currentDifficulty = difficulties[difficultyIndex]; // Set current difficulty
        // console.log('Starting difficulty:', currentDifficulty);
        
        // Get questions for current difficulty
        const difficultyQuestions = getRandomQuestions(currentDifficulty, questionsPerDifficulty[currentDifficulty]);
        // console.log('Questions for difficulty:', difficultyQuestions);

        if (difficultyQuestions.length === 0) {
            console.warn(`No questions found for difficulty: ${currentDifficulty}`);
            difficultyIndex++;
            startNextDifficulty();
            return;
        }

        // Create new quiz but preserve previous results
        currentQuiz = new Quiz(difficultyQuestions);
        currentQuiz.results = savedResults; // Restore saved results
        setupQuiz(currentDifficulty);
    } else {
        endQuiz();
    }
}

// function startPreparationCountdown() {
//   const countdownElement = document.getElementById("countdown");
//   let count = 5;

//   countdownElement.style.display = "block";
//   countdownElement.textContent =
//     "Prepare for Difficult Mode in " + count + " seconds...";

//   const countInterval = setInterval(() => {
//     count--;
//     if (count > 0) {
//       countdownElement.textContent =
//         "Prepare for Difficult Mode in " + count + " seconds...";
//     } else {
//       clearInterval(countInterval);
//       countdownElement.style.display = "none";
//       startQuiz("Hard");
//     }
//   }, 1000);
// }

function startQuiz(difficulty) {
  resetQuiz();
  difficultyStatus[difficulty] = false;  // Reset status
  startTime = Date.now();
  
  // Get all questions for the difficulty level
  const allQuestions = getRandomQuestions(difficulty);
  currentQuiz = new Quiz(allQuestions);
  setupQuiz(difficulty);
  displayQuestion();

  // Update progress display
  const totalQuestions = allQuestions.length;
  const progressElement = document.getElementById("quiz-progress");
  if (progressElement) {
      progressElement.textContent = `Question 1 of ${totalQuestions}`;
  }
}

function endDifficulty(difficulty) {
    difficultyStatus[difficulty] = true;
    checkAllDifficultiesComplete();
}

function checkAllDifficultiesComplete() {
    return Object.values(difficultyStatus).every(status => status);
}

function formatFractionQuestion(question) {
  // Handle mixed numbers first (e.g., 1 2/3)
  question = question.replace(/(\d+)\s+(\d+)\/(\d+)/g, 
      (match, whole, numerator, denominator) => {
          return `<span class="mixed-number">
              <span class="whole">${whole}</span>
              <span class="fraction">
                  <span class="numerator">${numerator}</span>
                  <span class="denominator">${denominator}</span>
              </span>
          </span>`;
      }
  );

  // Handle simple fractions (e.g., 2/3)
  question = question.replace(/(\d+)\/(\d+)/g,
      (match, numerator, denominator) => {
          return `<span class="fraction">
              <span class="numerator">${numerator}</span>
              <span class="denominator">${denominator}</span>
          </span>`;
      }
  );

  return question;
}

function setupQuiz(difficulty) {
  const container = document.getElementById("question-display");
  const progressBarContainer = document.getElementById("progress-bar");
  const difficultyDisplay = document.getElementById("difficulty-display");

  if (!container) return;

  container.innerHTML = "";
  progressBarContainer.innerHTML = "";

  // Hide progress bar for Easy and Medium modes
  progressBarContainer.style.display = difficulty === "Hard" ? "block" : "none";

  if (difficultyDisplay) {
    difficultyDisplay.innerHTML = `
        <div class="difficulty-indicator ${difficulty.toLowerCase()}">
            <span class="difficulty-label">Difficulty:</span>
            <span class="difficulty-value">${difficulty}</span>
        </div>
    `;
}

  if (difficulty === "Hard") {
    // Add question counter for Hard mode
    const questionCounter = document.createElement("div");
    questionCounter.id = "question-counter";
    questionCounter.className = "question-counter";
    questionCounter.textContent = `${currentQuiz.currentQuestionIndex + 1}/${currentQuiz.questions.length} left`;
    container.appendChild(questionCounter);

    const currentStepDiv = document.createElement("div");
    currentStepDiv.id = "current-step";
    progressBarContainer.appendChild(currentStepDiv);

    const currentQuestion = currentQuiz.getCurrentQuestion();
    window.hardModeState = {
      currentStep: 0,
      steps: currentQuestion.steps,
    };

    timer = new Timer(3, updateHardMode, nextStep);
    progressBar = new ProgressBar("progress-bar", 6000);

    displayHardModeStep();
    timer.start();
    progressBar.start();
  } else {
    // New implementation for Easy and Medium with flashing questions
    const form = document.createElement("form");
    form.id = "quiz-form";
    
    // Get questions from currentQuiz
    const questions = currentQuiz.questions;
    // console.log('Setting up quiz with questions:', questions);
    
    if (!questions || questions.length === 0) {
        console.error('No questions available for difficulty:', difficulty);
        return;
    }

    let currentQuestionIndex = 0;

    // Add question counter
    const questionCounter = document.createElement("div");
    questionCounter.id = "question-counter";
    questionCounter.className = "question-counter";
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    container.appendChild(questionCounter);

    // Create timer display
    const timerDisplay = document.createElement("div");
    timerDisplay.id = "question-timer";
    timerDisplay.className = "timer-display";
    container.appendChild(timerDisplay);

    // Create question container
    const questionContainer = document.createElement("div");
    questionContainer.className = "single-question-container";
    form.appendChild(questionContainer);
    container.appendChild(form);

    function displayCurrentQuestion() {
        // Update question counter
        const questionCounter = document.getElementById("question-counter");
        questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;

        const question = questions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <div class="question-text flash-question">
                ${formatFractionQuestion(question.question)}
            </div>
            <input type="text" 
                   class="answer-input" 
                   id="current-answer"
                   required 
                   step="any"
                   placeholder="${question.isFraction ? 'Enter as a/b' : 'Enter answer'}"
                   ${question.isFraction ? 'pattern="\\d+/\\d+" title="Enter answer as a fraction (e.g., 1/2)"' : ''}>
            <button type="button" class="submit-answer">Next</button>
        `;

        // Start timer for current question
        let timeLeft = 20; // 20 seconds per question
        const startTime = Date.now();
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        
        const timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleQuestionTimeout();
            }
        }, 1000);

        // Handle next button click
        const nextButton = questionContainer.querySelector('.submit-answer');
        nextButton.addEventListener('click', () => {
            clearInterval(timer);
            const answer = document.getElementById('current-answer').value;
            const timeSpent = 20 - timeLeft; // Calculate time spent

            // Record answer in currentQuiz.results
            if (!currentQuiz.results) {
                currentQuiz.results = [];
            }

            currentQuiz.results.push({
                studentName: studentInfo.name,
                studentSection: studentInfo.section,
                difficulty: currentDifficulty,
                question: question.question,
                userAnswer: parseFloat(answer),
                correctAnswer: question.answer,
                correct: parseFloat(answer) === question.answer,
                responseTime: timeSpent
            });

            console.log('Added result:', currentQuiz.results[currentQuiz.results.length - 1]);

            // Move to next question or finish
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                displayCurrentQuestion();
            } else {
                finishQuizSection();
            }
        });
    }

    function handleQuestionTimeout() {
        const question = questions[currentQuestionIndex];
        
        // Record timeout in currentQuiz.results
        if (!currentQuiz.results) {
            currentQuiz.results = [];
        }

        currentQuiz.results.push({
            studentName: studentInfo.name,
            studentSection: studentInfo.section,
            difficulty: currentDifficulty,
            question: question.question,
            userAnswer: null,
            correctAnswer: question.answer,
            correct: false,
            responseTime: 20 // Maximum time
        });

        console.log('Added timeout result:', currentQuiz.results[currentQuiz.results.length - 1]);

        // Move to next question or finish
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayCurrentQuestion();
        } else {
            finishQuizSection();
        }
    }

    function finishQuizSection() {
        difficultyIndex++;
        setTimeout(() => {
            startNextDifficulty();
        }, 1000);
    }

    // Start with first question
    displayCurrentQuestion();
  }

  // Add event listener for answer inputs
  const answerInputs = document.querySelectorAll('.answer-input');
  answerInputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
              e.preventDefault();
              const submitButton = input.closest('.question-container').querySelector('.submit-answer');
              if (submitButton) {
                  submitButton.click();
              }
          }
      });
  });
}

function displayHardModeStep() {
  const state = window.hardModeState;
  if (!state || state.currentStep >= state.steps.length) return;

  const step = state.steps[state.currentStep];
  const currentStepDiv = document.getElementById("current-step");
  
  if (!currentStepDiv) return;

  // Remove existing flash class
  currentStepDiv.classList.remove("flash-number");

  // Force reflow
  void currentStepDiv.offsetWidth;

  // Display the step
  const displayText = state.currentStep === 0 
      ? step.value 
      : step.operation + step.value;

  currentStepDiv.textContent = displayText;
  currentStepDiv.classList.add("flash-number");
}

function nextStep() {
  const state = window.hardModeState;
  if (!state) return;

  state.currentStep++;

  if (state.currentStep < state.steps.length) {
    // More steps to show
    displayHardModeStep();
    timer.reset();
    timer.start();
    progressBar.reset();
    progressBar.start();
  } else {
    // End of sequence
    showAnswerInput(state.expression);
  }
}

function showAnswerInput(expression) {
  const container = document.getElementById("question-display");
  container.innerHTML = `
        
        <input type="number" id="final-answer" placeholder="Enter your answer">
        <button id="submit-answer">Submit</button>
    `;

  // Add event listener to the submit button
  document
    .getElementById("submit-answer")
    .addEventListener("click", submitHardModeAnswer);
}

function updateHardMode(timeLeft) {
  progressBar.draw(1 - timeLeft / 1); // 3 seconds total
}

function displayQuestion() {
  const questionElement = document.getElementById("current-question");
  if (!questionElement || !currentQuiz) return;

  const currentQuestion = currentQuiz.getCurrentQuestion();
  if (currentQuestion) {
      questionElement.textContent = currentQuestion.question;
      currentQuiz.startTime = Date.now();

      // Update progress
      const progress = `Question ${currentQuiz.currentIndex + 1} of ${currentQuiz.questions.length}`;
      const progressElement = document.getElementById("quiz-progress");
      if (progressElement) {
          progressElement.textContent = progress;
      }
  }
}

class QuizDataTracker {
  constructor() {   
    this.SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbzmXhdfn1gimYmZug-lecKRI34CN2xcmeuuQYvtB4QjqXkVvSC-BVpcTtVuVBMZZJzCFA/exec';
    this.isSubmitting = false;
    this.lastSubmitTime = 0;
    this.minSubmitInterval = 2000; // 2 seconds
  }

  async sendToSpreadsheet(data) {
    try {
        this.isSubmitting = true;

        const formattedData = data.map(row => ({
            timestamp: row.timestamp,
            studentName: row.studentName,
            studentSection: row.studentSection,
            totalCorrectAnswers: Number(row.totalCorrectAnswers),
            totalWrongAnswers: Number(row.totalWrongAnswers),
            averageTimePerQuestion: Number(row.averageTimePerQuestion),
            totalQuestions: Number(row.totalQuestions),
            easyCorrect: Number(row.easyCorrect),
            easyTotal: Number(row.easyTotal),
            easyPercentage: Number(row.easyPercentage),
            mediumCorrect: Number(row.mediumCorrect),
            mediumTotal: Number(row.mediumTotal),
            mediumPercentage: Number(row.mediumPercentage),
            hardCorrect: Number(row.hardCorrect),
            hardTotal: Number(row.hardTotal),
            hardPercentage: Number(row.hardPercentage)
        }));

        // Create URL with parameters
        const url = new URL(this.SHEETS_API_URL);
        url.searchParams.append('data', JSON.stringify(formattedData));

        const response = await fetch(url.toString(), {
            method: 'GET',
            mode: 'no-cors'
        });

        this.lastSubmitTime = Date.now();
        console.log('Data sent successfully:', formattedData);
        return true;

    } catch (error) {
        console.error('Error sending data:', error);
        throw error;
    } finally {
        this.isSubmitting = false;
    }
}
}

// Create a single instance of the tracker
const quizDataTracker = new QuizDataTracker();

function calculateQuizSummary(results) {
    // console.log('Raw results:', results);

    const summary = {
        totalCorrect: 0,
        totalWrong: 0,
        totalTime: 0,
        totalQuestions: results.length,
        byDifficulty: {
            Easy: { correct: 0, total: 0 },
            Medium: { correct: 0, total: 0 },
            Hard: { correct: 0, total: 0 }
        }
    };

    let validResponseTimes = 0;

    results.forEach(result => {
        if (result.correct) summary.totalCorrect++;
        else summary.totalWrong++;

        // Validate and add response time
        if (typeof result.responseTime === 'number' && !isNaN(result.responseTime)) {
            summary.totalTime += result.responseTime;
            validResponseTimes++;
        }

        const diff = result.difficulty;
        summary.byDifficulty[diff].total++;
        if (result.correct) summary.byDifficulty[diff].correct++;
    });

    // Ensure averageTime is a valid number
    summary.averageTime = validResponseTimes > 0 ? 
        Number((summary.totalTime / validResponseTimes).toFixed(2)) : 0;

    // console.log('Total time:', summary.totalTime);
    // console.log('Valid responses:', validResponseTimes);
    // console.log('Average time:', summary.averageTime);

    // Calculate percentages
    Object.keys(summary.byDifficulty).forEach(diff => {
        const stats = summary.byDifficulty[diff];
        stats.percentage = stats.total > 0 ? 
            Number(((stats.correct / stats.total) * 100).toFixed(1)) : 0;
    });

    return summary;
}

function createThrobber() {
    return `
        <div class="throbber-overlay">
            <div class="throbber">
                <div class="throbber-spinner"></div>
                <p>Submitting your results...</p>
            </div>
        </div>`;
}

function showIncompleteWarning(missingDifficulties) {
    const quizScreen = document.getElementById("quiz-screen");
    quizScreen.innerHTML = `
        <div class="incomplete-warning">
            <h2>Too fast!! DONT DO THAT!.</h2>
            <p>You still need to complete: ${missingDifficulties}</p>
            <button id="continue-quiz" class="continue-btn">Refresh the page and try again</button>
        </div>`;

    // Add event listener after creating the button
    document.getElementById('continue-quiz').addEventListener('click', () => {
        startNextDifficulty();
    });
}

function endQuiz() {
    const summary = calculateQuizSummary(currentQuiz.results);
    const quizScreen = document.getElementById("quiz-screen");

    quizScreen.innerHTML = createThrobber();

    const quizData = [{
        timestamp: new Date().toISOString(),
        studentName: studentInfo.name,
        studentSection: studentInfo.section,
        totalCorrectAnswers: summary.totalCorrect || 0,
        totalWrongAnswers: summary.totalWrong || 0,
        averageTimePerQuestion: parseFloat(summary.averageTime) || 0,
        totalQuestions: summary.totalQuestions || 0,
        easyCorrect: summary.byDifficulty.Easy.correct || 0,
        easyTotal: summary.byDifficulty.Easy.total || 0,
        easyPercentage: summary.byDifficulty.Easy.percentage || 0,
        mediumCorrect: summary.byDifficulty.Medium.correct || 0,
        mediumTotal: summary.byDifficulty.Medium.total || 0,
        mediumPercentage: summary.byDifficulty.Medium.percentage || 0,
        hardCorrect: summary.byDifficulty.Hard.correct || 0,
        hardTotal: summary.byDifficulty.Hard.total || 0,
        hardPercentage: summary.byDifficulty.Hard.percentage || 0
    }];

    if (!checkAllDifficultiesComplete()) {
        const missingDifficulties = Object.entries(difficultyStatus)
            .filter(([_, completed]) => !completed)
            .map(([diff, _]) => diff)
            .join(', ');
        
        showIncompleteWarning(missingDifficulties);
        return;
    }

    console.log('Quiz data before sending:', quizData); // Debug log

    quizDataTracker.sendToSpreadsheet(quizData)
        .then(() => {
            const resultDiv = document.createElement("div");
            resultDiv.className = "end-screen";
            resultDiv.innerHTML = `
                <h2>Thank you for your response!</h2>
                <div class="thank-you-image">
                    <img src="./ThankYou.png" alt="Thank You" />
                </div>
            `;
            quizScreen.innerHTML = "";
            quizScreen.appendChild(resultDiv);
        })
        .catch(error => {
            console.error('Error submitting quiz:', error);
            quizScreen.innerHTML = `
                <div class="end-screen error">
                    <h2>Error submitting results</h2>
                    <p>Please try again later</p>
                </div>`;
        });
}

function resetQuiz() {
  // Stop and clear timer
  if (timer) {
    timer.stop();
    timer = null;
  }

  // Reset and clear progress bar
  if (progressBar) {
    progressBar.reset();
    progressBar.stop();
    progressBar = null;
  }

  // Reset quiz
  if (currentQuiz) {
    currentQuiz.reset();
  }

  // Clear containers
  const container = document.getElementById("question-display");
  const progressBarContainer = document.getElementById("progress-bar");

  if (container) container.innerHTML = "";
  if (progressBarContainer) progressBarContainer.innerHTML = "";
}

// Modify the submitHardModeAnswer function to include student info
function submitHardModeAnswer() {
    const endTime = Date.now();
    const responseTime = (endTime - currentQuiz.startTime) / 1000; // Convert to seconds

    const answer = parseInt(document.getElementById("final-answer").value);
    const currentQuestion = currentQuiz.getCurrentQuestion();
    const correct = answer === currentQuestion.finalAnswer;

    // Include student info in results
    currentQuiz.results.push({
        studentName: studentInfo.name,
        studentSection: studentInfo.section,
        difficulty: "Hard",
        correct: correct,
        responseTime: responseTime, // Store response time in seconds
        question: currentQuestion.steps.map(s => s.operation + s.value).join(' '),
        userAnswer: answer,
        correctAnswer: currentQuestion.finalAnswer
    });

    // Disable input and button after submission
    document.getElementById("final-answer").disabled = true;
    document.getElementById("submit-answer").disabled = true;

    // Move to next question or finish
    currentQuiz.currentQuestionIndex++;
    
    // Show next question after delay
    setTimeout(() => {
        if (currentQuiz.currentQuestionIndex < currentQuiz.questions.length) {
            setupQuiz("Hard"); // Start next hard mode question
        } else {
            difficultyIndex++;
            startNextDifficulty();
        }
    }, 2000);
}

function validateAnswer(userAnswer, correctAnswer, isFraction) {
    if (!isFraction) {
        return Number(userAnswer) === Number(correctAnswer);
    }
    
    // Convert fraction strings to decimal for comparison
    const convertFractionToDecimal = (fraction) => {
        if (fraction.includes('/')) {
            const [num, den] = fraction.split('/').map(Number);
            return num / den;
        }
        return Number(fraction);
    };
    
    const userDecimal = convertFractionToDecimal(userAnswer);
    const correctDecimal = convertFractionToDecimal(correctAnswer);
    
    return Math.abs(userDecimal - correctDecimal) < 0.0001;
}
