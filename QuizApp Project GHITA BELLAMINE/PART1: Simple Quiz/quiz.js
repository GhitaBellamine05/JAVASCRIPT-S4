const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const scoreText = document.getElementById("score");
const timerText = document.getElementById("time-left");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timeLeft = 10;
let timerInterval;

let questions = [
  {
    question: "Inside which HTML element do we put the JavaScript?",
    choice1: "<script>",
    choice2: "<javascript>",
    choice3: "<js>",
    choice4: "<scripting>",
    answer: 1,
  },
  {
    question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
    choice1: "<script href='xxx.js'>",
    choice2: "<script name='xxx.js'>",
    choice3: "<script src='xxx.js'>",
    choice4: "<script file='xxx.js'>",
    answer: 3,
  },
  {
    question: "How do you write 'Hello World' in an alert box?",
    choice1: "msgBox('Hello World');",
    choice2: "alertBox('Hello World');",
    choice3: "msg('Hello World');",
    choice4: "alert('Hello World');",
    answer: 4,
  },
];

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = questions.length;

function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  scoreText.innerText = score;
  getNewQuestion();
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("quizScore", score); // Store score before redirecting
    return window.location.assign("end.html");
  }

  questionCounter++;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice, index) => {
    choice.innerText = currentQuestion["choice" + (index + 1)];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;

  // Restart timer
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 10;
  timerText.innerText = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.innerText = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  acceptingAnswers = false;
  
  // Apply "incorrect" class to all choices
  choices.forEach((choice) => choice.parentElement.classList.add("incorrect"));

  setTimeout(() => {
    choices.forEach((choice) => choice.parentElement.classList.remove("incorrect"));
    getNewQuestion();
  }, 1000);
}

choices.forEach((choice, index) => {
  choice.addEventListener("click", () => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    clearInterval(timerInterval);

    const selectedAnswer = index + 1;
    const classToApply = selectedAnswer === currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    choice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      choice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

function incrementScore(num) {
  score += num;
  scoreText.innerText = score;
  localStorage.setItem("quizScore", score); // Update score in localStorage
}

startGame();
