/* =========================================================
   CHEMLAB — MAIN APPLICATION CONTROLLER
   ---------------------------------------------------------
   Responsibilities:
   • Page navigation
   • Basic titration
   • Advanced titration
   • Quiz engine
   • AI chemistry tutor
   • Persistent AI conversations
   • UI synchronization
   • Application initialization

   Other files:
   • auth.js         → authentication + premium
   • progress.js     → persistent XP/progress
   • achievements.js → achievements
   • chemistry-ai   → server-side chemistry engine

   IMPORTANT:
   This file intentionally does NOT duplicate:
   • Supabase authentication logic
   • Premium activation logic
   • Persistent progress logic
   • Achievement logic
========================================================= */

"use strict";

/* =========================================================
   1. CONFIGURATION
========================================================= */

const CHEMLAB_CONFIG = Object.freeze({
    supabaseUrl:
        "https://zscbgeaieiqwknhjxpnt.supabase.co",

    supabasePublishableKey:
        "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy",

    chemistryAIUrl:
        "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/chemistry-ai",

    aiConversationDays: 30,

    defaultExperiment: "titration"
});


/* =========================================================
   2. SUPABASE CLIENT
========================================================= */

function getChemLabSupabase() {
    if (window.supabaseClient) {
        return window.supabaseClient;
    }

    if (
        typeof window.supabase !== "undefined" &&
        typeof window.supabase.createClient === "function"
    ) {
        window.supabaseClient = window.supabase.createClient(
            CHEMLAB_CONFIG.supabaseUrl,
            CHEMLAB_CONFIG.supabasePublishableKey
        );

        return window.supabaseClient;
    }

    console.error("ChemLab: Supabase client is unavailable.");
    return null;
}


/* =========================================================
   3. APPLICATION STATE
========================================================= */

window.chemLabState = window.chemLabState || {
    currentPage: "dashboard",

    currentExperiment: null,

    xp: 0,
    streak: 0,
    level: 1,
    experimentsCompleted: 0,

    aiConversationId: null,

    aiLoading: false,

    quiz: {
        currentQuestion: 0,
        score: 0,
        answered: false,
        recorded: false
    }
};


/* =========================================================
   4. BASIC DOM HELPERS
========================================================= */

function chemLabElement(id) {
    return document.getElementById(id);
}


function setChemLabText(id, value) {
    const element = chemLabElement(id);

    if (element) {
        element.textContent = value;
    }
}


function setChemLabValue(id, value) {
    const element = chemLabElement(id);

    if (element) {
        element.value = value;
    }
}


function showChemLabElement(id) {
    const element = chemLabElement(id);

    if (element) {
        element.hidden = false;
        element.style.display = "";
    }
}


function hideChemLabElement(id) {
    const element = chemLabElement(id);

    if (element) {
        element.hidden = true;
    }
}


/* =========================================================
   5. PAGE NAVIGATION
========================================================= */

