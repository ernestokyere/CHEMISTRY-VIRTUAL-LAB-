/* =========================================================
   CHEMLAB — MAIN APPLICATION
   Advanced Chemistry Virtual Laboratory
   ========================================================= */

"use strict";

/* =========================================================
   1. CHEMLAB CONFIGURATION
========================================================= */

const CHEMLAB_CONFIG = {
    supabaseUrl:
        "https://zscbgeaieiqwknhjxpnt.supabase.co",

    chemistryAIEndpoint:
        "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/chemistry-ai",

    supabasePublishableKey:
        "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy"
};


/* =========================================================
   2. GLOBAL STATE
========================================================= */

const chemLabState = {

    currentPage: "home",

    currentExperiment: null,

    xp: 0,

    experimentsCompleted: 0,

    quizScore: 0,

    currentQuestion: 0,

    quizAnswered: false,

    advancedExperimentCompleted: false
};


/* =========================================================
   3. BASIC TITRATION STATE
========================================================= */

const titrationState = {

    hclConcentration: 0.100,

    hclVolume: 25,

    naohConcentration: 0.100,

    titrantVolume: 0,

    equivalencePoint: 25,

    indicator: "phenolphthalein"
};


/* =========================================================
   4. ADVANCED TITRATION STATE
========================================================= */

const advancedTitration = {

    initialized: false,

    accessChecking: false,

    hclConcentration: 0.100,

    naohConcentration: 0.100,

    sampleVolume: 25,

    addedVolume: 0,

    maxVolume: 60,

    completed: false,

    equivalenceReached: false,

    lastCalculatedState: null
};


/* =========================================================
   5. QUIZ DATA
========================================================= */

const quizQuestions = [

    {
        question:
            "What is the pH of a neutral solution at 25°C?",

        options: [
            "0",
            "5",
            "7",
            "14"
        ],

        answer: 2,

        explanation:
            "At 25°C, a neutral solution has a pH of approximately 7."
    },

    {
        question:
            "Which ion is responsible for acidic properties?",

        options: [
            "OH⁻",
            "H⁺",
            "Na⁺",
            "Cl⁻"
        ],

        answer: 1,

        explanation:
            "Hydrogen ions, H⁺, are responsible for the acidic character of aqueous solutions."
    },

    {
        question:
            "What happens during neutralization?",

        options: [
            "Acid and base react",
            "Only water evaporates",
            "A gas always forms",
            "The solution freezes"
        ],

        answer: 0,

        explanation:
            "Neutralization occurs when an acid reacts with a base."
    },

    {
        question:
            "Which indicator is commonly used in acid-base titration?",

        options: [
            "Phenolphthalein",
            "Copper",
            "Iron",
            "Sodium chloride"
        ],

        answer: 0,

        explanation:
            "Phenolphthalein is a common acid-base indicator."
    },

    {
        question:
            "At the equivalence point of a strong acid–strong base titration, the pH is approximately:",

        options: [
            "2",
            "5",
            "7",
            "12"
        ],

        answer: 2,

        explanation:
            "For a strong acid–strong base titration at about 25°C, the equivalence-point pH is approximately 7."
    }
];


/* =========================================================
   6. DOM HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function safeText(element, value) {

    if (!element) {
        return;
    }

    element.textContent = value;
}


function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );
}


function round(value, decimals = 2) {

    const factor = Math.pow(10, decimals);

    return Math.round(value * factor) / factor;
}


/* =========================================================
   7. NOTIFICATION SYSTEM
========================================================= */

function showNotification(
    message,
    type = "info",
    duration = 3500
) {

    let container = $("notificationContainer");

    if (!container) {

        container = document.createElement("div");

        container.id = "notificationContainer";

        container.style.position = "fixed";
        container.style.left = "50%";
        container.style.bottom = "25px";
        container.style.transform = "translateX(-50%)";
        container.style.zIndex = "99999";
        container.style.width = "min(92%, 500px)";
        container.style.pointerEvents = "none";

        document.body.appendChild(container);
    }

    const notification =
        document.createElement("div");

    notification.className =
        "eduvora-notification";

    notification.dataset.type = type;

    notification.textContent = message;

    notification.style.pointerEvents = "auto";

    notification.style.marginTop = "10px";

    notification.style.padding =
        "14px 18px";

    notification.style.borderRadius =
        "12px";

    notification.style.background =
        type === "success"
            ? "#16a34a"
            : type === "error"
                ? "#dc2626"
                : type === "warning"
                    ? "#d97706"
                    : "#101828";

    notification.style.color = "#ffffff";

    notification.style.boxShadow =
        "0 12px 30px rgba(0,0,0,.18)";

    notification.style.fontWeight = "600";

    container.appendChild(notification);

    setTimeout(() => {

        notification.style.opacity = "0";

        notification.style.transform =
            "translateY(10px)";

        notification.style.transition =
            "all .25s ease";

        setTimeout(() => {

            notification.remove();

        }, 300);

    }, duration);
}


/* =========================================================
   8. PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {

        page.classList.remove("active");

        page.style.display = "";

    });

    const requestedPage =
        $(pageId);

    if (!requestedPage) {

        console.warn(
            "ChemLab: Page not found:",
            pageId
        );

        return;
    }

    requestedPage.classList.add("active");

    requestedPage.style.display = "";

    chemLabState.currentPage =
        pageId;

    if (pageId === "advancedTitrationPage") {

        requestAnimationFrame(() => {

            drawAdvancedTitrationChart();

        });
    }
}


/* =========================================================
   9. EXPERIMENT NAVIGATION
========================================================= */

function openExperiment(experimentName) {

    chemLabState.currentExperiment =
        experimentName;

    if (experimentName === "titration") {

        showPage("titration");

        resetExperiment();

        return;
    }

    showNotification(
        "This experiment is not available yet.",
        "warning"
    );
}


/* =========================================================
   10. BASIC TITRATION CALCULATIONS
========================================================= */

