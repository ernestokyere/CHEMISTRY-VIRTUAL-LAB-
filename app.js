/* =========================================
   CHEMLAB — STAGE 2
   REAL-RULE-BASED TITRATION ENGINE
========================================= */


/* =========================================
   APPLICATION NAVIGATION
========================================= */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function openExperiment(experiment) {

    if (experiment === "titration") {
        showPage("titration");
        resetExperiment();
    }
}


/* =========================================
   TITRATION CONFIGURATION
=========================================

   Experiment:

   HCl + NaOH → NaCl + H₂O

   HCl concentration:
   0.100 mol/L

   Initial HCl volume:
   25.00 mL

   NaOH concentration:
   0.100 mol/L

   Therefore:

   n(HCl) = C × V
          = 0.100 × 0.025
          = 0.00250 mol

   Equivalence occurs when:

   n(NaOH) = 0.00250 mol

   At 0.100 mol/L NaOH:

   V = n / C
     = 0.025 L
     = 25.00 mL

========================================= */

const titration = {

    acid: {
        name: "HCl",
        concentration: 0.100,
        initialVolume: 25.00
    },

    base: {
        name: "NaOH",
        concentration: 0.100
    },

    titrantVolume: 0,

    indicator: "phenolphthalein"

};


/* =========================================
   CONSTANTS
========================================= */

const PHENOLPHTHALEIN_ENDPOINT = 8.20;


/* =========================================
   ADD TITRANT
========================================= */

function addTitrant(amount = 1) {

    titration.titrantVolume += amount;

    /*
       Prevent unrealistic volume.
    */

    if (titration.titrantVolume > 50) {
        titration.titrantVolume = 50;
    }

    calculateTitration();

}


/* =========================================
   CALCULATE TITRATION
========================================= */

function calculateTitration() {

    const acidConcentration =
        titration.acid.concentration;

    const acidVolumeL =
        titration.acid.initialVolume / 1000;

    const baseConcentration =
        titration.base.concentration;

    const baseVolumeL =
        titration.titrantVolume / 1000;


    /*
       MOLES OF HCl
    */

    const acidMoles =
        acidConcentration * acidVolumeL;


    /*
       MOLES OF NaOH
    */

    const baseMoles =
        baseConcentration * baseVolumeL;


    /*
       TOTAL SOLUTION VOLUME
    */

    const totalVolumeL =
        acidVolumeL + baseVolumeL;


    /*
       Determine pH
    */

    let pH;

    let state;


    /*
       BEFORE EQUIVALENCE

       HCl is in excess.
    */

    if (acidMoles > baseMoles) {

        const remainingHPlus =
            acidMoles - baseMoles;

        const concentrationHPlus =
            remainingHPlus / totalVolumeL;

        pH =
            -Math.log10(concentrationHPlus);

        state =
            "Acidic";


    /*
       AT EQUIVALENCE

       Strong acid + strong base.

       Idealized pH ≈ 7.
    */

    } else if (
        Math.abs(acidMoles - baseMoles)
        < 0.0000001
    ) {

        pH = 7.00;

        state =
            "Neutral";


    /*
       AFTER EQUIVALENCE

       OH⁻ is in excess.
    */

    } else {

        const remainingOH =
            baseMoles - acidMoles;

        const concentrationOH =
            remainingOH / totalVolumeL;

        const pOH =
            -Math.log10(concentrationOH);

        pH =
            14 - pOH;

        state =
            "Basic";
    }


    /*
       Keep pH within normal scale.
    */

    pH =
        Math.max(0, Math.min(14, pH));


    /*
       Update the interface.
    */

    updateTitrationDisplay(
        pH,
        state,
        acidMoles,
        baseMoles
    );

}


/* =========================================
   UPDATE DISPLAY
========================================= */