function showPage(pageId) {
    if (!pageId) {
        return;
    }

    const pages = document.querySelectorAll(".page");

    pages.forEach((page) => {
        const isActive = page.id === pageId;

        page.classList.toggle("active", isActive);

        if (isActive) {
            page.removeAttribute("hidden");
            page.style.display = "";
        } else {
            page.setAttribute("hidden", "true");
            page.style.display = "none";
        }
    });

    const requestedPage = chemLabElement(pageId);

    if (requestedPage) {
        requestedPage.classList.add("active");
        requestedPage.removeAttribute("hidden");
        requestedPage.style.display = "";
    }

    window.chemLabState.currentPage = pageId;

    document.querySelectorAll("[data-page]").forEach((item) => {
        item.classList.toggle(
            "active",
            item.getAttribute("data-page") === pageId
        );
    });

    if (pageId === "progress") {
        if (typeof window.refreshChemLabProgressUI === "function") {
            window.refreshChemLabProgressUI();
        }

        updateProgressUI();
    }

    if (pageId === "achievements") {
        if (typeof window.refreshChemLabAchievements === "function") {
            window.refreshChemLabAchievements();
        }
    }

    if (pageId === "ai") {
        loadAIConversations();
    }

    if (pageId === "advancedTitrationPage") {
        initializeAdvancedTitration();
        updateAdvancedTitration();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   6. EXPERIMENT NAVIGATION
========================================================= */

function openExperiment(experimentName) {
    const experiment = String(experimentName || "").toLowerCase();

    window.chemLabState.currentExperiment = experiment;

    if (
        experiment === "titration" ||
        experiment === "acid-base-titration" ||
        experiment === "basic-titration"
    ) {
        showPage("lab");
        resetTitration();
        return;
    }

    if (
        experiment === "advanced-titration" ||
        experiment === "advanced"
    ) {
        openAdvancedTitration();
        return;
    }

    showPage("lab");
}


/* =========================================================
   7. BASIC TITRATION STATE
========================================================= */

window.titrationState = window.titrationState || {
    acidConcentration: 0.100,
    acidVolume: 25.0,

    baseConcentration: 0.100,
    baseVolume: 0,

    equivalenceVolume: 25.0,

    indicator: "phenolphthalein",

    completed: false
};


/* =========================================================
   8. BASIC TITRATION CALCULATION
========================================================= */

function calculateTitrationPH() {
    const acidM =
        Number(window.titrationState.acidConcentration) || 0;

    const acidV =
        Number(window.titrationState.acidVolume) || 0;

    const baseM =
        Number(window.titrationState.baseConcentration) || 0;

    const baseV =
        Number(window.titrationState.baseVolume) || 0;

    const acidMoles =
        acidM * (acidV / 1000);

    const baseMoles =
        baseM * (baseV / 1000);

    const totalVolume =
        (acidV + baseV) / 1000;

    if (totalVolume <= 0) {
        return 7;
    }

    const difference =
        acidMoles - baseMoles;

    if (Math.abs(difference) < 1e-12) {
        return 7;
    }

    if (difference > 0) {
        const hPlus =
            difference / totalVolume;

        return -Math.log10(hPlus);
    }

    const ohMinus =
        Math.abs(difference) / totalVolume;

    const pOH =
        -Math.log10(ohMinus);

    return 14 - pOH;
}


/* =========================================================
   9. BASIC TITRATION UI
========================================================= */

function updateTitrationUI() {
    const state = window.titrationState;

    const pH = calculateTitrationPH();

    setChemLabText(
        "titrantVolume",
        `${state.baseVolume.toFixed(1)} mL`
    );

    setChemLabText(
        "phValue",
        pH.toFixed(2)
    );

    setChemLabText(
        "equivalencePoint",
        `${state.equivalenceVolume.toFixed(1)} mL`
    );

    let reactionStatus = "Acidic solution";

    if (Math.abs(pH - 7) < 0.05) {
        reactionStatus = "Equivalence point reached";
    } else if (pH > 7) {
        reactionStatus = "Basic solution";
    }

    setChemLabText(
        "reactionStatus",
        reactionStatus
    );

    let indicatorStatus = "Colourless";

    if (state.indicator === "phenolphthalein") {
        if (pH >= 8.2) {
            indicatorStatus = "Pink";
        }
    }

    if (state.indicator === "methyl-orange") {
        if (pH < 3.1) {
            indicatorStatus = "Red";
        } else if (pH <= 4.4) {
            indicatorStatus = "Orange";
        } else {
            indicatorStatus = "Yellow";
        }
    }

    setChemLabText(
        "indicatorStatus",
        indicatorStatus
    );

    const observation =
        pH < 7
            ? "The solution remains acidic because acid is still in excess."
            : pH > 7
                ? "The solution is basic because the titrant is now in excess."
                : "The acid and base have reacted in stoichiometric amounts.";

    setChemLabText(
        "observation",
        observation
    );

    const stateOutput = chemLabElement("experimentState");

    if (stateOutput) {
        stateOutput.textContent =
            `Acid: ${state.acidVolume.toFixed(1)} mL ` +
            `${state.acidConcentration.toFixed(3)} M | ` +
            `Base added: ${state.baseVolume.toFixed(1)} mL | ` +
            `pH: ${pH.toFixed(2)}`;
    }

    return pH;
}


/* =========================================================
   10. ADD TITRANT
========================================================= */

function addTitrant(amount = 1) {
    const increment = Number(amount);

    if (!Number.isFinite(increment) || increment <= 0) {
        return;
    }

    const state = window.titrationState;

    state.baseVolume += increment;

    if (state.baseVolume > 100) {
        state.baseVolume = 100;
    }

    updateTitrationUI();

    if (
        state.baseVolume >= state.equivalenceVolume &&
        !state.completed
    ) {
        state.completed = true;

        completeExperiment(
            "basic-titration",
            50
        );
    }
}


/* =========================================================
   11. RESET BASIC TITRATION
========================================================= */

function resetTitration() {
    window.titrationState = {
        acidConcentration: 0.100,
        acidVolume: 25.0,

        baseConcentration: 0.100,
        baseVolume: 0,

        equivalenceVolume: 25.0,

        indicator: "phenolphthalein",

        completed: false
    };

    updateTitrationUI();
}


/* =========================================================
   12. EXPERIMENT STATE FOR AI
========================================================= */

function getCurrentAIExperimentState() {
    const experiment =
        window.chemLabState.currentExperiment;

    if (
        experiment === "titration" ||
        experiment === "acid-base-titration"
    ) {
        return {
            type: "acid-base-titration",

            acidConcentration:
                window.titrationState.acidConcentration,

            acidVolume:
                window.titrationState.acidVolume,

            baseConcentration:
                window.titrationState.baseConcentration,

            baseVolume:
                window.titrationState.baseVolume,

            equivalenceVolume:
                window.titrationState.equivalenceVolume,

            pH:
                calculateTitrationPH()
        };
    }

    if (
        window.advancedTitration
    ) {
        return {
            type: "advanced-acid-base-titration",

            acidConcentration:
                window.advancedTitration.acidConcentration,

            acidVolume:
                window.advancedTitration.acidVolume,

            baseConcentration:
                window.advancedTitration.baseConcentration,

            baseVolume:
                window.advancedTitration.baseVolume,

            equivalenceVolume:
                window.advancedTitration.equivalenceVolume,

            pH:
                calculateAdvancedPH()
        };
    }

    return {
        type: experiment || "general-chemistry"
    };
}


/* =========================================================
   13. XP / PROGRESS BRIDGE
   ---------------------------------------------------------
   progress.js owns persistent progress.

   app.js only requests updates through its public API.
========================================================= */

function addXP(amount, reason = "ChemLab activity") {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
        return;
    }

    if (typeof window.awardChemLabXP === "function") {
        window.awardChemLabXP(value, reason);
        return;
    }

    /*
      Safe fallback for situations where progress.js
      has not loaded yet.
    */

    window.chemLabState.xp += value;

    updateProgressUI();
}


function completeExperiment(experimentId, xp = 50) {
    if (
        typeof window.completeChemLabExperiment === "function"
    ) {
        window.completeChemLabExperiment(
            experimentId,
            xp
        );

        return;
    }

    addXP(
        xp,
        `Completed ${experimentId}`
    );

    window.chemLabState.experimentsCompleted += 1;

    updateProgressUI();
}


/* =========================================================
   14. PROGRESS UI
========================================================= */

function updateProgressUI() {
    const state =
        window.chemLabState;

    const progress =
        window.chemLabProgress || {};

    const xp =
        Number.isFinite(Number(progress.xp))
            ? Number(progress.xp)
            : state.xp;

    const streak =
        Number.isFinite(Number(progress.streak))
            ? Number(progress.streak)
            : state.streak;

    const level =
        Number.isFinite(Number(progress.level))
            ? Number(progress.level)
            : state.level;

    const experiments =
        Number.isFinite(
            Number(progress.experimentsCompleted)
        )
            ? Number(progress.experimentsCompleted)
            : state.experimentsCompleted;

    /* Dashboard */

    setChemLabText(
        "dashboardXpValue",
        xp
    );

    setChemLabText(
        "dashboardStreakValue",
        streak
    );

    setChemLabText(
        "dashboardLevelValue",
        level
    );

    setChemLabText(
        "dashboardExperimentsCompleted",
        experiments
    );

    /* Progress page */

    setChemLabText(
        "xpValue",
        xp
    );

    setChemLabText(
        "streakValue",
        streak
    );

    setChemLabText(
        "levelValue",
        level
    );

    setChemLabText(
        "experimentsCompleted",
        experiments
    );

    setChemLabText(
        "progressLevel",
        `Level ${level}`
    );

    setChemLabText(
        "progressXP",
        `${xp} XP`
    );

    const levelBase = 100;

    const currentLevelXP =
        xp % levelBase;

    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                (currentLevelXP / levelBase) * 100
            )
        );

    const progressBar =
        chemLabElement("progressBar");

    if (progressBar) {
        progressBar.style.width =
            `${percentage}%`;
    }

    setChemLabText(
        "progressText",
        `${currentLevelXP} / ${levelBase} XP`
    );
}


