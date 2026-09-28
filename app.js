/* =========================================================
   CHEMLAB
   MAIN APPLICATION CONTROLLER
   Version 4.0
   =========================================================

   Responsibilities:
   - Page navigation
   - Basic titration laboratory
   - Advanced titration laboratory
   - Chemistry AI Tutor
   - Quiz Arena
   - AI conversation history
   - Progress integration
   - XP integration
   - Responsive navigation
   - Global UI events

   Depends on:
   - Supabase JS
   - auth.js
   - progress.js
   - achievements.js
========================================================= */


/* =========================================================
   01. CHEMLAB CONFIGURATION
========================================================= */

const CHEMLAB_CONFIG = {

    supabaseUrl:
        "https://zscbgeaieiqwknhjxpnt.supabase.co",

    supabaseKey:
        "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy",

    chemistryAIUrl:
        "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/chemistry-ai",

    aiConversationDays: 30,

    defaultPage: "home",

    defaultExperiment: null

};


/* =========================================================
   02. SUPABASE CLIENT
========================================================= */

function getChemLabSupabase() {

    if (window.supabaseClient) {
        return window.supabaseClient;
    }

    if (
        typeof window.supabase === "undefined" ||
        typeof window.supabase.createClient !== "function"
    ) {
        console.error("ChemLab: Supabase library is unavailable.");
        return null;
    }

    window.supabaseClient =
        window.supabase.createClient(
            CHEMLAB_CONFIG.supabaseUrl,
            CHEMLAB_CONFIG.supabaseKey,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );

    return window.supabaseClient;
}


/* =========================================================
   03. GLOBAL CHEMLAB STATE
========================================================= */

window.chemLabState = window.chemLabState || {

    currentPage:
        CHEMLAB_CONFIG.defaultPage,

    currentExperiment:
        CHEMLAB_CONFIG.defaultExperiment,

    aiConversationId:
        null,

    aiLoading:
        false,

    aiMessages:
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

    }

};


/* =========================================================
   04. DOM HELPERS
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function $all(selector) {

    return Array.from(
        document.querySelectorAll(selector)
    );

}


function setText(id, value) {

    const element = $(id);

    if (element) {
        element.textContent =
            value ?? "";
    }

}


function setHTML(id, value) {

    const element = $(id);

    if (element) {
        element.innerHTML =
            value ?? "";
    }

}


function showElement(element) {

    if (!element) return;

    element.hidden = false;

}


function hideElement(element) {

    if (!element) return;

    element.hidden = true;

}


/* =========================================================
   05. NOTIFICATIONS
========================================================= */

function showNotification(
    message,
    type = "info",
    duration = 3500
) {

    let container =
        $("notificationContainer");

    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "notificationContainer";

        container.className =
            "notification-container";

        document.body.appendChild(
            container
        );

    }

    const notification =
        document.createElement("div");

    notification.className =
        `notification notification-${type}`;

    notification.setAttribute(
        "role",
        "status"
    );

    const iconMap = {

        success: "✓",

        error: "✕",

        warning: "!",

        info: "i"

    };

    notification.innerHTML = `

        <span class="notification-icon">
            ${iconMap[type] || "i"}
        </span>

        <span class="notification-message">
            ${escapeHTML(message)}
        </span>

        <button
            class="notification-close"
            type="button"
            aria-label="Close notification"
        >
            ×
        </button>

    `;

    container.appendChild(
        notification
    );

    requestAnimationFrame(() => {

        notification.classList.add(
            "show"
        );

    });

    const closeButton =
        notification.querySelector(
            ".notification-close"
        );

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => removeNotification(
                notification
            )
        );

    }

    setTimeout(
        () =>
            removeNotification(
                notification
            ),
        duration
    );

}


