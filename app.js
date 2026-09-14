/* =========================================
   CHEMLAB APPLICATION
========================================= */


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   EXPERIMENT NAVIGATION
========================================= */

function openExperiment(experiment) {

    if (experiment === "titration") {

        showPage("titration");

        resetExperiment();

    }

}


/* =========================================
   TITRATION SIMULATION
========================================= */

let titrantVolume = 0;


/*
   Simplified educational model.

   Later we will replace this with
   a proper chemistry simulation engine.
*/

function addTitrant(amount = 1) {

    titrantVolume += amount;

    if (titrantVolume > 50) {
        titrantVolume = 50;
    }

    updateTitrationDisplay();

}


function updateTitrationDisplay() {

    const volumeElement =
        document.getElementById("volume");

    const phElement =
        document.getElementById("ph");

    const indicatorElement =
        document.getElementById("indicator");

    const buretteLiquid =
        document.getElementById("buretteLiquid");

    const flaskLiquid =
        document.getElementById("flaskLiquid");


    volumeElement.textContent =
        titrantVolume.toFixed(2) + " mL";


    /*
       Educational demonstration of
       pH movement toward the endpoint.
    */

    let ph;

    if (titrantVolume < 20) {

        ph = 2 + titrantVolume * 0.15;

    } else if (titrantVolume < 25) {

        ph = 5 + (titrantVolume - 20) * 1.5;

    } else {

        ph = 12;
    }


    ph = Math.min(ph, 12);

    phElement.textContent =
        ph.toFixed(2);


    /*
       Indicator state
    */

    if (ph < 8.2) {

        indicatorElement.textContent =
            "Colourless";

    } else {

        indicatorElement.textContent =
            "Pink";
    }


    /*
       Visual liquid movement
    */

    const buretteHeight =
        Math.max(10, 80 - titrantVolume * 1.5);

    buretteLiquid.style.height =
        buretteHeight + "%";


    const flaskHeight =
        Math.min(80, 25 + titrantVolume);

    flaskLiquid.style.height =
        flaskHeight + "%";

}


/* =========================================
   RESET EXPERIMENT
========================================= */

function resetExperiment() {

    titrantVolume = 0;

    updateTitrationDisplay();

}


/* =========================================
   AI DEMO
========================================= */

function askAI(question) {

    const chat =
        document.getElementById("chatMessages");

    chat.innerHTML += `
        <div class="user-message">
            ${question}
        </div>
    `;


    let answer =
        "That's a great chemistry question. " +
        "The full AI tutor will be connected in the next stage.";


    if (question === "What is titration?") {

        answer =
            "Titration is a laboratory technique used " +
            "to determine the concentration of a solution " +
            "by reacting it with a solution of known concentration.";

    }


    if (question === "Why do we use an indicator?") {

        answer =
            "An indicator helps us identify when a chemical " +
            "reaction has reached a particular point, such as " +
            "the endpoint of an acid–base titration.";

    }


    if (question === "What is the endpoint?") {

        answer =
            "The endpoint is the point during a titration " +
            "where the indicator shows that the reaction has " +
            "reached the desired stage.";

    }


    setTimeout(() => {

        chat.innerHTML += `
            <div class="ai-message">
                🤖 ${answer}
            </div>
        `;

        chat.scrollTop = chat.scrollHeight;

    }, 400);

}


/* =========================================
   SEND AI QUESTION
========================================= */

function sendQuestion() {

    const input =
        document.getElementById("questionInput");

    const question =
        input.value.trim();


    if (!question) {
        return;
    }


    askAI(question);

    input.value = "";

}


/* =========================================
   MAIN AI PAGE
========================================= */

function mainAIQuestion() {

    const input =
        document.getElementById("mainQuestion");

    const question =
        input.value.trim();


    if (!question) {
        return;
    }


    const chat =
        document.getElementById("mainChat");


    chat.innerHTML += `
        <div class="user-message">
            ${question}
        </div>
    `;


    setTimeout(() => {

        chat.innerHTML += `
            <div class="ai-message">

                🤖 I'm your ChemLab AI Tutor.

                <br><br>

                In the next stage, I'll be connected
                to a real AI model so I can answer
                chemistry questions intelligently.

            </div>
        `;

        chat.scrollTop =
            chat.scrollHeight;

    }, 400);


    input.value = "";

}


/* =========================================
   QUIZ
========================================= */

const quizQuestions = [

    {
        question:
            "What is the main purpose of titration?",

        options: [
            "To measure temperature",
            "To determine concentration",
            "To measure mass",
            "To produce electricity"
        ],

        correct: 1
    },


    {
        question:
            "What is used to show the endpoint of an acid-base titration?",

        options: [
            "A thermometer",
            "An indicator",
            "A balance",
            "A stopwatch"
        ],

        correct: 1
    },


    {
        question:
            "What type of reaction occurs between an acid and a base?",

        options: [
            "Neutralization",
            "Combustion",
            "Decomposition",
            "Polymerization"
        ],

        correct: 0
    },


    {
        question:
            "What does pH measure?",

        options: [
            "Acidity or alkalinity",
            "Mass",
            "Temperature",
            "Volume"
        ],

        correct: 0
    },


    {
        question:
            "Which piece of equipment commonly delivers the titrant?",

        options: [
            "Burette",
            "Beaker",
            "Thermometer",
            "Balance"
        ],

        correct: 0
    }

];


let currentQuestion = 0;
let quizScore = 0;


function answerQuiz(answer) {

    const question =
        quizQuestions[currentQuestion];


    const feedback =
        document.getElementById("quizFeedback");


    if (answer === question.correct) {

        quizScore++;

        feedback.textContent =
            "✅ Correct!";

    } else {

        feedback.textContent =
            "❌ Not quite. Review the concept and try the next question.";

    }


    setTimeout(() => {

        currentQuestion++;

        if (currentQuestion >= quizQuestions.length) {

            finishQuiz();

        } else {

            loadQuizQuestion();

        }

    }, 900);

}


function loadQuizQuestion() {

    const question =
        quizQuestions[currentQuestion];


    document.getElementById("questionNumber")
        .textContent =
        currentQuestion + 1;


    document.getElementById("quizQuestion")
        .textContent =
        question.question;


    const options =
        document.getElementById("quizOptions");


    options.innerHTML = "";


    question.options.forEach((option, index) => {

        const button =
            document.createElement("button");

        button.textContent =
            String.fromCharCode(65 + index) +
            ". " +
            option;

        button.onclick = () =>
            answerQuiz(index);

        options.appendChild(button);

    });


    document.getElementById("quizFeedback")
        .textContent = "";

}


function finishQuiz() {

    const percentage =
        Math.round(
            (quizScore / quizQuestions.length) * 100
        );


    document.getElementById("quizQuestion")
        .textContent =
        `Quiz Complete! You scored ${percentage}%`;


    document.getElementById("quizOptions")
        .innerHTML = `
            <button onclick="restartQuiz()">
                🔄 Try Again
            </button>
        `;


    document.getElementById("quizFeedback")
        .textContent =
        "🏆 Great work! Keep learning chemistry.";

}


function restartQuiz() {

    currentQuestion = 0;
    quizScore = 0;

    loadQuizQuestion();

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadQuizQuestion();

        resetExperiment();

    }
);