/* =========================================================
   15. QUIZ DATABASE
========================================================= */

const CHEMLAB_QUIZ_QUESTIONS = [
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
            "At 25°C, a neutral aqueous solution has a pH of 7."
    },

    {
        question:
            "Which ion is responsible for acidity in aqueous solution?",

        options: [
            "Na⁺",
            "H⁺",
            "Cl⁻",
            "OH⁻"
        ],

        answer: 1,

        explanation:
            "Acidity in aqueous solution is associated with hydrogen ions, H⁺."
    },

    {
        question:
            "What happens at the equivalence point of a strong acid–strong base titration?",

        options: [
            "Only acid remains",
            "Only base remains",
            "The reacting amounts are stoichiometrically equal",
            "No ions are present"
        ],

        answer: 2,

        explanation:
            "At equivalence, the acid and base have reacted in stoichiometric amounts."
    },

    {
        question:
            "Which formula is used to calculate molarity?",

        options: [
            "M = mass × volume",
            "M = moles / volume",
            "M = volume / moles",
            "M = moles × volume"
        ],

        answer: 1,

        explanation:
            "Molarity is the number of moles of solute per litre of solution."
    },

    {
        question:
            "A solution with pH 3 is:",

        options: [
            "Acidic",
            "Neutral",
            "Basic",
            "Always concentrated"
        ],

        answer: 0,

        explanation:
            "A pH below 7 is acidic at 25°C."
    }
];


/* =========================================================
   16. QUIZ STATE
========================================================= */

window.quizState = window.quizState || {
    currentQuestion: 0,
    score: 0,
    answered: false,
    recorded: false
};


/* =========================================================
   17. LOAD QUIZ QUESTION
========================================================= */

function loadQuizQuestion() {
    const question =
        CHEMLAB_QUIZ_QUESTIONS[
            window.quizState.currentQuestion
        ];

    if (!question) {
        finishQuiz();
        return;
    }

    setChemLabText(
        "quizQuestion",
        question.question
    );

    const optionsContainer =
        chemLabElement("quizOptions");

    if (!optionsContainer) {
        return;
    }

    optionsContainer.innerHTML = "";

    question.options.forEach(
        (option, index) => {
            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "quiz-option";

            button.textContent =
                option;

            button.dataset.answer =
                String(index);

            button.addEventListener(
                "click",
                () => answerQuiz(index)
            );

            optionsContainer.appendChild(
                button
            );
        }
    );

    setChemLabText(
        "quizProgress",
        `Question ${
            window.quizState.currentQuestion + 1
        } of ${
            CHEMLAB_QUIZ_QUESTIONS.length
        }`
    );

    setChemLabText(
        "quizScore",
        `Score: ${window.quizState.score}`
    );
}


/* =========================================================
   18. ANSWER QUIZ
========================================================= */

function answerQuiz(selectedAnswer) {
    if (window.quizState.answered) {
        return;
    }

    const question =
        CHEMLAB_QUIZ_QUESTIONS[
            window.quizState.currentQuestion
        ];

    if (!question) {
        return;
    }

    window.quizState.answered = true;

    const buttons =
        document.querySelectorAll(
            ".quiz-option"
        );

    buttons.forEach((button) => {
        const answer =
            Number(button.dataset.answer);

        button.disabled = true;

        if (answer === question.answer) {
            button.classList.add("correct");
        }

        if (
            answer === selectedAnswer &&
            answer !== question.answer
        ) {
            button.classList.add("incorrect");
        }
    });

    if (
        selectedAnswer ===
        question.answer
    ) {
        window.quizState.score += 1;

        addXP(
            10,
            "Correct quiz answer"
        );
    }

    setChemLabText(
        "quizScore",
        `Score: ${window.quizState.score}`
    );

    setChemLabText(
        "quizExplanation",
        question.explanation
    );
}


/* =========================================================
   19. NEXT QUIZ QUESTION
========================================================= */

function nextQuizQuestion() {
    if (!window.quizState.answered) {
        return;
    }

    window.quizState.currentQuestion += 1;

    if (
        window.quizState.currentQuestion >=
        CHEMLAB_QUIZ_QUESTIONS.length
    ) {
        finishQuiz();
        return;
    }

    window.quizState.answered = false;

    loadQuizQuestion();
}


/* =========================================================
   20. FINISH QUIZ
========================================================= */

function finishQuiz() {
    if (window.quizState.recorded) {
        return;
    }

    window.quizState.recorded = true;

    const total =
        CHEMLAB_QUIZ_QUESTIONS.length;

    const score =
        window.quizState.score;

    const percentage =
        total > 0
            ? Math.round(
                (score / total) * 100
            )
            : 0;

    setChemLabText(
        "quizFinalScore",
        `${score} / ${total}`
    );

    setChemLabText(
        "quizPercentage",
        `${percentage}%`
    );

    if (
        typeof window.recordChemLabQuiz ===
        "function"
    ) {
        window.recordChemLabQuiz(
            score,
            total
        );
    }

    showChemLabElement(
        "quizResult"
    );
}


/* =========================================================
   21. RESTART QUIZ
========================================================= */

function restartQuiz() {
    window.quizState = {
        currentQuestion: 0,
        score: 0,
        answered: false,
        recorded: false
    };

    hideChemLabElement(
        "quizResult"
    );

    setChemLabText(
        "quizExplanation",
        ""
    );

    loadQuizQuestion();
}


/* =========================================================
   22. ADVANCED TITRATION STATE
========================================================= */

window.advancedTitration =
    window.advancedTitration || {
        acidConcentration: 0.100,
        acidVolume: 25.0,

        baseConcentration: 0.100,
        baseVolume: 0,

        equivalenceVolume: 25.0,

        maxVolume: 60,

        indicator: "phenolphthalein",

        completed: false,

        initialized: false
    };


/* =========================================================
   23. ADVANCED TITRATION CALCULATION
========================================================= */

