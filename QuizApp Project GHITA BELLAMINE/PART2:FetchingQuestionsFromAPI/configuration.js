document.querySelector("#quiz-configuration").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get user input values
    const numQuestions = document.querySelector("#questions_num").value;
    const category = document.querySelector("#category").value;
    const difficulty = document.querySelector("#difficulty").value;
    const type = document.querySelector("#type").value; 

    // Convert numQuestions to an integer
    const numQuestionsInt = parseInt(numQuestions);

    // Validate inputs
    if (isNaN(numQuestionsInt) || numQuestionsInt < 1 || numQuestionsInt > 50) {
        alert("Please enter a valid number of questions (between 1 and 50).");
        return;
    }
    if (!category) {
        alert("Please select a category.");
        return;
    }
    if (!difficulty) {
        alert("Please select a difficulty level.");
        return;
    }
    if (!type) {
        alert("Please select a question type.");
        return;
    }

    // Store settings in localStorage
    const quizConfig = {
        numQuestions: numQuestionsInt,
        category: category,
        difficulty: difficulty,
        type: type
    };

    localStorage.setItem("quizConfig", JSON.stringify(quizConfig));

    // Redirect to the quiz page
    window.location.href = "quiz.html";
});