function calculateBasicTitration(volume) {

    const acidMoles =
        titrationState.hclConcentration *
        (titrationState.hclVolume / 1000);

    const baseMoles =
        titrationState.naohConcentration *
        (volume / 1000);

    const totalVolume =
        (titrationState.hclVolume + volume) /
        1000;

    const difference =
        acidMoles - baseMoles;

    let pH;

    let state;

    if (Math.abs(difference) < 1e-10) {

        pH = 7;

        state = "equivalence";

    } else if (difference > 0) {

        const hPlus =
            difference / totalVolume;

        pH =
            -Math.log10(
                Math.max(hPlus, 1e-14)
            );

        state = "acidic";

    } else {

        const ohMinus =
            Math.abs(difference) /
            totalVolume;

        const pOH =
            -Math.log10(
                Math.max(ohMinus, 1e-14)
            );

        pH = 14 - pOH;

        state = "basic";
    }

    return {

        acidMoles,

        baseMoles,

        totalVolume,

        difference,

        pH: clamp(pH, 0, 14),

        state
    };
}


/* =========================================================
   11. BASIC TITRATION CONTROLS
========================================================= */

function addTitrant(amount) {

    const newVolume =
        titrationState.titrantVolume +
        amount;

    titrationState.titrantVolume =
        clamp(
            newVolume,
            0,
            60
        );

    updateTitrationDisplay();
}


function getIndicatorStatus(pH) {

    if (pH >= 8.2) {

        return {
            text: "Pink — basic range",
            color: "pink"
        };
    }

    return {
        text: "Colorless",
        color: "clear"
    };
}


function updateBurette(volume) {

    const liquid =
        $("buretteLiquid");

    if (!liquid) {
        return;
    }

    const percentage =
        clamp(
            (volume / 60) * 100,
            0,
            100
        );

    liquid.style.height =
        `${percentage}%`;
}


function updateFlask(pH) {

    const solution =
        $("solution");

    if (!solution) {
        return;
    }

    if (pH < 6.5) {

        solution.style.background =
            "rgba(255, 180, 180, .55)";

    } else if (pH > 8.2) {

        solution.style.background =
            "rgba(255, 170, 220, .65)";

    } else {

        solution.style.background =
            "rgba(245, 245, 245, .7)";
    }
}


function updateEndpointMessage(state) {

    const element =
        $("endpointMessage");

    if (!element) {
        return;
    }

    if (state === "equivalence") {

        element.textContent =
            "Equivalence point reached.";
        return;
    }

    if (state === "acidic") {

        element.textContent =
            "Acid is still in excess.";
        return;
    }

    element.textContent =
        "Base is now in excess.";
}


function updateTitrationDisplay() {

    const result =
        calculateBasicTitration(
            titrationState.titrantVolume
        );

    safeText(
        $("titrantVolume"),
        `${round(titrationState.titrantVolume, 1)} mL`
    );

    safeText(
        $("phValue"),
        round(result.pH, 2)
    );

    const indicator =
        getIndicatorStatus(result.pH);

    safeText(
        $("indicatorStatus"),
        indicator.text
    );

    updateBurette(
        titrationState.titrantVolume
    );

    updateFlask(
        result.pH
    );

    updateEndpointMessage(
        result.state
    );

    const observation =
        $("titrationObservation");

    if (observation) {

        if (result.state === "equivalence") {

            observation.textContent =
                "The acid and base have reacted in approximately equal amounts. You are at the equivalence point.";

        } else if (result.state === "acidic") {

            observation.textContent =
                "The solution remains acidic because hydrochloric acid is still in excess.";

        } else {

            observation.textContent =
                "The solution is basic because sodium hydroxide is now in excess.";
        }
    }
}


function resetExperiment() {

    titrationState.titrantVolume = 0;

    chemLabState.currentExperiment =
        "titration";

    updateTitrationDisplay();
}


function getExperimentState() {

    return {

        experiment:
            chemLabState.currentExperiment,

        titrantVolume:
            titrationState.titrantVolume,

        result:
            calculateBasicTitration(
                titrationState.titrantVolume
            )
    };
}

/* =========================================================
   12. AI CHEMISTRY TUTOR
========================================================= */

const CHEMLAB_AI_URL =
    CHEMLAB_CONFIG.chemistryAIEndpoint;

const CHEMLAB_SUPABASE_KEY =
    CHEMLAB_CONFIG.supabasePublishableKey;


/* ---------------------------------------------------------
   GET CURRENT SUPABASE SESSION
--------------------------------------------------------- */

async function getAISessionToken() {

    try {

        /*
         * Your auth.js creates supabaseClient.
         * We use that client when available.
         */

        if (
            typeof supabaseClient !== "undefined" &&
            supabaseClient?.auth
        ) {

            const {
                data,
                error
            } = await supabaseClient.auth.getSession();

            if (error) {
                console.warn(
                    "Supabase session error:",
                    error
                );
            }

            return (
                data?.session?.access_token ||
                null
            );
        }

    } catch (error) {

        console.warn(
            "Could not get Supabase AI session:",
            error
        );
    }

    return null;
}


/* ---------------------------------------------------------
   SEND QUESTION TO CHEMLAB AI
--------------------------------------------------------- */

