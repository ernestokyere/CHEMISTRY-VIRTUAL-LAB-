/* =========================================================
   CHEMLAB — MAIN APPLICATION
   Complete replacement app.js
   ========================================================= */


/* =========================================================
   GLOBAL CONFIGURATION
   ========================================================= */

const CHEMLAB_CONFIG = {
    supabaseUrl:
        "https://zscbgeaieiqwknhjxpnt.supabase.co",

    chemistryAIEndpoint:
        "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/chemistry-ai"
};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let chemLabState = {
    currentPage: "home",

    currentExperiment: null,

    xp: 0,

    experimentsCompleted: 0,

    quizScore: 0,

    currentQuestion: 0,

    quizAnswered: false
};


/* =========================================================
   BASIC TITRATION STATE
   ========================================================= */

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


const PHENOLPHTHALEIN_ENDPOINT = 8.20;


/* =========================================================
   QUIZ DATA
   ========================================================= */

const quizQuestions = [

    {
        question:
            "What is the main purpose of an acid-base titration?",

        options: [
            "To determine the concentration of a solution",
            "To measure temperature",
            "To identify a metal",
            "To measure density"
        ],

        answer: 0,

        explanation:
            "Titration is commonly used to determine the concentration of an unknown solution."
    },

    {
        question:
            "What is the purpose of an indicator in an acid-base titration?",

        options: [
            "To increase the temperature",
            "To show a color change near the endpoint",
            "To increase the volume",
            "To produce oxygen"
        ],

        answer: 1,

        explanation:
            "An indicator changes color over a particular pH range and helps identify the endpoint."
    },

    {
        question:
            "What is the approximate pH at the equivalence point of a strong acid–strong base titration?",

        options: [
            "1",
            "5",
            "7",
            "14"
        ],

        answer: 2,

        explanation:
            "For a strong acid reacting with a strong base, the equivalence point is approximately pH 7 at 25°C."
    },

    {
        question:
            "Which piece of equipment is normally used to deliver the titrant accurately?",

        options: [
            "Beaker",
            "Burette",
            "Thermometer",
            "Evaporating dish"
        ],

        answer: 1,

        explanation:
            "A burette allows the titrant volume to be measured accurately."
    },

    {
        question:
            "What is the balanced reaction between HCl and NaOH?",

        options: [
            "HCl + NaOH → NaCl + H₂O",
            "HCl + NaOH → H₂ + Cl₂",
            "HCl + NaOH → NaOH₂",
            "HCl + NaOH → HCl₂ + Na"
        ],

        answer: 0,

        explanation:
            "Hydrochloric acid reacts with sodium hydroxide to form sodium chloride and water."
    }

];


/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function safeText(element, value) {

    if (!element) {
        return;
    }

    element.textContent =
        value === undefined ||
        value === null
            ? ""
            : String(value);
}


function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );
}


function round(value, decimals = 2) {

    const factor =
        Math.pow(10, decimals);

    return Math.round(
        value * factor
    ) / factor;
}


function showNotification(
    message,
    type = "info"
) {

    const existing =
        document.querySelector(
            ".eduvora-notification"
        );

    if (existing) {
        existing.remove();
    }

    const notification =
        document.createElement("div");

    notification.className =
        "eduvora-notification";

    notification.setAttribute(
        "role",
        "status"
    );

    notification.textContent =
        message;

    if (type === "error") {
        notification.style.background =
            "#991b1b";
    } else if (type === "success") {
        notification.style.background =
            "#166534";
    } else if (type === "premium") {
        notification.style.background =
            "#7c3aed";
    }

    document.body.appendChild(
        notification
    );

    setTimeout(() => {

        if (notification.parentNode) {
            notification.remove();
        }

    }, 4000);
}