function calculateAdvancedTitration(
    baseVolume = window.advancedTitration.baseVolume
) {
    const state =
        window.advancedTitration;

    const acidMoles =
        state.acidConcentration *
        (state.acidVolume / 1000);

    const baseMoles =
        state.baseConcentration *
        (baseVolume / 1000);

    const totalVolume =
        (state.acidVolume + baseVolume) /
        1000;

    const difference =
        acidMoles - baseMoles;

    let pH = 7;

    if (Math.abs(difference) < 1e-12) {
        pH = 7;
    } else if (difference > 0) {
        const hPlus =
            difference / totalVolume;

        pH =
            -Math.log10(hPlus);
    } else {
        const ohMinus =
            Math.abs(difference) /
            totalVolume;

        const pOH =
            -Math.log10(ohMinus);

        pH =
            14 - pOH;
    }

    return {
        pH,
        equivalenceVolume:
            acidMoles /
            state.baseConcentration *
            1000
    };
}


function calculateAdvancedPH() {
    return calculateAdvancedTitration(
        window.advancedTitration.baseVolume
    ).pH;
}


/* =========================================================
   24. ADVANCED INDICATOR STATUS
========================================================= */

function getAdvancedIndicatorStatus(pH) {
    const indicator =
        window.advancedTitration.indicator;

    if (
        indicator ===
        "phenolphthalein"
    ) {
        if (pH >= 8.2) {
            return "Pink";
        }

        return "Colourless";
    }

    if (
        indicator ===
        "methyl-orange"
    ) {
        if (pH < 3.1) {
            return "Red";
        }

        if (pH <= 4.4) {
            return "Orange";
        }

        return "Yellow";
    }

    return "No colour change selected";
}


/* =========================================================
   25. UPDATE ADVANCED TITRATION
========================================================= */

function updateAdvancedTitration() {
    const state =
        window.advancedTitration;

    const result =
        calculateAdvancedTitration(
            state.baseVolume
        );

    state.equivalenceVolume =
        result.equivalenceVolume;

    setChemLabText(
        "advancedPH",
        result.pH.toFixed(2)
    );

    setChemLabText(
        "advancedTitrantVolume",
        `${state.baseVolume.toFixed(1)} mL`
    );

    setChemLabText(
        "advancedEquivalencePoint",
        `${state.equivalenceVolume.toFixed(1)} mL`
    );

    setChemLabText(
        "advancedIndicatorStatus",
        getAdvancedIndicatorStatus(
            result.pH
        )
    );

    const reached =
        state.baseVolume >=
        state.equivalenceVolume;

    setChemLabText(
        "advancedEquivalenceStatus",
        reached
            ? "Reached"
            : "Not reached"
    );

    const observation =
        reached
            ? "The equivalence point has been reached or passed."
            : "The equivalence point has not yet been reached.";

    setChemLabText(
        "advancedObservation",
        observation
    );

    if (
        reached &&
        !state.completed
    ) {
        state.completed = true;

        completeExperiment(
            "advanced-titration",
            75
        );
    }

    drawAdvancedTitrationChart();

    return result;
}


/* =========================================================
   26. ADVANCED TITRATION INPUTS
========================================================= */

function updateAdvancedAcidConcentration(value) {
    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number <= 0
    ) {
        return;
    }

    window.advancedTitration.acidConcentration =
        number;

    updateAdvancedTitration();
}


function updateAdvancedBaseConcentration(value) {
    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number <= 0
    ) {
        return;
    }

    window.advancedTitration.baseConcentration =
        number;

    updateAdvancedTitration();
}


function updateAdvancedBaseVolume(value) {
    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return;
    }

    window.advancedTitration.baseVolume =
        Math.min(
            number,
            window.advancedTitration.maxVolume
        );

    updateAdvancedTitration();
}


/* =========================================================
   27. ADVANCED TITRATION CHART
========================================================= */

