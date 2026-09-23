"use strict";

/* =========================================================
   CHEMLAB — ACHIEVEMENTS UI
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


    if (!grid) {
        return;
    }


    const progress =
        window.chemLabProgress;


    const definitions =
        window.CHEMLAB_ACHIEVEMENTS ||
        [
            {
                id: "first-step",
                title: "First Step",
                description:
                    "Earn your first XP",
                icon: "🚀"
            },

            {
                id: "first-experiment",
                title: "Lab Explorer",
                description:
                    "Complete your first experiment",
                icon: "🧪"
            },

            {
                id: "first-quiz",
                title: "Quiz Starter",
                description:
                    "Complete your first quiz",
                icon: "📝"
            },

            {
                id: "quiz-master",
                title: "Quiz Master",
                description:
                    "Reach 80% or higher on a quiz",
                icon: "🏆"
            },

            {
                id: "xp-100",
                title: "Century Chemist",
                description:
                    "Reach 100 XP",
                icon: "💯"
            },

            {
                id: "level-5",
                title: "Rising Chemist",
                description:
                    "Reach Level 5",
                icon: "⭐"
            },

            {
                id: "streak-3",
                title: "Getting Consistent",
                description:
                    "Reach a 3-day streak",
                icon: "🔥"
            },

            {
                id: "streak-7",
                title: "One Week Strong",
                description:
                    "Reach a 7-day streak",
                icon: "🔥"
            }
        ];


    const unlocked =
        progress &&
        Array.isArray(progress.achievements)
            ? progress.achievements
            : [];


    if (counter) {

        counter.textContent =
            `${unlocked.length}/${definitions.length}`;
    }


    if (!progress) {

        grid.innerHTML = `
            <div class="achievements-empty">
                <strong>Sign in to track achievements.</strong>
                <br>
                Your achievements will appear here.
            </div>
        `;

        return;
    }


    grid.innerHTML =
        definitions.map(
            achievement => {

                const isUnlocked =
                    unlocked.includes(
                        achievement.id
                    );


                return `
                    <article
                        class="
                            achievement-card
                            ${isUnlocked
                                ? "unlocked"
                                : "locked"}
                        "
                    >

                        <div class="achievement-check">
                            ${
                                isUnlocked
                                    ? "✓"
                                    : "🔒"
                            }
                        </div>


                        <div class="achievement-icon">
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
                                ${
                                    isUnlocked
                                        ? "unlocked"
                                        : "locked"
                                }
                            "
                        >
                            ${
                                isUnlocked
                                    ? "✓ Unlocked"
                                    : "🔒 Locked"
                            }
                        </span>

                    </article>
                `;
            }
        ).join("");
}


/* =========================================================
   SAFE HTML
========================================================= */

function escapeAchievementHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   REFRESH WHEN PROGRESS CHANGES
========================================================= */

function refreshAchievementsUI() {

    renderChemLabAchievements();
}


/* =========================================================
   PAGE OBSERVER
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            renderChemLabAchievements,
            1200
        );


        setInterval(
            renderChemLabAchievements,
            2000
        );
    }
);


/* =========================================================
   PUBLIC API
========================================================= */

window.renderChemLabAchievements =
    renderChemLabAchievements;

window.refreshAchievementsUI =
    refreshAchievementsUI;