window.showNotification =
    showNotification;


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageId) {

    const pages =
        document.querySelectorAll(
            ".page"
        );

    pages.forEach(page => {

        page.classList.remove(
            "active"
        );
    });


    const requestedPage =
        document.getElementById(
            pageId
        );


    if (!requestedPage) {

        console.warn(
            `Page "${pageId}" was not found.`
        );

        return;
    }


    requestedPage.classList.add(
        "active"
    );


    chemLabState.currentPage =
        pageId;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


window.showPage =
    showPage;


/* =========================================================
   OPEN EXPERIMENT
   ========================================================= */

function openExperiment(
    experiment
) {

    if (
        experiment ===
        "titration"
    ) {

        chemLabState.currentExperiment =
            "titration";

        showPage(
            "titration"
        );

        resetExperiment();

        return;
    }


    console.warn(
        "Unknown experiment:",
        experiment
    );
}


window.openExperiment =
    openExperiment;


/* =========================================================
   BASIC TITRATION CALCULATION
   ========================================================= */

function calculateTitration() {

    const acidMoles =
        titration.acid.concentration *
        (
            titration.acid.initialVolume /
            1000
        );


    const baseMoles =
        titration.base.concentration *
        (
            titration.titrantVolume /
            1000
        );


    const totalVolume =
        (
            titration.acid.initialVolume +
            titration.titrantVolume
        ) / 1000;


    const difference =
        acidMoles -
        baseMoles;


    let pH;

    let state;


    if (
        Math.abs(difference) <
        0.000000001
    ) {

        pH = 7;

        state =
            "equivalence";

    } else if (
        difference > 0
    ) {

        const hPlus =
            difference /
            totalVolume;

        pH =
            -Math.log10(
                Math.max(
                    hPlus,
                    0.000000000001
                )
            );

        state =
            "acidic";

    } else {

        const ohMinus =
            Math.abs(difference) /
            totalVolume;

        const pOH =
            -Math.log10(
                Math.max(
                    ohMinus,
                    0.000000000001
                )
            );

        pH =
            14 -
            pOH;

        state =
            "basic";
    }


    pH =
        clamp(
            pH,
            0,
            14
        );


    return {

        pH,
        state,

        acidMoles,

        baseMoles,

        totalVolume,

        difference,

        equivalenceVolume:
            (
                acidMoles /
                titration.base.concentration
            ) * 1000
    };
}


/* =========================================================
   ADD TITRANT
   ========================================================= */

function addTitrant(
    amount = 1
) {

    let volume =
        Number(amount);


    if (
        !Number.isFinite(volume) ||
        volume <= 0
    ) {

        volume = 1;
    }


    titration.titrantVolume =
        clamp(
            titration.titrantVolume +
            volume,
            0,
            50
        );


    calculateTitration();


    updateTitrationDisplay();
}


window.addTitrant =
    addTitrant;


/* =========================================================
   BASIC TITRATION DISPLAY
   ========================================================= */

function updateTitrationDisplay() {

    const result =
        calculateTitration();


    safeText(
        $("titrantVolume"),
        `${titration.titrantVolume.toFixed(1)} mL`
    );


    safeText(
        $("phValue"),
        result.pH.toFixed(2)
    );


    safeText(
        $("pHValue"),
        result.pH.toFixed(2)
    );


    safeText(
        $("titrationPH"),
        result.pH.toFixed(2)
    );


    safeText(
        $("indicatorStatus"),
        getIndicatorStatus(
            result.pH
        )
    );


    updateBurette(
        titration.titrantVolume
    );


    updateFlask(
        result
    );


    updateEndpointMessage(
        result
    );
}


/* =========================================================
   INDICATOR STATUS
   ========================================================= */

function getIndicatorStatus(
    pH
) {

    if (
        pH >= 8.2 &&
        pH <= 10
    ) {

        return "🌸 Pink — endpoint range";
    }


    if (pH > 10) {

        return "🌸 Strong pink — basic";
    }


    return "⚪ Colorless — acidic";
}


/* =========================================================
   BASIC BURETTE
   ========================================================= */

function updateBurette(
    volume
) {

    const liquid =
        $("buretteLiquid");

    if (!liquid) {
        return;
    }


    const percentage =
        clamp(
            (volume / 50) * 100,
            0,
            100
        );


    liquid.style.height =
        `${percentage}%`;
}


/* =========================================================
   BASIC FLASK
   ========================================================= */

function updateFlask(
    result
) {

    const flask =
        $("flask");

    const solution =
        $("solution");


    if (solution) {

        if (
            result.state ===
            "equivalence"
        ) {

            solution.style.background =
                "rgba(255, 192, 203, 0.65)";

        } else if (
            result.state ===
            "basic"
        ) {

            solution.style.background =
                "rgba(255, 105, 180, 0.70)";

        } else {

            solution.style.background =
                "rgba(255, 255, 255, 0.18)";
        }
    }


    if (flask) {

        flask.dataset.state =
            result.state;
    }
}


/* =========================================================
   ENDPOINT MESSAGE
   ========================================================= */

function updateEndpointMessage(
    result
) {

    let message =
        $("endpointMessage");


    if (!message) {

        const container =
            $("titrationLab") ||
            $("titration");

        if (!container) {
            return;
        }


        message =
            document.createElement(
                "div"
            );

        message.id =
            "endpointMessage";

        message.style.marginTop =
            "15px";

        message.style.padding =
            "12px";

        message.style.borderRadius =
            "10px";

        message.style.fontWeight =
            "600";

        container.appendChild(
            message
        );
    }


    if (
        result.state ===
        "equivalence"
    ) {

        message.textContent =
            "🎯 Equivalence point reached! The acid and base have reacted in stoichiometric amounts.";

        message.style.background =
            "#dcfce7";

        message.style.color =
            "#166534";

    } else if (
        result.state ===
        "basic"
    ) {

        message.textContent =
            "🧪 The solution is now basic because NaOH is in excess.";

        message.style.background =
            "#fce7f3";

        message.style.color =
            "#9d174d";

    } else {

        message.textContent =
            "🧪 The solution remains acidic because HCl is still in excess.";

        message.style.background =
            "#fee2e2";

        message.style.color =
            "#991b1b";
    }
}


/* =========================================================
   RESET BASIC EXPERIMENT
   ========================================================= */

function resetExperiment() {

    titration.titrantVolume =
        0;


    updateTitrationDisplay();


    const questionInput =
        $("experimentAIQuestion");

    if (questionInput) {
        questionInput.value =
            "";
    }


    const answer =
        $("experimentAIAnswer");

    if (answer) {
        answer.textContent =
            "";
    }
}


window.resetExperiment =
    resetExperiment;


/* =========================================================
   EXPERIMENT STATE
   ========================================================= */

function getExperimentState() {

    const result =
        calculateTitration();


    return {

        experiment:
            "Acid-Base Titration",

        acid:
            titration.acid.name,

        acidConcentration:
            titration.acid.concentration,

        acidVolume:
            titration.acid.initialVolume,

        base:
            titration.base.name,

        baseConcentration:
            titration.base.concentration,

        titrantVolume:
            titration.titrantVolume,

        pH:
            result.pH,

        state:
            result.state,

        indicator:
            titration.indicator
    };
}


window.getExperimentState =
    getExperimentState;


/* =========================================================
   CHEMLAB AI TUTOR — SUPABASE
   ========================================================= */

const CHEMLAB_AI_URL =
    "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/chemistry-ai";

const CHEMLAB_SUPABASE_KEY =
    "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy";


/* =========================================================
   GET SUPABASE SESSION
   ========================================================= */

async function getAISessionToken() {

    try {

        if (
            typeof supabase !== "undefined" &&
            supabase &&
            supabase.auth
        ) {

            const {
                data,
                error
            } = await supabase.auth.getSession();


            if (
                !error &&
                data &&
                data.session &&
                data.session.access_token
            ) {

                return data.session.access_token;
            }
        }

    } catch (error) {

        console.warn(
            "Could not get AI session:",
            error
        );
    }


    return null;
}


/* =========================================================
   ASK CHEMLAB AI
   ========================================================= */

async function askAI(question) {

    const cleanQuestion =
        String(question || "")
            .trim();


    if (!cleanQuestion) {

        return {

            success: false,

            answer:
                "Please enter a chemistry question."
        };
    }


    let experiment = {};

    try {

        if (
            typeof getExperimentState ===
            "function"
        ) {

            experiment =
                getExperimentState();
        }

    } catch (error) {

        console.warn(
            "Could not get experiment state:",
            error
        );
    }


    try {

        const accessToken =
            await getAISessionToken();


        const headers = {

            "Content-Type":
                "application/json",

            "apikey":
                CHEMLAB_SUPABASE_KEY
        };


        /*
           Send the student's Supabase access token
           when available.
        */

        if (accessToken) {

            headers["Authorization"] =
                `Bearer ${accessToken}`;
        }


        const requestBody = {

            question:
                cleanQuestion,

            experiment:
                experiment,

            source:
                "ChemLab",

            student_mode:
                true
        };


        console.log(
            "ChemLab AI request:",
            requestBody
        );


        const response =
            await fetch(
                CHEMLAB_AI_URL,
                {
                    method:
                        "POST",

                    headers:
                        headers,

                    body:
                        JSON.stringify(
                            requestBody
                        )
                }
            );


        /*
           Read the response as text first.
           This helps us see the actual Supabase
           response when something goes wrong.
        */

        const rawResponse =
            await response.text();


        console.log(
            "ChemLab AI raw response:",
            rawResponse
        );


        let data = null;


        try {

            data =
                rawResponse
                    ? JSON.parse(
                        rawResponse
                    )
                    : null;

        } catch (jsonError) {

            console.error(
                "AI JSON parsing error:",
                jsonError
            );


            if (!response.ok) {

                throw new Error(
                    `AI service error (${response.status}).`
                );
            }


            throw new Error(
                "The AI service returned an invalid response."
            );
        }


        /*
           Handle HTTP errors.
        */

        if (!response.ok) {

            console.error(
                "ChemLab AI HTTP error:",
                response.status,
                data
            );


            throw new Error(

                data?.error ||

                data?.message ||

                data?.details ||

                `AI service returned error ${response.status}.`
            );
        }


        /*
           Support different response formats.
        */

        const answer =

            data?.answer ||

            data?.response ||

            data?.message ||

            data?.result ||

            data?.text ||

            data?.content ||

            data?.data?.answer ||

            data?.data?.response ||

            data?.data?.message;


        if (!answer) {

            console.error(
                "Unexpected AI response:",
                data
            );


            throw new Error(
                "The AI returned an empty response."
            );
        }


        return {

            success: true,

            answer:
                String(answer).trim()
        };


    } catch (error) {

        console.error(
            "Chemistry AI error:",
            error
        );


        return {

            success: false,

            answer:
                `The Chemistry AI could not respond right now.\n\n${error.message || "Please try again."}`
        };
    }
}


/* =========================================================
   EXPERIMENT AI
   ========================================================= */

async function askExperimentAI() {

    const input =
        $("experimentAIQuestion");


    const output =
        $("experimentAIAnswer");


    if (!input) {

        console.warn(
            "Experiment AI input was not found."
        );

        return;
    }


    const question =
        input.value.trim();


    if (!question) {

        if (output) {

            output.textContent =
                "Please enter a chemistry question.";
        }

        return;
    }


    if (output) {

        output.textContent =
            "🧠 Chemistry AI is thinking...";
    }


    const result =
        await askAI(
            question
        );


    if (output) {

        output.textContent =
            result.answer;
    }
}


window.askExperimentAI =
    askExperimentAI;


/* =========================================================
   MAIN AI CHAT
   ========================================================= */

async function mainAIQuestion() {

    const input =
        $("mainAIInput") ||
        $("aiQuestion");


    const output =
        $("mainAIAnswer") ||
        $("aiAnswer");


    if (!input) {

        console.warn(
            "Main AI input was not found."
        );

        return;
    }


    const question =
        input.value.trim();


    if (!question) {

        if (output) {

            output.textContent =
                "Please enter a chemistry question.";
        }

        return;
    }


    if (output) {

        output.textContent =
            "🧠 Chemistry AI is thinking...";
    }


    const result =
        await askAI(
            question
        );


    if (output) {

        output.textContent =
            result.answer;
    }
}


window.askAI =
    askAI;

window.mainAIQuestion =
    mainAIQuestion;


/* =========================================================
   AI ENTER KEY SUPPORT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const inputs = [

            $("mainAIInput"),

            $("aiQuestion"),

            $("experimentAIQuestion")
        ];


        inputs.forEach(
            function (input) {

                if (!input) {
                    return;
                }


                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter" &&
                            !event.shiftKey
                        ) {

                            event.preventDefault();


                            if (
                                input.id ===
                                "experimentAIQuestion"
                            ) {

                                askExperimentAI();

                            } else {

                                mainAIQuestion();
                            }
                        }
                    }
                );
            }
        );


        console.log(
            "ChemLab AI Tutor initialized successfully."
        );
    }
);


/* =========================================================
   QUIZ
   ========================================================= */

function loadQuizQuestion() {

    const questionData =
        quizQuestions[
            chemLabState.currentQuestion
        ];


    if (!questionData) {
        finishQuiz();
        return;
    }


    chemLabState.quizAnswered =
        false;


    const questionElement =
        $("quizQuestion");


    const optionsContainer =
        $("quizOptions");


    const questionNumber =
        $("quizQuestionNumber");


    const feedback =
        $("quizFeedback");


    if (questionElement) {

        questionElement.textContent =
            questionData.question;
    }


    if (questionNumber) {

        questionNumber.textContent =
            `Question ${
                chemLabState.currentQuestion + 1
            } of ${
                quizQuestions.length
            }`;
    }


    if (feedback) {

        feedback.textContent =
            "";

        feedback.style.display =
            "none";
    }


    if (!optionsContainer) {
        return;
    }


    optionsContainer.innerHTML =
        "";


    questionData.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "quiz-option";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                () => {

                    answerQuiz(
                        index
                    );
                }
            );


            optionsContainer.appendChild(
                button
            );
        }
    );
}