function drawAdvancedTitrationChart() {
    const canvas =
        chemLabElement(
            "advancedTitrationChart"
        );

    if (!canvas) {
        return;
    }

    const context =
        canvas.getContext("2d");

    if (!context) {
        return;
    }

    const width =
        canvas.width;

    const height =
        canvas.height;

    context.clearRect(
        0,
        0,
        width,
        height
    );

    const padding = 45;

    const plotWidth =
        width - padding * 2;

    const plotHeight =
        height - padding * 2;

    /* Axes */

    context.beginPath();

    context.moveTo(
        padding,
        padding
    );

    context.lineTo(
        padding,
        height - padding
    );

    context.lineTo(
        width - padding,
        height - padding
    );

    context.stroke();

    const maxVolume =
        window.advancedTitration.maxVolume;

    const points = [];

    for (
        let volume = 0;
        volume <= maxVolume;
        volume += 1
    ) {
        const result =
            calculateAdvancedTitration(
                volume
            );

        const x =
            padding +
            (volume / maxVolume) *
            plotWidth;

        const clampedPH =
            Math.max(
                0,
                Math.min(
                    14,
                    result.pH
                )
            );

        const y =
            height -
            padding -
            (clampedPH / 14) *
            plotHeight;

        points.push({
            x,
            y
        });
    }

    context.beginPath();

    points.forEach(
        (point, index) => {
            if (index === 0) {
                context.moveTo(
                    point.x,
                    point.y
                );
            } else {
                context.lineTo(
                    point.x,
                    point.y
                );
            }
        }
    );

    context.stroke();

    context.font =
        "12px Arial";

    context.fillText(
        "Volume (mL)",
        width / 2 - 30,
        height - 10
    );

    context.save();

    context.translate(
        15,
        height / 2
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

    context.fillText(
        "0",
        padding - 5,
        height - padding + 18
    );

    context.fillText(
        "14",
        15,
        padding + 5
    );
}


/* =========================================================
   28. RESET ADVANCED TITRATION
========================================================= */

function resetAdvancedTitration() {
    window.advancedTitration = {
        acidConcentration: 0.100,
        acidVolume: 25.0,

        baseConcentration: 0.100,
        baseVolume: 0,

        equivalenceVolume: 25.0,

        maxVolume: 60,

        indicator: "phenolphthalein",

        completed: false,

        initialized:
            window.advancedTitration?.initialized ||
            false
    };

    updateAdvancedTitration();
}


/* =========================================================
   29. ADVANCED TITRATION INITIALIZATION
========================================================= */

function initializeAdvancedTitration() {
    const state =
        window.advancedTitration;

    if (state.initialized) {
        updateAdvancedTitration();
        return;
    }

    const volumeSlider =
        chemLabElement(
            "advancedTitrantVolume"
        );

    if (volumeSlider) {
        volumeSlider.addEventListener(
            "input",
            () => {
                updateAdvancedBaseVolume(
                    volumeSlider.value
                );
            }
        );
    }

    const acidInput =
        chemLabElement(
            "advancedAcidConcentration"
        );

    if (acidInput) {
        acidInput.addEventListener(
            "input",
            () => {
                updateAdvancedAcidConcentration(
                    acidInput.value
                );
            }
        );
    }

    const baseInput =
        chemLabElement(
            "advancedBaseConcentration"
        );

    if (baseInput) {
        baseInput.addEventListener(
            "input",
            () => {
                updateAdvancedBaseConcentration(
                    baseInput.value
                );
            }
        );
    }

    state.initialized = true;

    updateAdvancedTitration();
}


/* =========================================================
   30. ADVANCED TITRATION AI EXPLANATION
========================================================= */

async function explainAdvancedTitration() {
    const state =
        getCurrentAIExperimentState();

    const question =
        "Explain what is happening in my current advanced acid-base titration. Use my experiment values, explain the pH, equivalence point, and indicator behaviour step by step.";

    showPage("ai");

    const input =
        chemLabElement("mainAIInput");

    if (input) {
        input.value = question;
    }

    return mainAIQuestion(
        question,
        state
    );
}


/* =========================================================
   31. PREMIUM ACCESS
========================================================= */

async function checkAdvancedPremiumAccess() {
    try {
        if (
            typeof window.getCurrentUser !==
            "function"
        ) {
            return false;
        }

        const user =
            await window.getCurrentUser();

        if (!user) {
            return false;
        }

        if (
            typeof window.getPremiumStatus ===
            "function"
        ) {
            const premium =
                await window.getPremiumStatus();

            return Boolean(
                premium?.isPremium ??
                premium?.is_premium ??
                premium === true
            );
        }

        return false;
    } catch (error) {
        console.error(
            "ChemLab premium check failed:",
            error
        );

        return false;
    }
}


/* =========================================================
   32. OPEN ADVANCED TITRATION
========================================================= */

async function openAdvancedTitration() {
    const isPremium =
        await checkAdvancedPremiumAccess();

    if (!isPremium) {
        if (
            typeof window.openPremiumModal ===
            "function"
        ) {
            window.openPremiumModal();
            return;
        }

        if (
            typeof window.showPremiumSection ===
            "function"
        ) {
            window.showPremiumSection();
            return;
        }

        showPage("premiumSection");
        return;
    }

    window.chemLabState.currentExperiment =
        "advanced-titration";

    showPage(
        "advancedTitrationPage"
    );

    initializeAdvancedTitration();
}


/* =========================================================
   33. CLOSE ADVANCED TITRATION
========================================================= */

function closeAdvancedTitration() {
    showPage("lab");
}


/* =========================================================
   34. PREMIUM SECTION
========================================================= */

function showPremiumSection() {
    const premiumSection =
        chemLabElement(
            "premiumSection"
        );

    if (!premiumSection) {
        return;
    }

    document
        .querySelectorAll(".page")
        .forEach((page) => {
            page.classList.remove("active");
            page.setAttribute(
                "hidden",
                "true"
            );

            page.style.display =
                "none";
        });

    premiumSection.removeAttribute(
        "hidden"
    );

    premiumSection.style.display =
        "";

    premiumSection.classList.add(
        "active"
    );

    window.chemLabState.currentPage =
        "premiumSection";
}


/* =========================================================
   35. AI CHAT HELPERS
========================================================= */

function getAIInput() {
    return chemLabElement(
        "mainAIInput"
    );
}


function getAIAnswerContainer() {
    return chemLabElement(
        "mainAIAnswer"
    );
}


function setAIStatus(message) {
    setChemLabText(
        "aiStatus",
        message || ""
    );
}


function createAIMessageElement(
    role,
    content
) {
    const wrapper =
        document.createElement("div");

    wrapper.className =
        `ai-message ${role}`;

    const label =
        document.createElement("strong");

    label.textContent =
        role === "user"
            ? "You"
            : "ChemLab AI";

    const text =
        document.createElement("div");

    text.textContent =
        content;

    wrapper.appendChild(label);
    wrapper.appendChild(text);

    return wrapper;
}


/* =========================================================
   36. AI CONVERSATION TITLE
========================================================= */

function createConversationTitle(
    question
) {
    const clean =
        String(question || "")
            .replace(/\s+/g, " ")
            .trim();

    if (!clean) {
        return "Chemistry Chat";
    }

    return clean.length > 50
        ? `${clean.substring(0, 50)}…`
        : clean;
}


/* =========================================================
   37. AI CONVERSATION EXPIRY
========================================================= */

function getAIExpiryDate() {
    const date =
        new Date();

    date.setDate(
        date.getDate() +
        CHEMLAB_CONFIG.aiConversationDays
    );

    return date.toISOString();
}


/* =========================================================
   38. CREATE AI CONVERSATION
========================================================= */

async function createAIConversation(
    firstQuestion
) {
    const client =
        getChemLabSupabase();

    if (!client) {
        throw new Error(
            "Supabase is unavailable."
        );
    }

    const {
        data: {
            user
        }
    } =
        await client.auth.getUser();

    if (!user) {
        throw new Error(
            "Please sign in to save AI conversations."
        );
    }

    const {
        data,
        error
    } =
        await client
            .from("ai_conversations")
            .insert({
                user_id: user.id,

                title:
                    createConversationTitle(
                        firstQuestion
                    ),

                expires_at:
                    getAIExpiryDate()
            })
            .select()
            .single();

    if (error) {
        throw error;
    }

    window.chemLabState.aiConversationId =
        data.id;

    return data;
}


/* =========================================================
   39. SAVE AI MESSAGE
========================================================= */

async function saveAIMessage(
    conversationId,
    role,
    content
) {
    const client =
        getChemLabSupabase();

    if (!client) {
        throw new Error(
            "Supabase is unavailable."
        );
    }

    const {
        data: {
            user
        }
    } =
        await client.auth.getUser();

    if (!user) {
        throw new Error(
            "Please sign in to save conversations."
        );
    }

    const {
        data,
        error
    } =
        await client
            .from("ai_messages")
            .insert({
                conversation_id:
                    conversationId,

                user_id:
                    user.id,

                role,

                content
            })
            .select()
            .single();

    if (error) {
        throw error;
    }

    return data;
}


/* =========================================================
   40. LOAD AI CONVERSATIONS
========================================================= */

async function loadAIConversations() {
    const client =
        getChemLabSupabase();

    if (!client) {
        return [];
    }

    try {
        const {
            data: {
                user
            }
        } =
            await client.auth.getUser();

        if (!user) {
            renderAIConversationHistory(
                []
            );

            return [];
        }

        const {
            data,
            error
        } =
            await client
                .from("ai_conversations")
                .select(
                    "id,title,created_at,updated_at,expires_at"
                )
                .eq(
                    "user_id",
                    user.id
                )
                .order(
                    "updated_at",
                    {
                        ascending: false
                    }
                );

        if (error) {
            throw error;
        }

        renderAIConversationHistory(
            data || []
        );

        return data || [];
    } catch (error) {
        console.error(
            "Unable to load AI conversations:",
            error
        );

        renderAIConversationHistory(
            []
        );

        return [];
    }
}


/* =========================================================
   41. RENDER AI CONVERSATION HISTORY
========================================================= */

function renderAIConversationHistory(
    conversations
) {
    const container =
        chemLabElement(
            "aiConversationHistory"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !Array.isArray(conversations) ||
        conversations.length === 0
    ) {
        const empty =
            document.createElement("div");

        empty.className =
            "ai-history-empty";

        empty.textContent =
            "No previous conversations yet.";

        container.appendChild(
            empty
        );

        return;
    }

    conversations.forEach(
        (conversation) => {
            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "ai-history-item";

            button.dataset.conversationId =
                conversation.id;

            button.textContent =
                conversation.title ||
                "Chemistry Chat";

            if (
                conversation.id ===
                window.chemLabState.aiConversationId
            ) {
                button.classList.add(
                    "active"
                );
            }

            container.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   42. LOAD ONE AI CONVERSATION
========================================================= */

async function loadAIConversation(
    conversationId
) {
    if (!conversationId) {
        return;
    }

    const client =
        getChemLabSupabase();

    if (!client) {
        return;
    }

    try {
        const {
            data: {
                user
            }
        } =
            await client.auth.getUser();

        if (!user) {
            return;
        }

        const {
            data: conversation,
            error:
                conversationError
        } =
            await client
                .from("ai_conversations")
                .select("*")
                .eq(
                    "id",
                    conversationId
                )
                .eq(
                    "user_id",
                    user.id
                )
                .single();

        if (conversationError) {
            throw conversationError;
        }

        const {
            data: messages,
            error:
                messageError
        } =
            await client
                .from("ai_messages")
                .select(
                    "id,role,content,created_at"
                )
                .eq(
                    "conversation_id",
                    conversation.id
                )
                .eq(
                    "user_id",
                    user.id
                )
                .order(
                    "created_at",
                    {
                        ascending: true
                    }
                );

        if (messageError) {
            throw messageError;
        }

        window.chemLabState.aiConversationId =
            conversation.id;

        renderLoadedAIConversation(
            messages || []
        );

        await loadAIConversations();
    } catch (error) {
        console.error(
            "Unable to load AI conversation:",
            error
        );

        setAIStatus(
            "Unable to load this conversation."
        );
    }
}


/* =========================================================
   43. RENDER LOADED AI CONVERSATION
========================================================= */

function renderLoadedAIConversation(
    messages
) {
    const container =
        getAIAnswerContainer();

    if (!container) {
        return;
    }

    container.innerHTML = "";

    messages.forEach(
        (message) => {
            container.appendChild(
                createAIMessageElement(
                    message.role,
                    message.content
                )
            );
        }
    );

    container.scrollTop =
        container.scrollHeight;
}


/* =========================================================
   44. START NEW AI CHAT
========================================================= */

function startNewAIChat() {
    window.chemLabState.aiConversationId =
        null;

    window.chemLabState.aiLoading =
        false;

    const container =
        getAIAnswerContainer();

    if (container) {
        container.innerHTML = "";

        const welcome =
            createAIMessageElement(
                "assistant",
                "Hello! I’m ChemLab AI. Ask me anything about chemistry, your experiment, calculations, or results."
            );

        container.appendChild(
            welcome
        );
    }

    const input =
        getAIInput();

    if (input) {
        input.value = "";
        input.focus();
    }

    setAIStatus("");
}


/* =========================================================
   45. CLEAR AI CHAT
   ---------------------------------------------------------
   This does NOT delete the saved conversation.
   It simply starts a new conversation.
========================================================= */

function clearAIChat() {
    startNewAIChat();
}


/* =========================================================
   46. PERSIST AI EXCHANGE
========================================================= */

async function persistAIExchange(
    question,
    answer
) {
    let conversationId =
        window.chemLabState.aiConversationId;

    if (!conversationId) {
        const conversation =
            await createAIConversation(
                question
            );

        conversationId =
            conversation.id;
    }

    await saveAIMessage(
        conversationId,
        "user",
        question
    );

    await saveAIMessage(
        conversationId,
        "assistant",
        answer
    );

    await loadAIConversations();

    return conversationId;
}


/* =========================================================
   47. CALL CHEMLAB AI
========================================================= */

async function askAI(
    question,
    experimentState = null
) {
    const cleanQuestion =
        String(question || "")
            .trim();

    if (!cleanQuestion) {
        throw new Error(
            "Please enter a chemistry question."
        );
    }

    const client =
        getChemLabSupabase();

    let accessToken = null;

    if (client) {
        try {
            const {
                data: {
                    session
                }
            } =
                await client.auth.getSession();

            accessToken =
                session?.access_token ||
                null;
        } catch (error) {
            console.warn(
                "ChemLab: could not read session.",
                error
            );
        }
    }

    const response =
        await fetch(
            CHEMLAB_CONFIG.chemistryAIUrl,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    apikey:
                        CHEMLAB_CONFIG
                            .supabasePublishableKey,

                    ...(accessToken
                        ? {
                            Authorization:
                                `Bearer ${accessToken}`
                        }
                        : {})
                },

                body: JSON.stringify({
                    question:
                        cleanQuestion,

                    experiment:
                        window.chemLabState
                            .currentExperiment,

                    experimentState:
                        experimentState ||
                        getCurrentAIExperimentState(),

                    source:
                        "ChemLab",

                    student_mode:
                        true
                })
            }
        );

    let payload = null;

    try {
        payload =
            await response.json();
    } catch {
        payload = null;
    }

    if (!response.ok) {
        throw new Error(
            payload?.error ||
            "The AI service returned an error."
        );
    }

    if (
        !payload ||
        typeof payload.answer !==
        "string"
    ) {
        throw new Error(
            "The AI service returned an invalid response."
        );
    }

    return payload.answer;
}


/* =========================================================
   48. MAIN AI QUESTION
========================================================= */

async function mainAIQuestion(
    providedQuestion = null,
    providedExperimentState = null
) {
    if (
        window.chemLabState.aiLoading
    ) {
        return;
    }

    const input =
        getAIInput();

    const answerContainer =
        getAIAnswerContainer();

    const question =
        String(
            providedQuestion ??
            input?.value ??
            ""
        ).trim();

    if (!question) {
        setAIStatus(
            "Enter a chemistry question first."
        );

        return;
    }

    /* Persistent history requires login. */

    let user = null;

    try {
        if (
            typeof window.getCurrentUser ===
            "function"
        ) {
            user =
                await window.getCurrentUser();
        } else {
            const client =
                getChemLabSupabase();

            if (client) {
                const {
                    data: {
                        user: currentUser
                    }
                } =
                    await client.auth.getUser();

                user =
                    currentUser;
            }
        }
    } catch (error) {
        console.error(
            "ChemLab: authentication check failed.",
            error
        );
    }

    if (!user) {
        setAIStatus(
            "Please sign in to use persistent AI conversations."
        );

        if (
            typeof window.openAuthModal ===
            "function"
        ) {
            window.openAuthModal();
        }

        return;
    }

    window.chemLabState.aiLoading =
        true;

    setAIStatus(
        "ChemLab AI is thinking..."
    );

    const sendButton =
        chemLabElement(
            "askAIButton"
        );

    if (sendButton) {
        sendButton.disabled = true;
    }

    if (answerContainer) {
        answerContainer.appendChild(
            createAIMessageElement(
                "user",
                question
            )
        );

        answerContainer.scrollTop =
            answerContainer.scrollHeight;
    }

    if (input) {
        input.value = "";
    }

    try {
        const answer =
            await askAI(
                question,
                providedExperimentState ||
                getCurrentAIExperimentState()
            );

        if (answerContainer) {
            answerContainer.appendChild(
                createAIMessageElement(
                    "assistant",
                    answer
                )
            );

            answerContainer.scrollTop =
                answerContainer.scrollHeight;
        }

        await persistAIExchange(
            question,
            answer
        );

        setAIStatus(
            "Conversation saved."
        );
    } catch (error) {
        console.error(
            "ChemLab AI error:",
            error
        );

        if (answerContainer) {
            answerContainer.appendChild(
                createAIMessageElement(
                    "assistant",
                    `I couldn't complete that request. ${error.message || "Please try again."}`
                )
            );
        }

        setAIStatus(
            "AI request failed."
        );
    } finally {
        window.chemLabState.aiLoading =
            false;

        if (sendButton) {
            sendButton.disabled =
                false;
        }
    }
}


/* =========================================================
   49. EXPERIMENT AI QUESTION
========================================================= */

async function askExperimentAI() {
    const state =
        getCurrentAIExperimentState();

    const question =
        "Explain my current chemistry experiment. Tell me what is happening, use my current values, and explain the result clearly.";

    showPage("ai");

    const input =
        getAIInput();

    if (input) {
        input.value =
            question;
    }

    return mainAIQuestion(
        question,
        state
    );
}


/* =========================================================
   50. NEW AI CHAT BUTTON
========================================================= */

function initializeAINewChatButton() {
    const button =
        chemLabElement(
            "newAIChatButton"
        );

    if (
        !button ||
        button.dataset.bound === "true"
    ) {
        return;
    }

    button.dataset.bound =
        "true";

    button.addEventListener(
        "click",
        startNewAIChat
    );
}


/* =========================================================
   51. AI HISTORY CLICK HANDLER
========================================================= */

function initializeAIHistory() {
    const history =
        chemLabElement(
            "aiConversationHistory"
        );

    if (
        !history ||
        history.dataset.bound === "true"
    ) {
        return;
    }

    history.dataset.bound =
        "true";

    history.addEventListener(
        "click",
        (event) => {
            const button =
                event.target.closest(
                    "[data-conversation-id]"
                );

            if (!button) {
                return;
            }

            loadAIConversation(
                button.dataset
                    .conversationId
            );
        }
    );
}


/* =========================================================
   52. AI KEYBOARD HANDLER
========================================================= */

function initializeAIKeyboard() {
    const input =
        getAIInput();

    if (
        !input ||
        input.dataset.keyboardBound ===
            "true"
    ) {
        return;
    }

    input.dataset.keyboardBound =
        "true";

    input.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {
                event.preventDefault();

                mainAIQuestion();
            }
        }
    );
}


