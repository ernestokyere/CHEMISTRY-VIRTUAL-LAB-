/* =========================================
   CHEMLAB — APP.JS
   STAGE 2 → STAGE 14D
   TITRATION + AI + QUIZ + PREMIUM LAB
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
   BASIC TITRATION CONFIGURATION
=========================================

   HCl + NaOH → NaCl + H₂O

   HCl:
   0.100 mol/L
   25.00 mL

   NaOH:
   0.100 mol/L

   Equivalence:
   25.00 mL NaOH

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

    titration.titrantVolume += Number(amount) || 0;

    titration.titrantVolume =
        Math.max(
            0,
            Math.min(
                50,
                titration.titrantVolume
            )
        );

    calculateTitration();
}


/* =========================================
   CALCULATE BASIC TITRATION
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


    const acidMoles =
        acidConcentration *
        acidVolumeL;


    const baseMoles =
        baseConcentration *
        baseVolumeL;


    const totalVolumeL =
        acidVolumeL +
        baseVolumeL;


    let pH;
    let state;


    /* BEFORE EQUIVALENCE */

    if (acidMoles > baseMoles) {

        const remainingHPlus =
            acidMoles -
            baseMoles;

        const concentrationHPlus =
            remainingHPlus /
            totalVolumeL;

        pH =
            -Math.log10(
                concentrationHPlus
            );

        state = "Acidic";


    /* AT EQUIVALENCE */

    } else if (
        Math.abs(
            acidMoles -
            baseMoles
        ) < 0.0000001
    ) {

        pH = 7.00;

        state = "Neutral";


    /* AFTER EQUIVALENCE */

    } else {

        const remainingOH =
            baseMoles -
            acidMoles;

        const concentrationOH =
            remainingOH /
            totalVolumeL;

        const pOH =
            -Math.log10(
                concentrationOH
            );

        pH =
            14 -
            pOH;

        state = "Basic";
    }


    pH =
        Math.max(
            0,
            Math.min(
                14,
                pH
            )
        );


    updateTitrationDisplay(
        pH,
        state,
        acidMoles,
        baseMoles
    );
}


/* =========================================
   UPDATE BASIC TITRATION DISPLAY
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


    /* Volume */

    volumeElement.textContent =
        titration.titrantVolume.toFixed(2) +
        " mL";


    /* pH */

    if (phElement) {

        phElement.textContent =
            pH.toFixed(2);
    }


    /* Indicator */

    if (indicatorElement) {

        indicatorElement.textContent =
            pH >= PHENOLPHTHALEIN_ENDPOINT
                ? "Pink"
                : "Colourless";
    }


    /* Burette */

    if (buretteLiquid) {

        const remainingBurette =
            Math.max(
                10,
                90 -
                (
                    titration.titrantVolume /
                    50
                ) *
                80
            );

        buretteLiquid.style.height =
            remainingBurette +
            "%";
    }


    /* Flask */

    if (flaskLiquid) {

        const flaskLevel =
            Math.min(
                80,
                25 +
                (
                    titration.titrantVolume /
                    50
                ) *
                55
            );

        flaskLiquid.style.height =
            flaskLevel +
            "%";


        if (
            pH >=
            PHENOLPHTHALEIN_ENDPOINT
        ) {

            flaskLiquid.style.background =
                "#f7a8c4";

        } else {

            flaskLiquid.style.background =
                "#d9f0ff";
        }
    }


    updateEndpointMessage(
        pH,
        acidMoles,
        baseMoles
    );
}


/* =========================================
   BASIC ENDPOINT MESSAGE
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


    if (!message) {

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
            "8px";

        const laboratory =
            document.querySelector(
                ".laboratory"
            );

        if (laboratory) {

            laboratory.appendChild(
                message
            );
        }
    }


    if (!message) {
        return;
    }


    const difference =
        Math.abs(
            acidMoles -
            baseMoles
        );


    if (
        difference < 0.00015 &&
        pH >= 7 &&
        pH < PHENOLPHTHALEIN_ENDPOINT
    ) {

        message.textContent =
            "⚠️ You are approaching the equivalence point.";

    } else if (
        pH >=
        PHENOLPHTHALEIN_ENDPOINT
    ) {

        message.textContent =
            "🎯 Phenolphthalein endpoint reached.";

    } else {

        message.textContent =
            "🔬 The solution is still acidic. Continue adding titrant.";
    }
}


/* =========================================
   RESET BASIC EXPERIMENT
========================================= */

