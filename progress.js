/* =========================================================
   CHEMLAB
   REAL STUDENT PROGRESS ENGINE
   Version 4.0
   =========================================================

   Handles:
   - XP
   - Levels
   - Daily streaks
   - Experiment completion
   - Quiz statistics
   - Achievement state
   - Supabase persistence
   - Dashboard synchronization
   ========================================================= */


/* =========================================================
   01. CONFIG
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
   02. ACHIEVEMENTS
========================================================= */

const CHEMLAB_ACHIEVEMENTS = [

    {
        id:
            "first-step",

        icon:
            "🚀",

        title:
            "First Step",

        description:
            "Start your ChemLab learning journey.",

        condition:
            progress =>
                progress.xp > 0
    },


    {
        id:
            "first-experiment",

        icon:
            "⚗️",

        title:
            "First Experiment",

        description:
            "Complete your first chemistry experiment.",

        condition:
            progress =>
                progress.experimentsCompleted >= 1
    },


    {
        id:
            "first-quiz",

        icon:
            "🧠",

        title:
            "Quiz Starter",

        description:
            "Complete your first chemistry quiz.",

        condition:
            progress =>
                progress.quizzesCompleted >= 1
    },


    {
        id:
            "quiz-master",

        icon:
            "🏆",

        title:
            "Quiz Master",

        description:
            "Score 100% on a chemistry quiz.",

        condition:
            progress =>
                progress.bestQuizPercentage >= 100
    },


    {
        id:
            "xp-100",

        icon:
            "⭐",

        title:
            "100 XP",

        description:
            "Earn your first 100 XP.",

        condition:
            progress =>
                progress.xp >= 100
    },


    {
        id:
            "level-5",

        icon:
            "🔥",

        title:
            "Level 5",

        description:
            "Reach Level 5.",

        condition:
            progress =>
                progress.level >= 5
    },


    {
        id:
            "streak-3",

        icon:
            "📅",

        title:
            "3-Day Streak",

        description:
            "Learn chemistry for three days in a row.",

        condition:
            progress =>
                progress.streak >= 3
    },


    {
        id:
            "streak-7",

        icon:
            "🔥",

        title:
            "7-Day Streak",

        description:
            "Maintain a seven-day learning streak.",

        condition:
            progress =>
                progress.streak >= 7
    }

];


window.CHEMLAB_ACHIEVEMENTS =
    CHEMLAB_ACHIEVEMENTS;


/* =========================================================
   03. STATE
========================================================= */

const chemLabProgress = {

    loaded:
        false,

    loading:
        false,

    saving:
        false,

    saveQueued:
        false,

    currentUserId:
        null,

    lastSavedSignature:
        "",

    xp:
        0,

    level:
        1,

    experimentsCompleted:
        0,

    quizzesCompleted:
        0,

    quizScore:
        0,

    bestQuizPercentage:
        0,

    streak:
        0,

    lastActivityDate:
        null,

    achievements:
        []

};


window.chemLabProgress =
    chemLabProgress;


/* =========================================================
   04. SUPABASE
========================================================= */

function getProgressClient() {

    if (
        window.supabaseClient
    ) {

        return window.supabaseClient;

    }


    if (
        typeof window.supabase ===
        "undefined"
    ) {

        return null;

    }


    window.supabaseClient =
        window.supabase.createClient(
            CHEMLAB_PROGRESS_CONFIG.supabaseUrl,
            CHEMLAB_PROGRESS_CONFIG.supabaseKey,
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
   05. SAFE HELPERS
========================================================= */

function progressNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : fallback;

}


function progressArray(
    value
) {

    return Array.isArray(value)
        ? value
        : [];

}


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
   06. DATE HELPERS
========================================================= */

function getTodayString() {

    const date =
        new Date();


    return [

        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        ),

        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )

    ].join("-");

}


function getYesterdayString() {

    const date =
        new Date();


    date.setDate(
        date.getDate() - 1
    );


    return [

        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        ),

        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )

    ].join("-");

}


/* =========================================================
   07. LEVEL SYSTEM
========================================================= */

function calculateChemLabLevel(
    xp
) {

    const safeXP =
        Math.max(
            0,
            progressNumber(
                xp,
                0
            )
        );


    return (
        Math.floor(
            safeXP / 100
        ) + 1
    );

}