window.loadQuizQuestion =
    loadQuizQuestion;


/* =========================================================
   ANSWER QUIZ
   ========================================================= */

function answerQuiz(
    selectedIndex
) {

    if (
        chemLabState.quizAnswered
    ) {
        return;
    }


    const questionData =
        quizQuestions[
            chemLabState.currentQuestion
        ];


    if (!questionData) {
        return;
    }


    chemLabState.quizAnswered =
        true;


    const isCorrect =
        selectedIndex ===
        questionData.answer;


    if (isCorrect) {

        chemLabState.quizScore++;

        addXP(20);
    }


    const options =
        document.querySelectorAll(
            ".quiz-option"
        );


    options.forEach(
        (button, index) => {

            button.disabled =
                true;


            if (
                index ===
                questionData.answer
            ) {

                button.classList.add(
                    "correct"
                );
            }


            if (
                index === selectedIndex &&
                !isCorrect
            ) {

                button.classList.add(
                    "incorrect"
                );
            }
        }
    );


    const feedback =
        $("quizFeedback");


    if (feedback) {

        feedback.style.display =
            "block";


        feedback.textContent =
            isCorrect
                ? `✅ Correct! ${questionData.explanation}`
                : `❌ Not quite. ${questionData.explanation}`;
    }


    setTimeout(
        () => {

            chemLabState.currentQuestion++;


            if (
                chemLabState.currentQuestion >=
                quizQuestions.length
            ) {

                finishQuiz();

            } else {

                loadQuizQuestion();
            }

        },
        1200
    );
}