function resetExperiment() {

    titration.titrantVolume = 0;

    calculateTitration();
}


/* =========================================
   EXPERIMENT STATE
========================================= */

function getExperimentState() {

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


    let pH = 7;
    let state = "Neutral";


    if (acidMoles > baseMoles) {

        const hplus =
            (
                acidMoles -
                baseMoles
            ) /
            totalVolume;

        pH =
            -Math.log10(hplus);

        state =
            "Acidic";

    } else if (
        baseMoles >
        acidMoles
    ) {

        const oh =
            (
                baseMoles -
                acidMoles
            ) /
            totalVolume;

        const pOH =
            -Math.log10(oh);

        pH =
            14 -
            pOH;

        state =
            "Basic";
    }


    return {

        experiment:
            "HCl + NaOH titration",

        titrantVolume:
            titration.titrantVolume.toFixed(2),

        pH:
            pH.toFixed(2),

        indicator:
            pH >=
            PHENOLPHTHALEIN_ENDPOINT
                ? "Pink"
                : "Colourless",

        state:
            state
    };
}


/* =========================================
   CHEMLAB AI
========================================= */

async function askAI(question) {

    const chat =
        document.getElementById(
            "chatMessages"
        );


    if (!chat) {

        console.error(
            "ChemLab AI: chatMessages element not found."
        );

        return;
    }


    addChatMessage(
        chat,
        question,
        "user"
    );


    const loading =
        document.createElement(
            "div"
        );

    loading.className =
        "ai-message";

    loading.textContent =
        "🤖 ChemLab AI is thinking...";

    chat.appendChild(
        loading
    );

    chat.scrollTop =
        chat.scrollHeight;


    try {

        let experiment = {};


        if (
            typeof getExperimentState ===
            "function"
        ) {

            experiment =
                getExperimentState();

        } else {

            experiment = {

                titrantVolume:
                    titration.titrantVolume.toFixed(2),

                pH:
                    "Unknown",

                indicator:
                    "Unknown",

                state:
                    "Unknown"
            };
        }


        const response =
            await fetch(
                "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/chemistry-ai",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy"
                    },

                    body:
                        JSON.stringify({

                            question:
                                question,

                            experiment:
                                experiment
                        })
                }
            );


        let data = {};

        try {

            data =
                await response.json();

        } catch {

            data = {};
        }


        loading.remove();


        if (!response.ok) {

            console.error(
                "ChemLab AI error:",
                data
            );

            addChatMessage(
                chat,
                "⚠️ ChemLab AI couldn't answer right now. Please try again.",
                "ai"
            );

            return;
        }


        if (
            !data.answer ||
            typeof data.answer !==
            "string"
        ) {

            console.error(
                "Invalid AI response:",
                data
            );

            addChatMessage(
                chat,
                "⚠️ The AI returned an unexpected response.",
                "ai"
            );

            return;
        }


        addChatMessage(
            chat,
            data.answer,
            "ai"
        );


        chat.scrollTop =
            chat.scrollHeight;


    } catch (error) {

        console.error(
            "ChemLab AI connection error:",
            error
        );


        loading.textContent =
            "⚠️ I couldn't connect to ChemLab AI. Please try again.";
    }
}


/* =========================================
   DISPLAY CHAT MESSAGE
========================================= */