function getLevelProgress(
    xp
) {

    const safeXP =
        Math.max(
            0,
            progressNumber(
                xp,
                0
            )
        );


    const level =
        calculateChemLabLevel(
            safeXP
        );


    const currentLevelXP =
        (level - 1) * 100;


    const nextLevelXP =
        level * 100;


    const progressXP =
        safeXP -
        currentLevelXP;


    const requiredXP =
        nextLevelXP -
        currentLevelXP;


    const percentage =
        Math.min(
            100,
            Math.round(
                (
                    progressXP /
                    requiredXP
                ) * 100
            )
        );


    return {

        level,

        currentLevelXP,

        nextLevelXP,

        progressXP,

        requiredXP,

        percentage

    };

}


window.calculateChemLabLevel =
    calculateChemLabLevel;

window.getLevelProgress =
    getLevelProgress;


/* =========================================================
   08. CURRENT USER
========================================================= */

async function getProgressUser() {

    if (
        typeof window.getCurrentUser ===
        "function"
    ) {

        try {

            return await window.getCurrentUser();

        } catch {

            /* fallback below */

        }

    }


    const client =
        getProgressClient();


    if (!client) {
        return null;
    }


    try {

        const {
            data
        } =
            await client.auth.getUser();


        return data?.user ||
            null;

    } catch {

        return null;

    }

}


/* =========================================================
   09. RESET LOCAL STATE
========================================================= */

function resetProgressState() {

    chemLabProgress.loaded =
        false;

    chemLabProgress.loading =
        false;

    chemLabProgress.saving =
        false;

    chemLabProgress.saveQueued =
        false;

    chemLabProgress.currentUserId =
        null;

    chemLabProgress.lastSavedSignature =
        "";

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

    emitProgressChange();

}


/* =========================================================
   10. APPLY DATABASE DATA
========================================================= */

function applyProgressData(
    data
) {

    chemLabProgress.xp =
        progressNumber(
            data?.xp,
            0
        );


    chemLabProgress.level =
        calculateChemLabLevel(
            chemLabProgress.xp
        );


    chemLabProgress.experimentsCompleted =
        progressNumber(
            data?.experiments_completed,
            0
        );


    chemLabProgress.quizzesCompleted =
        progressNumber(
            data?.quizzes_completed,
            0
        );


    chemLabProgress.quizScore =
        progressNumber(
            data?.quiz_score,
            0
        );


    chemLabProgress.bestQuizPercentage =
        progressNumber(
            data?.best_quiz_percentage,
            0
        );


    chemLabProgress.streak =
        progressNumber(
            data?.streak,
            0
        );


    chemLabProgress.lastActivityDate =
        data?.last_activity_date ||
        null;


    chemLabProgress.achievements =
        progressArray(
            data?.achievements
        );

}


/* =========================================================
   11. CREATE PROGRESS ROW
========================================================= */

async function createProgressRow(
    userId
) {

    const client =
        getProgressClient();


    if (
        !client ||
        !userId
    ) {

        return null;

    }


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

        const {
            data,
            error
        } =
            await client
                .from(
                    CHEMLAB_PROGRESS_CONFIG.table
                )
                .insert(
                    initialData
                )
                .select("*")
                .single();


        if (!error) {

            return data;

        }


        /*
           Another request may have created
           the row. Fetch it again.
        */

        const retry =
            await client
                .from(
                    CHEMLAB_PROGRESS_CONFIG.table
                )
                .select("*")
                .eq(
                    "user_id",
                    userId
                )
                .limit(1);


        return retry.data?.[0] ||
            null;

    } catch (error) {

        console.error(
            "ChemLab progress creation error:",
            error
        );

        return null;

    }

}


/* =========================================================
   12. LOAD PROGRESS
========================================================= */

