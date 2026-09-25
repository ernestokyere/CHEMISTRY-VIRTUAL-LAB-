"use strict";

/* =========================================================
   CHEMLAB — REAL STUDENT PROGRESS ENGINE
   CLEAN REPLACEMENT
   Compatible with:
   - app.js
   - auth.js
   - achievements.js
   - Supabase student_progress
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const CHEMLAB_PROGRESS_CONFIG = {
    supabaseUrl:
        "https://zscbgeaieiqwknhjxpnt.supabase.co",

    supabaseKey:
        "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy",

    table:
        "student_progress",

    saveDelay:
        800
};


/* =========================================================
   PROGRESS STATE
========================================================= */

const chemLabProgress = {

    loaded: false,

    loading: false,

    saving: false,

    saveQueued: false,

    lastSavedSignature: "",

    currentUserId: null,

    xp: 0,

    level: 1,

    experimentsCompleted: 0,

    quizzesCompleted: 0,

    quizScore: 0,

    bestQuizPercentage: 0,

    streak: 0,

    lastActivityDate: null,

    achievements: []
};


/* =========================================================
   ACHIEVEMENTS
========================================================= */

const CHEMLAB_ACHIEVEMENTS = [

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
   DATE HELPERS
========================================================= */

function progressDateKey(date = new Date()) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function progressToday() {

    return progressDateKey();
}


function progressYesterday() {

    const date =
        new Date();

    date.setDate(
        date.getDate() - 1
    );

    return progressDateKey(date);
}


/* =========================================================
   VALUE HELPERS
========================================================= */

function progressNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return Math.max(
        0,
        Math.floor(number)
    );
}


function progressSafeArray(value) {

    if (!Array.isArray(value)) {
        return [];
    }

    return [
        ...new Set(
            value.filter(
                item =>
                    typeof item === "string"
            )
        )
    ];
}


/* =========================================================
   SIGNATURE
========================================================= */

function progressSignature() {

    return JSON.stringify({

        xp:
            chemLabProgress.xp,

        level:
            chemLabProgress.level,

        experimentsCompleted:
            chemLabProgress.experimentsCompleted,

        quizzesCompleted:
            chemLabProgress.quizzesCompleted,

        quizScore:
            chemLabProgress.quizScore,

        bestQuizPercentage:
            chemLabProgress.bestQuizPercentage,

        streak:
            chemLabProgress.streak,

        lastActivityDate:
            chemLabProgress.lastActivityDate,

        achievements:
            chemLabProgress.achievements

    });
}


/* =========================================================
   LEVEL SYSTEM
========================================================= */

function calculateChemLabLevel(xp) {

    const safeXP =
        progressNumber(xp);

    return (
        Math.floor(
            safeXP / 100
        ) + 1
    );
}


function getLevelProgress(xp) {

    const safeXP =
        progressNumber(xp);

    const level =
        calculateChemLabLevel(
            safeXP
        );

    const levelStart =
        (level - 1) * 100;

    const levelEnd =
        level * 100;

    const current =
        safeXP - levelStart;

    const required =
        levelEnd - levelStart;

    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    (current / required) * 100
                )
            )
        );

    return {

        level,

        current,

        required,

        percentage,

        totalXP:
            safeXP

    };
}


/* =========================================================
   SUPABASE CLIENT
========================================================= */

function getChemLabSupabaseClient() {

    if (
        window.supabaseClient &&
        typeof window.supabaseClient.auth === "object"
    ) {

        return window.supabaseClient;
    }

    if (
        window.supabase &&
        typeof window.supabase.createClient ===
            "function"
    ) {

        try {

            const client =
                window.supabase.createClient(
                    CHEMLAB_PROGRESS_CONFIG.supabaseUrl,
                    CHEMLAB_PROGRESS_CONFIG.supabaseKey
                );

            window.supabaseClient =
                client;

            return client;

        } catch (error) {

            console.error(
                "ChemLab Supabase client error:",
                error
            );
        }
    }

    return null;
}


/* =========================================================
   CURRENT SESSION
========================================================= */