window.answerQuiz =
    answerQuiz;


/* =========================================================
   FINISH QUIZ
   ========================================================= */

function finishQuiz() {

    const total =
        quizQuestions.length;


    const score =
        chemLabState.quizScore;


    const percentage =
        Math.round(
            (score / total) *
            100
        );


    const questionElement =
        $("quizQuestion");


    const optionsContainer =
        $("quizOptions");


    const questionNumber =
        $("quizQuestionNumber");


    const feedback =
        $("quizFeedback");


    if (questionNumber) {

        questionNumber.textContent =
            "Quiz Complete";
    }


    if (questionElement) {

        questionElement.textContent =
            `You scored ${score}/${total} (${percentage}%).`;
    }


    if (optionsContainer) {

        optionsContainer.innerHTML =
            "";
    }


    if (feedback) {

        feedback.style.display =
            "block";


        feedback.textContent =
            percentage >= 80
                ? "🎉 Excellent chemistry work!"
                : percentage >= 60
                    ? "👏 Good work. Keep practicing!"
                    : "📚 Keep learning and try again!";
    }


    updateProgressDisplay();
}


window.finishQuiz =
    finishQuiz;


/* =========================================================
   RESTART QUIZ
   ========================================================= */

function restartQuiz() {

    chemLabState.currentQuestion =
        0;


    chemLabState.quizScore =
        0;


    chemLabState.quizAnswered =
        false;


    loadQuizQuestion();
}


window.restartQuiz =
    restartQuiz;


/* =========================================================
   XP SYSTEM
   ========================================================= */

function addXP(
    amount
) {

    const value =
        Number(amount);


    if (
        !Number.isFinite(value) ||
        value <= 0
    ) {
        return;
    }


    chemLabState.xp +=
        Math.round(value);


    updateProgressDisplay();
}


window.addXP =
    addXP;


/* =========================================================
   PROGRESS DISPLAY
   ========================================================= */

function updateProgressDisplay() {

    const xp =
        chemLabState.xp;


    const level =
        Math.max(
            1,
            Math.floor(xp / 100) + 1
        );


    const levelXP =
        xp % 100;


    const progressPercent =
        levelXP;


    safeText(
        $("xpValue"),
        xp
    );


    safeText(
        $("xpDisplay"),
        xp
    );


    safeText(
        $("levelValue"),
        level
    );


    safeText(
        $("levelDisplay"),
        level
    );


    safeText(
        $("experimentsCompleted"),
        chemLabState.experimentsCompleted
    );


    safeText(
        $("quizScore"),
        chemLabState.quizScore
    );


    const progressBar =
        $("progressBar");


    if (progressBar) {

        progressBar.style.width =
            `${progressPercent}%`;
    }


    const progressText =
        $("progressText");


    if (progressText) {

        progressText.textContent =
            `${levelXP}/100 XP to Level ${
                level + 1
            }`;
    }
}


window.updateProgressDisplay =
    updateProgressDisplay;