function removeNotification(
    notification
) {

    if (!notification) return;

    notification.classList.remove(
        "show"
    );

    setTimeout(() => {

        notification.remove();

    }, 250);

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


window.showNotification =
    showNotification;


/* =========================================================
   06. PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    if (!pageId) {
        pageId =
            CHEMLAB_CONFIG.defaultPage;
    }

    const pages =
        $all(".page");

    if (!pages.length) {
        return;
    }

    pages.forEach(page => {

        const isActive =
            page.id === pageId;

        page.classList.toggle(
            "active",
            isActive
        );

        page.hidden =
            !isActive;

    });


    /*
       Navigation buttons
    */

    $all("[data-page]").forEach(
        button => {

            const target =
                button.dataset.page;

            button.classList.toggle(
                "active",
                target === pageId
            );

            button.setAttribute(
                "aria-current",
                target === pageId
                    ? "page"
                    : "false"
            );

        }
    );


    window.chemLabState.currentPage =
        pageId;


    /*
       Close mobile menu
    */

    closeMobileNavigation();


    /*
       Page-specific actions
    */

    if (pageId === "dashboard") {

        refreshDashboard();

    }

    if (pageId === "progress") {

        refreshProgressPage();

    }

    if (pageId === "ai") {

        initializeAIInterface();

    }

    if (pageId === "quiz") {

        updateQuizUI();

    }

    if (
        pageId === "advancedTitrationPage"
    ) {

        initializeAdvancedTitration();

    }


    /*
       Scroll to top
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


window.showPage =
    showPage;


/* =========================================================
   07. MOBILE NAVIGATION
========================================================= */

function openMobileNavigation() {

    const navigation =
        $("mobileNavigation");

    if (!navigation) return;

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


/* =========================================================
   08. EXPERIMENT NAVIGATION
========================================================= */

function openExperiment(
    experiment
) {

    if (
        experiment ===
        "titration"
    ) {

        window.chemLabState
            .currentExperiment =
            "titration";

        showPage("titration");

        initializeTitration();

        return;
    }


    if (
        experiment ===
        "advanced-titration"
    ) {

        openAdvancedTitration();

        return;
    }


    showNotification(
        "This experiment is coming soon.",
        "info"
    );

}


window.openExperiment =
    openExperiment;


/* =========================================================
   09. BASIC TITRATION STATE
========================================================= */

const titrationState = {

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
        false

};


/* =========================================================
   10. TITRATION PH CALCULATION
========================================================= */

function calculateTitrationPH() {

    const acidMoles =
        titrationState
            .acidConcentration *
        (titrationState.acidVolume / 1000);


    const baseMoles =
        titrationState
            .baseConcentration *
        (titrationState.baseVolume / 1000);


    const totalVolume =
        (
            titrationState.acidVolume +
            titrationState.baseVolume
        ) / 1000;


    if (
        totalVolume <= 0
    ) {

        return 7;

    }


    const difference =
        acidMoles -
        baseMoles;


    /*
       Before equivalence:
       excess H+
    */

    if (
        difference > 0
    ) {

        const hPlus =
            difference /
            totalVolume;

        return Math.max(
            0,
            -Math.log10(hPlus)
        );

    }


    /*
       At equivalence
    */

    if (
        Math.abs(difference) <
        1e-10
    ) {

        return 7;

    }


    /*
       After equivalence:
       excess OH-
    */

    const ohMinus =
        Math.abs(difference) /
        totalVolume;

    const pOH =
        -Math.log10(ohMinus);

    return Math.min(
        14,
        14 - pOH
    );

}


/* =========================================================
   11. BASIC TITRATION STATUS
========================================================= */

function getTitrationStatus(
    ph
) {

    if (
        titrationState.baseVolume <
        titrationState.equivalenceVolume
    ) {

        return {
            label:
                "Acidic solution",

            type:
                "acidic",

            indicator:
                "Phenolphthalein remains colourless.",

            observation:
                "Hydrochloric acid is still in excess."

        };

    }


    if (
        Math.abs(
            titrationState.baseVolume -
            titrationState.equivalenceVolume
        ) < 0.001
    ) {

        return {
            label:
                "Equivalence point",

            type:
                "success",

            indicator:
                "A very faint endpoint colour appears.",

            observation:
                "The acid and base have reacted in stoichiometrically equal amounts."

        };

    }


    return {

        label:
            "Basic solution",

        type:
            "basic",

        indicator:
            "Phenolphthalein is pink.",

        observation:
            "Sodium hydroxide is now in excess."

    };

}


/* =========================================================
   12. UPDATE BASIC TITRATION UI
========================================================= */

function updateTitrationUI() {

    const ph =
        calculateTitrationPH();

    const status =
        getTitrationStatus(ph);


    setText(
        "titrantVolume",
        titrationState.baseVolume
            .toFixed(2)
    );


    setText(
        "phValue",
        ph.toFixed(2)
    );


    setText(
        "indicatorStatus",
        status.indicator
    );


    setText(
        "endpointMessage",
        status.label
    );


    setText(
        "titrationObservation",
        status.observation
    );


    setText(
        "equivalencePoint",
        `${titrationState.equivalenceVolume.toFixed(2)} mL`
    );


    setText(
        "reactionStatus",
        status.label
    );


    /*
       Optional visual elements
    */

    const liquid =
        $("buretteLiquid");

    if (liquid) {

        const percentage =
            Math.min(
                100,
                (
                    titrationState.baseVolume /
                    titrationState.maxVolume
                ) * 100
            );

        liquid.style.height =
            `${percentage}%`;

    }


    const solution =
        $("solution");

    if (solution) {

        if (
            titrationState.baseVolume <
            titrationState.equivalenceVolume
        ) {

            solution.classList.remove(
                "basic",
                "endpoint"
            );

            solution.classList.add(
                "acidic"
            );

        } else if (
            titrationState.baseVolume ===
            titrationState.equivalenceVolume
        ) {

            solution.classList.remove(
                "acidic",
                "basic"
            );

            solution.classList.add(
                "endpoint"
            );

        } else {

            solution.classList.remove(
                "acidic",
                "endpoint"
            );

            solution.classList.add(
                "basic"
            );

        }

    }


    /*
       Mark experiment complete
    */

    if (
        !titrationState.completed &&
        Math.abs(
            titrationState.baseVolume -
            titrationState.equivalenceVolume
        ) < 0.001
    ) {

        titrationState.completed =
            true;

        completeChemLabExperiment(
            "Acid-Base Titration",
            50
        );

        showNotification(
            "Experiment completed! +50 XP",
            "success"
        );

    }

}


/* =========================================================
   13. ADD TITRANT
========================================================= */

function addTitrant(
    amount = 1
) {

    if (
        titrationState.baseVolume >=
        titrationState.maxVolume
    ) {

        showNotification(
            "The burette has reached the maximum volume.",
            "warning"
        );

        return;

    }


    const safeAmount =
        Number(amount) || 1;


    titrationState.baseVolume =
        Math.min(
            titrationState.maxVolume,
            Number(
                (
                    titrationState.baseVolume +
                    safeAmount
                ).toFixed(2)
            )
        );


    updateTitrationUI();

}


window.addTitrant =
    addTitrant;


/* =========================================================
   14. RESET BASIC TITRATION
========================================================= */

function resetTitration() {

    titrationState.baseVolume =
        0;

    titrationState.completed =
        false;

    updateTitrationUI();

    showNotification(
        "Titration experiment reset.",
        "info"
    );

}


window.resetTitration =
    resetTitration;


/* =========================================================
   15. INITIALIZE BASIC TITRATION
========================================================= */

function initializeTitration() {

    updateTitrationUI();

}


/* =========================================================
   16. PROGRESS BRIDGE
========================================================= */

function awardChemLabXP(
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

}


function completeChemLabExperiment(
    name,
    xpReward = 25
) {

    if (
        typeof window.completeChemLabExperiment ===
        "function"
    ) {

        return window.completeChemLabExperiment(
            name,
            xpReward
        );

    }

}


function refreshDashboard() {

    if (
        typeof window.updateProgressUI ===
        "function"
    ) {

        window.updateProgressUI();

    }

}


function refreshProgressPage() {

    if (
        typeof window.updateProgressUI ===
        "function"
    ) {

        window.updateProgressUI();

    }


    if (
        typeof window.refreshAchievementsUI ===
        "function"
    ) {

        window.refreshAchievementsUI();

    }

}


/* =========================================================
   17. ADVANCED TITRATION
========================================================= */

const advancedTitrationState = {

    acidConcentration:
        0.100,

    baseConcentration:
        0.100,

    acidVolume:
        25.00,

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

};


/* =========================================================
   18. ADVANCED TITRATION CALCULATIONS
========================================================= */

function calculateAdvancedTitration() {

    const acidMoles =
        advancedTitrationState
            .acidConcentration *
        (
            advancedTitrationState
                .acidVolume / 1000
        );


    const baseMoles =
        advancedTitrationState
            .baseConcentration *
        (
            advancedTitrationState
                .baseVolume / 1000
        );


    const totalVolume =
        (
            advancedTitrationState
                .acidVolume +
            advancedTitrationState
                .baseVolume
        ) / 1000;


    const difference =
        acidMoles -
        baseMoles;


    let ph =
        7;


    if (
        difference > 0
    ) {

        const hPlus =
            difference /
            totalVolume;

        ph =
            -Math.log10(
                hPlus
            );

    } else if (
        difference < 0
    ) {

        const ohMinus =
            Math.abs(
                difference
            ) / totalVolume;

        const pOH =
            -Math.log10(
                ohMinus
            );

        ph =
            14 - pOH;

    }


    return {

        acidMoles,

        baseMoles,

        totalVolume,

        difference,

        ph:
            Math.max(
                0,
                Math.min(
                    14,
                    ph
                )
            )

    };

}


function calculateAdvancedPH() {

    return calculateAdvancedTitration()
        .ph;

}


/* =========================================================
   19. ADVANCED INDICATOR STATUS
========================================================= */

function getAdvancedIndicatorStatus(
    ph
) {

    if (ph < 8.2) {

        return "Colourless";

    }

    if (ph < 10) {

        return "Endpoint transition";

    }

    return "Pink";


}


/* =========================================================
   20. UPDATE ADVANCED TITRATION
========================================================= */

function updateAdvancedTitrationUI() {

    const result =
        calculateAdvancedTitration();


    const ph =
        result.ph;


    setText(
        "advancedPhValue",
        ph.toFixed(2)
    );


    setText(
        "advancedHplus",
        formatScientific(
            Math.pow(
                10,
                -ph
            )
        )
    );


    setText(
        "advancedOhminus",
        formatScientific(
            Math.pow(
                10,
                ph - 14
            )
        )
    );


    setText(
        "advancedEquivalence",
        `${advancedTitrationState.equivalenceVolume.toFixed(2)} mL`
    );


    setText(
        "advancedHplusConcentration",
        formatScientific(
            Math.pow(
                10,
                -ph
            )
        )
    );


    setText(
        "advancedOhConcentration",
        formatScientific(
            Math.pow(
                10,
                ph - 14
            )
        )
    );


    setText(
        "advancedTotalVolume",
        `${result.totalVolume.toFixed(3)} L`
    );


    setText(
        "advancedIndicatorStatus",
        getAdvancedIndicatorStatus(ph)
    );


    const progress =
        Math.min(
            100,
            (
                advancedTitrationState.baseVolume /
                advancedTitrationState.equivalenceVolume
            ) * 100
        );


    setText(
        "advancedNeutralizationProgress",
        `${progress.toFixed(0)}%`
    );


    setText(
        "advancedProgressText",
        `${progress.toFixed(0)}% neutralized`
    );


    const progressBar =
        $("advancedProgressBar");

    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

    }


    setText(
        "advancedObservation",
        getAdvancedObservation(
            result
        )
    );


    setText(
        "advancedReactionStatus",
        getAdvancedReactionStatus(
            result
        )
    );


    /*
       Sync volume controls
    */

    setText(
        "advancedNaohVolume",
        `${advancedTitrationState.baseVolume.toFixed(2)} mL`
    );


    const slider =
        $("advancedVolumeSlider");

    if (slider) {

        slider.value =
            advancedTitrationState.baseVolume;

    }


    /*
       Visual burette
    */

    const liquid =
        $("advancedBuretteLiquid");

    if (liquid) {

        liquid.style.height =
            `${(
                advancedTitrationState.baseVolume /
                advancedTitrationState.maxVolume
            ) * 100}%`;

    }


    /*
       Visual solution
    */

    const solution =
        $("advancedSolution");

    if (solution) {

        solution.classList.toggle(
            "acidic",
            ph < 7
        );

        solution.classList.toggle(
            "endpoint",
            Math.abs(
                advancedTitrationState.baseVolume -
                advancedTitrationState.equivalenceVolume
            ) < 0.001
        );

        solution.classList.toggle(
            "basic",
            ph > 7
        );

    }


    /*
       Completion
    */

    if (
        !advancedTitrationState.completed &&
        Math.abs(
            advancedTitrationState.baseVolume -
            advancedTitrationState.equivalenceVolume
        ) < 0.001
    ) {

        advancedTitrationState.completed =
            true;

        completeChemLabExperiment(
            "Advanced Acid-Base Titration",
            100
        );

        showNotification(
            "Advanced experiment completed! +100 XP",
            "success"
        );

    }

}


/* =========================================================
   21. ADVANCED OBSERVATION
========================================================= */

function getAdvancedObservation(
    result
) {

    if (
        result.difference > 0
    ) {

        return (
            "HCl is still in excess. " +
            "The solution remains acidic."
        );

    }


    if (
        Math.abs(
            result.difference
        ) < 1e-10
    ) {

        return (
            "The equivalence point has been reached. " +
            "The acid and base have reacted in equal stoichiometric amounts."
        );

    }


    return (
        "NaOH is now in excess. " +
        "The solution has become basic."
    );

}


function getAdvancedReactionStatus(
    result
) {

    if (
        result.difference > 0
    ) {

        return "Before equivalence";

    }


    if (
        Math.abs(
            result.difference
        ) < 1e-10
    ) {

        return "At equivalence";

    }


    return "After equivalence";

}


function formatScientific(
    value
) {

    if (
        !Number.isFinite(value)
    ) {

        return "0";

    }

    return value.toExponential(2);

}


/* =========================================================
   22. ADVANCED INPUTS
========================================================= */

function readAdvancedInputs() {

    const acid =
        $("advancedHclConcentration");

    const base =
        $("advancedNaohConcentration");

    const sample =
        $("advancedSampleVolume");


    if (acid) {

        const value =
            Number(acid.value);

        if (
            Number.isFinite(value) &&
            value > 0
        ) {

            advancedTitrationState
                .acidConcentration =
                value;

        }

    }


    if (base) {

        const value =
            Number(base.value);

        if (
            Number.isFinite(value) &&
            value > 0
        ) {

            advancedTitrationState
                .baseConcentration =
                value;

        }

    }


    if (sample) {

        const value =
            Number(sample.value);

        if (
            Number.isFinite(value) &&
            value > 0
        ) {

            advancedTitrationState
                .acidVolume =
                value;

        }

    }


    advancedTitrationState
        .equivalenceVolume =
        (
            advancedTitrationState.acidConcentration *
            advancedTitrationState.acidVolume
        ) /
        advancedTitrationState.baseConcentration;

}


/* =========================================================
   23. ADVANCED TITRATION INITIALIZATION
========================================================= */

function initializeAdvancedTitration() {

    if (
        !advancedTitrationState.initialized
    ) {

        const acid =
            $("advancedHclConcentration");

        const base =
            $("advancedNaohConcentration");

        const sample =
            $("advancedSampleVolume");

        const slider =
            $("advancedVolumeSlider");

        const addButton =
            $("advancedAddNaohButton");


        if (acid) {

            acid.addEventListener(
                "input",
                () => {

                    readAdvancedInputs();

                    updateAdvancedTitrationUI();

                }
            );

        }


        if (base) {

            base.addEventListener(
                "input",
                () => {

                    readAdvancedInputs();

                    updateAdvancedTitrationUI();

                }
            );

        }


        if (sample) {

            sample.addEventListener(
                "input",
                () => {

                    readAdvancedInputs();

                    updateAdvancedTitrationUI();

                }
            );

        }


        if (slider) {

            slider.addEventListener(
                "input",
                () => {

                    advancedTitrationState
                        .baseVolume =
                        Math.min(
                            advancedTitrationState.maxVolume,
                            Math.max(
                                0,
                                Number(
                                    slider.value
                                ) || 0
                            )
                        );

                    updateAdvancedTitrationUI();

                }
            );

        }


        if (addButton) {

            addButton.addEventListener(
                "click",
                () => {

                    addAdvancedNaOH(1);

                }
            );

        }


        advancedTitrationState.initialized =
            true;

    }


    readAdvancedInputs();

    updateAdvancedTitrationUI();

}


/* =========================================================
   24. ADD ADVANCED NaOH
========================================================= */

function addAdvancedNaOH(
    amount = 1
) {

    advancedTitrationState.baseVolume =
        Math.min(
            advancedTitrationState.maxVolume,
            Number(
                (
                    advancedTitrationState.baseVolume +
                    Number(amount || 1)
                ).toFixed(2)
            )
        );


    updateAdvancedTitrationUI();

}


window.addAdvancedNaOH =
    addAdvancedNaOH;


/* =========================================================
   25. RESET ADVANCED TITRATION
========================================================= */

function resetAdvancedTitration() {

    advancedTitrationState.baseVolume =
        0;

    advancedTitrationState.completed =
        false;

    updateAdvancedTitrationUI();

    showNotification(
        "Advanced titration reset.",
        "info"
    );

}


window.resetAdvancedTitration =
    resetAdvancedTitration;


/* =========================================================
   26. OPEN ADVANCED TITRATION
========================================================= */

async function openAdvancedTitration() {

    if (
        typeof window.getCurrentUser !==
        "function"
    ) {

        showNotification(
            "Please sign in to continue.",
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

        return;

    }


    const user =
        await window.getCurrentUser();


    if (!user) {

        showNotification(
            "Please sign in to access the Advanced Lab.",
            "warning"
        );

        window.openAuthModal(
            "signin"
        );

        return;

    }


    if (
        typeof window.getPremiumStatus !==
        "function"
    ) {

        showNotification(
            "Premium system is still loading.",
            "warning"
        );

        return;

    }


    const premium =
        await window.getPremiumStatus();


    if (
        !premium ||
        !premium.isPremium
    ) {

        if (
            typeof window.openPremiumModal ===
            "function"
        ) {

            window.openPremiumModal(
                "yearly"
            );

        } else {

            showPage(
                "premiumSection"
            );

        }

        return;

    }


    window.chemLabState
        .currentExperiment =
        "advanced-titration";


    showPage(
        "advancedTitrationPage"
    );


    initializeAdvancedTitration();

}


window.openAdvancedTitration =
    openAdvancedTitration;


function closeAdvancedTitration() {

    showPage("lab");

}


window.closeAdvancedTitration =
    closeAdvancedTitration;


/* =========================================================
   27. ADVANCED AI EXPERIMENT STATE
========================================================= */

function getCurrentExperimentState() {

    if (
        window.chemLabState
            .currentExperiment ===
        "advanced-titration"
    ) {

        const result =
            calculateAdvancedTitration();

        return {

            experiment:
                "Advanced Acid-Base Titration",

            acidConcentration:
                advancedTitrationState
                    .acidConcentration,

            acidVolume:
                advancedTitrationState
                    .acidVolume,

            baseConcentration:
                advancedTitrationState
                    .baseConcentration,

            baseVolume:
                advancedTitrationState
                    .baseVolume,

            pH:
                result.ph,

            acidMoles:
                result.acidMoles,

            baseMoles:
                result.baseMoles,

            totalVolume:
                result.totalVolume,

            reactionStatus:
                getAdvancedReactionStatus(
                    result
                )

        };

    }


    return {

        experiment:
            "Acid-Base Titration",

        acidConcentration:
            titrationState
                .acidConcentration,

        acidVolume:
            titrationState
                .acidVolume,

        baseConcentration:
            titrationState
                .baseConcentration,

        baseVolume:
            titrationState
                .baseVolume,

        pH:
            calculateTitrationPH(),

        equivalenceVolume:
            titrationState
                .equivalenceVolume

    };

}


/* =========================================================
   28. QUIZ DATABASE
========================================================= */

const CHEMLAB_QUIZ_QUESTIONS = [

    {
        question:
            "What is the pH of a neutral solution at 25°C?",

        options:
            [
                "1",
                "5",
                "7",
                "14"
            ],

        answer:
            2,

        explanation:
            "A neutral aqueous solution at 25°C has a pH of 7."

    },


    {
        question:
            "Which ion determines whether a solution is acidic?",

        options:
            [
                "Na⁺",
                "H⁺",
                "Cl⁻",
                "OH⁻"
            ],

        answer:
            1,

        explanation:
            "Acidity is related to the concentration of hydrogen ions, H⁺."

    },


    {
        question:
            "At the equivalence point of a 1:1 strong acid–strong base titration, what is true?",

        options:
            [
                "Only acid remains",
                "Only base remains",
                "Acid and base have reacted in stoichiometrically equal amounts",
                "The solution contains no ions"
            ],

        answer:
            2,

        explanation:
            "At equivalence, the reacting acid and base have been supplied in the required stoichiometric ratio."

    },


    {
        question:
            "Which equation correctly defines molarity?",

        options:
            [
                "M = volume ÷ moles",
                "M = moles ÷ volume",
                "M = mass × volume",
                "M = volume × mass"
            ],

        answer:
            1,

        explanation:
            "Molarity is the number of moles of solute divided by the volume of solution in litres."

    },


    {
        question:
            "A solution has a pH of 3. What can you conclude?",

        options:
            [
                "It is strongly acidic",
                "It is neutral",
                "It is basic",
                "It contains no ions"
            ],

        answer:
            0,

        explanation:
            "A pH below 7 indicates an acidic solution."
    }

];


/* =========================================================
   29. QUIZ STATE
========================================================= */

function resetQuizState() {

    window.chemLabState.quiz = {

        currentQuestion:
            0,

        score:
            0,

        answered:
            false,

        finished:
            false

    };

}


/* =========================================================
   30. LOAD QUIZ QUESTION
========================================================= */

function loadQuizQuestion() {

    const quiz =
        window.chemLabState.quiz;

    const question =
        CHEMLAB_QUIZ_QUESTIONS[
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
        `Question ${quiz.currentQuestion + 1} of ${CHEMLAB_QUIZ_QUESTIONS.length}`
    );


    setText(
        "quizQuestion",
        question.question
    );


    const options =
        $("quizOptions");


    if (!options) return;


    options.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "quiz-option";

            button.dataset.index =
                index;

            button.textContent =
                option;

            button.addEventListener(
                "click",
                () => answerQuiz(
                    index
                )
            );

            options.appendChild(
                button
            );

        }
    );


    const progress =
        (
            quiz.currentQuestion /
            CHEMLAB_QUIZ_QUESTIONS.length
        ) * 100;


    const progressBar =
        $("quizProgressBar");

    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

    }


    hideElement(
        $("quizResult")
    );

}