async function loadStudentProgress() {

    if (
        chemLabProgress.loading
    ) {

        return;

    }


    const user =
        await getProgressUser();


    if (!user) {

        resetProgressState();

        return;

    }


    chemLabProgress.loading =
        true;


    try {

        const client =
            getProgressClient();


        if (!client) {

            return;

        }


        let {
            data,
            error
        } =
            await client
                .from(
                    CHEMLAB_PROGRESS_CONFIG.table
                )
                .select("*")
                .eq(
                    "user_id",
                    user.id
                )
                .limit(1);


        if (error) {

            throw error;

        }


        if (
            !data ||
            !data.length
        ) {

            const created =
                await createProgressRow(
                    user.id
                );


            data =
                created
                    ? [created]
                    : [];

        }


        if (!data.length) {

            throw new Error(
                "Could not create student progress."
            );

        }


        chemLabProgress.currentUserId =
            user.id;


        applyProgressData(
            data[0]
        );


        chemLabProgress.loaded =
            true;


        /*
           Mark the current day as activity.
           Save afterward so the streak is
           actually persisted.
        */

        const signatureBeforeActivity =
            progressSignature();


        await registerDailyActivity(
            false
        );


        chemLabProgress.lastSavedSignature =
            signatureBeforeActivity;


        checkAchievements();

        updateProgressUI();

        emitProgressChange();


        /*
           If daily activity changed the data,
           persist it.
        */

        if (
            progressSignature() !==
            signatureBeforeActivity
        ) {

            scheduleProgressSave();

        }


    } catch (error) {

        console.error(
            "ChemLab progress loading error:",
            error
        );


    } finally {

        chemLabProgress.loading =
            false;

    }

}


window.loadStudentProgress =
    loadStudentProgress;


/* =========================================================
   13. SAVE PROGRESS
========================================================= */

async function saveStudentProgress(
    immediate = false
) {

    if (
        !chemLabProgress.loaded ||
        !chemLabProgress.currentUserId
    ) {

        return false;

    }


    if (
        chemLabProgress.saving
    ) {

        chemLabProgress.saveQueued =
            true;

        return false;

    }


    const signature =
        progressSignature();


    if (
        !immediate &&
        signature ===
        chemLabProgress.lastSavedSignature
    ) {

        return true;

    }


    const client =
        getProgressClient();


    if (!client) {

        return false;

    }


    chemLabProgress.saving =
        true;


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
                chemLabProgress.achievements

        };


        const {
            error
        } =
            await client
                .from(
                    CHEMLAB_PROGRESS_CONFIG.table
                )
                .update(
                    payload
                )
                .eq(
                    "user_id",
                    chemLabProgress.currentUserId
                );


        if (error) {

            throw error;

        }


        chemLabProgress.lastSavedSignature =
            signature;


        return true;

    } catch (error) {

        console.error(
            "ChemLab progress save error:",
            error
        );

        return false;

    } finally {

        chemLabProgress.saving =
            false;


        if (
            chemLabProgress.saveQueued
        ) {

            chemLabProgress.saveQueued =
                false;

            scheduleProgressSave();

        }

    }

}


/* =========================================================
   14. DEBOUNCED SAVE
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
            CHEMLAB_PROGRESS_CONFIG
                .saveDelay
        );

}


/* =========================================================
   15. DAILY ACTIVITY
========================================================= */

async function registerDailyActivity(
    shouldSave = true
) {

    if (
        !chemLabProgress.loaded
    ) {

        return;

    }


    const today =
        getTodayString();


    if (
        chemLabProgress
            .lastActivityDate ===
        today
    ) {

        return;

    }


    const yesterday =
        getYesterdayString();


    if (
        !chemLabProgress
            .lastActivityDate
    ) {

        chemLabProgress.streak =
            1;

    } else if (
        chemLabProgress
            .lastActivityDate ===
        yesterday
    ) {

        chemLabProgress.streak +=
            1;

    } else {

        chemLabProgress.streak =
            1;

    }


    chemLabProgress
        .lastActivityDate =
        today;


    checkAchievements();

    updateProgressUI();

    emitProgressChange();


    if (shouldSave) {

        scheduleProgressSave();

    }

}


/* =========================================================
   16. AWARD XP
========================================================= */