/* =========================================================
   COMPLETE EXPERIMENT
   ========================================================= */

function completeExperiment() {

    chemLabState.experimentsCompleted++;


    addXP(50);


    showNotification(
        "🎉 Experiment completed! +50 XP",
        "success"
    );
}


window.completeExperiment =
    completeExperiment;


/* =========================================================
   ADVANCED TITRATION STATE
   ========================================================= */

const advancedTitration = {

    initialized: false,

    hclConcentration: 0.100,

    naohConcentration: 0.100,

    sampleVolume: 25,

    addedVolume: 0,

    maxVolume: 60
};


/* =========================================================
   ADVANCED TITRATION CALCULATION
   ========================================================= */

function calculateAdvancedTitration(
    addedVolume
) {

    const hcl =
        advancedTitration.hclConcentration;


    const naoh =
        advancedTitration.naohConcentration;


    const sampleVolume =
        advancedTitration.sampleVolume;


    const volume =
        clamp(
            Number(addedVolume) || 0,
            0,
            advancedTitration.maxVolume
        );


    const hclMoles =
        hcl *
        (
            sampleVolume /
            1000
        );


    const naohMoles =
        naoh *
        (
            volume /
            1000
        );


    const totalVolume =
        (
            sampleVolume +
            volume
        ) / 1000;


    const equivalenceVolume =
        (
            hclMoles /
            naoh
        ) * 1000;


    let pH;

    let state;


    const difference =
        hclMoles -
        naohMoles;


    if (
        Math.abs(difference) <
        0.000000001
    ) {

        pH = 7;

        state =
            "equivalence";

    } else if (
        difference > 0
    ) {

        const hPlus =
            difference /
            totalVolume;


        pH =
            -Math.log10(
                Math.max(
                    hPlus,
                    0.000000000001
                )
            );


        state =
            "acidic";

    } else {

        const ohMinus =
            Math.abs(difference) /
            totalVolume;


        const pOH =
            -Math.log10(
                Math.max(
                    ohMinus,
                    0.000000000001
                )
            );


        pH =
            14 -
            pOH;


        state =
            "basic";
    }


    pH =
        clamp(
            pH,
            0,
            14
        );


    const hPlusConcentration =
        Math.pow(
            10,
            -pH
        );


    const ohMinusConcentration =
        Math.pow(
            10,
            -(14 - pH)
        );


    const neutralizationProgress =
        clamp(
            (
                naohMoles /
                hclMoles
            ) * 100,
            0,
            100
        );


    return {

        pH,

        state,

        hclMoles,

        naohMoles,

        totalVolume,

        equivalenceVolume,

        neutralizationProgress,

        hPlusConcentration,

        ohMinusConcentration,

        addedVolume: volume
    };
}


/* =========================================================
   INITIALIZE ADVANCED TITRATION
   ========================================================= */

function initializeAdvancedTitration() {

    const slider =
        $("advancedVolumeSlider");


    const addButton =
        $("advancedAddNaohButton");


    const resetButton =
        $("advancedResetButton");


    const hclInput =
        $("advancedHclConcentration");


    const naohInput =
        $("advancedNaohConcentration");


    const sampleInput =
        $("advancedSampleVolume");


    if (
        !slider ||
        !addButton ||
        !resetButton
    ) {

        console.warn(
            "Advanced titration controls were not found."
        );

        return;
    }


    if (
        advancedTitration.initialized
    ) {
        return;
    }


    advancedTitration.initialized =
        true;


    if (hclInput) {

        advancedTitration.hclConcentration =
            Number(hclInput.value) ||
            0.100;


        hclInput.addEventListener(
            "input",
            () => {

                advancedTitration.hclConcentration =
                    clamp(
                        Number(
                            hclInput.value
                        ) || 0.100,
                        0.001,
                        5
                    );


                updateAdvancedTitration();
            }
        );
    }


    if (naohInput) {

        advancedTitration.naohConcentration =
            Number(naohInput.value) ||
            0.100;


        naohInput.addEventListener(
            "input",
            () => {

                advancedTitration.naohConcentration =
                    clamp(
                        Number(
                            naohInput.value
                        ) || 0.100,
                        0.001,
                        5
                    );


                updateAdvancedTitration();
            }
        );
    }


    if (sampleInput) {

        advancedTitration.sampleVolume =
            Number(sampleInput.value) ||
            25;


        sampleInput.addEventListener(
            "input",
            () => {

                advancedTitration.sampleVolume =
                    clamp(
                        Number(
                            sampleInput.value
                        ) || 25,
                        1,
                        100
                    );


                updateAdvancedTitration();
            }
        );
    }


    slider.addEventListener(
        "input",
        () => {

            advancedTitration.addedVolume =
                clamp(
                    Number(slider.value) || 0,
                    0,
                    advancedTitration.maxVolume
                );


            updateAdvancedTitration();
        }
    );


    addButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const current =
                Number(
                    slider.value
                ) || 0;


            slider.value =
                Math.min(
                    current + 1,
                    advancedTitration.maxVolume
                );


            advancedTitration.addedVolume =
                Number(
                    slider.value
                );


            updateAdvancedTitration();
        }
    );


    resetButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            slider.value =
                0;


            advancedTitration.addedVolume =
                0;


            updateAdvancedTitration();


            const explanation =
                $("advancedExplanation");


            if (explanation) {

                explanation.style.display =
                    "none";
            }
        }
    );


    updateAdvancedTitration();
}


/* =========================================================
   UPDATE ADVANCED TITRATION
   ========================================================= */