async function askAI(
    question,
    experiment = null
) {

    const cleanedQuestion =
        String(question || "").trim();

    if (!cleanedQuestion) {

        throw new Error(
            "Please enter a chemistry question."
        );
    }


    /*
     * Get the student's current authentication
     * session.
     */

    const token =
        await getAISessionToken();


    /*
     * Build secure request headers.
     */

    const headers = {

        "Content-Type":
            "application/json",

        "apikey":
            CHEMLAB_SUPABASE_KEY
    };


    /*
     * If the student is signed in,
     * send their access token.
     */

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }


    /*
     * Send request to Supabase Edge Function.
     */

    let response;

    try {

        response =
            await fetch(
                CHEMLAB_AI_URL,
                {
                    method: "POST",

                    headers,

                    body: JSON.stringify({

                        question:
                            cleanedQuestion,

                        experiment:
                            experiment ||
                            chemLabState.currentExperiment ||
                            "General Chemistry",

                        source:
                            "ChemLab",

                        student_mode:
                            true
                    })
                }
            );

    } catch (networkError) {

        console.error(
            "ChemLab AI network error:",
            networkError
        );

        throw new Error(
            "Could not connect to ChemLab AI. Please check your internet connection."
        );
    }


    /*
     * Read response safely.
     */

    let data = null;

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";


    if (
        contentType.includes(
            "application/json"
        )
    ) {

        try {

            data =
                await response.json();

        } catch (error) {

            console.error(
                "Invalid AI JSON response:",
                error
            );
        }

    } else {

        try {

            const text =
                await response.text();

            data = {
                error: text
            };

        } catch (_) {}
    }


    /*
     * Handle Supabase / Edge Function errors.
     */

    if (!response.ok) {

        console.error(
            "ChemLab AI server error:",
            response.status,
            data
        );

        const serverMessage =
            data?.error ||
            data?.message ||
            data?.details;

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            throw new Error(
                "ChemLab AI requires a valid student session. Please sign in and try again."
            );
        }

        if (
            response.status === 404
        ) {

            throw new Error(
                "ChemLab AI service could not be found. Please check the Supabase Edge Function."
            );
        }

        if (
            response.status >= 500
        ) {

            throw new Error(
                serverMessage ||
                "ChemLab AI is temporarily unavailable. Please try again."
            );
        }

        throw new Error(
            serverMessage ||
            `ChemLab AI returned an error (${response.status}).`
        );
    }


    /*
     * Extract AI answer.
     */

    const answer =
        data?.answer ||
        data?.response ||
        data?.message ||
        data?.result;


    if (!answer) {

        console.error(
            "ChemLab AI returned no answer:",
            data
        );

        throw new Error(
            "ChemLab AI connected successfully, but no answer was returned."
        );
    }


    return String(answer);
}


/* =========================================================
   MAIN AI QUESTION
========================================================= */

async function mainAIQuestion() {

    /*
     * Support both the old and new input IDs.
     */

    const input =
        $("aiQuestion") ||
        $("mainAIInput");


    /*
     * Support both possible output containers.
     */

    const output =
        $("aiChat") ||
        $("mainAIAnswer");


    const status =
        $("aiStatus");


    if (!input) {

        console.error(
            "ChemLab AI: question input not found."
        );

        return;
    }


    const question =
        input.value.trim();


    if (!question) {

        if (status) {

            status.textContent =
                "Please enter a chemistry question.";
        }

        input.focus();

        return;
    }


    /*
     * Disable the button while AI is responding.
     */

    const button =
        $("askAIButton");


    if (button) {

        button.disabled =
            true;

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            "🧠 Thinking...";
    }


    if (status) {

        status.textContent =
            "ChemLab AI is thinking...";
    }


    /*
     * Add student's question to chat.
     */

    if (
        output &&
        output.id === "aiChat"
    ) {

        addAIChatMessage(
            "user",
            question
        );

        addAIChatMessage(
            "assistant",
            "🧠 ChemLab AI is thinking..."
        );

    } else if (output) {

        output.textContent =
            "🧠 ChemLab AI is thinking...";
    }


    try {

        const answer =
            await askAI(
                question
            );


        /*
         * Replace temporary thinking message.
         */

        if (
            output &&
            output.id === "aiChat"
        ) {

            const messages =
                output.querySelectorAll(
                    ".ai-message.assistant"
                );

            const lastMessage =
                messages[
                    messages.length - 1
                ];

            if (lastMessage) {

                const paragraph =
                    lastMessage.querySelector(
                        "p"
                    );

                if (paragraph) {

                    paragraph.textContent =
                        answer;

                } else {

                    lastMessage.textContent =
                        answer;
                }

            } else {

                addAIChatMessage(
                    "assistant",
                    answer
                );
            }

        } else if (output) {

            output.textContent =
                answer;
        }


        if (status) {

            status.textContent =
                "ChemLab AI is ready.";
        }


        /*
         * Clear question after successful response.
         */

        input.value = "";

    } catch (error) {

        console.error(
            "ChemLab AI error:",
            error
        );


        const message =
            error?.message ||
            "Unable to connect to ChemLab AI.";


        if (
            output &&
            output.id === "aiChat"
        ) {

            const messages =
                output.querySelectorAll(
                    ".ai-message.assistant"
                );

            const lastMessage =
                messages[
                    messages.length - 1
                ];

            if (lastMessage) {

                const paragraph =
                    lastMessage.querySelector(
                        "p"
                    );

                if (paragraph) {

                    paragraph.textContent =
                        `⚠️ ${message}`;

                } else {

                    lastMessage.textContent =
                        `⚠️ ${message}`;
                }
            }

        } else if (output) {

            output.textContent =
                `⚠️ ${message}`;
        }


        if (status) {

            status.textContent =
                message;
        }

    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                button.dataset.originalText ||
                "🤖 Ask ChemLab AI";
        }
    }
}


/* =========================================================
   ADD MESSAGE TO AI CHAT
========================================================= */

