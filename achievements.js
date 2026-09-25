"use strict";

/* =========================================================
   CHEMLAB — ACHIEVEMENTS UI
   CLEAN REPLACEMENT
   Works with:
   - progress.js
   - app.js
   - auth.js
========================================================= */


/* =========================================================
   ACHIEVEMENT DEFINITIONS
========================================================= */

const CHEMLAB_ACHIEVEMENT_UI_DEFINITIONS = [

    {
        id: "first-step",
        title: "First Step",
        description: "Earn your first XP",
        icon: "🚀"
    },

    {
        id: "first-experiment",
        title: "Lab Explorer",
        description: "Complete your first experiment",
        icon: "🧪"
    },

    {
        id: "first-quiz",
        title: "Quiz Starter",
        description: "Complete your first quiz",
        icon: "📝"
    },

    {
        id: "quiz-master",
        title: "Quiz Master",
        description: "Reach 80% or higher on a quiz",
        icon: "🏆"
    },

    {
        id: "xp-100",
        title: "Century Chemist",
        description: "Reach 100 XP",
        icon: "💯"
    },

    {
        id: "level-5",
        title: "Rising Chemist",
        description: "Reach Level 5",
        icon: "⭐"
    },

    {
        id: "streak-3",
        title: "Getting Consistent",
        description: "Reach a 3-day streak",
        icon: "🔥"
    },

    {
        id: "streak-7",
        title: "One Week Strong",
        description: "Reach a 7-day streak",
        icon: "🔥"
    }

];


/* =========================================================
   GET ACHIEVEMENT DEFINITIONS
========================================================= */

function getChemLabAchievementDefinitions() {

    /*
       progress.js is the main owner of the
       achievement definitions.

       Use those definitions when available.
    */

    if (
        Array.isArray(
            window.CHEMLAB_ACHIEVEMENTS
        ) &&
        window.CHEMLAB_ACHIEVEMENTS.length
    ) {

        return window.CHEMLAB_ACHIEVEMENTS;
    }


    return CHEMLAB_ACHIEVEMENT_UI_DEFINITIONS;
}


/* =========================================================
   SAFE HTML
========================================================= */

function escapeAchievementHTML(value) {

    return String(value)
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


/* =========================================================
   GET CURRENT PROGRESS
========================================================= */

function getAchievementProgress() {

    const progress =
        window.chemLabProgress;


    if (
        !progress ||
        !progress.loaded
    ) {

        return null;
    }


    return progress;
}


/* =========================================================
   RENDER ACHIEVEMENTS
========================================================= */

function renderChemLabAchievements() {

    const grid =
        document.getElementById(
            "achievementsGrid"
        );


    const counter =
        document.getElementById(
            "achievementUnlockedCount"
        );


    /*
       The achievements page may not exist
       on every page/state.

       Simply do nothing if its container
       is not present.
    */

    if (!grid) {
        return;
    }


    const definitions =
        getChemLabAchievementDefinitions();


    const progress =
        getAchievementProgress();


    /*
       Not signed in / progress not loaded.
    */

    if (!progress) {

        if (counter) {

            counter.textContent =
                `0/${definitions.length}`;
        }


        grid.innerHTML = `

            <div class="achievements-empty">

                <div
                    class="achievements-empty-icon"
                    aria-hidden="true"
                >
                    🏆
                </div>

                <strong>
                    Sign in to track achievements
                </strong>

                <p>
                    Complete experiments, quizzes,
                    and other ChemLab activities
                    to unlock achievements.
                </p>

            </div>

        `;

        return;
    }


    const unlocked =
        Array.isArray(
            progress.achievements
        )
            ? progress.achievements
            : [];


    const unlockedCount =
        definitions.filter(
            achievement =>
                unlocked.includes(
                    achievement.id
                )
        ).length;


    if (counter) {

        counter.textContent =
            `${unlockedCount}/${definitions.length}`;
    }


    /*
       Render every achievement.
    */

    grid.innerHTML =
        definitions
            .map(
                achievement => {

                    const isUnlocked =
                        unlocked.includes(
                            achievement.id
                        );


                    const statusClass =
                        isUnlocked
                            ? "unlocked"
                            : "locked";


                    const statusText =
                        isUnlocked
                            ? "✓ Unlocked"
                            : "🔒 Locked";


                    const checkIcon =
                        isUnlocked
                            ? "✓"
                            : "🔒";


                    return `

                        <article
                            class="
                                achievement-card
                                ${statusClass}
                            "
                            data-achievement-id="${escapeAchievementHTML(
                                achievement.id
                            )}"
                            aria-label="${escapeAchievementHTML(
                                achievement.title
                            )}"
                        >

                            <div
                                class="achievement-check"
                                aria-hidden="true"
                            >
                                ${checkIcon}
                            </div>


                            <div
                                class="achievement-icon"
                                aria-hidden="true"
                            >
                                ${achievement.icon}
                            </div>


                            <h3>
                                ${escapeAchievementHTML(
                                    achievement.title
                                )}
                            </h3>


                            <p>
                                ${escapeAchievementHTML(
                                    achievement.description
                                )}
                            </p>


                            <span
                                class="
                                    achievement-status
                                    ${statusClass}
                                "
                            >
                                ${statusText}
                            </span>

                        </article>

                    `;
                }
            )
            .join("");
}


/* =========================================================
   REFRESH
========================================================= */

function refreshAchievementsUI() {

    renderChemLabAchievements();
}


/* =========================================================
   REFRESH AFTER PROGRESS CHANGES
========================================================= */

function handleAchievementProgressChange() {

    /*
       Progress may update several values
       during one action, so schedule one
       render instead of rendering repeatedly.
    */

    if (
        window.chemLabAchievementRenderTimer
    ) {

        clearTimeout(
            window.chemLabAchievementRenderTimer
        );
    }


    window.chemLabAchievementRenderTimer =
        setTimeout(
            () => {

                window.chemLabAchievementRenderTimer =
                    null;

                renderChemLabAchievements();

            },
            50
        );
}


/* =========================================================
   AUTH CHANGE
========================================================= */

function handleAchievementAuthChange() {

    handleAchievementProgressChange();
}


/* =========================================================
   CUSTOM EVENTS
========================================================= */

window.addEventListener(
    "chemlab:auth-change",
    handleAchievementAuthChange
);


/* =========================================================
   OBSERVE PROGRESS OBJECT
========================================================= */

/*
   progress.js exposes window.chemLabProgress.

   Because the object itself is mutated rather than
   replaced, we do not use an expensive polling loop.

   Instead, progress.js and app.js can explicitly call
   refreshAchievementsUI() whenever needed.
*/


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            handleAchievementProgressChange();
        }
    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

let achievementsInitialized =
    false;


function initializeChemLabAchievements() {

    if (achievementsInitialized) {
        return;
    }


    achievementsInitialized =
        true;


    renderChemLabAchievements();
}


/* =========================================================
   PUBLIC API
========================================================= */

window.renderChemLabAchievements =
    renderChemLabAchievements;


window.refreshAchievementsUI =
    refreshAchievementsUI;


window.getChemLabAchievementDefinitions =
    getChemLabAchievementDefinitions;


window.initializeChemLabAchievements =
    initializeChemLabAchievements;


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChemLabAchievements,
        {
            once: true
        }
    );

} else {

    initializeChemLabAchievements();
}