/* =========================================================
   31. ANSWER QUIZ
========================================================= */

function answerQuiz(
    selectedIndex
) {

    const quiz =
        window.chemLabState.quiz;


    if (
        quiz.answered ||
        quiz.finished
    ) {

        return;

    }


    const question =
        CHEMLAB_QUIZ_QUESTIONS[
            quiz.currentQuestion
        ];


    if (!question) return;


    quiz.answered =
        true;


    const buttons =
        $all(
            "#quizOptions .quiz-option"
        );


    buttons.forEach(
        (button, index) => {

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
                index === selectedIndex &&
                index !== question.answer
            ) {

                button.classList.add(
                    "incorrect"
                );

            }

        }
    );


    const correct =
        selectedIndex ===
        question.answer;


    if (correct) {

        quiz.score += 1;

        showNotification(
            "Correct! Great work.",
            "success"
        );

    } else {

        showNotification(
            "Not quite. Review the explanation.",
            "warning"
        );

    }


    showElement(
        $("quizResult")
    );


    setText(
        "quizResultText",
        question.explanation
    );


    setText(
        "quizScore",
        `${quiz.score}/${CHEMLAB_QUIZ_QUESTIONS.length}`
    );

}


window.answerQuiz =
    answerQuiz;


/* =========================================================
   32. NEXT QUIZ QUESTION
========================================================= */