function updateAdvancedTitration() {

    const slider =
        $("advancedVolumeSlider");


    if (slider) {

        advancedTitration.addedVolume =
            Number(
                slider.value
            ) || 0;
    }


    const result =
        calculateAdvancedTitration(
            advancedTitration.addedVolume
        );


    /* -----------------------------------------------------
       BURETTE
       ----------------------------------------------------- */

    const buretteLiquid =
        $("advancedBuretteLiquid");


    if (buretteLiquid) {

        const percentage =
            clamp(
                (
                    result.addedVolume /
                    advancedTitration.maxVolume
                ) * 100,
                0,
                100
            );


        buretteLiquid.style.height =
            `${percentage}%`;
    }


    safeText(
        $("advancedNaohVolume"),
        `${result.addedVolume.toFixed(1)} mL`
    );


    /* -----------------------------------------------------
       PH
       ----------------------------------------------------- */

    safeText(
        $("advancedPhValue"),
        result.pH.toFixed(2)
    );


    safeText(
        $("advancedProgressText"),
        `${result.neutralizationProgress.toFixed(1)}% neutralized`
    );


    const progressBar =
        $("advancedProgressBar");


    if (progressBar) {

        progressBar.style.width =
            `${result.neutralizationProgress}%`;
    }


    /* -----------------------------------------------------
       FLASK
       ----------------------------------------------------- */

    const solution =
        $("advancedSolution");


    if (solution) {

        if (
            result.state ===
            "equivalence"
        ) {

            solution.style.background =
                "rgba(255, 192, 203, 0.65)";

        } else if (
            result.state ===
            "basic"
        ) {

            solution.style.background =
                "rgba(255, 105, 180, 0.70)";

        } else {

            solution.style.background =
                "rgba(255, 255, 255, 0.18)";
        }
    }


    /* -----------------------------------------------------
       EQUIVALENCE
       ----------------------------------------------------- */

    safeText(
        $("advancedEquivalence"),
        `${result.equivalenceVolume.toFixed(2)} mL`
    );


    const equivalenceStatus =
        $("advancedEquivalenceStatus");


    if (equivalenceStatus) {

        if (
            result.state ===
            "equivalence"
        ) {

            equivalenceStatus.textContent =
                "🎯 Equivalence point reached";

            equivalenceStatus.style.color =
                "#16a34a";

        } else if (
            result.addedVolume <
            result.equivalenceVolume
        ) {

            equivalenceStatus.textContent =
                "Acid is still in excess";

            equivalenceStatus.style.color =
                "#dc2626";

        } else {

            equivalenceStatus.textContent =
                "Base is in excess";

            equivalenceStatus.style.color =
                "#be185d";
        }
    }


    /* -----------------------------------------------------
       INDICATOR
       ----------------------------------------------------- */

    safeText(
        $("advancedIndicatorStatus"),
        result.pH >= 8.2
            ? "🌸 Pink"
            : "⚪ Colorless"
    );


    /* -----------------------------------------------------
       CHEMICAL VALUES
       ----------------------------------------------------- */

    safeText(
        $("advancedHplus"),
        result.hPlusConcentration
            .toExponential(3)
    );


    safeText(
        $("advancedOhminus"),
        result.ohMinusConcentration
            .toExponential(3)
    );


    safeText(
        $("advancedReactionStatus"),
        result.state === "equivalence"
            ? "Neutralization complete"
            : result.state === "acidic"
                ? "HCl in excess"
                : "NaOH in excess"
    );


    safeText(
        $("advancedHplusConcentration"),
        result.hPlusConcentration
            .toExponential(3)
    );


    safeText(
        $("advancedOhConcentration"),
        result.ohMinusConcentration
            .toExponential(3)
    );


    safeText(
        $("advancedTotalVolume"),
        `${(
            advancedTitration.sampleVolume +
            result.addedVolume
        ).toFixed(1)} mL`
    );


    safeText(
        $("advancedNeutralizationProgress"),
        `${result.neutralizationProgress.toFixed(1)}%`
    );


    safeText(
        $("advancedObservation"),
        getAdvancedObservation(
            result
        )
    );


    /* -----------------------------------------------------
       CHART
       ----------------------------------------------------- */

    drawAdvancedTitrationChart();
}


window.updateAdvancedTitration =
    updateAdvancedTitration;


/* =========================================================
   ADVANCED OBSERVATION
   ========================================================= */

function getAdvancedObservation(
    result
) {

    if (
        result.state ===
        "equivalence"
    ) {

        return "The acid and base have reacted in stoichiometric amounts.";
    }


    if (
        result.state ===
        "acidic"
    ) {

        return "Hydrochloric acid remains in excess, so the solution is acidic.";
    }


    return "Sodium hydroxide is in excess, so the solution is basic.";
}


/* =========================================================
   ADVANCED EXPLANATION
   ========================================================= */

function explainAdvancedTitration() {

    const result =
        calculateAdvancedTitration(
            advancedTitration.addedVolume
        );


    const explanationBox =
        $("advancedExplanation");


    const explanationText =
        $("advancedExplanationText");


    if (!explanationBox) {
        return;
    }


    let explanation;


    if (
        result.state ===
        "equivalence"
    ) {

        explanation =
            `At ${result.addedVolume.toFixed(1)} mL of NaOH, the titration is at the equivalence point. The amount of NaOH added is stoichiometrically equal to the amount of HCl originally present. For this strong acid–strong base reaction, the pH is approximately 7 at 25°C.`;

    } else if (
        result.state ===
        "acidic"
    ) {

        explanation =
            `At ${result.addedVolume.toFixed(1)} mL of NaOH, HCl is still in excess. The remaining H⁺ ions determine the acidic pH of the solution. The calculated pH is approximately ${result.pH.toFixed(2)}.`;

    } else {

        explanation =
            `At ${result.addedVolume.toFixed(1)} mL of NaOH, the base is in excess. The remaining OH⁻ ions determine the basic pH. The calculated pH is approximately ${result.pH.toFixed(2)}.`;
    }


    if (explanationText) {

        explanationText.textContent =
            explanation;
    }


    explanationBox.style.display =
        "block";
}


