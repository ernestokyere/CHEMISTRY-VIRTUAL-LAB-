/* =========================================================
   CHEMLAB
   ACHIEVEMENTS ENGINE
   Version 4.0
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const CONFIG = {
        gridId: "achievementsGrid",
        countId: "achievementUnlockedCount"
    };


    /* =====================================================
       FALLBACK ACHIEVEMENTS
       Uses the same achievement source as progress.js
       ===================================================== */

    const FALLBACK_ACHIEVEMENTS = [
        {
            id: "first-step",
            title: "First Step",
            description: "Complete your first chemistry activity.",
            icon: "🚀"
        },
        {
            id: "lab-explorer",
            title: "Lab Explorer",
            description: "Complete your first virtual experiment.",
            icon: "🧪"
        },
        {
            id: "quiz-starter",
            title: "Quiz Starter",
            description: "Complete your first chemistry quiz.",
            icon: "📝"
        },
        {
            id: "quiz-master",
            title: "Quiz Master",
            description: "Score at least 80% on a chemistry quiz.",
            icon: "🏆"
        },
        {
            id: "xp-100",
            title: "Century of XP",
            description: "Earn 100 XP.",
            icon: "⚡"
        },
        {
            id: "xp-500",
            title: "Chemistry Pro",
            description: "Earn 500 XP.",
            icon: "🔥"
        },
        {
            id: "streak-7",
            title: "7-Day Streak",
            description: "Study chemistry for 7 consecutive days.",
            icon: "🔥"
        },
        {
            id: "experiment-master",
            title: "Experiment Master",
            description: "Complete 5 virtual experiments.",
            icon: "🔬"
        }
    ];


    /* =====================================================
       GET ACHIEVEMENT DEFINITIONS
       ===================================================== */

    function getDefinitions() {

        if (
            Array.isArray(window.CHEMLAB_ACHIEVEMENTS) &&
            window.CHEMLAB_ACHIEVEMENTS.length
        ) {
            return window.CHEMLAB_ACHIEVEMENTS;
        }

        return FALLBACK_ACHIEVEMENTS;
    }


    /* =====================================================
       GET CURRENT PROGRESS
       ===================================================== */

    function getProgress() {

        if (
            window.chemLabProgress &&
            typeof window.chemLabProgress === "object"
        ) {
            return window.chemLabProgress;
        }

        return null;
    }


    /* =====================================================
       SAFE TEXT
       ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       CHECK UNLOCKED STATE
       ===================================================== */

    function isUnlocked(achievement, progress) {

        if (!progress) {
            return false;
        }

        const unlocked =
            Array.isArray(progress.achievements)
                ? progress.achievements
                : [];

        return unlocked.includes(achievement.id);
    }


    /* =====================================================
       GET UNLOCK DATE
       ===================================================== */

    function getUnlockDate(achievement, progress) {

        if (!progress) {
            return null;
        }

        const dates =
            progress.achievementDates ||
            progress.achievementUnlockDates ||
            {};

        return dates[achievement.id] || null;
    }


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        try {
            return date.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        } catch (error) {
            return "";
        }
    }


    /* =====================================================
       RENDER EMPTY / LOGIN STATE
       ===================================================== */

    function renderGuestState(container, countElement) {

        if (countElement) {
            countElement.textContent = "0";
        }

        container.innerHTML = `
            <div class="achievement-empty-state">
                <div class="achievement-empty-icon">🏆</div>

                <h3>Start your chemistry journey</h3>

                <p>
                    Sign in and complete activities to unlock
                    achievements, earn XP and build your chemistry profile.
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
    }


    /* =====================================================
       RENDER ACHIEVEMENTS
       ===================================================== */

    function renderAchievements() {

        const container =
            document.getElementById(CONFIG.gridId);

        if (!container) {
            return;
        }

        const countElement =
            document.getElementById(CONFIG.countId);

        const progress = getProgress();

        if (!progress) {
            renderGuestState(container, countElement);
            return;
        }

        const definitions = getDefinitions();

        if (!definitions.length) {
            container.innerHTML = `
                <div class="achievement-empty-state">
                    <div class="achievement-empty-icon">🏆</div>
                    <h3>No achievements yet</h3>
                    <p>New achievements will appear here.</p>
                </div>
            `;

            if (countElement) {
                countElement.textContent = "0";
            }

            return;
        }

        let unlockedCount = 0;

        const cards = definitions.map((achievement) => {

            const unlocked =
                isUnlocked(achievement, progress);

            if (unlocked) {
                unlockedCount++;
            }

            const unlockDate =
                unlocked
                    ? formatDate(
                        getUnlockDate(
                            achievement,
                            progress
                        )
                    )
                    : "";

            const icon =
                achievement.icon ||
                achievement.emoji ||
                "🏆";

            return `
                <article
                    class="
                        achievement-card
                        ${unlocked ? "is-unlocked" : "is-locked"}
                    "
                    data-achievement-id="${escapeHTML(
                        achievement.id
                    )}"
                >

                    <div class="achievement-icon-wrap">
                        <span class="achievement-icon">
                            ${escapeHTML(icon)}
                        </span>

                        ${
                            unlocked
                                ? `
                                    <span
                                        class="achievement-check"
                                        aria-label="Unlocked"
                                    >
                                        ✓
                                    </span>
                                  `
                                : `
                                    <span
                                        class="achievement-lock"
                                        aria-label="Locked"
                                    >
                                        🔒
                                    </span>
                                  `
                        }
                    </div>


                    <div class="achievement-card-content">

                        <h3 class="achievement-title">
                            ${escapeHTML(
                                achievement.title ||
                                "Achievement"
                            )}
                        </h3>

                        <p class="achievement-description">
                            ${escapeHTML(
                                achievement.description ||
                                "Complete this achievement."
                            )}
                        </p>


                        ${
                            unlocked
                                ? `
                                    <div class="achievement-status unlocked">
                                        <span>✓ Unlocked</span>

                                        ${
                                            unlockDate
                                                ? `
                                                    <small>
                                                        ${escapeHTML(
                                                            unlockDate
                                                        )}
                                                    </small>
                                                  `
                                                : ""
                                        }
                                    </div>
                                  `
                                : `
                                    <div class="achievement-status locked">
                                        <span>🔒 Locked</span>
                                    </div>
                                  `
                        }

                    </div>

                </article>
            `;
        }).join("");

        container.innerHTML = cards;

        if (countElement) {
            countElement.textContent =
                `${unlockedCount}`;
        }
    }


    /* =====================================================
       REFRESH
       ===================================================== */

    function refreshAchievements() {

        try {
            renderAchievements();
        } catch (error) {
            console.error(
                "ChemLab achievements render error:",
                error
            );
        }
    }


    /* =====================================================
       SHOW ACHIEVEMENT NOTIFICATION
       ===================================================== */

    function showAchievementNotification(achievement) {

        if (!achievement) {
            return;
        }

        const title =
            achievement.title ||
            "Achievement Unlocked";

        const icon =
            achievement.icon ||
            achievement.emoji ||
            "🏆";

        const description =
            achievement.description ||
            "You unlocked a new achievement!";

        if (
            typeof window.showNotification === "function"
        ) {
            window.showNotification(
                `${icon} ${title}: ${description}`,
                "success"
            );

            return;
        }

        const container =
            document.getElementById(
                "notificationContainer"
            );

        if (!container) {
            return;
        }

        const notification =
            document.createElement("div");

        notification.className =
            "notification notification-success achievement-notification";

        notification.innerHTML = `
            <div class="notification-icon">
                ${escapeHTML(icon)}
            </div>

            <div class="notification-content">
                <strong>
                    ${escapeHTML(title)}
                </strong>

                <span>
                    ${escapeHTML(description)}
                </span>
            </div>

            <button
                type="button"
                class="notification-close"
                aria-label="Close notification"
            >
                ×
            </button>
        `;

        container.appendChild(notification);

        const closeButton =
            notification.querySelector(
                ".notification-close"
            );

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                () => notification.remove()
            );
        }

        setTimeout(() => {

            if (notification.isConnected) {
                notification.classList.add(
                    "notification-hide"
                );

                setTimeout(
                    () => notification.remove(),
                    300
                );
            }

        }, 5000);
    }


    /* =====================================================
       FIND NEW ACHIEVEMENTS
       ===================================================== */

    let previousUnlocked = new Set();


    function checkForNewAchievements() {

        const progress = getProgress();

        if (!progress) {
            previousUnlocked = new Set();
            return;
        }

        const unlocked =
            Array.isArray(progress.achievements)
                ? progress.achievements
                : [];

        const currentUnlocked =
            new Set(unlocked);

        if (previousUnlocked.size > 0) {

            currentUnlocked.forEach((achievementId) => {

                if (
                    !previousUnlocked.has(
                        achievementId
                    )
                ) {

                    const achievement =
                        getDefinitions().find(
                            item =>
                                item.id ===
                                achievementId
                        );

                    if (achievement) {
                        showAchievementNotification(
                            achievement
                        );
                    }
                }
            });
        }

        previousUnlocked =
            currentUnlocked;
    }


    /* =====================================================
       INITIALIZE PREVIOUS STATE
       ===================================================== */

    function initializeAchievementState() {

        const progress = getProgress();

        if (!progress) {
            previousUnlocked = new Set();
            return;
        }

        previousUnlocked =
            new Set(
                Array.isArray(progress.achievements)
                    ? progress.achievements
                    : []
            );
    }


    /* =====================================================
       PROGRESS EVENT
       ===================================================== */

    function handleProgressChange() {

        checkForNewAchievements();

        refreshAchievements();
    }


    /* =====================================================
       AUTH EVENT
       ===================================================== */

    function handleAuthChange() {

        setTimeout(() => {

            initializeAchievementState();

            refreshAchievements();

        }, 100);
    }


    /* =====================================================
       VISIBILITY
       ===================================================== */

    function handleVisibilityChange() {

        if (
            document.visibilityState ===
            "visible"
        ) {
            refreshAchievements();
        }
    }


    /* =====================================================
       PAGE EVENTS
       ===================================================== */

    document.addEventListener(
        "chemlab:progress-change",
        handleProgressChange
    );

    document.addEventListener(
        "chemlab:auth-change",
        handleAuthChange
    );

    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initialize() {

        initializeAchievementState();

        refreshAchievements();
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            { once: true }
        );

    } else {

        initialize();
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.renderChemLabAchievements =
        renderAchievements;

    window.refreshChemLabAchievements =
        refreshAchievements;

    window.showChemLabAchievementNotification =
        showAchievementNotification;

})();