async function getChemLabProgressSession() {

    try {

        if (
            typeof window.getCurrentSession ===
            "function"
        ) {

            const session =
                await window.getCurrentSession();

            if (session) {
                return session;
            }
        }

    } catch (error) {

        console.warn(
            "Could not obtain session from auth.js:",
            error
        );
    }


    const client =
        getChemLabSupabaseClient();

    if (!client) {
        return null;
    }


    try {

        const result =
            await client.auth.getSession();

        return (
            result &&
            result.data &&
            result.data.session
        ) || null;

    } catch (error) {

        console.error(
            "Supabase session error:",
            error
        );

        return null;
    }
}


/* =========================================================
   CURRENT USER
========================================================= */

async function getChemLabProgressUser() {

    try {

        if (
            typeof window.getCurrentUser ===
            "function"
        ) {

            const user =
                await window.getCurrentUser();

            if (user) {
                return user;
            }
        }

    } catch (error) {

        console.warn(
            "Could not obtain user from auth.js:",
            error
        );
    }


    const session =
        await getChemLabProgressSession();

    if (
        session &&
        session.user
    ) {

        return session.user;
    }


    return null;
}


/* =========================================================
   RESET LOCAL STATE
========================================================= */

function resetChemLabProgressState() {

    chemLabProgress.loaded =
        false;

    chemLabProgress.loading =
        false;

    chemLabProgress.saving =
        false;

    chemLabProgress.saveQueued =
        false;

    chemLabProgress.lastSavedSignature =
        "";

    chemLabProgress.currentUserId =
        null;

    chemLabProgress.xp =
        0;

    chemLabProgress.level =
        1;

    chemLabProgress.experimentsCompleted =
        0;

    chemLabProgress.quizzesCompleted =
        0;

    chemLabProgress.quizScore =
        0;

    chemLabProgress.bestQuizPercentage =
        0;

    chemLabProgress.streak =
        0;

    chemLabProgress.lastActivityDate =
        null;

    chemLabProgress.achievements =
        [];

    updateProgressUI();
}


/* =========================================================
   LOAD PROGRESS
========================================================= */

async function loadStudentProgress() {

    if (chemLabProgress.loading) {
        return false;
    }


    chemLabProgress.loading =
        true;


    try {

        const session =
            await getChemLabProgressSession();


        if (
            !session ||
            !session.access_token ||
            !session.user
        ) {

            resetChemLabProgressState();

            return false;
        }


        const user =
            session.user;


        const token =
            session.access_token;


        chemLabProgress.currentUserId =
            user.id;


        const url =
            `${CHEMLAB_PROGRESS_CONFIG.supabaseUrl}` +
            `/rest/v1/${CHEMLAB_PROGRESS_CONFIG.table}` +
            `?user_id=eq.${encodeURIComponent(user.id)}` +
            `&select=*`;


        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {

                        apikey:
                            CHEMLAB_PROGRESS_CONFIG.supabaseKey,

                        Authorization:
                            `Bearer ${token}`,

                        Accept:
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Progress load failed:",
                errorText
            );

            return false;
        }


        const rows =
            await response.json();


        if (
            !Array.isArray(rows) ||
            rows.length === 0
        ) {

            const created =
                await createStudentProgress(
                    user.id,
                    token
                );

            if (!created) {
                return false;
            }

        } else {

            const data =
                rows[0];

            applyProgressData(
                data
            );
        }


        chemLabProgress.loaded =
            true;


        chemLabProgress.level =
            calculateChemLabLevel(
                chemLabProgress.xp
            );


        await registerDailyActivity(
            false
        );


        checkAchievements();

        updateProgressUI();


        chemLabProgress.lastSavedSignature =
            progressSignature();


        console.log(
            "ChemLab progress loaded."
        );


        return true;

    } catch (error) {

        console.error(
            "ChemLab progress load error:",
            error
        );

        return false;

    } finally {

        chemLabProgress.loading =
            false;
    }
}


/* =========================================================
   APPLY DATABASE DATA
========================================================= */