window.explainAdvancedTitration =
    explainAdvancedTitration;


/* =========================================================
   OPEN ADVANCED TITRATION
   ========================================================= */

function openAdvancedTitration() {

    const premiumSection =
        $("premiumSection");


    const advancedPage =
        $("advancedTitrationPage");


    if (premiumSection) {

        premiumSection.style.display =
            "none";
    }


    if (advancedPage) {

        document
            .querySelectorAll(".page")
            .forEach(page => {

                page.classList.remove(
                    "active"
                );
            });


        advancedPage.classList.add(
            "active"
        );


        advancedPage.style.display =
            "block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    initializeAdvancedTitration();


    setTimeout(
        () => {

            updateAdvancedTitration();

        },
        100
    );
}


window.openAdvancedTitration =
    openAdvancedTitration;


/* =========================================================
   CLOSE ADVANCED TITRATION
   ========================================================= */

function closeAdvancedTitration() {

    const advancedPage =
        $("advancedTitrationPage");


    const premiumSection =
        $("premiumSection");


    if (advancedPage) {

        advancedPage.classList.remove(
            "active"
        );


        advancedPage.style.display =
            "none";
    }


    if (premiumSection) {

        premiumSection.style.display =
            "";
    }


    showPage(
        "lab"
    );
}


window.closeAdvancedTitration =
    closeAdvancedTitration;


/* =========================================================
   ADVANCED TITRATION CHART
   ========================================================= */

function calculateCurvePH(
    volume,
    hcl,
    naoh,
    sampleVolume
) {

    const acidMoles =
        hcl *
        (
            sampleVolume /
            1000
        );


    const baseMoles =
        naoh *
        (
            volume /
            1000
        );


    const totalVolume =
        (
            sampleVolume +
            volume
        ) / 1000;


    const difference =
        acidMoles -
        baseMoles;


    if (
        Math.abs(difference) <
        0.000000001
    ) {

        return 7;
    }


    if (
        difference > 0
    ) {

        const hPlus =
            difference /
            totalVolume;


        return clamp(
            -Math.log10(
                Math.max(
                    hPlus,
                    0.000000000001
                )
            ),
            0,
            14
        );
    }


    const ohMinus =
        Math.abs(difference) /
        totalVolume;


    const pOH =
        -Math.log10(
            Math.max(
                ohMinus,
                0.000000000001
            )
        );


    return clamp(
        14 - pOH,
        0,
        14
    );
}


function drawAdvancedTitrationChart() {

    const canvas =
        $("advancedTitrationChart");


    if (!canvas) {
        return;
    }


    const context =
        canvas.getContext("2d");


    if (!context) {
        return;
    }


    const rect =
        canvas.getBoundingClientRect();


    const width =
        Math.max(
            canvas.clientWidth ||
            rect.width ||
            600,
            300
        );


    const height =
        Math.max(
            canvas.clientHeight ||
            rect.height ||
            300,
            200
        );


    const devicePixelRatio =
        window.devicePixelRatio ||
        1;


    canvas.width =
        width *
        devicePixelRatio;


    canvas.height =
        height *
        devicePixelRatio;


    context.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );


    context.clearRect(
        0,
        0,
        width,
        height
    );


    const padding = 45;


    const graphWidth =
        width -
        padding -
        20;


    const graphHeight =
        height -
        padding -
        30;


    /* -----------------------------------------------------
       BACKGROUND
       ----------------------------------------------------- */

    context.fillStyle =
        "#ffffff";

    context.fillRect(
        0,
        0,
        width,
        height
    );


    /* -----------------------------------------------------
       GRID
       ----------------------------------------------------- */

    context.strokeStyle =
        "#e5e7eb";

    context.lineWidth =
        1;


    for (
        let pH = 0;
        pH <= 14;
        pH += 2
    ) {

        const y =
            padding +
            graphHeight -
            (
                pH / 14
            ) *
            graphHeight;


        context.beginPath();

        context.moveTo(
            padding,
            y
        );

        context.lineTo(
            padding +
            graphWidth,
            y
        );

        context.stroke();


        context.fillStyle =
            "#4b5563";

        context.font =
            "11px Arial";

        context.textAlign =
            "right";

        context.fillText(
            String(pH),
            padding - 7,
            y + 4
        );
    }


    const maxVolume =
        advancedTitration.maxVolume;


    for (
        let volume = 0;
        volume <= maxVolume;
        volume += 10
    ) {

        const x =
            padding +
            (
                volume /
                maxVolume
            ) *
            graphWidth;


        context.beginPath();

        context.moveTo(
            x,
            padding
        );

        context.lineTo(
            x,
            padding +
            graphHeight
        );

        context.stroke();


        context.fillStyle =
            "#4b5563";

        context.font =
            "11px Arial";

        context.textAlign =
            "center";

        context.fillText(
            String(volume),
            x,
            padding +
            graphHeight +
            17
        );
    }


    /* -----------------------------------------------------
       AXES
       ----------------------------------------------------- */

    context.strokeStyle =
        "#111827";

    context.lineWidth =
        2;


    context.beginPath();

    context.moveTo(
        padding,
        padding
    );

    context.lineTo(
        padding,
        padding +
        graphHeight
    );

    context.lineTo(
        padding +
        graphWidth,
        padding +
        graphHeight
    );

    context.stroke();


    /* -----------------------------------------------------
       CURVE
       ----------------------------------------------------- */

    const hcl =
        advancedTitration.hclConcentration;


    const naoh =
        advancedTitration.naohConcentration;


    const sampleVolume =
        advancedTitration.sampleVolume;


    context.beginPath();


    let firstPoint =
        true;


    for (
        let volume = 0;
        volume <= maxVolume;
        volume += 0.25
    ) {

        const pH =
            calculateCurvePH(
                volume,
                hcl,
                naoh,
                sampleVolume
            );


        const x =
            padding +
            (
                volume /
                maxVolume
            ) *
            graphWidth;


        const y =
            padding +
            graphHeight -
            (
                pH /
                14
            ) *
            graphHeight;


        if (firstPoint) {

            context.moveTo(
                x,
                y
            );

            firstPoint =
                false;

        } else {

            context.lineTo(
                x,
                y
            );
        }
    }


    context.strokeStyle =
        "#3157d5";

    context.lineWidth =
        3;

    context.stroke();


    /* -----------------------------------------------------
       CURRENT POINT
       ----------------------------------------------------- */

    const currentVolume =
        advancedTitration.addedVolume;


    const currentPH =
        calculateCurvePH(
            currentVolume,
            hcl,
            naoh,
            sampleVolume
        );


    const currentX =
        padding +
        (
            currentVolume /
            maxVolume
        ) *
        graphWidth;


    const currentY =
        padding +
        graphHeight -
        (
            currentPH /
            14
        ) *
        graphHeight;


    context.beginPath();

    context.arc(
        currentX,
        currentY,
        5,
        0,
        Math.PI * 2
    );


    context.fillStyle =
        "#dc2626";

    context.fill();


    /* -----------------------------------------------------
       AXIS LABELS
       ----------------------------------------------------- */

    context.fillStyle =
        "#111827";

    context.font =
        "bold 12px Arial";


    context.textAlign =
        "center";


    context.fillText(
        "NaOH added (mL)",
        padding +
        graphWidth / 2,
        height - 5
    );


    context.save();


    context.translate(
        13,
        padding +
        graphHeight / 2
    );


    context.rotate(
        -Math.PI / 2
    );


    context.fillText(
        "pH",
        0,
        0
    );


    context.restore();
}