async function awardChemLabXP(
    amount,
    reason = ""
) {

    if (
        !chemLabProgress.loaded
    ) {

        console.warn(
            "ChemLab XP award ignored because progress has not loaded."
        );

        return;

    }


    const xpAmount =
        Math.max(
            0,
            Math.round(
                progressNumber(
                    amount,
                    0
                )
            )
        );


    if (
        xpAmount <= 0
    ) {

        return;

    }


    const previousLevel =
        chemLabProgress.level;


    chemLabProgress.xp +=
        xpAmount;


    chemLabProgress.level =
        calculateChemLabLevel(
            chemLabProgress.xp
        );


    await registerDailyActivity(
        false
    );


    checkAchievements();

    updateProgressUI();

    emitProgressChange();

    scheduleProgressSave();


    if (
        chemLabProgress.level >
        previousLevel
    ) {

        if (
            typeof window.showNotification ===
            "function"
        ) {

            window.showNotification(
                `Level up! You reached Level ${chemLabProgress.level}.`,
                "success",
                5000
            );

        }

    } else if (
        reason &&
        typeof window.showNotification ===
        "function"
    ) {

        window.showNotification(
            `+${xpAmount} XP — ${reason}`,
            "success"
        );

    }

}


window.awardChemLabXP =
    awardChemLabXP;


/* =========================================================
   17. COMPLETE EXPERIMENT
========================================================= */

async function completeChemLabExperiment(
    name,
    xpReward = 25
) {

    if (
        !chemLabProgress.loaded
    ) {

        return;

    }


    chemLabProgress
        .experimentsCompleted +=
        1;


    await registerDailyActivity(
        false
    );


    /*
       Award XP directly here rather than
       calling awardChemLabXP, because we
       need exactly one completion update.
    */

    const reward =
        Math.max(
            0,
            Math.round(
                progressNumber(
                    xpReward,
                    25
                )
            )
        );


    chemLabProgress.xp +=
        reward;


    chemLabProgress.level =
        calculateChemLabLevel(
            chemLabProgress.xp
        );


    checkAchievements();

    updateProgressUI();

    emitProgressChange();

    scheduleProgressSave();


    if (
        typeof window.showNotification ===
        "function"
    ) {

        window.showNotification(
            `${name} completed! +${reward} XP`,
            "success"
        );

    }

}


window.completeChemLabExperiment =
    completeChemLabExperiment;


/* =========================================================
   18. RECORD QUIZ
========================================================= */

async function recordChemLabQuiz(
    score,
    total
) {

    if (
        !chemLabProgress.loaded
    ) {

        return;

    }


    const safeScore =
        Math.max(
            0,
            progressNumber(
                score,
                0
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


    chemLabProgress
        .quizzesCompleted +=
        1;


    chemLabProgress
        .quizScore +=
        safeScore;


    chemLabProgress
        .bestQuizPercentage =
        Math.max(
            chemLabProgress
                .bestQuizPercentage,
            percentage
        );


    let reward =
        10;


    if (
        percentage >= 80
    ) {

        reward =
            25;

    } else if (
        percentage >= 60
    ) {

        reward =
            18;

    }


    await registerDailyActivity(
        false
    );


    chemLabProgress.xp +=
        reward;


    chemLabProgress.level =
        calculateChemLabLevel(
            chemLabProgress.xp
        );


    checkAchievements();

    updateProgressUI();

    emitProgressChange();

    scheduleProgressSave();


    if (
        typeof window.showNotification ===
        "function"
    ) {

        window.showNotification(
            `Quiz completed! +${reward} XP`,
            "success"
        );

    }

}


window.recordChemLabQuiz =
    recordChemLabQuiz;


/* =========================================================
   19. ACHIEVEMENTS
========================================================= */

function checkAchievements() {

    if (
        !chemLabProgress.loaded
    ) {

        return;

    }


    const unlocked =
        progressArray(
            chemLabProgress.achievements
        );


    CHEMLAB_ACHIEVEMENTS.forEach(
        achievement => {

            if (
                unlocked.includes(
                    achievement.id
                )
            ) {

                return;

            }


            let passed =
                false;


            try {

                passed =
                    Boolean(
                        achievement.condition(
                            chemLabProgress
                        )
                    );

            } catch {

                passed =
                    false;

            }


            if (
                passed
            ) {

                unlockAchievement(
                    achievement
                );

            }

        }
    );

}


function unlockAchievement(
    achievement
) {

    if (
        chemLabProgress
            .achievements
            .includes(
                achievement.id
            )
    ) {

        return;

    }


    chemLabProgress
        .achievements
        .push(
            achievement.id
        );


    if (
        typeof window.showNotification ===
        "function"
    ) {

        window.showNotification(
            `Achievement unlocked: ${achievement.title}`,
            "success",
            5000
        );

    }


    scheduleProgressSave();

    emitProgressChange(
        achievement.id
    );

}


window.checkChemLabAchievements =
    checkAchievements;


/* =========================================================
   20. PROGRESS UI
========================================================= */

function updateProgressUI() {

    const levelData =
        getLevelProgress(
            chemLabProgress.xp
        );


    chemLabProgress.level =
        levelData.level;


    /*
       Main progress
    */

    setProgressText(
        "xpValue",
        chemLabProgress.xp
    );


    setProgressText(
        "streakValue",
        chemLabProgress.streak
    );


    setProgressText(
        "levelValue",
        chemLabProgress.level
    );


    setProgressText(
        "experimentsCompleted",
        chemLabProgress
            .experimentsCompleted
    );


    /*
       Progress page
    */

    setProgressText(
        "progressLevel",
        `Level ${levelData.level}`
    );


    setProgressText(
        "progressXP",
        `${levelData.progressXP} / ${levelData.requiredXP} XP`
    );


    setProgressWidth(
        "progressBar",
        levelData.percentage
    );


    setProgressText(
        "progressText",
        `${levelData.percentage}% to Level ${levelData.level + 1}`
    );


    /*
       Dashboard
    */

    setProgressText(
        "dashboardXpValue",
        chemLabProgress.xp
    );


    setProgressText(
        "dashboardStreakValue",
        chemLabProgress.streak
    );


    setProgressText(
        "dashboardLevelValue",
        chemLabProgress.level
    );


    setProgressText(
        "dashboardExperimentsCompleted",
        chemLabProgress
            .experimentsCompleted
    );


    setProgressText(
        "dashboardProgressLevel",
        `Level ${levelData.level}`
    );


    setProgressText(
        "dashboardProgressXP",
        `${levelData.progressXP} / ${levelData.requiredXP} XP`
    );


    setProgressWidth(
        "dashboardProgressBar",
        levelData.percentage
    );


    setProgressText(
        "dashboardProgressText",
        `${levelData.percentage}% to Level ${levelData.level + 1}`
    );


    /*
       Achievement count
    */

    setProgressText(
        "achievementUnlockedCount",
        `${chemLabProgress.achievements.length}/${CHEMLAB_ACHIEVEMENTS.length}`
    );

}


function setProgressText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "";

    }

}