function addAIChatMessage(
    role,
    message
) {

    const chat =
        $("aiChat");

    if (!chat) {
        return;
    }


    const wrapper =
        document.createElement("div");


    wrapper.className =
        role === "user"
            ? "ai-message user"
            : "ai-message assistant";


    if (role === "user") {

        wrapper.innerHTML = `
            <div>
                <strong>You</strong>
                <p></p>
            </div>
        `;

    } else {

        wrapper.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div>
                <strong>ChemLab AI</strong>
                <p></p>
            </div>
        `;
    }


    const paragraph =
        wrapper.querySelector("p");


    if (paragraph) {

        paragraph.textContent =
            message;
    }


    chat.appendChild(
        wrapper
    );


    /*
     * Keep latest message visible.
     */

    chat.scrollTop =
        chat.scrollHeight;
}


/* =========================================================
   CLEAR AI CHAT
========================================================= */

function clearAIChat() {

    const chat =
        $("aiChat");

    const status =
        $("aiStatus");


    if (chat) {

        chat.innerHTML = `
            <div class="ai-message assistant">
                <div class="ai-avatar">🤖</div>

                <div>
                    <strong>ChemLab AI</strong>

                    <p>
                        Hello! Ask me a chemistry question
                        and I’ll help you understand it
                        step by step.
                    </p>
                </div>
            </div>
        `;
    }


    if (status) {

        status.textContent =
            "";
    }


    const input =
        $("aiQuestion") ||
        $("mainAIInput");


    if (input) {

        input.value = "";

        input.focus();
    }
}


/* =========================================================
   ADVANCED EXPERIMENT AI
========================================================= */

async function askExperimentAI() {

    const input =
        $("advancedExplanationText");


    if (!input) {
        return;
    }


    const question =
        "Explain the current advanced acid-base titration experiment. " +
        "Use the current volume, pH, equivalence point, " +
        "and chemical reaction to explain what is happening to a student.";


    input.textContent =
        "🧠 ChemLab AI is analyzing the experiment...";


    try {

        const result =
            await askAI(
                question,
                "Advanced Acid-Base Titration"
            );


        input.textContent =
            result;

    } catch (error) {

        console.error(
            "Advanced AI error:",
            error
        );


        input.textContent =
            error?.message ||
            "Unable to get the AI explanation.";
    }
}

/* =========================================================
   13. QUIZ SYSTEM
========================================================= */

function loadQuizQuestion() {

    const question =
        quizQuestions[
            chemLabState.currentQuestion
        ];

    if (!question) {
        finishQuiz();
        return;
    }

    safeText(
        $("quizQuestion"),
        question.question
    );

    const options =
        $("quizOptions");

    if (!options) {
        return;
    }

    options.innerHTML = "";

    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "quiz-option";

            button.textContent =
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

    chemLabState.quizAnswered =
        false;
}


function answerQuiz(selectedIndex) {

    if (
        chemLabState.quizAnswered
    ) {
        return;
    }

    const question =
        quizQuestions[
            chemLabState.currentQuestion
        ];

    if (!question) {
        return;
    }

    chemLabState.quizAnswered =
        true;

    const buttons =
        document.querySelectorAll(
            ".quiz-option"
        );

    buttons.forEach(
        (button, index) => {

            button.disabled =
                true;

            if (
                index === question.answer
            ) {

                button.classList.add(
                    "correct"
                );
            }

            if (
                index === selectedIndex &&
                index !== question.answer
            ) {

                button.classList.add(
                    "incorrect"
                );
            }
        }
    );

    if (
        selectedIndex === question.answer
    ) {

        chemLabState.quizScore++;

        showNotification(
            "Correct! +10 XP",
            "success"
        );

        addXP(10);

    } else {

        showNotification(
            "Not quite. Check the correct answer.",
            "warning"
        );
    }

    const explanation =
        $("quizExplanation");

    if (explanation) {

        explanation.textContent =
            question.explanation;
    }
}


function finishQuiz() {

    const total =
        quizQuestions.length;

    const score =
        chemLabState.quizScore;

    safeText(
        $("quizScore"),
        `${score}/${total}`
    );

    showNotification(
        `Quiz completed: ${score}/${total}`,
        "success"
    );
}


function restartQuiz() {

    chemLabState.quizScore = 0;

    chemLabState.currentQuestion = 0;

    chemLabState.quizAnswered = false;

    loadQuizQuestion();
}


/* =========================================================
   14. XP / PROGRESS
========================================================= */

function addXP(amount) {

    const safeAmount =
        Number(amount) || 0;

    chemLabState.xp +=
        safeAmount;

    updateProgressUI();
}


function completeExperiment(
    xpAmount = 50
) {

    chemLabState.experimentsCompleted++;

    addXP(xpAmount);

    showNotification(
        `Experiment completed! +${xpAmount} XP`,
        "success",
        4500
    );

    updateProgressUI();
}


function updateProgressUI() {

    const xpElements =
        document.querySelectorAll(
            "[data-xp], #xpValue, #totalXP"
        );

    xpElements.forEach(
        element => {

            element.textContent =
                chemLabState.xp.toLocaleString();
        }
    );

    safeText(
        $("experimentsCompleted"),
        chemLabState.experimentsCompleted
    );
}


/* =========================================================
   15. ADVANCED TITRATION CALCULATION
========================================================= */

function calculateAdvancedTitration(
    addedVolume
) {

    const hclM =
        Number(
            advancedTitration.hclConcentration
        );

    const naohM =
        Number(
            advancedTitration.naohConcentration
        );

    const sampleMl =
        Number(
            advancedTitration.sampleVolume
        );

    const volumeMl =
        clamp(
            Number(addedVolume) || 0,
            0,
            advancedTitration.maxVolume
        );

    const acidMoles =
        hclM *
        (sampleMl / 1000);

    const baseMoles =
        naohM *
        (volumeMl / 1000);

    const totalVolume =
        (sampleMl + volumeMl) /
        1000;

    const difference =
        acidMoles - baseMoles;

    const equivalenceVolumeMl =
        (acidMoles / naohM) *
        1000;

    let pH;

    let state;

    let hPlus = 0;

    let ohMinus = 0;

    const equivalenceTolerance =
        Math.max(
            acidMoles * 1e-8,
            1e-12
        );

    if (
        Math.abs(difference) <=
        equivalenceTolerance
    ) {

        pH = 7;

        state =
            "equivalence";

        hPlus =
            1e-7;

        ohMinus =
            1e-7;

    } else if (
        difference > 0
    ) {

        hPlus =
            difference /
            totalVolume;

        pH =
            -Math.log10(
                Math.max(
                    hPlus,
                    1e-14
                )
            );

        state =
            "acidic";

        ohMinus =
            1e-14 /
            Math.max(hPlus, 1e-14);

    } else {

        ohMinus =
            Math.abs(difference) /
            totalVolume;

        const pOH =
            -Math.log10(
                Math.max(
                    ohMinus,
                    1e-14
                )
            );

        pH =
            14 - pOH;

        state =
            "basic";

        hPlus =
            1e-14 /
            Math.max(ohMinus, 1e-14);
    }

    pH =
        clamp(
            pH,
            0,
            14
        );

    const neutralizationProgress =
        acidMoles === 0
            ? 0
            : clamp(
                (baseMoles / acidMoles) * 100,
                0,
                100
            );

    const volumeDifference =
        Math.abs(
            volumeMl -
            equivalenceVolumeMl
        );

    const nearEquivalence =
        volumeDifference <= 0.25;

    return {

        hclMoles:
            acidMoles,

        naohMoles:
            baseMoles,

        totalVolume,

        difference,

        equivalenceVolume:
            equivalenceVolumeMl,

        addedVolume:
            volumeMl,

        pH,

        state,

        hPlus,

        ohMinus,

        neutralizationProgress,

        nearEquivalence
    };
}


/* =========================================================
   16. ADVANCED TITRATION OBSERVATION
========================================================= */

function getAdvancedObservation(
    result
) {

    if (!result) {

        return "Begin adding sodium hydroxide to the hydrochloric acid sample.";
    }

    if (
        result.state ===
        "equivalence"
    ) {

        return (
            "Equivalence point reached. " +
            "The strong acid and strong base have reacted in stoichiometrically equivalent amounts. " +
            "At approximately 25°C, the solution has a pH close to 7."
        );
    }

    if (
        result.nearEquivalence
    ) {

        return (
            "You are very close to the equivalence point. " +
            "A small change in titrant volume can produce a noticeable change in pH."
        );
    }

    if (
        result.state ===
        "acidic"
    ) {

        return (
            "Hydrochloric acid is still in excess. " +
            "Adding more sodium hydroxide will continue neutralization."
        );
    }

    return (
        "Sodium hydroxide is now in excess. " +
        "The solution has moved into the basic region."
    );
}


/* =========================================================
   17. ADVANCED INDICATOR
========================================================= */

function getAdvancedIndicatorStatus(
    pH
) {

    if (pH >= 10) {

        return {
            text: "Strong pink / basic",
            className: "basic"
        };
    }

    if (pH >= 8.2) {

        return {
            text: "Pink",
            className: "pink"
        };
    }

    return {
        text: "Colorless",
        className: "clear"
    };
}


/* =========================================================
   18. ADVANCED LAB VISUALS
========================================================= */

function updateAdvancedBurette(
    volume
) {

    const liquid =
        $("advancedBuretteLiquid");

    if (!liquid) {
        return;
    }

    const percentage =
        clamp(
            (volume /
                advancedTitration.maxVolume) *
                100,
            0,
            100
        );

    liquid.style.height =
        `${percentage}%`;
}


function updateAdvancedFlask(
    pH
) {

    const solution =
        $("advancedSolution");

    if (!solution) {
        return;
    }

    if (pH < 6.5) {

        solution.style.background =
            "rgba(255, 190, 190, .6)";

    } else if (pH >= 8.2) {

        solution.style.background =
            "rgba(255, 170, 220, .65)";

    } else {

        solution.style.background =
            "rgba(245, 245, 245, .7)";
    }
}


/* =========================================================
   19. ADVANCED LAB DISPLAY
========================================================= */

function updateAdvancedTitration() {

    const result =
        calculateAdvancedTitration(
            advancedTitration.addedVolume
        );

    advancedTitration.lastCalculatedState =
        result;

    updateAdvancedBurette(
        result.addedVolume
    );

    updateAdvancedFlask(
        result.pH
    );

    safeText(
        $("advancedNaohVolume"),
        `${round(result.addedVolume, 1)} mL`
    );

    safeText(
        $("advancedPhValue"),
        round(result.pH, 3)
    );

    safeText(
        $("advancedProgressText"),
        `${round(result.neutralizationProgress, 1)}%`
    );

    const progressBar =
        $("advancedProgressBar");

    if (progressBar) {

        progressBar.style.width =
            `${result.neutralizationProgress}%`;
    }

    safeText(
        $("advancedHplus"),
        result.hPlus.toExponential(3)
    );

    safeText(
        $("advancedOhminus"),
        result.ohMinus.toExponential(3)
    );

    safeText(
        $("advancedEquivalence"),
        `${round(result.equivalenceVolume, 2)} mL`
    );

    safeText(
        $("advancedTotalVolume"),
        `${round(result.totalVolume * 1000, 2)} mL`
    );

    safeText(
        $("advancedHplusConcentration"),
        result.hPlus.toExponential(3)
    );

    safeText(
        $("advancedOhConcentration"),
        result.ohMinus.toExponential(3)
    );

    safeText(
        $("advancedNeutralizationProgress"),
        `${round(result.neutralizationProgress, 1)}%`
    );

    const indicator =
        getAdvancedIndicatorStatus(
            result.pH
        );

    safeText(
        $("advancedIndicatorStatus"),
        indicator.text
    );

    safeText(
        $("advancedReactionStatus"),
        result.state === "equivalence"
            ? "Equivalence point reached"
            : result.state === "acidic"
                ? "Acid in excess"
                : "Base in excess"
    );

    safeText(
        $("advancedObservation"),
        getAdvancedObservation(result)
    );

    const explanation =
        $("advancedExplanation");

    if (explanation) {

        explanation.textContent =
            getAdvancedObservation(result);
    }

    const equivalenceIndicator =
        document.querySelector(
            ".equivalence-indicator"
        );

    if (equivalenceIndicator) {

        equivalenceIndicator.classList.toggle(
            "active",
            result.state === "equivalence" ||
            result.nearEquivalence
        );
    }

    const slider =
        $("advancedVolumeSlider");

    if (slider) {

        if (
            Number(slider.value) !==
            advancedTitration.addedVolume
        ) {

            slider.value =
                advancedTitration.addedVolume;
        }
    }

    const completionNow =
        result.state === "equivalence";

    if (
        completionNow &&
        !advancedTitration.completed
    ) {

        advancedTitration.completed =
            true;

        chemLabState.advancedExperimentCompleted =
            true;

        completeExperiment(75);
    }

    advancedTitration.equivalenceReached =
        completionNow;

    drawAdvancedTitrationChart();
}


/* =========================================================
   20. ADVANCED LAB INPUTS
========================================================= */

function updateAdvancedConcentrations() {

    const hclInput =
        $("advancedHclConcentration");

    const naohInput =
        $("advancedNaohConcentration");

    const sampleInput =
        $("advancedSampleVolume");

    if (hclInput) {

        const value =
            Number(hclInput.value);

        if (
            Number.isFinite(value) &&
            value > 0
        ) {

            advancedTitration.hclConcentration =
                value;
        }
    }

    if (naohInput) {

        const value =
            Number(naohInput.value);

        if (
            Number.isFinite(value) &&
            value > 0
        ) {

            advancedTitration.naohConcentration =
                value;
        }
    }

    if (sampleInput) {

        const value =
            Number(sampleInput.value);

        if (
            Number.isFinite(value) &&
            value > 0
        ) {

            advancedTitration.sampleVolume =
                value;
        }
    }

    advancedTitration.completed =
        false;

    advancedTitration.equivalenceReached =
        false;

    chemLabState.advancedExperimentCompleted =
        false;

    updateAdvancedTitration();
}


function setAdvancedVolume(
    volume
) {

    advancedTitration.addedVolume =
        clamp(
            Number(volume) || 0,
            0,
            advancedTitration.maxVolume
        );

    updateAdvancedTitration();
}


function addAdvancedNaOH(
    amount = 1
) {

    setAdvancedVolume(
        advancedTitration.addedVolume +
        amount
    );
}


function resetAdvancedTitration() {

    advancedTitration.addedVolume =
        0;

    advancedTitration.completed =
        false;

    advancedTitration.equivalenceReached =
        false;

    chemLabState.advancedExperimentCompleted =
        false;

    const slider =
        $("advancedVolumeSlider");

    if (slider) {

        slider.value = "0";
    }

    updateAdvancedTitration();

    showNotification(
        "Advanced titration reset.",
        "info"
    );
}


/* =========================================================
   21. ADVANCED TITRATION CHART
========================================================= */

function calculateCurvePH(
    volume
) {

    const result =
        calculateAdvancedTitration(
            volume
        );

    return result.pH;
}


function drawAdvancedTitrationChart() {

    const canvas =
        $("advancedTitrationChart");

    if (!canvas) {
        return;
    }

    const parent =
        canvas.parentElement;

    const width =
        Math.max(
            parent?.clientWidth || 0,
            320
        );

    const height =
        Math.max(
            parent?.clientHeight || 0,
            280
        );

    const dpr =
        window.devicePixelRatio || 1;

    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;

    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;

    const ctx =
        canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    const padding = {

        left: 55,

        right: 20,

        top: 25,

        bottom: 45
    };

    const chartWidth =
        width -
        padding.left -
        padding.right;

    const chartHeight =
        height -
        padding.top -
        padding.bottom;

    if (
        chartWidth <= 0 ||
        chartHeight <= 0
    ) {

        return;
    }

    /* Grid */

    ctx.strokeStyle =
        "rgba(100,116,139,.15)";

    ctx.lineWidth = 1;

    for (
        let pH = 0;
        pH <= 14;
        pH += 2
    ) {

        const y =
            padding.top +
            chartHeight -
            (pH / 14) *
            chartHeight;

        ctx.beginPath();

        ctx.moveTo(
            padding.left,
            y
        );

        ctx.lineTo(
            width - padding.right,
            y
        );

        ctx.stroke();

        ctx.fillStyle =
            "#667085";

        ctx.font =
            "12px Arial";

        ctx.fillText(
            String(pH),
            25,
            y + 4
        );
    }

    /* X-axis grid */

    for (
        let volume = 0;
        volume <= advancedTitration.maxVolume;
        volume += 10
    ) {

        const x =
            padding.left +
            (volume /
                advancedTitration.maxVolume) *
                chartWidth;

        ctx.beginPath();

        ctx.moveTo(
            x,
            padding.top
        );

        ctx.lineTo(
            x,
            padding.top +
            chartHeight
        );

        ctx.stroke();

        ctx.fillStyle =
            "#667085";

        ctx.font =
            "12px Arial";

        ctx.fillText(
            `${volume}`,
            x - 8,
            height - 20
        );
    }

    /* Axes */

    ctx.strokeStyle =
        "#667085";

    ctx.lineWidth = 1.5;

    ctx.beginPath();

    ctx.moveTo(
        padding.left,
        padding.top
    );

    ctx.lineTo(
        padding.left,
        padding.top +
        chartHeight
    );

    ctx.lineTo(
        width - padding.right,
        padding.top +
        chartHeight
    );

    ctx.stroke();

    /* Curve */

    ctx.beginPath();

    const points = 180;

    for (
        let i = 0;
        i <= points;
        i++
    ) {

        const volume =
            (i / points) *
            advancedTitration.maxVolume;

        const pH =
            calculateCurvePH(
                volume
            );

        const x =
            padding.left +
            (volume /
                advancedTitration.maxVolume) *
                chartWidth;

        const y =
            padding.top +
            chartHeight -
            (pH / 14) *
            chartHeight;

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

    ctx.stroke();

    /* Equivalence line */

    const equivalence =
        calculateAdvancedTitration(
            0
        ).equivalenceVolume;

    if (
        equivalence >= 0 &&
        equivalence <=
        advancedTitration.maxVolume
    ) {

        const x =
            padding.left +
            (equivalence /
                advancedTitration.maxVolume) *
                chartWidth;

        ctx.setLineDash(
            [6, 6]
        );

        ctx.strokeStyle =
            "#7c3aed";

        ctx.lineWidth = 1.5;

        ctx.beginPath();

        ctx.moveTo(
            x,
            padding.top
        );

        ctx.lineTo(
            x,
            padding.top +
            chartHeight
        );

        ctx.stroke();

        ctx.setLineDash([]);

        ctx.fillStyle =
            "#7c3aed";

        ctx.font =
            "12px Arial";

        ctx.fillText(
            "Equivalence",
            Math.min(
                x + 5,
                width - 90
            ),
            padding.top + 15
        );
    }

    /* Current point */

    const current =
        advancedTitration.lastCalculatedState;

    if (current) {

        const x =
            padding.left +
            (current.addedVolume /
                advancedTitration.maxVolume) *
                chartWidth;

        const y =
            padding.top +
            chartHeight -
            (current.pH / 14) *
            chartHeight;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            6,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#dc2626";

        ctx.fill();

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 2;

        ctx.stroke();
    }

    /* Labels */

    ctx.fillStyle =
        "#101828";

    ctx.font =
        "bold 13px Arial";

    ctx.fillText(
        "pH",
        12,
        18
    );

    ctx.fillText(
        "NaOH added (mL)",
        width / 2 - 50,
        height - 2
    );
}


/* =========================================================
   22. ADVANCED AI EXPLANATION
========================================================= */

async function explainAdvancedTitration() {

    const result =
        advancedTitration.lastCalculatedState;

    const explanation =
        $("advancedExplanationText");

    if (!explanation) {
        return;
    }

    if (!result) {

        explanation.textContent =
            "Start the experiment first.";

        return;
    }

    explanation.textContent =
        "🧠 ChemLab AI is analyzing the experiment...";

    const prompt =
        `Explain this chemistry titration experiment to a student.

HCl concentration: ${advancedTitration.hclConcentration} M
HCl sample volume: ${advancedTitration.sampleVolume} mL
NaOH concentration: ${advancedTitration.naohConcentration} M
NaOH added: ${result.addedVolume} mL
Calculated equivalence volume: ${result.equivalenceVolume} mL
Current pH: ${result.pH}
Current state: ${result.state}
Neutralization progress: ${result.neutralizationProgress}%

Explain:
1. What is happening chemically.
2. Whether acid or base is in excess.
3. How the pH relates to the reaction.
4. What the equivalence point means.
5. What the student should observe next.

Keep it educational and clear.`;

    try {

        const answer =
            await askAI(
                prompt,
                "Advanced Acid-Base Titration"
            );

        explanation.textContent =
            answer;

    } catch (error) {

        console.error(
            error
        );

        explanation.textContent =
            error.message ||
            "Unable to generate the explanation.";
    }
}


/* =========================================================
   23. PREMIUM ACCESS PROTECTION
========================================================= */

async function checkAdvancedPremiumAccess() {

    if (
        advancedTitration.accessChecking
    ) {

        return false;
    }

    advancedTitration.accessChecking =
        true;

    try {

        if (
            typeof window.getCurrentStudent !==
            "function"
        ) {

            showNotification(
                "Please sign in before opening the Advanced Lab.",
                "warning"
            );

            if (
                typeof window.openAuthModal ===
                "function"
            ) {

                window.openAuthModal(
                    "signin"
                );
            }

            return false;
        }

        const student =
            await window.getCurrentStudent();

        if (!student) {

            showNotification(
                "Please sign in to access the Premium Advanced Lab.",
                "warning"
            );

            if (
                typeof window.openAuthModal ===
                "function"
            ) {

                window.openAuthModal(
                    "signin"
                );
            }

            return false;
        }

        if (
            typeof window.getPremiumStatus !==
            "function"
        ) {

            showNotification(
                "Premium verification is temporarily unavailable.",
                "error"
            );

            return false;
        }

        const premium =
            await window.getPremiumStatus();

        if (
            premium?.isPremium === true
        ) {

            return true;
        }

        showNotification(
            "Premium access is required for the Advanced Lab.",
            "warning"
        );

        if (
            typeof window.openPremiumPage ===
            "function"
        ) {

            window.openPremiumPage();

        } else if (
            typeof window.openPremiumModal ===
            "function"
        ) {

            window.openPremiumModal();
        }

        return false;

    } catch (error) {

        console.error(
            "Premium access check failed:",
            error
        );

        showNotification(
            "Could not verify Premium access.",
            "error"
        );

        return false;

    } finally {

        advancedTitration.accessChecking =
            false;
    }
}


/* =========================================================
   24. OPEN ADVANCED TITRATION
========================================================= */

async function openAdvancedTitration() {

    const hasAccess =
        await checkAdvancedPremiumAccess();

    if (!hasAccess) {
        return;
    }

    const advancedPage =
        $("advancedTitrationPage");

    if (!advancedPage) {

        showNotification(
            "Advanced Lab page could not be found.",
            "error"
        );

        return;
    }

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {

        page.classList.remove("active");

        page.style.display = "";

    });

    advancedPage.classList.add(
        "active"
    );

    advancedPage.style.display =
        "block";

    chemLabState.currentPage =
        "advancedTitrationPage";

    chemLabState.currentExperiment =
        "advanced-titration";

    initializeAdvancedTitration();

    requestAnimationFrame(() => {

        updateAdvancedTitration();

        drawAdvancedTitrationChart();

    });
}


/* =========================================================
   25. CLOSE ADVANCED TITRATION
========================================================= */

function closeAdvancedTitration() {

    resetAdvancedTitration();

    const advancedPage =
        $("advancedTitrationPage");

    if (advancedPage) {

        advancedPage.classList.remove(
            "active"
        );

        advancedPage.style.display =
            "none";
    }

    chemLabState.currentExperiment =
        null;

    showPage("lab");
}


/* =========================================================
   26. PREMIUM SECTION
========================================================= */

function showPremiumSection() {

    if (
        typeof window.openPremiumPage ===
        "function"
    ) {

        window.openPremiumPage();

        return;
    }

    showPage(
        "premiumSection"
    );
}


/* =========================================================
   27. ADVANCED INITIALIZATION
========================================================= */

function initializeAdvancedTitration() {

    if (
        advancedTitration.initialized
    ) {

        return;
    }

    const hclInput =
        $("advancedHclConcentration");

    const naohInput =
        $("advancedNaohConcentration");

    const sampleInput =
        $("advancedSampleVolume");

    const slider =
        $("advancedVolumeSlider");

    const addButton =
        $("advancedAddNaohButton");

    const resetButton =
        $("advancedResetButton");

    const explainButton =
        $("advancedExplainButton");

    if (!slider) {

        console.warn(
            "ChemLab: Advanced titration controls not found."
        );

        return;
    }

    /* Set safe slider defaults */

    slider.min = "0";

    slider.max =
        String(
            advancedTitration.maxVolume
        );

    slider.step = "0.1";

    slider.value = "0";

    if (hclInput) {

        hclInput.addEventListener(
            "input",
            updateAdvancedConcentrations
        );
    }

    if (naohInput) {

        naohInput.addEventListener(
            "input",
            updateAdvancedConcentrations
        );
    }

    if (sampleInput) {

        sampleInput.addEventListener(
            "input",
            updateAdvancedConcentrations
        );
    }

    slider.addEventListener(
        "input",
        event => {

            setAdvancedVolume(
                event.target.value
            );
        }
    );

    if (addButton) {

        addButton.addEventListener(
            "click",
            () => addAdvancedNaOH(1)
        );
    }

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetAdvancedTitration
        );
    }

    if (explainButton) {

        explainButton.addEventListener(
            "click",
            explainAdvancedTitration
        );
    }

    advancedTitration.initialized =
        true;
}


/* =========================================================
   28. BUTTON INITIALIZATION
========================================================= */

function initializeAppButtons() {

    const plusOne =
        $("add1ml");

    if (
        plusOne &&
        !plusOne.dataset.bound
    ) {

        plusOne.addEventListener(
            "click",
            () => addTitrant(1)
        );

        plusOne.dataset.bound =
            "true";
    }


    const plusFive =
        $("add5ml");

    if (
        plusFive &&
        !plusFive.dataset.bound
    ) {

        plusFive.addEventListener(
            "click",
            () => addTitrant(5)
        );

        plusFive.dataset.bound =
            "true";
    }


    const reset =
        $("resetExperiment");

    if (
        reset &&
        !reset.dataset.bound
    ) {

        reset.addEventListener(
            "click",
            resetExperiment
        );

        reset.dataset.bound =
            "true";
    }
}


/* =========================================================
   29. AI BUTTON + KEYBOARD SUPPORT
========================================================= */

function initializeAIKeyboard() {

    const input =
        $("aiQuestion") ||
        $("mainAIInput");

    const askButton =
        $("askAIButton");

    const clearButton =
        $("clearAIButton");


    /* -----------------------------
       ASK BUTTON
    ----------------------------- */

    if (
        askButton &&
        !askButton.dataset.bound
    ) {

        askButton.addEventListener(
            "click",
            mainAIQuestion
        );

        askButton.dataset.bound =
            "true";
    }


    /* -----------------------------
       CLEAR BUTTON
    ----------------------------- */

    if (
        clearButton &&
        !clearButton.dataset.bound
    ) {

        clearButton.addEventListener(
            "click",
            clearAIChat
        );

        clearButton.dataset.bound =
            "true";
    }


    /* -----------------------------
       ENTER KEY
    ----------------------------- */

    if (
        input &&
        !input.dataset.bound
    ) {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    mainAIQuestion();
                }
            }
        );


        input.dataset.bound =
            "true";
    }
}

/* =========================================================
   30. WINDOW RESIZE
========================================================= */

let chartResizeTimer = null;

function handleChartResize() {

    clearTimeout(
        chartResizeTimer
    );

    chartResizeTimer =
        setTimeout(
            () => {

                if (
                    chemLabState.currentPage ===
                    "advancedTitrationPage"
                ) {

                    drawAdvancedTitrationChart();
                }

            },
            100
        );
}


/* =========================================================
   31. ESCAPE KEY
========================================================= */

function initializeEscapeKey() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {

                return;
            }

            if (
                typeof window.closeAuthModal ===
                "function"
            ) {

                window.closeAuthModal();
            }

            if (
                typeof window.closeAccountModal ===
                "function"
            ) {

                window.closeAccountModal();
            }

            if (
                typeof window.closePremiumModal ===
                "function"
            ) {

                window.closePremiumModal();
            }
        }
    );
}


/* =========================================================
   32. CHEMLAB INITIALIZATION
========================================================= */

function initializeChemLab() {

    try {

        updateTitrationDisplay();

        loadQuizQuestion();

        updateProgressUI();

        initializeAdvancedTitration();

        initializeAppButtons();

        initializeAIKeyboard();

        initializeEscapeKey();

        window.addEventListener(
            "resize",
            handleChartResize
        );

        console.log(
            "ChemLab initialized successfully."
        );

    } catch (error) {

        console.error(
            "ChemLab initialization error:",
            error
        );
    }
}


/* =========================================================
   33. GLOBAL EXPORTS
========================================================= */

window.chemLabState =
    chemLabState;

window.titrationState =
    titrationState;

window.advancedTitration =
    advancedTitration;

window.showPage =
    showPage;

window.openExperiment =
    openExperiment;

window.addTitrant =
    addTitrant;

window.resetExperiment =
    resetExperiment;

window.getExperimentState =
    getExperimentState;

window.askAI =
    askAI;

window.mainAIQuestion =
    mainAIQuestion;

window.askExperimentAI =
    askExperimentAI;

window.loadQuizQuestion =
    loadQuizQuestion;

window.answerQuiz =
    answerQuiz;

window.restartQuiz =
    restartQuiz;

window.addXP =
    addXP;

window.completeExperiment =
    completeExperiment;

window.calculateAdvancedTitration =
    calculateAdvancedTitration;

window.updateAdvancedTitration =
    updateAdvancedTitration;

window.resetAdvancedTitration =
    resetAdvancedTitration;

window.addAdvancedNaOH =
    addAdvancedNaOH;

window.explainAdvancedTitration =
    explainAdvancedTitration;

window.openAdvancedTitration =
    openAdvancedTitration;

window.closeAdvancedTitration =
    closeAdvancedTitration;

window.showPremiumSection =
    showPremiumSection;

window.drawAdvancedTitrationChart =
    drawAdvancedTitrationChart;


/* =========================================================
   34. DOM READY
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChemLab
    );

} else {

    initializeChemLab();
}
