const finalScoreElement = document.getElementById("finalScore");
const scoreMessageElement = document.getElementById("scoreMessage");

// Retrieve score from localStorage
const finalScore = localStorage.getItem("SCORE") || 0;
const fullMark = localStorage.getItem("QUEST_NUM")*10 || 0;
finalScoreElement.innerText = finalScore + "/"+ fullMark;

// Generate a message based on score
if (finalScore >= 80) {
    scoreMessageElement.innerText = " Excellent! You're a quiz master!";
} else if (finalScore >= 50) {
    scoreMessageElement.innerText = " Good job! Keep practicing!";
} else {
    scoreMessageElement.innerText = " Keep trying, you'll get better!";
}

// Function to restart the quiz
function restartQuiz() {
    window.location.href = "configuration.html";
}