function nextQuizQuestion() {

    const quiz =
        window.chemLabState.quiz;


    if (!quiz.answered) {

        showNotification(
            "Choose an answer first.",
            "warning"
        );

        return;

    }


    quiz.currentQuestion += 1;


    if (
        quiz.currentQuestion >=
        CHEMLAB_QUIZ_QUESTIONS.length
    ) {

        finishQuiz();

        return;

    }


    loadQuizQuestion();

}


window.nextQuizQuestion =
    nextQuizQuestion;


/* =========================================================
   33. FINISH QUIZ
========================================================= */

function finishQuiz() {

    const quiz =
        window.chemLabState.quiz;


    quiz.finished =
        true;


    const total =
        CHEMLAB_QUIZ_QUESTIONS.length;


    const percentage =
        Math.round(
            (
                quiz.score /
                total
            ) * 100
        );


    setText(
        "quizQuestionNumber",
        "Quiz Complete"
    );


    setText(
        "quizQuestion",
        `You scored ${quiz.score} out of ${total}.`
    );


    setText(
        "quizScore",
        `${quiz.score}/${total}`
    );


    showElement(
        $("quizResult")
    );


    setText(
        "quizResultText",
        getQuizFeedback(
            percentage
        )
    );


    const progressBar =
        $("quizProgressBar");

    if (progressBar) {

        progressBar.style.width =
            "100%";

    }


    if (
        typeof window.recordChemLabQuiz ===
        "function"
    ) {

        window.recordChemLabQuiz(
            quiz.score,
            total
        );

    }


    if (
        percentage === 100
    ) {

        showNotification(
            "Perfect score! Quiz Master progress updated.",
            "success"
        );

    } else {

        showNotification(
            `Quiz completed: ${percentage}%`,
            "success"
        );

    }

}


