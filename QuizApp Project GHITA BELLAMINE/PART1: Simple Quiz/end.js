const finalScoreElement = document.getElementById("finalScore");
const scoreMessageElement = document.getElementById("scoreMessage");

// Retrieve score from localStorage
const finalScore = localStorage.getItem("quizScore") || 0;
const fullMark = 30;
finalScoreElement.innerText = finalScore + "/"+ fullMark;

// Generate a message based on score
if (finalScore == 30) {
    scoreMessageElement.innerText = " Excellent! You're a quiz master!";
}
else {
    scoreMessageElement.innerText = " Keep trying, you'll get better!";
}

// Function to restart the quiz
function restartQuiz() {
    window.location.href = "quiz.html";
}

