/* =========================================================
   CHEMLAB
   ACHIEVEMENTS SYSTEM
   Version 5.0
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       01. HELPERS
       ===================================================== */

    function getAchievementDefinitions() {
        if (
            Array.isArray(window.CHEMLAB_ACHIEVEMENTS) &&
            window.CHEMLAB_ACHIEVEMENTS.length
        ) {
            return window.CHEMLAB_ACHIEVEMENTS;
        }

        return [];
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getProgressState() {
        return window.chemLabProgress || null;
    }


    /* =====================================================
       02. RENDER ACHIEVEMENTS
       ===================================================== */

    function renderChemLabAchievements() {

        const grid = document.getElementById("achievementsGrid");
        const countElement =
            document.getElementById("achievementUnlockedCount");

        if (!grid) {
            return;
        }

        const definitions = getAchievementDefinitions();
        const progress = getProgressState();

        if (!definitions.length) {

            grid.innerHTML = `
                <div class="achievement-empty">
                    <div class="achievement-empty-icon">🏆</div>
                    <h3>Achievements are coming soon</h3>
                    <p>
                        Complete experiments, quizzes and learning
                        activities to unlock achievements.
                    </p>
                </div>
            `;

            if (countElement) {
                countElement.textContent = "0";
            }

            return;
        }


        if (!progress) {

            grid.innerHTML = `
                <div class="achievement-empty">
                    <div class="achievement-empty-icon">🔐</div>
                    <h3>Sign in to track achievements</h3>
                    <p>
                        Your achievements will appear here as you
                        learn and complete experiments.
                    </p>

                    <button
                        type="button"
                        class="primary-button"
                        onclick="openAuthModal('login')"
                    >
                        Sign In
                    </button>
                </div>
            `;

            if (countElement) {
                countElement.textContent = "0";
            }

            return;
        }


        const unlocked =
            Array.isArray(progress.achievements)
                ? progress.achievements
                : [];


        if (countElement) {
            countElement.textContent = unlocked.length;
        }


        grid.innerHTML = definitions.map((achievement) => {

            const id = achievement.id || "";
            const title = achievement.title || "Achievement";
            const description =
                achievement.description ||
                "Complete a learning milestone to unlock this achievement.";

            const icon = achievement.icon || "🏆";

            const isUnlocked = unlocked.includes(id);

            return `
                <article
                    class="achievement-card ${
                        isUnlocked ? "unlocked" : "locked"
                    }"
                    data-achievement-id="${escapeHTML(id)}"
                >

                    <div class="achievement-icon">
                        ${escapeHTML(icon)}
                    </div>

                    <div class="achievement-content">

                        <div class="achievement-title-row">

                            <h3>
                                ${escapeHTML(title)}
                            </h3>

                            ${
                                isUnlocked
                                    ? `
                                        <span class="achievement-status unlocked">
                                            Unlocked
                                        </span>
                                      `
                                    : `
                                        <span class="achievement-status locked">
                                            Locked
                                        </span>
                                      `
                            }

                        </div>

                        <p>
                            ${escapeHTML(description)}
                        </p>

                    </div>

                    ${
                        isUnlocked
                            ? `
                                <div class="achievement-check">
                                    ✓
                                </div>
                              `
                            : `
                                <div class="achievement-lock">
                                    🔒
                                </div>
                              `
                    }

                </article>
            `;
        }).join("");
    }


    /* =====================================================
       03. REFRESH
       ===================================================== */

    function refreshAchievements() {
        renderChemLabAchievements();
    }


    /* =====================================================
       04. EVENT LISTENERS
       ===================================================== */

    window.addEventListener(
        "chemlab:progress-change",
        refreshAchievements
    );


    window.addEventListener(
        "chemlab:auth-change",
        function () {
            setTimeout(refreshAchievements, 100);
        }
    );


    document.addEventListener(
        "visibilitychange",
        function () {

            if (!document.hidden) {
                refreshAchievements();
            }

        }
    );


    /* =====================================================
       05. PUBLIC API
       ===================================================== */

    window.renderChemLabAchievements =
        renderChemLabAchievements;

    window.refreshChemLabAchievements =
        refreshAchievements;


    /* =====================================================
       06. INITIALIZE
       ===================================================== */

    function initializeAchievements() {

        setTimeout(function () {
            renderChemLabAchievements();
        }, 300);

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAchievements
        );

    } else {

        initializeAchievements();

    }

})();