/* =========================================================
   53. AI AUTH SESSION INITIALIZATION
========================================================= */

async function initializeAIHistoryAfterAuth() {
    const client =
        getChemLabSupabase();

    if (!client) {
        return;
    }

    try {
        const {
            data: {
                session
            }
        } =
            await client.auth.getSession();

        if (session?.user) {
            await loadAIConversations();
        } else {
            renderAIConversationHistory(
                []
            );
        }
    } catch (error) {
        console.error(
            "ChemLab AI history initialization failed:",
            error
        );
    }
}


/* =========================================================
   54. AUTH STATE LISTENER
========================================================= */

function initializeChemLabAuthListener() {
    const client =
        getChemLabSupabase();

    if (
        !client ||
        client.__chemLabAuthListenerBound
    ) {
        return;
    }

    client.__chemLabAuthListenerBound =
        true;

    client.auth.onAuthStateChange(
        async (event) => {
            if (
                event === "SIGNED_IN" ||
                event === "TOKEN_REFRESHED" ||
                event === "USER_UPDATED"
            ) {
                await loadAIConversations();
            }

            if (
                event === "SIGNED_OUT"
            ) {
                window.chemLabState
                    .aiConversationId =
                    null;

                renderAIConversationHistory(
                    []
                );

                startNewAIChat();
            }
        }
    );
}


