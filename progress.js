"use strict";

/* =========================================================
   CHEMLAB — REAL STUDENT PROGRESS ENGINE
   STAGE 8B
========================================================= */

const CHEMLAB_PROGRESS_CONFIG = {
    supabaseUrl: "https://zscbgeaieiqwknhjxpnt.supabase.co",

    supabaseKey:
        "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy",

    table: "student_progress",

    saveDelay: 800
};


/* =========================================================
   LOCAL PROGRESS STATE
========================================================= */

const chemLabProgress = {
    loaded: false,
    saving: false,
    lastSavedSignature: "",

    xp: 0,
    level: 1,

    experimentsCompleted: 0,

    quizzesCompleted: 0,
    quizScore: 0,

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
   HELPERS
========================================================= */

function progressToday() {
    return new Date().toISOString().slice(0, 10);
}


function progressYesterday() {
    const date = new Date();

    date.setDate(date.getDate() - 1);

    return date.toISOString().slice(0, 10);
}


function progressNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? Math.max(0, Math.floor(number))
        : fallback;
}


function progressSafeArray(value) {
    return Array.isArray(value) ? value : [];
}


function progressSignature() {
    return JSON.stringify({
        xp: chemLabProgress.xp,
        level: chemLabProgress.level,
        experimentsCompleted:
            chemLabProgress.experimentsCompleted,
        quizzesCompleted:
            chemLabProgress.quizzesCompleted,
        quizScore:
            chemLabProgress.quizScore,
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

    const safeXP = progressNumber(xp);

    return Math.floor(safeXP / 100) + 1;
}


function getLevelProgress(xp) {

    const safeXP = progressNumber(xp);

    const level = calculateChemLabLevel(safeXP);

    const levelStart = (level - 1) * 100;

    const levelEnd = level * 100;

    const current = safeXP - levelStart;

    const required = levelEnd - levelStart;

    const percentage =
        Math.min(100, Math.round((current / required) * 100));

    return {
        level,
        current,
        required,
        percentage,
        totalXP: safeXP
    };
}


/* =========================================================
   AUTH TOKEN
========================================================= */

async function getChemLabProgressToken() {

    try {

        if (
            typeof window.getAISessionToken ===
            "function"
        ) {

            const token =
                await window.getAISessionToken();

            if (token) {
                return token;
            }
        }

    } catch (error) {

        console.warn(
            "ChemLab progress token error:",
            error
        );
    }

    return null;
}


/* =========================================================
   CURRENT USER
========================================================= */

async function getChemLabProgressUser() {

    const token =
        await getChemLabProgressToken();

    if (!token) {
        return null;
    }

    try {

        const response = await fetch(
            `${CHEMLAB_PROGRESS_CONFIG.supabaseUrl}/auth/v1/user`,
            {
                method: "GET",

                headers: {
                    apikey:
                        CHEMLAB_PROGRESS_CONFIG.supabaseKey,

                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return null;
        }

        const user = await response.json();

        return user || null;

    } catch (error) {

        console.error(
            "Could not get ChemLab user:",
            error
        );

        return null;
    }
}


/* =========================================================
   LOAD PROGRESS
========================================================= */

async function loadStudentProgress() {

    const token =
        await getChemLabProgressToken();

    if (!token) {

        chemLabProgress.loaded = false;

        return false;
    }


    const user =
        await getChemLabProgressUser();

    if (!user || !user.id) {

        chemLabProgress.loaded = false;

        return false;
    }


    try {

        const url =
            `${CHEMLAB_PROGRESS_CONFIG.supabaseUrl}` +
            `/rest/v1/${CHEMLAB_PROGRESS_CONFIG.table}` +
            `?user_id=eq.${encodeURIComponent(user.id)}` +
            `&select=*`;


        const response = await fetch(url, {

            method: "GET",

            headers: {
                apikey:
                    CHEMLAB_PROGRESS_CONFIG.supabaseKey,

                Authorization:
                    `Bearer ${token}`,

                Accept:
                    "application/json"
            }

        });


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


        if (!rows.length) {

            await createStudentProgress(
                user.id,
                token
            );

            chemLabProgress.loaded = true;

            updateProgressUI();

            return true;
        }


        const data = rows[0];


        chemLabProgress.xp =
            progressNumber(data.xp);

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

        chemLabProgress.streak =
            progressNumber(data.streak);

        chemLabProgress.lastActivityDate =
            data.last_activity_date || null;

        chemLabProgress.achievements =
            progressSafeArray(
                data.achievements
            );


        chemLabProgress.loaded = true;

        updateProgressUI();

        checkAchievements();

        console.log(
            "ChemLab progress loaded:",
            chemLabProgress
        );

        return true;

    } catch (error) {

        console.error(
            "ChemLab progress error:",
            error
        );

        return false;
    }
}


/* =========================================================
   CREATE INITIAL PROGRESS
========================================================= */

async function createStudentProgress(
    userId,
    token
) {

    const today =
        progressToday();


    const initialData = {

        user_id: userId,

        xp: 0,

        level: 1,

        experiments_completed: 0,

        quizzes_completed: 0,

        quiz_score: 0,

        streak: 1,

        last_activity_date: today,

        achievements: []
    };


    try {

        const response = await fetch(

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
                    JSON.stringify(initialData)
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


        chemLabProgress.xp = 0;

        chemLabProgress.level = 1;

        chemLabProgress.experimentsCompleted = 0;

        chemLabProgress.quizzesCompleted = 0;

        chemLabProgress.quizScore = 0;

        chemLabProgress.streak = 1;

        chemLabProgress.lastActivityDate = today;

        chemLabProgress.achievements = [];

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
   SAVE PROGRESS
========================================================= */

let progressSaveTimer = null;


function scheduleProgressSave() {

    clearTimeout(progressSaveTimer);


    progressSaveTimer = setTimeout(
        saveStudentProgress,
        CHEMLAB_PROGRESS_CONFIG.saveDelay
    );
}


async function saveStudentProgress() {

    if (!chemLabProgress.loaded) {
        return false;
    }


    if (chemLabProgress.saving) {
        return false;
    }


    const signature =
        progressSignature();


    if (
        signature ===
        chemLabProgress.lastSavedSignature
    ) {

        return true;
    }


    const token =
        await getChemLabProgressToken();


    if (!token) {
        return false;
    }


    const user =
        await getChemLabProgressUser();


    if (!user || !user.id) {
        return false;
    }


    chemLabProgress.saving = true;


    try {

        chemLabProgress.level =
            calculateChemLabLevel(
                chemLabProgress.xp
            );


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

            streak:
                chemLabProgress.streak,

            last_activity_date:
                chemLabProgress.lastActivityDate,

            achievements:
                chemLabProgress.achievements,

            updated_at:
                new Date().toISOString()
        };


        const response = await fetch(

            `${CHEMLAB_PROGRESS_CONFIG.supabaseUrl}` +
            `/rest/v1/${CHEMLAB_PROGRESS_CONFIG.table}` +
            `?user_id=eq.${encodeURIComponent(user.id)}`,

            {
                method: "PATCH",

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
                    JSON.stringify(payload)
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
            signature;


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

        chemLabProgress.saving = false;
    }
}


/* =========================================================
   DAILY STREAK
========================================================= */

async function registerDailyActivity() {

    if (!chemLabProgress.loaded) {
        return;
    }


    const today =
        progressToday();

    const last =
        chemLabProgress.lastActivityDate;


    if (last === today) {
        return;
    }


    const yesterday =
        progressYesterday();


    if (last === yesterday) {

        chemLabProgress.streak =
            Math.max(
                1,
                chemLabProgress.streak + 1
            );

    } else {

        chemLabProgress.streak = 1;
    }


    chemLabProgress.lastActivityDate =
        today;


    checkAchievements();

    updateProgressUI();

    scheduleProgressSave();
}


/* =========================================================
   ADD XP
========================================================= */

function awardChemLabXP(
    amount,
    reason = "ChemLab activity"
) {

    if (!chemLabProgress.loaded) {
        return;
    }


    const xp =
        progressNumber(amount);


    if (xp <= 0) {
        return;
    }


    const previousLevel =
        chemLabProgress.level;


    chemLabProgress.xp += xp;


    chemLabProgress.level =
        calculateChemLabLevel(
            chemLabProgress.xp
        );


    registerDailyActivity();


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
}


/* =========================================================
   EXPERIMENT COMPLETION
========================================================= */

function completeChemLabExperiment(
    experimentName = "Experiment"
) {

    if (!chemLabProgress.loaded) {
        return;
    }


    chemLabProgress.experimentsCompleted += 1;


    awardChemLabXP(
        25,
        experimentName
    );


    checkAchievements();

    updateProgressUI();

    scheduleProgressSave();
}


/* =========================================================
   QUIZ COMPLETION
========================================================= */

function recordChemLabQuiz(
    score,
    total
) {

    if (!chemLabProgress.loaded) {
        return;
    }


    const safeScore =
        progressNumber(score);

    const safeTotal =
        Math.max(
            1,
            progressNumber(total, 1)
        );


    const percentage =
        Math.round(
            (safeScore / safeTotal) * 100
        );


    chemLabProgress.quizzesCompleted += 1;

    chemLabProgress.quizScore +=
        safeScore;


    let xpReward = 10;


    if (percentage >= 80) {

        xpReward = 25;

    } else if (percentage >= 60) {

        xpReward = 18;
    }


    awardChemLabXP(
        xpReward,
        `Quiz — ${percentage}%`
    );


    checkAchievements();

    updateProgressUI();

    scheduleProgressSave();
}


/* =========================================================
   ACHIEVEMENT SYSTEM
========================================================= */

function unlockAchievement(
    achievementId
) {

    if (
        chemLabProgress.achievements
            .includes(achievementId)
    ) {

        return false;
    }


    chemLabProgress.achievements.push(
        achievementId
    );


    const achievement =
        CHEMLAB_ACHIEVEMENTS.find(
            item =>
                item.id === achievementId
        );


    if (achievement) {

        showProgressNotification(

            `${achievement.icon} Achievement Unlocked!`,

            `${achievement.title} — ${achievement.description}`
        );
    }


    scheduleProgressSave();

    updateProgressUI();

    return true;
}


function checkAchievements() {

    if (!chemLabProgress.loaded) {
        return;
    }


    if (chemLabProgress.xp >= 1) {

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


    if (chemLabProgress.quizScore >= 4) {

        unlockAchievement(
            "quiz-master"
        );
    }


    if (chemLabProgress.xp >= 100) {

        unlockAchievement(
            "xp-100"
        );
    }


    if (chemLabProgress.level >= 5) {

        unlockAchievement(
            "level-5"
        );
    }


    if (chemLabProgress.streak >= 3) {

        unlockAchievement(
            "streak-3"
        );
    }


    if (chemLabProgress.streak >= 7) {

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
        document.getElementById("xpValue");

    const streak =
        document.getElementById("streakValue");

    const level =
        document.getElementById("levelValue");

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
            chemLabProgress.xp.toLocaleString();
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
    }


    if (progressText) {

        progressText.textContent =
            `${levelProgress.percentage}% to Level ${levelProgress.level + 1}`;
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
   MONITOR EXISTING CHEMLAB STATE
========================================================= */

let lastDetectedXP = null;

let lastDetectedExperiments = null;

let lastDetectedQuizScore = null;


function monitorExistingChemLabState() {

    if (
        !window.chemLabState ||
        !chemLabProgress.loaded
    ) {

        return;
    }


    const state =
        window.chemLabState;


    const currentXP =
        progressNumber(state.xp);


    const currentExperiments =
        progressNumber(
            state.experimentsCompleted
        );


    const currentQuizScore =
        progressNumber(
            state.quizScore
        );


    if (lastDetectedXP === null) {

        lastDetectedXP =
            currentXP;
    }


    if (lastDetectedExperiments === null) {

        lastDetectedExperiments =
            currentExperiments;
    }


    if (lastDetectedQuizScore === null) {

        lastDetectedQuizScore =
            currentQuizScore;
    }


    /*
       Sync XP increases from the existing
       ChemLab application.
    */

    if (currentXP > lastDetectedXP) {

        const difference =
            currentXP - lastDetectedXP;


        if (
            chemLabProgress.xp <
            currentXP
        ) {

            chemLabProgress.xp =
                Math.max(
                    chemLabProgress.xp,
                    currentXP
                );


            chemLabProgress.level =
                calculateChemLabLevel(
                    chemLabProgress.xp
                );


            registerDailyActivity();

            checkAchievements();

            updateProgressUI();

            scheduleProgressSave();
        }
    }


    /*
       Sync experiment completions.
    */

    if (
        currentExperiments >
        lastDetectedExperiments
    ) {

        const difference =
            currentExperiments -
            lastDetectedExperiments;


        chemLabProgress.experimentsCompleted =
            Math.max(
                chemLabProgress.experimentsCompleted,
                currentExperiments
            );


        registerDailyActivity();

        checkAchievements();

        updateProgressUI();

        scheduleProgressSave();
    }


    /*
       Sync quiz score.
    */

    if (
        currentQuizScore >
        lastDetectedQuizScore
    ) {

        chemLabProgress.quizScore =
            Math.max(
                chemLabProgress.quizScore,
                currentQuizScore
            );


        registerDailyActivity();

        checkAchievements();

        updateProgressUI();

        scheduleProgressSave();
    }


    lastDetectedXP =
        currentXP;

    lastDetectedExperiments =
        currentExperiments;

    lastDetectedQuizScore =
        currentQuizScore;
}


/* =========================================================
   AUTH STATE MONITOR
========================================================= */

let progressInitializationStarted = false;


async function initializeChemLabProgress() {

    if (progressInitializationStarted) {
        return;
    }


    progressInitializationStarted = true;


    /*
       Give auth.js time to restore
       the Supabase session.
    */

    await new Promise(
        resolve =>
            setTimeout(resolve, 800)
    );


    const loaded =
        await loadStudentProgress();


    if (loaded) {

        await registerDailyActivity();

        updateProgressUI();

        checkAchievements();
    }


    /*
       Keep the existing ChemLab state
       synchronized with Supabase.
    */

    setInterval(
        monitorExistingChemLabState,
        1500
    );
}


/* =========================================================
   PUBLIC API
========================================================= */

window.chemLabProgress =
    chemLabProgress;


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


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            initializeChemLabProgress,
            1000
        );
    }
);