function getQuizFeedback(
    percentage
) {

    if (percentage === 100) {

        return (
            "Excellent! You demonstrated a strong understanding of the chemistry concepts."
        );

    }


    if (percentage >= 80) {

        return (
            "Great work! You have a solid understanding of the key concepts."
        );

    }


    if (percentage >= 60) {

        return (
            "Good effort. Review the explanations and try again to strengthen your understanding."
        );

    }


    return (
        "Keep practising. Use the AI Tutor and laboratory simulations to reinforce these concepts."
    );

}


/* =========================================================
   34. RESTART QUIZ
========================================================= */

function restartQuiz() {

    resetQuizState();

    loadQuizQuestion();

}


window.restartQuiz =
    restartQuiz;


/* =========================================================
   35. QUIZ INITIALIZATION
========================================================= */

function initializeQuiz() {

    resetQuizState();

    loadQuizQuestion();

}


/* =========================================================
   36. AI TUTOR
========================================================= */

function initializeAIInterface() {

    const input =
        $("mainAIInput");

    if (input) {

        setTimeout(
            () => input.focus(),
            100
        );

    }


    renderAIConversation();

}


/* =========================================================
   37. AI CONVERSATION TITLE
========================================================= */

function generateConversationTitle(
    question
) {

    const cleaned =
        String(question || "")
            .trim()
            .replace(/\s+/g, " ");


    if (!cleaned) {

        return "Chemistry Tutor";

    }


    if (
        cleaned.length <= 60
    ) {

        return cleaned;

    }


    return (
        cleaned.substring(
            0,
            57
        ) + "..."
    );

}


/* =========================================================
   38. GET AI SESSION
========================================================= */

async function getAISession() {

    const client =
        getChemLabSupabase();


    if (!client) {
        return null;
    }


    const {
        data,
        error
    } =
        await client.auth.getSession();


    if (error) {

        console.error(
            "AI session error:",
            error
        );

        return null;

    }


    return data?.session || null;

}


/* =========================================================
   39. LOAD AI CONVERSATIONS
========================================================= */

async function loadAIConversations() {

    const session =
        await getAISession();


    if (!session?.user) {

        window.chemLabState
            .aiMessages = [];

        window.chemLabState
            .aiConversationId = null;

        renderAIConversation();

        return;

    }


    const client =
        getChemLabSupabase();


    if (!client) return;


    try {

        const {
            data,
            error
        } =
            await client
                .from("ai_conversations")
                .select(
                    "id,title,created_at,expires_at"
                )
                .eq(
                    "user_id",
                    session.user.id
                )