function applyProgressData(data) {

    chemLabProgress.xp =
        progressNumber(
            data.xp
        );


    chemLabProgress.level =
        calculateChemLabLevel(
            chemLabProgress.xp
        );


    chemLabProgress.experimentsCompleted =
        progressNumber(
            data.experiments_completed
        );


    chemLabProgress.quizzesCompleted =
        progressNumber(
            data.quizzes_completed
        );


    chemLabProgress.quizScore =
        progressNumber(
            data.quiz_score
        );


    chemLabProgress.bestQuizPercentage =
        progressNumber(
            data.best_quiz_percentage
        );


    chemLabProgress.streak =
        progressNumber(
            data.streak
        );


    chemLabProgress.lastActivityDate =
        data.last_activity_date ||
        null;


    chemLabProgress.achievements =
        progressSafeArray(
            data.achievements
        );
}


/* =========================================================
   CREATE INITIAL PROGRESS
========================================================= */

async function createStudentProgress(
    userId,
    token
) {

    const initialData = {

        user_id:
            userId,

        xp:
            0,

        level:
            1,

        experiments_completed:
            0,

        quizzes_completed:
            0,

        quiz_score:
            0,

        best_quiz_percentage:
            0,

        streak:
            0,

        last_activity_date:
            null,

        achievements:
            []
    };


    try {

        const response =
            await fetch(

                `${CHEMLAB_PROGRESS_CONFIG.supabaseUrl}` +
                `/rest/v1/${CHEMLAB_PROGRESS_CONFIG.table}`,

                {
                    method: "POST",

                    headers: {

                        apikey:
                            CHEMLAB_PROGRESS_CONFIG.supabaseKey,

                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",

                        Prefer:
                            "return=minimal"
                    },

                    body:
                        JSON.stringify(
                            initialData
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Could not create progress:",
                errorText
            );

            return false;
        }


        applyProgressData(
            initialData
        );


        chemLabProgress.currentUserId =
            userId;


        return true;

    } catch (error) {

        console.error(
            "Create progress error:",
            error
        );

        return false;
    }
}


/* =========================================================
   SAVE TIMER
========================================================= */

let progressSaveTimer =
    null;


function scheduleProgressSave() {

    clearTimeout(
        progressSaveTimer
    );


    progressSaveTimer =
        setTimeout(
            () => {

                saveStudentProgress();

            },
            CHEMLAB_PROGRESS_CONFIG.saveDelay
        );
}


/* =========================================================
   SAVE PROGRESS
========================================================= */

async function saveStudentProgress() {

    if (!chemLabProgress.loaded) {
        return false;
    }


    if (!chemLabProgress.currentUserId) {
        return false;
    }


    if (chemLabProgress.saving) {

        chemLabProgress.saveQueued =
            true;

        return false;
    }


    chemLabProgress.level =
        calculateChemLabLevel(
            chemLabProgress.xp
        );


    const signature =
        progressSignature();


    if (
        signature ===
        chemLabProgress.lastSavedSignature
    ) {

        return true;
    }


    const session =
        await getChemLabProgressSession();


    if (
        !session ||
        !session.access_token
    ) {

        return false;
    }


    chemLabProgress.saving =
        true;

    chemLabProgress.saveQueued =
        false;


    try {

        const payload = {

            xp:
                chemLabProgress.xp,

            level:
                chemLabProgress.level,

            experiments_completed:
                chemLabProgress.experimentsCompleted,

            quizzes_completed:
                chemLabProgress.quizzesCompleted,

            quiz_score:
                chemLabProgress.quizScore,

            best_quiz_percentage:
                chemLabProgress.bestQuizPercentage,

            streak:
                chemLabProgress.streak,

            last_activity_date:
                chemLabProgress.lastActivityDate,

            achievements:
                chemLabProgress.achievements,

            updated_at:
                new Date().toISOString()
        };


        const response =
            await fetch(

                `${CHEMLAB_PROGRESS_CONFIG.supabaseUrl}` +
                `/rest/v1/${CHEMLAB_PROGRESS_CONFIG.table}` +
                `?user_id=eq.${encodeURIComponent(
                    chemLabProgress.currentUserId
                )}`,

                {
                    method: "PATCH",

                    headers: {

                        apikey:
                            CHEMLAB_PROGRESS_CONFIG.supabaseKey,

                        Authorization:
                            `Bearer ${session.access_token}`,

                        "Content-Type":
                            "application/json",

                        Prefer:
                            "return=minimal"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Progress save failed:",
                errorText
            );

            return false;
        }


        chemLabProgress.lastSavedSignature =
            progressSignature();


        console.log(
            "ChemLab progress saved."
        );


        return true;

    } catch (error) {

        console.error(
            "Progress save error:",
            error
        );

        return false;

    } finally {

        chemLabProgress.saving =
            false;


        if (
            chemLabProgress.saveQueued
        ) {

            scheduleProgressSave();
        }
    }
}


/* =========================================================
   DAILY ACTIVITY
========================================================= */

async function registerDailyActivity(
    shouldSave = true
) {

    if (!chemLabProgress.loaded) {
        return false;
    }


    const today =
        progressToday();


    const last =
        chemLabProgress.lastActivityDate;


    if (last === today) {
        return false;
    }


    if (!last) {

        chemLabProgress.streak =
            1;

    } else {

        const yesterday =
            progressYesterday();


        if (last === yesterday) {

            chemLabProgress.streak =
                Math.max(
                    1,
                    chemLabProgress.streak + 1
                );

        } else {

            chemLabProgress.streak =
                1;
        }
    }


    chemLabProgress.lastActivityDate =
        today;


    checkAchievements();

    updateProgressUI();


    if (shouldSave) {
        scheduleProgressSave();
    }


    return true;
}


/* =========================================================
   ADD XP
========================================================= */

function awardChemLabXP(
    amount,
    reason = "ChemLab activity"
) {

    if (!chemLabProgress.loaded) {
        return false;
    }


    const xp =
        progressNumber(amount);


    if (xp <= 0) {
        return false;
    }


    const previousLevel =
        chemLabProgress.level;


    chemLabProgress.xp +=
        xp;


    chemLabProgress.level =
        calculateChemLabLevel(
            chemLabProgress.xp
        );


    registerDailyActivity(
        false
    );


    checkAchievements();

    updateProgressUI();

    scheduleProgressSave();


    if (
        chemLabProgress.level >
        previousLevel
    ) {

        showProgressNotification(

            `🎉 Level ${chemLabProgress.level}!`,

            `You earned ${xp} XP from ${reason}.`
        );

    } else {

        showProgressNotification(

            `+${xp} XP`,

            reason
        );
    }


    return true;
}


/* =========================================================
   EXPERIMENT COMPLETION
========================================================= */

function completeChemLabExperiment(
    experimentName = "Experiment",
    xpReward = 25
) {

    if (!chemLabProgress.loaded) {
        return false;
    }


    /*
       Supports both:

       completeChemLabExperiment("Titration")

       and:

       completeChemLabExperiment("Titration", 30)
    */

    if (
        typeof experimentName !==
        "string"
    ) {

        experimentName =
            "Experiment";
    }


    xpReward =
        progressNumber(
            xpReward,
            25
        );


    chemLabProgress.experimentsCompleted +=
        1;


    registerDailyActivity(
        false
    );


    awardChemLabXP(
        xpReward,
        experimentName
    );


    checkAchievements();

    updateProgressUI();

    scheduleProgressSave();


    return true;
}


/* =========================================================
   QUIZ COMPLETION
========================================================= */

function recordChemLabQuiz(
    score,
    total
) {

    if (!chemLabProgress.loaded) {
        return false;
    }


    const safeScore =
        Math.min(
            progressNumber(score),
            Math.max(
                1,
                progressNumber(
                    total,
                    1
                )
            )
        );


    const safeTotal =
        Math.max(
            1,
            progressNumber(
                total,
                1
            )
        );


    const percentage =
        Math.round(
            (
                safeScore /
                safeTotal
            ) * 100
        );


    chemLabProgress.quizzesCompleted +=
        1;


    chemLabProgress.quizScore +=
        safeScore;


    chemLabProgress.bestQuizPercentage =
        Math.max(
            chemLabProgress.bestQuizPercentage,
            percentage
        );


    let xpReward =
        10;


    if (percentage >= 80) {

        xpReward =
            25;

    } else if (percentage >= 60) {

        xpReward =
            18;
    }


    registerDailyActivity(
        false
    );


    awardChemLabXP(
        xpReward,
        `Quiz — ${percentage}%`
    );


    checkAchievements();

    updateProgressUI();

    scheduleProgressSave();


    return true;
}


/* =========================================================
   ACHIEVEMENT UNLOCK
========================================================= */

function unlockAchievement(
    achievementId
) {

    if (!chemLabProgress.loaded) {
        return false;
    }


    if (
        chemLabProgress.achievements
            .includes(
                achievementId
            )
    ) {

        return false;
    }


    const achievement =
        CHEMLAB_ACHIEVEMENTS.find(
            item =>
                item.id ===
                achievementId
        );


    if (!achievement) {
        return false;
    }


    chemLabProgress.achievements.push(
        achievementId
    );


    showProgressNotification(

        `${achievement.icon} Achievement Unlocked!`,

        `${achievement.title} — ${achievement.description}`
    );


    scheduleProgressSave();

    updateProgressUI();


    return true;
}


/* =========================================================
   ACHIEVEMENT CHECKER
========================================================= */

function checkAchievements() {

    if (!chemLabProgress.loaded) {
        return;
    }


    if (
        chemLabProgress.xp >= 1
    ) {

        unlockAchievement(
            "first-step"
        );
    }


    if (
        chemLabProgress.experimentsCompleted >= 1
    ) {

        unlockAchievement(
            "first-experiment"
        );
    }


    if (
        chemLabProgress.quizzesCompleted >= 1
    ) {

        unlockAchievement(
            "first-quiz"
        );
    }


    /*
       Correct quiz-master logic:
       checks the best percentage obtained
       on an individual quiz.
    */

    if (
        chemLabProgress.bestQuizPercentage >= 80
    ) {

        unlockAchievement(
            "quiz-master"
        );
    }


    if (
        chemLabProgress.xp >= 100
    ) {

        unlockAchievement(
            "xp-100"
        );
    }


    if (
        chemLabProgress.level >= 5
    ) {

        unlockAchievement(
            "level-5"
        );
    }


    if (
        chemLabProgress.streak >= 3
    ) {

        unlockAchievement(
            "streak-3"
        );
    }


    if (
        chemLabProgress.streak >= 7
    ) {

        unlockAchievement(
            "streak-7"
        );
    }
}


/* =========================================================
   PROGRESS UI
========================================================= */

function updateProgressUI() {

    const xp =
        document.getElementById(
            "xpValue"
        );


    const streak =
        document.getElementById(
            "streakValue"
        );


    const level =
        document.getElementById(
            "levelValue"
        );


    const experiments =
        document.getElementById(
            "experimentsCompleted"
        );


    const progressLevel =
        document.getElementById(
            "progressLevel"
        );


    const progressXP =
        document.getElementById(
            "progressXP"
        );


    const progressBar =
        document.getElementById(
            "progressBar"
        );


    const progressText =
        document.getElementById(
            "progressText"
        );


    if (xp) {

        xp.textContent =
            chemLabProgress.xp
                .toLocaleString();
    }


    if (streak) {

        streak.textContent =
            chemLabProgress.streak;
    }


    if (level) {

        level.textContent =
            chemLabProgress.level;
    }


    if (experiments) {

        experiments.textContent =
            chemLabProgress.experimentsCompleted;
    }


    const levelProgress =
        getLevelProgress(
            chemLabProgress.xp
        );


    if (progressLevel) {

        progressLevel.textContent =
            `Level ${levelProgress.level}`;
    }


    if (progressXP) {

        progressXP.textContent =
            `${levelProgress.current} / ${levelProgress.required} XP`;
    }


    if (progressBar) {

        progressBar.style.width =
            `${levelProgress.percentage}%`;

        progressBar.setAttribute(
            "aria-valuenow",
            String(
                levelProgress.percentage
            )
        );
    }


    if (progressText) {

        progressText.textContent =
            `${levelProgress.percentage}% to Level ${
                levelProgress.level + 1
            }`;
    }


    /*
       Optional dashboard elements.
       These IDs are intentionally different
       from the progress-page IDs.
    */

    const dashboardXP =
        document.getElementById(
            "dashboardXpValue"
        );


    const dashboardStreak =
        document.getElementById(
            "dashboardStreakValue"
        );


    const dashboardLevel =
        document.getElementById(
            "dashboardLevelValue"
        );


    const dashboardExperiments =
        document.getElementById(
            "dashboardExperimentsCompleted"
        );


    if (dashboardXP) {

        dashboardXP.textContent =
            chemLabProgress.xp
                .toLocaleString();
    }


    if (dashboardStreak) {

        dashboardStreak.textContent =
            chemLabProgress.streak;
    }


    if (dashboardLevel) {

        dashboardLevel.textContent =
            chemLabProgress.level;
    }


    if (dashboardExperiments) {

        dashboardExperiments.textContent =
            chemLabProgress.experimentsCompleted;
    }
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showProgressNotification(
    title,
    message
) {

    if (
        typeof window.showNotification ===
        "function"
    ) {

        window.showNotification(
            `${title} — ${message}`,
            "success"
        );

        return;
    }


    console.log(
        `${title}: ${message}`
    );
}


/* =========================================================
   AUTH CHANGE HANDLER
========================================================= */

let progressAuthTimer =
    null;


async function handleProgressAuthChange() {

    clearTimeout(
        progressAuthTimer
    );


    progressAuthTimer =
        setTimeout(
            async () => {

                const user =
                    await getChemLabProgressUser();


                if (
                    !user ||
                    !user.id
                ) {

                    resetChemLabProgressState();

                    return;
                }


                if (
                    chemLabProgress.currentUserId !==
                    user.id
                ) {

                    resetChemLabProgressState();

                    await loadStudentProgress();

                } else if (
                    !chemLabProgress.loaded
                ) {

                    await loadStudentProgress();
                }

            },
            150
        );
}


/* =========================================================
   AUTH EVENT
========================================================= */

window.addEventListener(
    "chemlab:auth-change",
    handleProgressAuthChange
);


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "hidden"
        ) {

            saveStudentProgress();
        }
    }
);