window.drawAdvancedTitrationChart =
    drawAdvancedTitrationChart;


window.updateAdvancedTitrationChart =
    drawAdvancedTitrationChart;


/* =========================================================
   PREMIUM SECTION VISIBILITY
   ========================================================= */

function showPremiumSection() {

    const premiumSection = $("premiumSection");

    if (!premiumSection) {
        console.error("ChemLab: premiumSection was not found.");
        return;
    }

    // Hide every page
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
        page.style.display = "";
    });

    // Show Premium as the active page
    premiumSection.classList.add("active");
    premiumSection.style.display = "";

    chemLabState.currentPage = "premiumSection";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

window.showPremiumSection = showPremiumSection;


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        if (
            typeof closeAuthModal ===
            "function"
        ) {

            closeAuthModal();
        }


        if (
            typeof closeAccount ===
            "function"
        ) {

            closeAccount();
        }


        if (
            typeof closePremiumModal ===
            "function"
        ) {

            closePremiumModal();
        }
    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "🧪 ChemLab application starting..."
        );


        /* -------------------------------------------------
           BASIC TITRATION
           ------------------------------------------------- */

        updateTitrationDisplay();


        /* -------------------------------------------------
           QUIZ
           ------------------------------------------------- */

        loadQuizQuestion();


        /* -------------------------------------------------
           PROGRESS
           ------------------------------------------------- */

        updateProgressDisplay();


        /* -------------------------------------------------
           ADVANCED TITRATION
           ------------------------------------------------- */

        initializeAdvancedTitration();


        /* -------------------------------------------------
           ADVANCED CLOSE BUTTON
           ------------------------------------------------- */

        const closeAdvanced =
            $("closeAdvancedTitration");


        if (closeAdvanced) {

            closeAdvanced.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    closeAdvancedTitration();
                }
            );
        }


        /* -------------------------------------------------
           ADVANCED EXPLAIN BUTTON
           ------------------------------------------------- */

        const explainButton =
            $("advancedExplainButton");


        if (explainButton) {

            explainButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    explainAdvancedTitration();
                }
            );
        }


        /* -------------------------------------------------
           AI ENTER KEY
           ------------------------------------------------- */

        const mainAIInput =
            $("mainAIInput") ||
            $("aiQuestion");


        if (mainAIInput) {

            mainAIInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter" &&
                        !event.shiftKey
                    ) {

                        event.preventDefault();

                        mainAIQuestion();
                    }
                }
            );
        }


        /* -------------------------------------------------
           EXPERIMENT AI ENTER KEY
           ------------------------------------------------- */

        const experimentAIInput =
            $("experimentAIQuestion");


        if (experimentAIInput) {

            experimentAIInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter" &&
                        !event.shiftKey
                    ) {

                        event.preventDefault();

                        askExperimentAI();
                    }
                }
            );
        }


        /* -------------------------------------------------
           +1 ML BUTTON
           ------------------------------------------------- */

        const addOne =
            $("add1ml");


        if (addOne) {

            addOne.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    addTitrant(1);
                }
            );
        }


        /* -------------------------------------------------
           +5 ML BUTTON
           ------------------------------------------------- */

        const addFive =
            $("add5ml");


        if (addFive) {

            addFive.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    addTitrant(5);
                }
            );
        }


        console.log(
            "🧪 ChemLab application ready."
        );
    }
);
