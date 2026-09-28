/* =========================================================
   CHEMLAB
   PROFESSIONAL APPLICATION CONTROLLER
   Version 5.1
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const CONFIG = {
        supabaseUrl:
            "https://zscbgeaieiqwknhjxpnt.supabase.co",

        supabaseKey:
            "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy",

        chemistryAIUrl:
            "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/chemistry-ai",

        aiConversationDays: 30,

        defaultPage: "home",

        defaultExperiment: "titration"
    };


    /* =====================================================
       SUPABASE
       ===================================================== */

    function getSupabase() {

        if (window.supabaseClient) {
            return window.supabaseClient;
        }

        if (
            typeof window.supabase === "undefined" ||
            typeof window.supabase.createClient !== "function"
        ) {
            console.error(
                "ChemLab: Supabase library is not available."
            );

            return null;
        }

        try {

            window.supabaseClient =
                window.supabase.createClient(
                    CONFIG.supabaseUrl,
                    CONFIG.supabaseKey
                );

            return window.supabaseClient;

        } catch (error) {

            console.error(
                "ChemLab: Could not create Supabase client.",
                error
            );

            return null;
        }
    }


    /* =====================================================
       STATE
       ===================================================== */

    const state = {

        currentPage:
            CONFIG.defaultPage,

        currentExperiment:
            null,

        aiLoading:
            false,

        aiConversationId:
            null,

        aiMessages:
            [],

        aiConversations:
            [],

        quiz: {

            currentQuestion:
                0,

            score:
                0,

            answered:
                false,

            finished:
                false
        },

        titration: {

            acidConcentration:
                0.100,

            acidVolume:
                25.00,

            baseConcentration:
                0.100,

            baseVolume:
                0,

            equivalenceVolume:
                25.00,

            indicator:
                "phenolphthalein",

            completed:
                false
        },

        advancedTitration: {

            acidConcentration:
                0.100,

            acidVolume:
                25.00,

            baseConcentration:
                0.100,

            baseVolume:
                0,

            equivalenceVolume:
                25.00,

            maxVolume:
                60,

            indicator:
                "phenolphthalein",

            completed:
                false,

            initialized:
                false
        }
    };


    window.chemLabState =
        state;


    /* =====================================================
       HELPERS
       ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }


    function setText(
        id,
        value
    ) {

        const element =
            $(id);

        if (element) {
            element.textContent =
                value;
        }
    }


    function clamp(
        value,
        min,
        max
    ) {

        const number =
            Number(value);

        if (!Number.isFinite(number)) {
            return min;
        }

        return Math.min(
            Math.max(
                number,
                min
            ),
            max
        );
    }


    function formatNumber(
        value,
        decimals = 2
    ) {

        const number =
            Number(value);

        if (!Number.isFinite(number)) {
            return "0";
        }

        return number.toFixed(
            decimals
        );
    }


    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    function notify(
        message,
        type = "info"
    ) {

        if (
            typeof window.showNotification ===
            "function"
        ) {

            window.showNotification(
                message,
                type
            );

            return;
        }

        const container =
            $("notificationContainer");

        if (!container) {
            return;
        }

        const notification =
            document.createElement(
                "div"
            );

        notification.className =
            `notification notification-${type}`;

        notification.innerHTML = `
            <span class="notification-message">
                ${escapeHTML(message)}
            </span>

            <button
                type="button"
                aria-label="Close notification"
            >
                ×
            </button>
        `;

        container.appendChild(
            notification
        );

        const closeButton =
            notification.querySelector(
                "button"
            );

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                () => notification.remove()
            );
        }

        setTimeout(
            () => {

                if (
                    notification.isConnected
                ) {
                    notification.remove();
                }

            },
            5000
        );
    }


    window.chemLabNotify =
        notify;


    /* =====================================================
       PAGE NAVIGATION
       ===================================================== */

    function showPage(
        pageId
    ) {

        if (!pageId) {
            return;
        }

        const pages =
            document.querySelectorAll(
                ".page"
            );

        if (!pages.length) {
            return;
        }

        pages.forEach(
            page => {

                page.classList.toggle(
                    "active",
                    page.id === pageId
                );
            }
        );


        const navButtons =
            document.querySelectorAll(
                "[data-page]"
            );

        navButtons.forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page ===
                    pageId
                );
            }
        );


        state.currentPage =
            pageId;


        if (
            pageId ===
            "dashboard"
        ) {

            updateProgressUI();
        }


        if (
            pageId ===
            "progress"
        ) {

            updateProgressUI();

            if (
                typeof window.refreshChemLabAchievements ===
                "function"
            ) {

                window.refreshChemLabAchievements();
            }
        }


        if (
            pageId ===
            "ai"
        ) {

            loadAIConversations();
        }


        if (
            pageId ===
            "quiz"
        ) {

            if (
                !state.quiz.finished
            ) {
                loadQuizQuestion();
            }
        }


        if (
            pageId ===
            "advancedTitrationPage"
        ) {

            initializeAdvancedTitration();
        }


        closeMobileNavigation();


        window.scrollTo({
            top:
                0,
            behavior:
                "smooth"
        });
    }


    window.showPage =
        showPage;


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    function openMobileNavigation() {

        const navigation =
            $("mobileNavigation");

        if (!navigation) {
            return;
        }

        navigation.classList.add(
            "active"
        );

        document.body.classList.add(
            "mobile-menu-open"
        );
    }


    function closeMobileNavigation() {

        const navigation =
            $("mobileNavigation");

        if (navigation) {

            navigation.classList.remove(
                "active"
            );
        }

        document.body.classList.remove(
            "mobile-menu-open"
        );
    }


    window.openMobileNavigation =
        openMobileNavigation;

    window.closeMobileNavigation =
        closeMobileNavigation;


    /* =====================================================
       BASIC TITRATION
       ===================================================== */

    function calculateTitrationPH() {

        const experiment =
            state.titration;

        const acidMoles =
            experiment.acidConcentration *
            experiment.acidVolume /
            1000;

        const baseMoles =
            experiment.baseConcentration *
            experiment.baseVolume /
            1000;

        const totalVolume =
            (
                experiment.acidVolume +
                experiment.baseVolume
            ) / 1000;


        if (
            totalVolume <= 0
        ) {
            return 7;
        }


        const difference =
            acidMoles -
            baseMoles;


        if (
            Math.abs(difference) <
            1e-12
        ) {
            return 7;
        }


        if (
            difference > 0
        ) {

            const hydrogen =
                difference /
                totalVolume;

            return clamp(
                -Math.log10(
                    hydrogen
                ),
                0,
                14
            );
        }


        const hydroxide =
            Math.abs(
                difference
            ) /
            totalVolume;

        const pOH =
            -Math.log10(
                hydroxide
            );

        return clamp(
            14 - pOH,
            0,
            14
        );
    }


    function getTitrationStatus(
        pH
    ) {

        if (
            Math.abs(
                pH - 7
            ) < 0.01
        ) {

            return "Neutral";
        }

        if (
            pH < 7
        ) {

            return "Acidic";
        }

        return "Basic";
    }


    function updateTitrationUI() {

        const experiment =
            state.titration;

        const pH =
            calculateTitrationPH();

        const status =
            getTitrationStatus(
                pH
            );

        const atEquivalence =
            Math.abs(
                experiment.baseVolume -
                experiment.equivalenceVolume
            ) < 0.001;


        setText(
            "titrantVolume",
            `${formatNumber(
                experiment.baseVolume,
                2
            )} mL`
        );


        setText(
            "phValue",
            formatNumber(
                pH,
                2
            )
        );


        setText(
            "indicatorStatus",
            atEquivalence
                ? "Endpoint reached"
                : status
        );


        setText(
            "endpointMessage",
            atEquivalence
                ? "Equivalence point reached."
                : "Continue adding titrant."
        );


        setText(
            "titrationObservation",
            atEquivalence
                ? "The acid and base have reacted in stoichiometric amounts."
                : `The solution is currently ${status.toLowerCase()}.`
        );


        const solution =
            $("solution");

        if (solution) {

            solution.classList.remove(
                "acidic",
                "neutral",
                "basic",
                "endpoint"
            );

            solution.classList.add(
                atEquivalence
                    ? "endpoint"
                    : status.toLowerCase()
            );
        }


        const burette =
            $("buretteLiquid");

        if (burette) {

            burette.style.height =
                `${clamp(
                    experiment.baseVolume,
                    0,
                    100
                )}%`;
        }
    }


    function addTitrant(
        amount = 1
    ) {

        const experiment =
            state.titration;

        if (
            experiment.completed
        ) {

            notify(
                "This experiment is complete. Reset it to try again.",
                "info"
            );

            return;
        }


        experiment.baseVolume =
            clamp(
                experiment.baseVolume +
                Number(amount),
                0,
                100
            );


        updateTitrationUI();


        const reachedEndpoint =
            Math.abs(
                experiment.baseVolume -
                experiment.equivalenceVolume
            ) < 0.001;


        if (
            reachedEndpoint &&
            !experiment.completed
        ) {

            experiment.completed =
                true;

            completeExperiment(
                "titration"
            );

            notify(
                "Titration complete! You reached the equivalence point.",
                "success"
            );
        }
    }


    function resetTitration() {

        state.titration.baseVolume =
            0;

        state.titration.completed =
            false;

        updateTitrationUI();

        notify(
            "Titration experiment reset.",
            "info"
        );
    }


    function openExperiment(
        experimentId
    ) {

        if (
            experimentId ===
            "titration"
        ) {

            state.currentExperiment =
                "titration";

            showPage(
                "titration"
            );

            updateTitrationUI();

            return;
        }


        if (
            experimentId ===
            "advancedTitration"
        ) {

            openAdvancedTitration();

            return;
        }


        notify(
            "This experiment is coming soon.",
            "info"
        );
    }


    window.openExperiment =
        openExperiment;

    window.addTitrant =
        addTitrant;

    window.resetTitration =
        resetTitration;

    window.calculateTitrationPH =
        calculateTitrationPH;


    /* =====================================================
       ADVANCED TITRATION
       ===================================================== */

    function recalculateAdvancedEquivalence() {

        const experiment =
            state.advancedTitration;

        if (
            experiment.baseConcentration <= 0
        ) {

            experiment.equivalenceVolume =
                experiment.maxVolume;

            return;
        }


        experiment.equivalenceVolume =
            (
                experiment.acidConcentration *
                experiment.acidVolume
            ) /
            experiment.baseConcentration;
    }


    function calculateAdvancedPH() {

        const experiment =
            state.advancedTitration;

        const acidMoles =
            experiment.acidConcentration *
            experiment.acidVolume /
            1000;

        const baseMoles =
            experiment.baseConcentration *
            experiment.baseVolume /
            1000;

        const totalVolume =
            (
                experiment.acidVolume +
                experiment.baseVolume
            ) / 1000;


        if (
            totalVolume <= 0
        ) {
            return 7;
        }


        const difference =
            acidMoles -
            baseMoles;


        if (
            Math.abs(difference) <
            1e-12
        ) {
            return 7;
        }


        if (
            difference > 0
        ) {

            return clamp(
                -Math.log10(
                    difference /
                    totalVolume
                ),
                0,
                14
            );
        }


        const hydroxide =
            Math.abs(
                difference
            ) /
            totalVolume;

        return clamp(
            14 -
            (
                -Math.log10(
                    hydroxide
                )
            ),
            0,
            14
        );
    }


    function updateAdvancedTitrationUI() {

        const experiment =
            state.advancedTitration;

        recalculateAdvancedEquivalence();


        const pH =
            calculateAdvancedPH();

        const acidMoles =
            experiment.acidConcentration *
            experiment.acidVolume /
            1000;

        const baseMoles =
            experiment.baseConcentration *
            experiment.baseVolume /
            1000;

        const totalVolume =
            (
                experiment.acidVolume +
                experiment.baseVolume
            ) / 1000;

        const difference =
            acidMoles -
            baseMoles;


        let hPlus;
        let ohMinus;


        if (
            difference > 0
        ) {

            hPlus =
                difference /
                totalVolume;

            ohMinus =
                1e-14 /
                hPlus;

        } else if (
            difference < 0
        ) {

            ohMinus =
                Math.abs(
                    difference
                ) /
                totalVolume;

            hPlus =
                1e-14 /
                ohMinus;

        } else {

            hPlus =
                1e-7;

            ohMinus =
                1e-7;
        }


        const atEquivalence =
            Math.abs(
                experiment.baseVolume -
                experiment.equivalenceVolume
            ) < 0.05;


        const progress =
            experiment.equivalenceVolume > 0
                ? clamp(
                    (
                        experiment.baseVolume /
                        experiment.equivalenceVolume
                    ) * 100,
                    0,
                    100
                )
                : 0;


        setText(
            "advancedNaohVolume",
            `${formatNumber(
                experiment.baseVolume,
                2
            )} mL`
        );


        setText(
            "advancedPhValue",
            formatNumber(
                pH,
                3
            )
        );


        setText(
            "advancedHplus",
            hPlus.toExponential(3)
        );


        setText(
            "advancedOhminus",
            ohMinus.toExponential(3)
        );


        setText(
            "advancedEquivalence",
            `${formatNumber(
                experiment.equivalenceVolume,
                2
            )} mL`
        );


        setText(
            "advancedEquivalenceStatus",
            atEquivalence
                ? "Equivalence point reached"
                : experiment.baseVolume <
                    experiment.equivalenceVolume
                    ? "Before equivalence"
                    : "After equivalence"
        );


        setText(
            "advancedHplusConcentration",
            hPlus.toExponential(3)
        );


        setText(
            "advancedOhConcentration",
            ohMinus.toExponential(3)
        );


        setText(
            "advancedTotalVolume",
            `${formatNumber(
                totalVolume * 1000,
                2
            )} mL`
        );


        setText(
            "advancedNeutralizationProgress",
            `${formatNumber(
                progress,
                1
            )}%`
        );


        setText(
            "advancedProgressText",
            `${formatNumber(
                progress,
                1
            )}% neutralized`
        );


        const progressBar =
            $("advancedProgressBar");

        if (progressBar) {

            progressBar.style.width =
                `${progress}%`;
        }


        setText(
            "advancedObservation",
            atEquivalence
                ? "The titration has reached the equivalence point."
                : "The reaction is progressing as sodium hydroxide is added."
        );


        setText(
            "advancedIndicatorStatus",
            atEquivalence
                ? "Endpoint"
                : pH < 7
                    ? "Acidic"
                    : "Basic"
        );


        setText(
            "advancedReactionStatus",
            atEquivalence
                ? "Neutralization complete"
                : "Neutralization in progress"
        );


        const slider =
            $("advancedVolumeSlider");

        if (slider) {

            slider.value =
                String(
                    clamp(
                        experiment.baseVolume,
                        0,
                        experiment.maxVolume
                    )
                );
        }


        const burette =
            $("advancedBuretteLiquid");

        if (burette) {

            const height =
                clamp(
                    (
                        experiment.baseVolume /
                        experiment.maxVolume
                    ) * 100,
                    0,
                    100
                );

            burette.style.height =
                `${height}%`;
        }


        const flask =
            $("advancedSolution");

        if (flask) {

            flask.classList.remove(
                "acidic",
                "neutral",
                "basic",
                "endpoint"
            );

            flask.classList.add(
                atEquivalence
                    ? "endpoint"
                    : pH < 7
                        ? "acidic"
                        : "basic"
            );
        }


        if (
            atEquivalence &&
            !experiment.completed
        ) {

            experiment.completed =
                true;

            completeExperiment(
                "advanced-titration"
            );

            notify(
                "Advanced titration completed!",
                "success"
            );
        }
    }


    function initializeAdvancedTitration() {

        const experiment =
            state.advancedTitration;

        const slider =
            $("advancedVolumeSlider");

        const hclInput =
            $("advancedHclConcentration");

        const naohInput =
            $("advancedNaohConcentration");

        const volumeDisplay =
            $("advancedNaohVolume");


        if (
            !experiment.initialized
        ) {

            if (slider) {

                slider.min =
                    "0";

                slider.max =
                    String(
                        experiment.maxVolume
                    );

                slider.step =
                    "0.1";

                slider.value =
                    String(
                        experiment.baseVolume
                    );

                slider.addEventListener(
                    "input",
                    () => {

                        experiment.baseVolume =
                            clamp(
                                slider.value,
                                0,
                                experiment.maxVolume
                            );

                        updateAdvancedTitrationUI();
                    }
                );
            }


            if (hclInput) {

                hclInput.value =
                    experiment.acidConcentration;

                hclInput.addEventListener(
                    "input",
                    () => {

                        const value =
                            Number(
                                hclInput.value
                            );

                        if (
                            Number.isFinite(value) &&
                            value > 0
                        ) {

                            experiment.acidConcentration =
                                value;

                            updateAdvancedTitrationUI();
                        }
                    }
                );
            }


            if (naohInput) {

                naohInput.value =
                    experiment.baseConcentration;

                naohInput.addEventListener(
                    "input",
                    () => {

                        const value =
                            Number(
                                naohInput.value
                            );

                        if (
                            Number.isFinite(value) &&
                            value > 0
                        ) {

                            experiment.baseConcentration =
                                value;

                            updateAdvancedTitrationUI();
                        }
                    }
                );
            }


            experiment.initialized =
                true;
        }


        if (volumeDisplay) {

            if (
                volumeDisplay.tagName ===
                "INPUT"
            ) {

                volumeDisplay.value =
                    experiment.baseVolume;
            }
        }


        updateAdvancedTitrationUI();
    }


    function addAdvancedNaOH() {

        const experiment =
            state.advancedTitration;

        const slider =
            $("advancedVolumeSlider");

        const step =
            slider
                ? Number(
                    slider.step
                ) || 0.1
                : 0.1;


        experiment.baseVolume =
            clamp(
                experiment.baseVolume +
                step,
                0,
                experiment.maxVolume
            );


        updateAdvancedTitrationUI();
    }


    function resetAdvancedTitration() {

        const experiment =
            state.advancedTitration;

        experiment.baseVolume =
            0;

        experiment.completed =
            false;

        updateAdvancedTitrationUI();

        notify(
            "Advanced titration reset.",
            "info"
        );
    }


    async function openAdvancedTitration() {

        try {

            const user =
                await getCurrentUser();

            if (!user) {

                notify(
                    "Please sign in to access the advanced laboratory.",
                    "info"
                );

                if (
                    typeof window.openAuthModal ===
                    "function"
                ) {

                    window.openAuthModal(
                        "login"
                    );
                }

                return;
            }


            let premium =
                false;


            if (
                typeof window.getPremiumStatus ===
                "function"
            ) {

                premium =
                    await window.getPremiumStatus();
            }


            if (!premium) {

                showPage(
                    "premiumSection"
                );

                notify(
                    "Premium access is required for this experiment.",
                    "info"
                );

                return;
            }


            state.currentExperiment =
                "advancedTitration";

            showPage(
                "advancedTitrationPage"
            );

            initializeAdvancedTitration();

        } catch (error) {

            console.error(
                "Advanced titration error:",
                error
            );

            notify(
                "Unable to open the advanced laboratory.",
                "error"
            );
        }
    }


    function closeAdvancedTitration() {

        showPage(
            "lab"
        );
    }


    window.openAdvancedTitration =
        openAdvancedTitration;

    window.closeAdvancedTitration =
        closeAdvancedTitration;

    window.addAdvancedNaOH =
        addAdvancedNaOH;

    window.resetAdvancedTitration =
        resetAdvancedTitration;

    window.calculateAdvancedPH =
        calculateAdvancedPH;


    /* =====================================================
       PREMIUM
       ===================================================== */

    function showPremiumSection() {

        showPage(
            "premiumSection"
        );
    }


    window.showPremiumSection =
        showPremiumSection;


    /* =====================================================
       PROGRESS
       ===================================================== */

    function addXP(
        amount,
        reason = ""
    ) {

        if (
            typeof window.awardChemLabXP ===
            "function"
        ) {

            return window.awardChemLabXP(
                amount,
                reason
            );
        }

        return null;
    }


    function completeExperiment(
        experimentId
    ) {

        if (
            typeof window.completeChemLabExperiment ===
            "function"
        ) {

            return window.completeChemLabExperiment(
                experimentId
            );
        }

        return addXP(
            50,
            `Completed ${experimentId}`
        );
    }


    function updateProgressUI() {

        const progress =
            window.chemLabProgress;

        if (!progress) {
            return;
        }


        const xp =
            Number(
                progress.xp
            ) || 0;

        const streak =
            Number(
                progress.streak
            ) || 0;

        const level =
            Number(
                progress.level
            ) || 1;

        const experiments =
            Number(
                progress.experimentsCompleted
            ) || 0;


        setText(
            "dashboardXpValue",
            xp
        );

        setText(
            "dashboardStreakValue",
            streak
        );

        setText(
            "dashboardLevelValue",
            level
        );

        setText(
            "dashboardExperimentsCompleted",
            experiments
        );


        setText(
            "progressLevel",
            level
        );

        setText(
            "progressXP",
            `${xp} XP`
        );

        setText(
            "xpValue",
            xp
        );

        setText(
            "streakValue",
            streak
        );

        setText(
            "experimentsCompleted",
            experiments
        );


        const levelProgress =
            typeof window.getChemLabLevelProgress ===
            "function"
                ? window.getChemLabLevelProgress()
                : null;


        if (!levelProgress) {
            return;
        }


        const percent =
            clamp(
                levelProgress.percent,
                0,
                100
            );


        const dashboardBar =
            $("dashboardProgressBar");

        if (dashboardBar) {

            dashboardBar.style.width =
                `${percent}%`;
        }


        const progressBar =
            $("progressBar");

        if (progressBar) {

            progressBar.style.width =
                `${percent}%`;
        }


        setText(
            "dashboardProgressText",
            `${formatNumber(
                percent,
                0
            )}% to next level`
        );


        setText(
            "progressText",
            `${formatNumber(
                percent,
                0
            )}% to next level`
        );
    }


    window.updateProgressUI =
        updateProgressUI;


    /* =====================================================
       QUIZ
       ===================================================== */

    const quizQuestions = [

        {
            question:
                "What is the pH of a neutral solution at 25°C?",

            options: [
                "0",
                "7",
                "10",
                "14"
            ],

            answer:
                1
        },

        {
            question:
                "Which ion is mainly responsible for acidity?",

            options: [
                "OH⁻",
                "Na⁺",
                "H⁺",
                "Cl⁻"
            ],

            answer:
                2
        },

        {
            question:
                "At the equivalence point of a strong acid–strong base titration, what is true?",

            options: [
                "Only acid remains",
                "Only base remains",
                "The reacting amounts are stoichiometrically equal",
                "No reaction occurs"
            ],

            answer:
                2
        },

        {
            question:
                "What is the formula for molarity?",

            options: [
                "Moles × volume",
                "Moles ÷ volume",
                "Volume ÷ moles",
                "Mass × volume"
            ],

            answer:
                1
        },

        {
            question:
                "A solution with pH 3 is:",

            options: [
                "Strongly basic",
                "Neutral",
                "Acidic",
                "Always pure water"
            ],

            answer:
                2
        }
    ];


    function loadQuizQuestion() {

        const quiz =
            state.quiz;

        const question =
            quizQuestions[
                quiz.currentQuestion
            ];


        if (!question) {

            finishQuiz();

            return;
        }


        quiz.answered =
            false;


        setText(
            "quizQuestionNumber",
            `Question ${
                quiz.currentQuestion + 1
            } of ${
                quizQuestions.length
            }`
        );


        setText(
            "quizQuestion",
            question.question
        );


        const options =
            $("quizOptions");

        if (!options) {
            return;
        }


        options.innerHTML =
            question.options
                .map(
                    (
                        option,
                        index
                    ) => `

                        <button
                            type="button"
                            class="quiz-option"
                            data-answer="${index}"
                        >

                            <span class="quiz-option-letter">
                                ${String.fromCharCode(
                                    65 + index
                                )}
                            </span>

                            <span>
                                ${escapeHTML(
                                    option
                                )}
                            </span>

                        </button>
                    `
                )
                .join("");


        options
            .querySelectorAll(
                "[data-answer]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            answerQuiz(
                                Number(
                                    button.dataset.answer
                                )
                            );
                        }
                    );
                }
            );


        const progress =
            (
                quiz.currentQuestion /
                quizQuestions.length
            ) * 100;


        const progressBar =
            $("quizProgressBar");

        if (progressBar) {

            progressBar.style.width =
                `${progress}%`;
        }


        const result =
            $("quizResult");

        if (result) {

            result.classList.add(
                "hidden"
            );
        }
    }


    function answerQuiz(
        selectedIndex
    ) {

        const quiz =
            state.quiz;

        if (
            quiz.answered ||
            quiz.finished
        ) {
            return;
        }


        const question =
            quizQuestions[
                quiz.currentQuestion
            ];

        if (!question) {
            return;
        }


        quiz.answered =
            true;


        const correct =
            selectedIndex ===
            question.answer;


        const options =
            $("quizOptions");

        if (options) {

            options
                .querySelectorAll(
                    "[data-answer]"
                )
                .forEach(
                    button => {

                        const index =
                            Number(
                                button.dataset.answer
                            );

                        button.disabled =
                            true;

                        if (
                            index ===
                            question.answer
                        ) {

                            button.classList.add(
                                "correct"
                            );
                        }

                        if (
                            index ===
                            selectedIndex &&
                            !correct
                        ) {

                            button.classList.add(
                                "incorrect"
                            );
                        }
                    }
                );
        }


        if (correct) {

            quiz.score++;

            addXP(
                10,
                "Correct quiz answer"
            );

            notify(
                "Correct! +10 XP",
                "success"
            );

        } else {

            notify(
                "Not quite. Review the correct answer and keep learning.",
                "info"
            );
        }


        if (
            quiz.currentQuestion <
            quizQuestions.length - 1
        ) {

            setTimeout(
                () => {

                    quiz.currentQuestion++;

                    loadQuizQuestion();

                },
                900
            );

        } else {

            setTimeout(
                finishQuiz,
                900
            );
        }
    }


    function finishQuiz() {

        const quiz =
            state.quiz;

        if (
            quiz.finished
        ) {
            return;
        }


        quiz.finished =
            true;


        const score =
            quiz.score;

        const percentage =
            Math.round(
                (
                    score /
                    quizQuestions.length
                ) * 100
            );


        setText(
            "quizScore",
            `${score}/${quizQuestions.length}`
        );


        setText(
            "quizResultText",
            `You scored ${percentage}%.`
        );


        const result =
            $("quizResult");

        if (result) {

            result.classList.remove(
                "hidden"
            );
        }


        if (
            typeof window.recordChemLabQuiz ===
            "function"
        ) {

            window.recordChemLabQuiz(
                score,
                quizQuestions.length
            );
        }


        if (
            percentage >= 80
        ) {

            notify(
                "Great work! You scored 80% or higher.",
                "success"
            );
        }
    }


    function restartQuiz() {

        state.quiz = {

            currentQuestion:
                0,

            score:
                0,

            answered:
                false,

            finished:
                false
        };


        loadQuizQuestion();
    }


    window.restartQuiz =
        restartQuiz;


    /* =====================================================
       AUTH / USER
       ===================================================== */

    async function getCurrentUserFromSupabase() {

        const supabase =
            getSupabase();

        if (!supabase) {
            return null;
        }


        try {

            const {
                data,
                error
            } =
                await supabase.auth.getUser();


            if (error) {
                return null;
            }


            return data?.user || null;

        } catch {

            return null;
        }
    }


    async function getCurrentUser() {

        if (
            typeof window.getChemLabCurrentUser ===
            "function"
        ) {

            const result =
                window.getChemLabCurrentUser();

            if (
                result &&
                typeof result.then ===
                "function"
            ) {

                return await result;
            }

            return result || null;
        }


        return getCurrentUserFromSupabase();
    }


    /* =====================================================
       AI EXPERIMENT CONTEXT
       ===================================================== */

    function getExperimentStateForAI() {

        if (
            state.currentExperiment ===
            "titration"
        ) {

            return {

                type:
                    "acid-base-titration",

                acidConcentration:
                    state.titration.acidConcentration,

                acidVolume:
                    state.titration.acidVolume,

                baseConcentration:
                    state.titration.baseConcentration,

                baseVolume:
                    state.titration.baseVolume,

                pH:
                    calculateTitrationPH()
            };
        }


        if (
            state.currentExperiment ===
            "advancedTitration"
        ) {

            return {

                type:
                    "advanced-acid-base-titration",

                acidConcentration:
                    state.advancedTitration.acidConcentration,

                acidVolume:
                    state.advancedTitration.acidVolume,

                baseConcentration:
                    state.advancedTitration.baseConcentration,

                baseVolume:
                    state.advancedTitration.baseVolume,

                equivalenceVolume:
                    state.advancedTitration.equivalenceVolume,

                pH:
                    calculateAdvancedPH()
            };
        }


        return {

            type:
                "general-chemistry"
        };
    }


    /* =====================================================
       AI CHAT UI
       ===================================================== */

    function appendAIMessage(
        role,
        content
    ) {

        state.aiMessages.push({

            role:
                role,

            content:
                content,

            timestamp:
                new Date().toISOString()
        });


        const history =
            $("aiConversationHistory");

        if (!history) {
            return;
        }


        const emptyState =
            history.querySelector(
                ".ai-empty-state"
            );

        if (emptyState) {
            emptyState.remove();
        }


        const message =
            document.createElement(
                "div"
            );

        message.className =
            `ai-message ai-message-${role}`;

        message.innerHTML = `

            <div class="ai-message-content">
                ${escapeHTML(content)}
            </div>

        `;


        history.appendChild(
            message
        );


        history.scrollTop =
            history.scrollHeight;
    }


    async function mainAIQuestion() {

        const input =
            $("mainAIInput");

        if (!input) {
            return;
        }


        const question =
            input.value.trim();


        if (!question) {

            notify(
                "Type a chemistry question first.",
                "info"
            );

            return;
        }


        if (
            state.aiLoading
        ) {
            return;
        }


        const user =
            await getCurrentUser();


        if (!user) {

            notify(
                "Please sign in before using ChemLab AI.",
                "info"
            );

            if (
                typeof window.openAuthModal ===
                "function"
            ) {

                window.openAuthModal(
                    "login"
                );
            }

            return;
        }


        state.aiLoading =
            true;


        const button =
            $("askAIButton");

        if (button) {

            button.disabled =
                true;

            button.classList.add(
                "loading"
            );
        }


        const questionText =
            question;


        input.value =
            "";


        appendAIMessage(
            "user",
            questionText
        );


        setText(
            "aiStatus",
            "ChemLab AI is thinking..."
        );


        try {

            const supabase =
                getSupabase();


            let token =
                null;


            if (supabase) {

                const {
                    data
                } =
                    await supabase.auth.getSession();

                token =
                    data?.session?.access_token ||
                    null;
            }


            const response =
                await fetch(
                    CONFIG.chemistryAIUrl,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            apikey:
                                CONFIG.supabaseKey,

                            ...(token
                                ? {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                                : {})
                        },

                        body:
                            JSON.stringify({

                                question:
                                    questionText,

                                experiment:
                                    state.currentExperiment ||
                                    "general-chemistry",

                                experimentState:
                                    getExperimentStateForAI(),

                                source:
                                    "ChemLab",

                                student_mode:
                                    true
                            })
                    }
                );


            let result =
                null;


            try {

                result =
                    await response.json();

            } catch {

                result =
                    null;
            }


            if (
                !response.ok
            ) {

                throw new Error(
                    result?.error ||
                    "The AI service returned an error."
                );
            }


            const answer =
                result?.answer ||
                result?.response ||
                result?.message ||
                "I couldn't generate an answer right now.";


            appendAIMessage(
                "assistant",
                answer
            );


            setText(
                "mainAIAnswer",
                answer
            );


            setText(
                "aiStatus",
                "ChemLab AI is ready"
            );


            await saveAIConversation(
                questionText,
                answer
            );


        } catch (error) {

            console.error(
                "ChemLab AI error:",
                error
            );


            const message =
                "I couldn't connect to ChemLab AI right now. Please try again.";


            appendAIMessage(
                "assistant",
                message
            );


            setText(
                "mainAIAnswer",
                message
            );


            setText(
                "aiStatus",
                "AI connection error"
            );


            notify(
                message,
                "error"
            );

        } finally {

            state.aiLoading =
                false;


            if (button) {

                button.disabled =
                    false;

                button.classList.remove(
                    "loading"
                );
            }
        }
    }


    function newAIChat() {

        state.aiConversationId =
            null;

        state.aiMessages =
            [];


        const history =
            $("aiConversationHistory");

        if (history) {

            history.innerHTML = `

                <div class="ai-empty-state">

                    <div class="ai-empty-icon">
                        🧪
                    </div>

                    <h3>
                        Ask ChemLab AI
                    </h3>

                    <p>
                        Ask questions about chemistry,
                        experiments, calculations,
                        reactions and concepts.
                    </p>

                </div>
            `;
        }


        setText(
            "mainAIAnswer",
            "Ask me anything about chemistry."
        );


        setText(
            "aiStatus",
            "ChemLab AI is ready"
        );


        const input =
            $("mainAIInput");

        if (input) {
            input.focus();
        }
    }


    async function saveAIConversation(
        question,
        answer
    ) {

        const supabase =
            getSupabase();

        if (!supabase) {
            return;
        }


        const user =
            await getCurrentUser();

        if (!user) {
            return;
        }


        try {

            if (
                !state.aiConversationId
            ) {

                const {
                    data,
                    error
                } =
                    await supabase
                        .from(
                            "ai_conversations"
                        )
                        .insert({

                            user_id:
                                user.id,

                            title:
                                question.slice(
                                    0,
                                    80
                                )
                        })
                        .select(
                            "id"
                        )
                        .single();


                if (error) {

                    console.warn(
                        "AI conversation creation failed:",
                        error
                    );

                    return;
                }


                state.aiConversationId =
                    data.id;
            }


            const {
                error
            } =
                await supabase
                    .from(
                        "ai_messages"
                    )
                    .insert([

                        {
                            conversation_id:
                                state.aiConversationId,

                            user_id:
                                user.id,

                            role:
                                "user",

                            content:
                                question
                        },

                        {
                            conversation_id:
                                state.aiConversationId,

                            user_id:
                                user.id,

                            role:
                                "assistant",

                            content:
                                answer
                        }

                    ]);


            if (error) {

                console.warn(
                    "AI message persistence failed:",
                    error
                );
            }

        } catch (error) {

            console.warn(
                "AI persistence error:",
                error
            );
        }
    }


    async function loadAIConversations() {

        const supabase =
            getSupabase();

        if (!supabase) {
            return;
        }


        const user =
            await getCurrentUser();

        if (!user) {
            return;
        }


        try {

            const cutoff =
                new Date(
                    Date.now() -
                    (
                        CONFIG.aiConversationDays *
                        24 *
                        60 *
                        60 *
                        1000
                    )
                ).toISOString();


            const {
                data,
                error
            } =
                await supabase
                    .from(
                        "ai_conversations"
                    )
                    .select(
                        "id,title,created_at"
                    )
                    .eq(
                        "user_id",
                        user.id
                    )
                    .gte(
                        "created_at",
                        cutoff
                    )
                    .order(
                        "created_at",
                        {
                            ascending:
                                false
                        }
                    )
                    .limit(
                        20
                    );


            if (error) {

                console.warn(
                    "AI conversations could not be loaded:",
                    error
                );

                return;
            }


            state.aiConversations =
                data || [];

        } catch (error) {

            console.warn(
                "AI conversation loading error:",
                error
            );
        }
    }


    window.mainAIQuestion =
        mainAIQuestion;

    window.newAIChat =
        newAIChat;


    window.askAISuggestion =
        function (
            question
        ) {

            const input =
                $("mainAIInput");

            if (!input) {
                return;
            }

            input.value =
                question;

            mainAIQuestion();
        };


    /* =====================================================
       EVENT BINDINGS
       ===================================================== */

    let eventsBound =
        false;


    function bindEvents() {

        if (eventsBound) {
            return;
        }

        eventsBound =
            true;


        /* Navigation */

        document
            .querySelectorAll(
                "[data-page]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        event => {

                            const page =
                                event.currentTarget
                                    .dataset
                                    .page;

                            if (page) {
                                showPage(page);
                            }
                        }
                    );
                }
            );


        /* Mobile menu */

        const mobileMenuButton =
            $("mobileMenuButton");

        if (mobileMenuButton) {

            mobileMenuButton.addEventListener(
                "click",
                openMobileNavigation
            );
        }


        const closeMobileMenu =
            $("closeMobileMenu");

        if (closeMobileMenu) {

            closeMobileMenu.addEventListener(
                "click",
                closeMobileNavigation
            );
        }


        /* Basic titration */

        const add1ml =
            $("add1ml");

        if (add1ml) {

            add1ml.addEventListener(
                "click",
                () => addTitrant(1)
            );
        }


        const add5ml =
            $("add5ml");

        if (add5ml) {

            add5ml.addEventListener(
                "click",
                () => addTitrant(5)
            );
        }


        const resetExperiment =
            $("resetExperiment");

        if (resetExperiment) {

            resetExperiment.addEventListener(
                "click",
                resetTitration
            );
        }


        /* Advanced titration */

        const advancedAdd =
            $("advancedAddNaohButton");

        if (advancedAdd) {

            advancedAdd.addEventListener(
                "click",
                addAdvancedNaOH
            );
        }


        const advancedReset =
            $("advancedResetButton");

        if (advancedReset) {

            advancedReset.addEventListener(
                "click",
                resetAdvancedTitration
            );
        }


        /* AI */

        const askButton =
            $("askAIButton");

        if (askButton) {

            askButton.addEventListener(
                "click",
                mainAIQuestion
            );
        }


        const aiInput =
            $("mainAIInput");

        if (aiInput) {

            aiInput.addEventListener(
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
        }


        const newAIButton =
            $("newAIChatButton");

        if (newAIButton) {

            newAIButton.addEventListener(
                "click",
                newAIChat
            );
        }


        /* Quiz */

        const restartButton =
            $("restartQuizButton");

        if (restartButton) {

            restartButton.addEventListener(
                "click",
                restartQuiz
            );
        }


        /* Advanced explanation */

        const explainButton =
            $("advancedExplainButton");

        if (explainButton) {

            explainButton.addEventListener(
                "