/* =========================================================
   BROWSER CLOSE / NAVIGATION
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        /*
           Best-effort save.

           Browsers may cancel ordinary async
           requests during unload, so this is
           supplementary rather than the primary
           save mechanism.
        */

        if (
            chemLabProgress.loaded
        ) {

            saveStudentProgress();
        }
    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

let progressInitializationStarted =
    false;


async function initializeChemLabProgress() {

    if (
        progressInitializationStarted
    ) {

        return;
    }


    progressInitializationStarted =
        true;


    /*
       First attempt immediately.
       auth.js already owns session restoration.
    */

    await loadStudentProgress();


    /*
       A second attempt handles cases where
       Supabase session restoration finishes
       slightly after page startup.
    */

    if (
        !chemLabProgress.loaded
    ) {

        setTimeout(
            async () => {

                if (
                    !chemLabProgress.loaded
                ) {

                    await loadStudentProgress();
                }

            },
            1200
        );
    }


    updateProgressUI();
}


/* =========================================================
   PUBLIC API
========================================================= */

window.chemLabProgress =
    chemLabProgress;


window.CHEMLAB_ACHIEVEMENTS =
    CHEMLAB_ACHIEVEMENTS;


window.loadStudentProgress =
    loadStudentProgress;


window.saveStudentProgress =
    saveStudentProgress;


window.awardChemLabXP =
    awardChemLabXP;


window.completeChemLabExperiment =
    completeChemLabExperiment;


window.recordChemLabQuiz =
    recordChemLabQuiz;


window.unlockAchievement =
    unlockAchievement;


window.checkAchievements =
    checkAchievements;


window.updateProgressUI =
    updateProgressUI;


window.getLevelProgress =
    getLevelProgress;


window.calculateChemLabLevel =
    calculateChemLabLevel;


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChemLabProgress,
        {
            once: true
        }
    );

} else {

    initializeChemLabProgress();
}