function updateTitrationDisplay(
    pH,
    state,
    acidMoles,
    baseMoles
) {

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


    if (!volumeElement) {
        return;
    }


    /*
       Volume
    */

    volumeElement.textContent =
        titration.titrantVolume.toFixed(2)
        + " mL";


    /*
       pH
    */

    phElement.textContent =
        pH.toFixed(2);


    /*
       Indicator

       Phenolphthalein is colourless
       below its transition range and
       becomes pink in the basic range.
    */

    if (pH >= PHENOLPHTHALEIN_ENDPOINT) {

        indicatorElement.textContent =
            "Pink";

    } else {

        indicatorElement.textContent =
            "Colourless";
    }


    /*
       Burette visual.

       More titrant delivered means
       less liquid remaining in burette.
    */

    const remainingBurette =
        Math.max(
            10,
            90 -
            (titration.titrantVolume / 50) * 80
        );

    buretteLiquid.style.height =
        remainingBurette + "%";


    /*
       Flask liquid rises as titrant
       is added.
    */

    const flaskLevel =
        Math.min(
            80,
            25 +
            (titration.titrantVolume / 50) * 55
        );

    flaskLiquid.style.height =
        flaskLevel + "%";


    /*
       Change the flask appearance
       when solution becomes basic.
    */

    if (pH >= PHENOLPHTHALEIN_ENDPOINT) {

        flaskLiquid.style.background =
            "#f7a8c4";

    } else {

        flaskLiquid.style.background =
            "#d9f0ff";
    }


    /*
       Detect endpoint.
    */

    updateEndpointMessage(
        pH,
        acidMoles,
        baseMoles
    );
}


/* =========================================
   ENDPOINT MESSAGE
========================================= */

function updateEndpointMessage(
    pH,
    acidMoles,
    baseMoles
) {

    let message =
        document.getElementById(
            "endpointMessage"
        );


    /*
       Create the message element
       if it doesn't exist yet.
    */

    if (!message) {

        message =
            document.createElement("div");

        message.id =
            "endpointMessage";

        message.style.marginTop =
            "15px";

        message.style.padding =
            "12px";

        message.style.borderRadius =
            "8px";

        const laboratory =
            document.querySelector(
                ".laboratory"
            );

        if (laboratory) {
            laboratory.appendChild(message);
        }
    }


    /*
       Near equivalence.
    */

    const difference =
        Math.abs(
            acidMoles - baseMoles
        );


    if (
        difference < 0.00015 &&
        pH >= 7 &&
        pH < PHENOLPHTHALEIN_ENDPOINT
    ) {

        message.textContent =
            "⚠️ You are approaching the equivalence point.";

    }


    /*
       Indicator endpoint reached.
    */

    else if (
        pH >= PHENOLPHTHALEIN_ENDPOINT
    ) {

        message.textContent =
            "🎯 Phenolphthalein endpoint reached.";

    }


    /*
       Still acidic.
    */

    else {

        message.textContent =
            "🔬 The solution is still acidic. Continue adding titrant.";

    }

}


/* =========================================
   RESET
========================================= */

function resetExperiment() {

    titration.titrantVolume = 0;

    calculateTitration();

}


/* =========================================
   AI TUTOR — TEMPORARY STAGE 2 VERSION
========================================= */

function askAI(question) {

    const chat =
        document.getElementById(
            "chatMessages"
        );

    if (!chat) {
        return;
    }


    addChatMessage(
        chat,
        question,
        "user"
    );


    let answer =
        chemistryAnswer(question);


    setTimeout(() => {

        addChatMessage(
            chat,
            answer,
            "ai"
        );

        chat.scrollTop =
            chat.scrollHeight;

    }, 300);

}


function chemistryAnswer(question) {

    const q =
        question.toLowerCase();


    if (q.includes("titration")) {

        return `
            Titration is a technique used to determine
            the concentration of an unknown solution by
            reacting it with a solution whose concentration
            is known.
        `;
    }


    if (
        q.includes("indicator") ||
        q.includes("phenolphthalein")
    ) {

        return `
            Phenolphthalein is an acid-base indicator.
            It is colourless in acidic solution and becomes
            pink as the solution becomes sufficiently basic.
            In this experiment, the colour change helps us
            identify the endpoint.
        `;
    }


    if (
        q.includes("endpoint") ||
        q.includes("equivalence")
    ) {

        return `
            The equivalence point is where the reacting
            amounts of acid and base are chemically equivalent.
            The endpoint is the observable point indicated by
            the indicator's colour change.
        `;
    }


    if (q.includes("ph")) {

        return `
            pH describes how acidic or basic a solution is.
            A lower pH means more acidic, while a higher pH
            means more basic.
        `;
    }


    return `
        Good question! The full AI Chemistry Tutor will be
        connected in Stage 3. For now, ask me about titration,
        pH, indicators, or the equivalence point.
    `;
}