function addChatMessage(
    container,
    message,
    type
) {

    if (!container) {
        return;
    }


    const div =
        document.createElement(
            "div"
        );


    div.className =
        type === "user"
            ? "user-message"
            : "ai-message";


    div.textContent =
        String(message ?? "");


    container.appendChild(
        div
    );
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
   MAIN AI QUESTION
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

        if (
            typeof chemistryAnswer ===
            "function"
        ) {

            addChatMessage(
                chat,
                chemistryAnswer(question),
                "ai"
            );

        } else {

            addChatMessage(
                chat,
                "🤖 Please use the ChemLab AI assistant to ask your chemistry question.",
                "ai"
            );
        }


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
let quizAnswered = false;


/* =========================================
   ANSWER QUIZ
========================================= */

function answerQuiz(answer) {

    if (
        quizAnswered ||
        !quizQuestions[currentQuestion]
    ) {
        return;
    }


    quizAnswered = true;


    const question =
        quizQuestions[currentQuestion];

    const feedback =
        document.getElementById(
            "quizFeedback"
        );


    if (
        Number(answer) ===
        question.correct
    ) {

        quizScore++;

        if (feedback) {

            feedback.textContent =
                "✅ Correct!";
        }

    } else {

        if (feedback) {

            feedback.textContent =
                "❌ Incorrect. Keep learning!";
        }
    }


    setTimeout(() => {

        currentQuestion++;

        quizAnswered = false;


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


/* =========================================
   LOAD QUIZ QUESTION
========================================= */

function loadQuizQuestion() {

    const question =
        quizQuestions[currentQuestion];


    if (!question) {
        return;
    }


    const numberElement =
        document.getElementById(
            "questionNumber"
        );

    const questionElement =
        document.getElementById(
            "quizQuestion"
        );

    const options =
        document.getElementById(
            "quizOptions"
        );

    const feedback =
        document.getElementById(
            "quizFeedback"
        );


    if (
        !numberElement ||
        !questionElement ||
        !options
    ) {
        return;
    }


    numberElement.textContent =
        currentQuestion + 1;


    questionElement.textContent =
        question.question;


    options.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.textContent =
                String.fromCharCode(
                    65 + index
                ) +
                ". " +
                option;


            button.addEventListener(
                "click",
                () => answerQuiz(index)
            );


            options.appendChild(
                button
            );
        }
    );


    if (feedback) {

        feedback.textContent =
            "";
    }
}


/* =========================================
   FINISH QUIZ
========================================= */

function finishQuiz() {

    const percentage =
        Math.round(
            (
                quizScore /
                quizQuestions.length
            ) *
            100
        );


    const questionElement =
        document.getElementById(
            "quizQuestion"
        );

    const options =
        document.getElementById(
            "quizOptions"
        );

    const feedback =
        document.getElementById(
            "quizFeedback"
        );


    if (questionElement) {

        questionElement.textContent =
            `Quiz Complete — ${percentage}%`;
    }


    if (options) {

        options.innerHTML = "";

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.textContent =
            "🔄 Try Again";

        button.addEventListener(
            "click",
            restartQuiz
        );

        options.appendChild(
            button
        );
    }


    if (feedback) {

        feedback.textContent =
            `You answered ${quizScore} out of ${quizQuestions.length} correctly.`;
    }
}


/* =========================================
   RESTART QUIZ
========================================= */

function restartQuiz() {

    currentQuestion = 0;

    quizScore = 0;

    quizAnswered = false;

    loadQuizQuestion();
}


/* =========================================
   ADVANCED PREMIUM TITRATION
========================================= */

(function () {

    let advancedTitrationInitialized =
        false;


    function initializeAdvancedTitration() {

        if (
            advancedTitrationInitialized
        ) {
            return;
        }


        const volumeSlider =
            document.getElementById(
                "advancedVolumeSlider"
            );

        const addButton =
            document.getElementById(
                "advancedAddNaohButton"
            );

        const resetButton =
            document.getElementById(
                "advancedResetButton"
            );

        const explainButton =
            document.getElementById(
                "advancedExplainButton"
            );

        const closeButton =
            document.getElementById(
                "closeAdvancedTitration"
            );


        if (
            !volumeSlider ||
            !addButton ||
            !resetButton
        ) {

            return;
        }


        advancedTitrationInitialized =
            true;


        function calculateAdvancedTitration() {

            const hclInput =
                document.getElementById(
                    "advancedHclConcentration"
                );

            const naohInput =
                document.getElementById(
                    "advancedNaohConcentration"
                );

            const sampleInput =
                document.getElementById(
                    "advancedSampleVolume"
                );


            const volumeDisplay =
                document.getElementById(
                    "advancedNaohVolume"
                );

            const phDisplay =
                document.getElementById(
                    "advancedPhValue"
                );

            const hplusDisplay =
                document.getElementById(
                    "advancedHplus"
                );

            const ohminusDisplay =
                document.getElementById(
                    "advancedOhminus"
                );

            const equivalenceDisplay =
                document.getElementById(
                    "advancedEquivalence"
                );

            const statusDisplay =
                document.getElementById(
                    "advancedReactionStatus"
                );


            const hplusConcentrationDisplay =
                document.getElementById(
                    "advancedHplusConcentration"
                );

            const ohConcentrationDisplay =
                document.getElementById(
                    "advancedOhConcentration"
                );

            const totalVolumeDisplay =
                document.getElementById(
                    "advancedTotalVolume"
                );

            const neutralizationProgressDisplay =
                document.getElementById(
                    "advancedNeutralizationProgress"
                );


            const indicatorDisplay =
                document.getElementById(
                    "advancedIndicatorStatus"
                );

            const solution =
                document.getElementById(
                    "advancedSolution"
                );

            const buretteLiquid =
                document.getElementById(
                    "advancedBuretteLiquid"
                );


            if (
                !hclInput ||
                !naohInput ||
                !sampleInput ||
                !volumeDisplay ||
                !phDisplay
            ) {

                return;
            }


            const hclConcentration =
                Number(
                    hclInput.value
                );

            const naohConcentration =
                Number(
                    naohInput.value
                );

            const sampleVolumeMl =
                Number(
                    sampleInput.value
                );

            const addedVolumeMl =
                Number(
                    volumeSlider.value
                );


            if (
                hclConcentration <= 0 ||
                naohConcentration <= 0 ||
                sampleVolumeMl <= 0
            ) {

                return;
            }


            const sampleVolumeL =
                sampleVolumeMl /
                1000;

            const addedVolumeL =
                addedVolumeMl /
                1000;


            /* Initial H+ moles */

            const initialHplusMoles =
                hclConcentration *
                sampleVolumeL;


            /* Added OH- moles */

            const addedOhMoles =
                naohConcentration *
                addedVolumeL;


            /* Total volume */

            const totalVolumeL =
                sampleVolumeL +
                addedVolumeL;


            /* Equivalence volume */

            const equivalenceVolumeMl =
                (
                    initialHplusMoles /
                    naohConcentration
                ) *
                1000;


            /* Neutralization */

            const neutralizationProgress =
                Math.min(
                    100,
                    (
                        addedOhMoles /
                        initialHplusMoles
                    ) *
                    100
                );


            /* Equivalence state */

            const equivalenceStatus =
                document.getElementById(
                    "advancedEquivalenceStatus"
                );

            const equivalenceIndicator =
                document.querySelector(
                    ".equivalence-indicator"
                );


            const isAtEquivalence =
                Math.abs(
                    addedVolumeMl -
                    equivalenceVolumeMl
                ) <= 0.10;


            if (equivalenceStatus) {

                if (
                    isAtEquivalence
                ) {

                    equivalenceStatus.textContent =
                        "Reached — neutralization is complete";

                } else if (
                    addedVolumeMl <
                    equivalenceVolumeMl
                ) {

                    equivalenceStatus.textContent =
                        "Not reached — acid remains";

                } else {

                    equivalenceStatus.textContent =
                        "Passed — base is in excess";
                }
            }


            if (equivalenceIndicator) {

                equivalenceIndicator.classList.toggle(
                    "reached",
                    isAtEquivalence
                );
            }


            /* =================================
               CALCULATE pH
            ================================= */

            let ph;

            let remainingHplus = 0;

            let remainingOh = 0;

            let hplusConcentration = 0;

            let ohConcentration = 0;

            let status = "Acidic";


            /* ACID EXCESS */

            if (
                addedOhMoles <
                initialHplusMoles
            ) {

                remainingHplus =
                    initialHplusMoles -
                    addedOhMoles;


                hplusConcentration =
                    remainingHplus /
                    totalVolumeL;


                ph =
                    -Math.log10(
                        hplusConcentration
                    );


                status =
                    "Acidic";


            /* EXACT EQUIVALENCE */

            } else if (
                Math.abs(
                    addedOhMoles -
                    initialHplusMoles
                ) <
                1e-12
            ) {

                ph = 7;

                status =
                    "Neutral";


            /* BASE EXCESS */

            } else {

                remainingOh =
                    addedOhMoles -
                    initialHplusMoles;


                ohConcentration =
                    remainingOh /
                    totalVolumeL;


                const pOH =
                    -Math.log10(
                        ohConcentration
                    );


                ph =
                    14 -
                    pOH;


                status =
                    "Basic";
            }


            ph =
                Math.max(
                    0,
                    Math.min(
                        14,
                        ph
                    )
                );


            /* =================================
               PROGRESS
            ================================= */

            const progressBar =
                document.getElementById(
                    "advancedProgressBar"
                );

            const progressText =
                document.getElementById(
                    "advancedProgressText"
                );

            const observation =
                document.getElementById(
                    "advancedObservation"
                );


            const titrationProgress =
                Math.min(
                    100,
                    (
                        addedVolumeMl /
                        equivalenceVolumeMl
                    ) *
                    100
                );


            if (progressBar) {

                progressBar.style.width =
                    titrationProgress +
                    "%";
            }


            if (progressText) {

                progressText.textContent =
                    Math.round(
                        titrationProgress
                    ) +
                    "%";
            }


            if (observation) {

                if (
                    addedVolumeMl === 0
                ) {

                    observation.textContent =
                        "Begin adding NaOH to start the titration.";

                } else if (
                    addedVolumeMl <
                    equivalenceVolumeMl -
                    0.10
                ) {

                    observation.textContent =
                        "The solution is still acidic. HCl remains in excess.";

                } else if (
                    Math.abs(
                        addedVolumeMl -
                        equivalenceVolumeMl
                    ) <= 0.10
                ) {

                    observation.textContent =
                        "Equivalence point reached! The acid and base have been neutralized.";

                } else {

                    observation.textContent =
                        "The solution is now basic. NaOH is in excess.";
                }
            }


            /* =================================
               UPDATE TEXT
            ================================= */

            volumeDisplay.textContent =
                addedVolumeMl.toFixed(2);


            phDisplay.textContent =
                ph.toFixed(2);


            hplusDisplay.textContent =
                remainingHplus.toFixed(5) +
                " mol";


            ohminusDisplay.textContent =
                remainingOh.toFixed(5) +
                " mol";


            equivalenceDisplay.textContent =
                equivalenceVolumeMl.toFixed(2) +
                " mL";


            statusDisplay.textContent =
                status;


            if (
                hplusConcentrationDisplay
            ) {

                hplusConcentrationDisplay.textContent =
                    hplusConcentration.toExponential(
                        3
                    ) +
                    " mol/L";
            }


            if (
                ohConcentrationDisplay
            ) {

                ohConcentrationDisplay.textContent =
                    ohConcentration.toExponential(
                        3
                    ) +
                    " mol/L";
            }


            if (
                totalVolumeDisplay
            ) {

                totalVolumeDisplay.textContent =
                    (
                        totalVolumeL *
                        1000
                    ).toFixed(2) +
                    " mL";
            }


            if (
                neutralizationProgressDisplay
            ) {

                neutralizationProgressDisplay.textContent =
                    neutralizationProgress.toFixed(
                        2
                    ) +
                    "%";
            }


            /* =================================
               PHENOLPHTHALEIN
            ================================= */

            if (
                indicatorDisplay
            ) {

                indicatorDisplay.textContent =
                    ph >=
                    PHENOLPHTHALEIN_ENDPOINT
                        ? "Pink"
                        : "Colorless";
            }


            /* =================================
               BURETTE
            ================================= */

            if (
                buretteLiquid
            ) {

                const percentage =
                    Math.min(
                        100,
                        (
                            addedVolumeMl /
                            60
                        ) *
                        100
                    );


                buretteLiquid.style.height =
                    percentage +
                    "%";
            }


            /* =================================
               FLASK
            ================================= */

            if (solution) {

                solution.classList.toggle(
                    "phenolphthalein-pink",
                    ph >=
                    PHENOLPHTHALEIN_ENDPOINT
                );
            }


            /* =================================
               UPDATE GRAPH
            ================================= */

            if (
                typeof window.updateAdvancedTitrationChart ===
                "function"
            ) {

                window.updateAdvancedTitrationChart(
                    addedVolumeMl
                );
            }
        }


        /* =====================================
           SLIDER
        ===================================== */

        volumeSlider.addEventListener(
            "input",
            calculateAdvancedTitration
        );


        /* =====================================
           ADD NaOH
        ===================================== */

        addButton.addEventListener(
            "click",
            function () {

                let currentVolume =
                    Number(
                        volumeSlider.value
                    );


                currentVolume += 1;


                if (
                    currentVolume > 60
                ) {

                    currentVolume = 60;
                }


                volumeSlider.value =
                    currentVolume;


                calculateAdvancedTitration();
            }
        );


        /* =====================================
           RESET
        ===================================== */

        resetButton.addEventListener(
            "click",
            function () {

                volumeSlider.value = 0;


                calculateAdvancedTitration();


                const explanation =
                    document.getElementById(
                        "advancedExplanation"
                    );


                if (explanation) {

                    explanation.style.display =
                        "none";
                }
            }
        );


        /* =====================================
           EXPLAIN RESULT
        ===================================== */

        if (explainButton) {

            explainButton.addEventListener(
                "click",
                function () {

                    const ph =
                        document.getElementById(
                            "advancedPhValue"
                        );

                    const volume =
                        document.getElementById(
                            "advancedNaohVolume"
                        );

                    const status =
                        document.getElementById(
                            "advancedReactionStatus"
                        );

                    const explanation =
                        document.getElementById(
                            "advancedExplanation"
                        );

                    const explanationText =
                        document.getElementById(
                            "advancedExplanationText"
                        );


                    if (
                        !ph ||
                        !volume ||
                        !status ||
                        !explanation ||
                        !explanationText
                    ) {

                        return;
                    }


                    explanationText.textContent =
                        "At " +
                        volume.textContent +
                        " mL of NaOH added, the solution is " +
                        status.textContent.toLowerCase() +
                        " with a pH of " +
                        ph.textContent +
                        ". During the titration, NaOH reacts with HCl in a 1:1 neutralization reaction: HCl + NaOH → NaCl + H₂O. The equivalence point occurs when the moles of NaOH added equal the original moles of HCl.";


                    explanation.style.display =
                        "block";
                }
            );
        }


        /* =====================================
           CLOSE ADVANCED LAB
        ===================================== */

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {

                    const experiment =
                        document.getElementById(
                            "advancedTitrationPage"
                        );


                    if (experiment) {

                        experiment.style.display =
                            "none";
                    }


                    const premiumSection =
                        document.getElementById(
                            "premiumSection"
                        );


                    if (premiumSection) {

                        premiumSection.style.display =
                            "block";
                    }


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            );
        }


        /* =====================================
           INITIAL CALCULATION
        ===================================== */

        calculateAdvancedTitration();
    }


    /* =========================================
       INITIALIZE
    ========================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAdvancedTitration
        );

    } else {

        initializeAdvancedTitration();
    }


    /* =========================================
       OPEN ADVANCED TITRATION
    ========================================= */

    window.openAdvancedTitration =
        function () {

            initializeAdvancedTitration();


            const premiumSection =
                document.getElementById(
                    "premiumSection"
                );

            const experiment =
                document.getElementById(
                    "advancedTitrationPage"
                );


            if (premiumSection) {

                premiumSection.style.display =
                    "none";
            }


            if (experiment) {

                experiment.style.display =
                    "block";
            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            /*
             * Give the browser time to display
             * the canvas before drawing.
             */

            setTimeout(
                function () {

                    if (
                        typeof window.updateAdvancedTitrationChart ===
                        "function"
                    ) {

                        const slider =
                            document.getElementById(
                                "advancedVolumeSlider"
                            );

                        window.updateAdvancedTitrationChart(
                            Number(
                                slider?.value
                            ) || 0
                        );
                    }

                },
                100
            );
        };

})();


/* =========================================
   ADVANCED TITRATION CURVE ENGINE
========================================= */

(function () {

    function calculateCurvePH(
        hclConcentration,
        naohConcentration,
        sampleVolumeMl,
        naohVolumeMl
    ) {

        const sampleVolumeL =
            sampleVolumeMl /
            1000;

        const addedVolumeL =
            naohVolumeMl /
            1000;


        const initialHplusMoles =
            hclConcentration *
            sampleVolumeL;


        const addedOhMoles =
            naohConcentration *
            addedVolumeL;


        const totalVolumeL =
            sampleVolumeL +
            addedVolumeL;


        const difference =
            initialHplusMoles -
            addedOhMoles;


        let ph;


        /* BEFORE EQUIVALENCE */

        if (
            difference > 0
        ) {

            const hplus =
                difference /
                totalVolumeL;


            ph =
                -Math.log10(
                    hplus
                );


        /* AT EQUIVALENCE */

        } else if (
            Math.abs(
                difference
            ) <
            1e-12
        ) {

            ph = 7;


        /* AFTER EQUIVALENCE */

        } else {

            const ohMoles =
                Math.abs(
                    difference
                );


            const oh =
                ohMoles /
                totalVolumeL;


            const poh =
                -Math.log10(
                    oh
                );


            ph =
                14 -
                poh;
        }


        return Math.max(
            0,
            Math.min(
                14,
                ph
            )
        );
    }


    function getCurveSettings() {

        const hclInput =
            document.getElementById(
                "advancedHclConcentration"
            );

        const naohInput =
            document.getElementById(
                "advancedNaohConcentration"
            );

        const sampleInput =
            document.getElementById(
                "advancedSampleVolume"
            );


        const hcl =
            parseFloat(
                hclInput?.value
            );

        const naoh =
            parseFloat(
                naohInput?.value
            );

        const sampleVolume =
            parseFloat(
                sampleInput?.value
            );


        if (
            !Number.isFinite(hcl) ||
            !Number.isFinite(naoh) ||
            !Number.isFinite(sampleVolume) ||
            hcl <= 0 ||
            naoh <= 0 ||
            sampleVolume <= 0
        ) {

            return null;
        }


        return {
            hcl,
            naoh,
            sampleVolume
        };
    }


    function calculateEquivalenceVolume(
        hcl,
        naoh,
        sampleVolume
    ) {

        const sampleVolumeL =
            sampleVolume /
            1000;


        const acidMoles =
            hcl *
            sampleVolumeL;


        return (
            acidMoles /
            naoh
        ) *
        1000;
    }


    function drawTitrationCurve(
        currentVolume = 0
    ) {

        const canvas =
            document.getElementById(
                "advancedTitrationChart"
            );


        if (!canvas) {
            return;
        }


        const settings =
            getCurveSettings();


        if (!settings) {
            return;
        }


        const {
            hcl,
            naoh,
            sampleVolume
        } = settings;


        const equivalenceVolume =
            calculateEquivalenceVolume(
                hcl,
                naoh,
                sampleVolume
            );


        const maxVolume =
            Math.max(
                equivalenceVolume * 2,
                10
            );


        const width =
            canvas.clientWidth ||
            600;


        const height =
            canvas.clientHeight ||
            330;


        const devicePixelRatio =
            window.devicePixelRatio ||
            1;


        canvas.width =
            Math.floor(
                width *
                devicePixelRatio
            );


        canvas.height =
            Math.floor(
                height *
                devicePixelRatio
            );


        const ctx =
            canvas.getContext(
                "2d"
            );


        if (!ctx) {
            return;
        }


        ctx.setTransform(
            devicePixelRatio,
            0,
            0,
            devicePixelRatio,
            0,
            0
        );


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* =================================
           GRAPH MARGINS
        ================================= */

        const marginLeft = 55;
        const marginRight = 20;
        const marginTop = 20;
        const marginBottom = 45;


        const graphWidth =
            width -
            marginLeft -
            marginRight;


        const graphHeight =
            height -
            marginTop -
            marginBottom;


        if (
            graphWidth <= 0 ||
            graphHeight <= 0
        ) {

            return;
        }


        /* =================================
           BACKGROUND
        ================================= */

        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            marginLeft,
            marginTop,
            graphWidth,
            graphHeight
        );


        /* =================================
           COORDINATES
        ================================= */

        function xPosition(
            volume
        ) {

            return (
                marginLeft +
                (
                    volume /
                    maxVolume
                ) *
                graphWidth
            );
        }


        function yPosition(
            ph
        ) {

            return (
                marginTop +
                graphHeight -
                (
                    ph /
                    14
                ) *
                graphHeight
            );
        }


        /* =================================
           GRID
        ================================= */

        ctx.strokeStyle =
            "#e4e7ec";

        ctx.lineWidth = 1;


        for (
            let ph = 0;
            ph <= 14;
            ph += 2
        ) {

            const y =
                yPosition(ph);


            ctx.beginPath();


            ctx.moveTo(
                marginLeft,
                y
            );


            ctx.lineTo(
                marginLeft +
                graphWidth,
                y
            );


            ctx.stroke();
        }


        const volumeStep =
            maxVolume /
            5;


        for (
            let i = 0;
            i <= 5;
            i++
        ) {

            const volume =
                i *
                volumeStep;


            const x =
                xPosition(
                    volume
                );


            ctx.beginPath();


            ctx.moveTo(
                x,
                marginTop
            );


            ctx.lineTo(
                x,
                marginTop +
                graphHeight
            );


            ctx.stroke();
        }


        /* =================================
           AXES
        ================================= */

        ctx.strokeStyle =
            "#344054";

        ctx.lineWidth =
            1.5;


        ctx.beginPath();


        ctx.moveTo(
            marginLeft,
            marginTop
        );


        ctx.lineTo(
            marginLeft,
            marginTop +
            graphHeight
        );


        ctx.lineTo(
            marginLeft +
            graphWidth,
            marginTop +
            graphHeight
        );


        ctx.stroke();


        /* =================================
           Y LABELS
        ================================= */

        ctx.fillStyle =
            "#475467";

        ctx.font =
            "12px Arial";

        ctx.textAlign =
            "right";

        ctx.textBaseline =
            "middle";


        for (
            let ph = 0;
            ph <= 14;
            ph += 2
        ) {

            ctx.fillText(
                String(ph),
                marginLeft - 10,
                yPosition(ph)
            );
        }


        /* =================================
           X LABELS
        ================================= */

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "top";


        for (
            let i = 0;
            i <= 5;
            i++
        ) {

            const volume =
                i *
                volumeStep;


            ctx.fillText(
                volume.toFixed(1),
                xPosition(volume),
                marginTop +
                graphHeight +
                10
            );
        }


        /* =================================
           TITRATION CURVE
        ================================= */

        ctx.beginPath();


        const points = 300;


        for (
            let i = 0;
            i <= points;
            i++
        ) {

            const volume =
                (
                    i /
                    points
                ) *
                maxVolume;


            const ph =
                calculateCurvePH(
                    hcl,
                    naoh,
                    sampleVolume,
                    volume
                );


            const x =
                xPosition(
                    volume
                );


            const y =
                yPosition(
                    ph
                );


            if (i === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );
            }
        }


        ctx.strokeStyle =
            "#3157d5";

        ctx.lineWidth = 3;

        ctx.lineJoin =
            "round";

        ctx.lineCap =
            "round";


        ctx.stroke();


        /* =================================
           EQUIVALENCE POINT
        ================================= */

        const equivalenceX =
            xPosition(
                equivalenceVolume
            );


        ctx.setLineDash([
            6,
            5
        ]);


        ctx.strokeStyle =
            "#12b76a";

        ctx.lineWidth =
            1.5;


        ctx.beginPath();


        ctx.moveTo(
            equivalenceX,
            marginTop
        );


        ctx.lineTo(
            equivalenceX,
            marginTop +
            graphHeight
        );


        ctx.stroke();


        ctx.setLineDash([]);


        /* =================================
           EQUIVALENCE LABEL
        ================================= */

        ctx.fillStyle =
            "#027a48";

        ctx.font =
            "bold 11px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "top";


        ctx.fillText(
            "Equivalence",
            equivalenceX,
            marginTop + 8
        );


        /* =================================
           CURRENT POINT
        ================================= */

        const safeCurrentVolume =
            Math.max(
                0,
                Math.min(
                    maxVolume,
                    Number(
                        currentVolume
                    ) || 0
                )
            );


        const currentPH =
           