/* =========================================================
   55. GLOBAL BUTTON INITIALIZATION
========================================================= */

function initializeAppButtons() {
    const resetButton =
        chemLabElement(
            "resetExperimentButton"
        );

    if (
        resetButton &&
        resetButton.dataset.bound !==
            "true"
    ) {
        resetButton.dataset.bound =
            "true";

        resetButton.addEventListener(
            "click",
            resetTitration
        );
    }

    const advancedReset =
        chemLabElement(
            "advancedResetButton"
        );

    if (
        advancedReset &&
        advancedReset.dataset.bound !==
            "true"
    ) {
        advancedReset.dataset.bound =
            "true";

        advancedReset.addEventListener(
            "click",
            resetAdvancedTitration
        );
    }

    const askAIButton =
        chemLabElement(
            "askAIButton"
        );

    if (
        askAIButton &&
        askAIButton.dataset.bound !==
            "true"
    ) {
        askAIButton.dataset.bound =
            "true";

        askAIButton.addEventListener(
            "click",
            () => mainAIQuestion()
        );
    }

    const nextQuizButton =
        chemLabElement(
            "nextQuizButton"
        );

    if (
        nextQuizButton &&
        nextQuizButton.dataset.bound !==
            "true"
    ) {
        nextQuizButton.dataset.bound =
            "true";

        nextQuizButton.addEventListener(
            "click",
            nextQuizQuestion
        );
    }

    const restartQuizButton =
        chemLabElement(
            "restartQuizButton"
        );

    if (
        restartQuizButton &&
        restartQuizButton.dataset.bound !==
            "true"
    ) {
        restartQuizButton.dataset.bound =
            "true";

        restartQuizButton.addEventListener(
            "click",
            restartQuiz
        );
    }
}


