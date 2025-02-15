// Get elements from the DOM
const questionElement = document.getElementById("question");
const multipleChoiceList = document.getElementById("multiple"); // UL for multiple choice
const booleanChoiceList = document.getElementById("boolean"); // UL for boolean
const scoreElement = document.getElementById("score");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Retrieve quiz configuration
function getQueryParams() {
    const config = JSON.parse(localStorage.getItem("quizConfig")); // Get stored config
    if (!config) {
        alert("No quiz configuration found! Redirecting...");
        window.location.href = "configuration.html"; // Redirect to settings page
    }
    return config;
}

function fetchQuestions() {
    document.querySelector("#loading-message").style.display = "block";
    const config = getQueryParams();
    let apiUrl = `https://opentdb.com/api.php?amount=${config.numQuestions}&category=${config.category}&difficulty=${config.difficulty}&type=${config.type}`;

    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            document.querySelector("#loading-message").style.display = "none";

            if (!data.results || data.results.length === 0) {
                alert("No questions available for the selected settings. Please choose different settings.");
                window.location.href = "configuration.html"; 
                return;
            }

            questions = data.results.map(formatQuestion);
            startGame();
        })
        .catch((error) => {
            console.error("Error fetching questions:", error);
            alert("An error occurred while fetching questions. Please try again.");
            window.location.href = "configuration.html"; // Redirect to settings page
        });
}


// Format questions
function formatQuestion(questionData) {
    const formattedQuestion = { question: questionData.question, type: questionData.type };

    if (questionData.type === "boolean") {
        formattedQuestion.choices = ["True", "False"];
        formattedQuestion.answer = questionData.correct_answer === "True" ? 1 : 2;
    } else {
        let answerChoices = [...questionData.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(formattedQuestion.answer - 1, 0, questionData.correct_answer);
        formattedQuestion.choices = answerChoices;
    }

    return formattedQuestion;
}

// Start Quiz
function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = `${score} / ${questions.length * 10}`;
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        localStorage.setItem("SCORE", score);
        localStorage.setItem("QUEST_NUM",questions.length);
        return window.location.assign("end.html");
    }

    resetChoiceStyles(); // Reset styles before showing the new question

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;

    document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`;

    if (currentQuestion.type === "boolean") {
        booleanChoiceList.style.display = "block";
        multipleChoiceList.style.display = "none";

        const booleanChoices = booleanChoiceList.getElementsByClassName("choice-text");
        booleanChoices[0].innerText = "True";
        booleanChoices[1].innerText = "False";

        booleanChoices[0].parentElement.onclick = () => checkAnswer(1, currentQuestion.answer, booleanChoices[0].parentElement);
        booleanChoices[1].parentElement.onclick = () => checkAnswer(2, currentQuestion.answer, booleanChoices[1].parentElement);
    } else {
        multipleChoiceList.style.display = "block";
        booleanChoiceList.style.display = "none";

        const choicesElements = Array.from(multipleChoiceList.getElementsByClassName("choice-text"));
        choicesElements.forEach((choiceElement, index) => {
            choiceElement.innerText = currentQuestion.choices[index];
            choiceElement.parentElement.onclick = () => checkAnswer(index + 1, currentQuestion.answer, choiceElement.parentElement);
        });
    }

    startTimer();
}

let timeLeft = 10;
let timerInterval;

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    document.getElementById("time-left").innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").innerText = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    alert("Time's up! Moving to the next question.");
    currentQuestionIndex++;
    displayQuestion();
}

// Reset styles for each question
function resetChoiceStyles() {
    document.querySelectorAll(".choice-container").forEach((choice) => {
        choice.classList.remove("correct", "incorrect");
    });
}

// Check the answer
function checkAnswer(selectedAnswer, correctAnswer, selectedElement) {
    clearInterval(timerInterval);

    resetChoiceStyles(); // Ensure old styles are cleared

    const isCorrect = selectedAnswer === correctAnswer;
    const classToApply = isCorrect ? "correct" : "incorrect";

    // Apply the border color class
    selectedElement.classList.add(classToApply);

    if (isCorrect) {
        score += 10;
        scoreElement.innerText = `${score} / ${questions.length * 10}`;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1000);
}


// Fetch and start the quiz
fetchQuestions();