function addChatMessage(
    container,
    message,
    type
) {

    const div =
        document.createElement("div");

    div.className =
        type === "user"
            ? "user-message"
            : "ai-message";

    div.innerHTML =
        message;

    container.appendChild(div);
}


/* =========================================
   SEND QUESTION
========================================= */

function sendQuestion() {

    const input =
        document.getElementById(
            "questionInput"
        );

    if (!input) {
        return;
    }


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
        document.getElementById(
            "mainQuestion"
        );

    const chat =
        document.getElementById(
            "mainChat"
        );


    if (!input || !chat) {
        return;
    }


    const question =
        input.value.trim();


    if (!question) {
        return;
    }


    addChatMessage(
        chat,
        question,
        "user"
    );


    setTimeout(() => {

        addChatMessage(
            chat,
            chemistryAnswer(question),
            "ai"
        );

        chat.scrollTop =
            chat.scrollHeight;

    }, 300);


    input.value = "";
}


/* =========================================
   QUIZ ENGINE
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
            "What is the purpose of an indicator?",

        options: [
            "To measure mass",
            "To show a chemical change such as the endpoint",
            "To increase concentration",
            "To measure temperature"
        ],

        correct: 1
    },


    {
        question:
            "What is the pH of an ideal strong acid-strong base equivalence point?",

        options: [
            "2",
            "5",
            "7",
            "12"
        ],

        correct: 2
    },


    {
        question:
            "Which equipment normally delivers the titrant?",

        options: [
            "Burette",
            "Balance",
            "Thermometer",
            "Evaporating dish"
        ],

        correct: 0
    },


    {
        question:
            "In this simulation, which reaction is being studied?",

        options: [
            "HCl + NaOH",
            "O₂ + H₂",
            "NaCl + H₂O",
            "CO₂ + O₂"
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
        document.getElementById(
            "quizFeedback"
        );


    if (answer === question.correct) {

        quizScore++;

        feedback.textContent =
            "✅ Correct!";

    } else {

        feedback.textContent =
            "❌ Incorrect. Keep learning!";

    }


    setTimeout(() => {

        currentQuestion++;

        if (
            currentQuestion >=
            quizQuestions.length
        ) {

            finishQuiz();

        } else {

            loadQuizQuestion();
        }

    }, 800);

}


function loadQuizQuestion() {

    const question =
        quizQuestions[currentQuestion];


    document.getElementById(
        "questionNumber"
    ).textContent =
        currentQuestion + 1;


    document.getElementById(
        "quizQuestion"
    ).textContent =
        question.question;


    const options =
        document.getElementById(
            "quizOptions"
        );


    options.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.textContent =
                String.fromCharCode(
                    65 + index
                )
                + ". "
                + option;


            button.onclick = () =>
                answerQuiz(index);


            options.appendChild(button);

        }
    );


    document.getElementById(
        "quizFeedback"
    ).textContent = "";

}


function finishQuiz() {

    const percentage =
        Math.round(
            quizScore /
            quizQuestions.length *
            100
        );


    document.getElementById(
        "quizQuestion"
    ).textContent =
        `Quiz Complete — ${percentage}%`;


    document.getElementById(
        "quizOptions"
    ).innerHTML = `
        <button onclick="restartQuiz()">
            🔄 Try Again
        </button>
    `;


    document.getElementById(
        "quizFeedback"
    ).textContent =
        `You answered ${quizScore} out of ${quizQuestions.length} correctly.`;
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

        resetExperiment();

        loadQuizQuestion();

    }
);