/* =========================================================
   56. ESCAPE KEY
========================================================= */

function initializeEscapeKey() {
    if (
        window.__chemLabEscapeBound
    ) {
        return;
    }

    window.__chemLabEscapeBound =
        true;

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key !== "Escape"
            ) {
                return;
            }

            const modal =
                document.querySelector(
                    ".modal.active, .modal[style*='display: flex']"
                );

            if (modal) {
                modal.classList.remove(
                    "active"
                );

                modal.style.display =
                    "none";
            }
        }
    );
}


/* =========================================================
   57. RESIZE HANDLER
========================================================= */

function initializeResizeHandler() {
    if (
        window.__chemLabResizeBound
    ) {
        return;
    }

    window.__chemLabResizeBound =
        true;

    window.addEventListener(
        "resize",
        () => {
            if (
                window.chemLabState
                    .currentPage ===
                "advancedTitrationPage"
            ) {
                drawAdvancedTitrationChart();
            }
        }
    );
}


/* =========================================================
   58. APPLICATION INITIALIZATION
========================================================= */

async function initializeChemLab() {
    if (
        window.__chemLabInitialized
    ) {
        return;
    }

    window.__chemLabInitialized =
        true;

    /* Initial application state */

    window.chemLabState.currentPage =
        "dashboard";

    window.chemLabState
        .currentExperiment =
        CHEMLAB_CONFIG
            .defaultExperiment;

    /* Initialize UI systems */

    updateProgressUI();

    updateTitrationUI();

    initializeAdvancedTitration();

    loadQuizQuestion();

    initializeAppButtons();

    initializeAINewChatButton();

    initializeAIHistory();

    initializeAIKeyboard();

    initializeEscapeKey();

    initializeResizeHandler();

    initializeChemLabAuthListener();

    /* AI history loads after session is checked. */

    await initializeAIHistoryAfterAuth();

    /*
      Only force dashboard if no other page
      is currently active.
    */

    const activePage =
        document.querySelector(
            ".page.active"
        );

    if (!activePage) {
        showPage("dashboard");
    }
}


/* =========================================================
   59. GLOBAL EXPORTS
   ---------------------------------------------------------
   These are intentional exports for:
   • existing HTML onclick handlers
   • auth.js integration
   • progress.js integration
========================================================= */

window.showPage =
    showPage;

window.openExperiment =
    openExperiment;

window.addTitrant =
    addTitrant;

window.resetTitration =
    resetTitration;

window.calculateTitrationPH =
    calculateTitrationPH;

window.updateTitrationUI =
    updateTitrationUI;

window.addXP =
    addXP;

window.completeExperiment =
    completeExperiment;

window.updateProgressUI =
    updateProgressUI;

window.loadQuizQuestion =
    loadQuizQuestion;

window.answerQuiz =
    answerQuiz;

window.nextQuizQuestion =
    nextQuizQuestion;

window.finishQuiz =
    finishQuiz;

window.restartQuiz =
    restartQuiz;

window.calculateAdvancedTitration =
    calculateAdvancedTitration;

window.calculateAdvancedPH =
    calculateAdvancedPH;

window.updateAdvancedTitration =
    updateAdvancedTitration;

window.updateAdvancedAcidConcentration =
    updateAdvancedAcidConcentration;

window.updateAdvancedBaseConcentration =
    updateAdvancedBaseConcentration;

window.updateAdvancedBaseVolume =
    updateAdvancedBaseVolume;

window.resetAdvancedTitration =
    resetAdvancedTitration;

window.initializeAdvancedTitration =
    initializeAdvancedTitration;

window.openAdvancedTitration =
    openAdvancedTitration;

window.closeAdvancedTitration =
    closeAdvancedTitration;

window.explainAdvancedTitration =
    explainAdvancedTitration;

window.showPremiumSection =
    showPremiumSection;

window.checkAdvancedPremiumAccess =
    checkAdvancedPremiumAccess;

window.askAI =
    askAI;

window.mainAIQuestion =
    mainAIQuestion;

window.askExperimentAI =
    askExperimentAI;

window.startNewAIChat =
    startNewAIChat;

window.clearAIChat =
    clearAIChat;

window.loadAIConversations =
    loadAIConversations;

window.loadAIConversation =
    loadAIConversation;

window.renderAIConversationHistory =
    renderAIConversationHistory;

window.getCurrentAIExperimentState =
    getCurrentAIExperimentState;


/* =========================================================
   60. START APPLICATION
========================================================= */

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeChemLab,
        {
            once: true
        }
    );
} else {
    initializeChemLab();
}