function setProgressWidth(
    id,
    percentage
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.style.width =
            `${Math.max(
                0,
                Math.min(
                    100,
                    percentage
                )
            )}%`;

    }

}


window.updateProgressUI =
    updateProgressUI;


/* =========================================================
   21. PROGRESS EVENT
========================================================= */

function emitProgressChange(
    achievementId = null
) {

    document.dispatchEvent(
        new CustomEvent(
            "chemlab:progress-change",
            {

                detail: {

                    progress:
                        chemLabProgress,

                    achievementId

                }

            }
        )
    );

}


/* =========================================================
   22. AUTH CHANGE
========================================================= */

document.addEventListener(
    "chemlab:auth-change",
    async event => {

        const user =
            event?.detail?.user ||
            null;


        if (!user) {

            resetProgressState();

            return;

        }


        await loadStudentProgress();

    }
);


/* =========================================================
   23. PAGE VISIBILITY
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


window.addEventListener(
    "pagehide",
    () => {

        saveStudentProgress();

    }
);


/* =========================================================
   24. INITIALIZATION
========================================================= */

async function initializeChemLabProgress() {

    if (
        window.__CHEMLAB_PROGRESS_INITIALIZED
    ) {

        return;

    }


    window.__CHEMLAB_PROGRESS_INITIALIZED =
        true;


    updateProgressUI();


    const user =
        await getProgressUser();


    if (user) {

        await loadStudentProgress();

    }


    /*
       Auth may initialize slightly
       after this script.
    */

    setTimeout(
        async () => {

            if (
                !chemLabProgress.loaded
            ) {

                const currentUser =
                    await getProgressUser();


                if (currentUser) {

                    await loadStudentProgress();

                }

            }

        },
        1200
    );

}


/* =========================================================
   25. PUBLIC API
========================================================= */

window.initializeChemLabProgress =
    initializeChemLabProgress;

window.saveStudentProgress =
    saveStudentProgress;

window.registerDailyActivity =
    registerDailyActivity;

window.getChemLabProgress =
    () =>
        chemLabProgress;


/* =========================================================
   26. DOM READY
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
