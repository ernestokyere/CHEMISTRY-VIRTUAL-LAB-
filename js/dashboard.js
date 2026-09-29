/* =========================================================
   CHEMLAB
   PROFESSIONAL DASHBOARD ENGINE
   Stage 4.1
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       STATE
       ===================================================== */

    const DASHBOARD_STATE = {
        initialized: false,
        loading: false,

        stats: {
            experiments: 0,
            mastery: 0,
            assessments: 0,
            xp: 0,
            streak: 0,
            level: 1
        },

        profile: null,

        lastUpdated: null
    };


    /* =====================================================
       HELPERS
       ===================================================== */

    function log() {
        if (
            window.CHEMLAB_LOG &&
            typeof window.CHEMLAB_LOG.info === "function"
        ) {
            window.CHEMLAB_LOG.info(
                "[Dashboard]",
                ...arguments
            );
        }
    }


    function warn() {
        if (
            window.CHEMLAB_LOG &&
            typeof window.CHEMLAB_LOG.warn === "function"
        ) {
            window.CHEMLAB_LOG.warn(
                "[Dashboard]",
                ...arguments
            );
        }
    }


    function getAuth() {
        return window.CHEMLAB_AUTH || null;
    }


    function getProfile() {
        return window.CHEMLAB_PROFILE || null;
    }


    function getSupabaseClient() {
        const auth = getAuth();

        if (
            auth &&
            typeof auth.getClient === "function"
        ) {
            return auth.getClient();
        }

        return null;
    }


    function getConfig() {
        return window.CHEMLAB_CONFIG || {};
    }


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    function setText(selector, value) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(function (element) {
            element.textContent = value;
        });
    }


    function setProgress(selector, value) {
        const elements = document.querySelectorAll(selector);

        const safeValue = Math.max(
            0,
            Math.min(100, Number(value) || 0)
        );

        elements.forEach(function (element) {
            element.style.width = safeValue + "%";
            element.setAttribute(
                "aria-valuenow",
                String(safeValue)
            );
        });
    }


    function formatNumber(value) {
        const number = Number(value) || 0;

        return number.toLocaleString();
    }


    /* =====================================================
       PROFILE
       ===================================================== */

    async function loadStudentProfile() {
        try {
            const profileManager = getProfile();

            if (
                profileManager &&
                typeof profileManager.loadProfile === "function"
            ) {
                const profile =
                    await profileManager.loadProfile();

                if (profile) {
                    DASHBOARD_STATE.profile = profile;
                }

                return profile;
            }
        } catch (error) {
            warn(
                "Unable to load dashboard profile.",
                error
            );
        }

        return null;
    }


    /* =====================================================
       DATABASE COUNT
       ===================================================== */

    async function countRows(tableName) {
        const client = getSupabaseClient();

        if (!client || !tableName) {
            return 0;
        }

        try {
            const result = await client
                .from(tableName)
                .select("*", {
                    count: "exact",
                    head: true
                });

            if (result.error) {
                warn(
                    "Unable to count table:",
                    tableName,
                    result.error
                );

                return 0;
            }

            return Number(result.count) || 0;

        } catch (error) {
            warn(
                "Database count failed:",
                tableName,
                error
            );

            return 0;
        }
    }


    /* =====================================================
       USER-SPECIFIC COUNT
       ===================================================== */

    async function countStudentRows(
        tableName,
        userId
    ) {
        const client = getSupabaseClient();

        if (
            !client ||
            !tableName ||
            !userId
        ) {
            return 0;
        }

        try {
            const result = await client
                .from(tableName)
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("student_id", userId);

            if (result.error) {
                return 0;
            }

            return Number(result.count) || 0;

        } catch (error) {
            return 0;
        }
    }


    /* =====================================================
       LOCAL DASHBOARD DATA
       ===================================================== */

    function loadLocalStats() {
        try {
            const stored =
                localStorage.getItem(
                    "chemlab_dashboard_stats"
                );

            if (!stored) {
                return;
            }

            const parsed = JSON.parse(stored);

            if (
                parsed &&
                typeof parsed === "object"
            ) {
                DASHBOARD_STATE.stats = {
                    ...DASHBOARD_STATE.stats,
                    ...parsed
                };
            }

        } catch (error) {
            warn(
                "Unable to read local dashboard stats.",
                error
            );
        }
    }


    function saveLocalStats() {
        try {
            localStorage.setItem(
                "chemlab_dashboard_stats",
                JSON.stringify(
                    DASHBOARD_STATE.stats
                )
            );
        } catch (error) {
            warn(
                "Unable to save dashboard stats.",
                error
            );
        }
    }


    /* =====================================================
       CALCULATE LEVEL
       ===================================================== */

    function calculateLevel(xp) {
        const safeXP = Math.max(
            0,
            Number(xp) || 0
        );

        return Math.max(
            1,
            Math.floor(safeXP / 500) + 1
        );
    }


    /* =====================================================
       LOAD DASHBOARD DATA
       ===================================================== */

    async function loadDashboardData() {
        if (DASHBOARD_STATE.loading) {
            return DASHBOARD_STATE.stats;
        }

        DASHBOARD_STATE.loading = true;

        try {
            loadLocalStats();

            const auth = getAuth();

            let user = null;

            if (
                auth &&
                typeof auth.getCurrentUser === "function"
            ) {
                user =
                    await auth.getCurrentUser();
            }

            if (!user) {
                renderDashboard();

                return DASHBOARD_STATE.stats;
            }

            const config = getConfig();

            const tables =
                config.supabase &&
                config.supabase.tables
                    ? config.supabase.tables
                    : {};

            /*
             * These counts are intentionally defensive.
             * The corresponding systems will become fully
             * functional as later ChemLab stages are built.
             */

            const [
                experiments,
                assessments
            ] = await Promise.all([
                countStudentRows(
                    tables.experimentSessions ||
                        "experiment_sessions",
                    user.id
                ),

                countStudentRows(
                    tables.assessmentAttempts ||
                        "assessment_attempts",
                    user.id
                )
            ]);


            DASHBOARD_STATE.stats.experiments =
                experiments;

            DASHBOARD_STATE.stats.assessments =
                assessments;


            /*
             * XP and mastery are currently stored locally
             * until the Progress/Mastery engine is built.
             */

            DASHBOARD_STATE.stats.level =
                calculateLevel(
                    DASHBOARD_STATE.stats.xp
                );

            DASHBOARD_STATE.lastUpdated =
                new Date().toISOString();

            saveLocalStats();

            renderDashboard();

            log(
                "Dashboard data loaded successfully."
            );

            return DASHBOARD_STATE.stats;

        } catch (error) {
            warn(
                "Dashboard loading failed.",
                error
            );

            renderDashboard();

            return DASHBOARD_STATE.stats;

        } finally {
            DASHBOARD_STATE.loading = false;
        }
    }


    /* =====================================================
       RENDER DASHBOARD
       ===================================================== */

    function renderDashboard() {
        const stats =
            DASHBOARD_STATE.stats;


        /* -----------------------------
           MAIN STATISTICS
           ----------------------------- */

        setText(
            "#dashboardExperimentsCompleted",
            formatNumber(stats.experiments)
        );

        setText(
            "#dashboardMasteryValue",
            stats.mastery + "%"
        );

        setText(
            "#dashboardAssessmentsCompleted",
            formatNumber(stats.assessments)
        );

        setText(
            "#dashboardScienceXP",
            formatNumber(stats.xp)
        );


        /* -----------------------------
           ADDITIONAL DASHBOARD VALUES
           ----------------------------- */

        setText(
            "#dashboardXpValue",
            formatNumber(stats.xp)
        );

        setText(
            "#dashboardStreakValue",
            formatNumber(stats.streak)
        );

        setText(
            "#dashboardLevelValue",
            "Level " + stats.level
        );


        /* -----------------------------
           PROGRESS BARS
           ----------------------------- */

        setProgress(
            "#dashboardMasteryProgress",
            stats.mastery
        );


        /* -----------------------------
           PROFILE
           ----------------------------- */

        const profile =
            DASHBOARD_STATE.profile;

        if (profile) {
            const name =
                profile.full_name ||
                "Chemistry Student";

            setText(
                "[data-dashboard-name]",
                name
            );

            setText(
                "[data-profile-name]",
                name
            );

            if (profile.academic_level) {
                setText(
                    "[data-dashboard-level]",
                    formatAcademicLevel(
                        profile.academic_level
                    )
                );
            }
        }
    }


    /* =====================================================
       ACADEMIC LEVEL FORMATTER
       ===================================================== */

    function formatAcademicLevel(level) {
        const values = {
            foundation: "Foundation Chemistry",
            undergraduate: "Undergraduate Chemistry",
            advanced: "Advanced Chemistry"
        };

        return (
            values[level] ||
            "Chemistry Student"
        );
    }


    /* =====================================================
       XP SYSTEM
       ===================================================== */

    function addXP(amount) {
        const value =
            Math.max(
                0,
                Number(amount) || 0
            );

        DASHBOARD_STATE.stats.xp += value;

        DASHBOARD_STATE.stats.level =
            calculateLevel(
                DASHBOARD_STATE.stats.xp
            );

        saveLocalStats();

        renderDashboard();

        return DASHBOARD_STATE.stats.xp;
    }


    /* =====================================================
       MASTERY
       ===================================================== */

    function setMastery(value) {
        DASHBOARD_STATE.stats.mastery =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(value) || 0
                )
            );

        saveLocalStats();

        renderDashboard();
    }


    /* =====================================================
       STREAK
       ===================================================== */

    function setStreak(value) {
        DASHBOARD_STATE.stats.streak =
            Math.max(
                0,
                Number(value) || 0
            );

        saveLocalStats();

        renderDashboard();
    }


    /* =====================================================
       REFRESH
       ===================================================== */

    async function refresh() {
        return loadDashboardData();
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    async function initialize() {
        if (DASHBOARD_STATE.initialized) {
            return;
        }

        DASHBOARD_STATE.initialized = true;

        loadLocalStats();

        await loadStudentProfile();

        await loadDashboardData();

        log(
            "Dashboard engine initialized."
        );
    }


    /* =====================================================
       AUTH STATE LISTENER
       ===================================================== */

    document.addEventListener(
        "chemlab:auth-state",
        function () {
            loadStudentProfile()
                .then(function () {
                    return loadDashboardData();
                });
        }
    );


    /* =====================================================
       PROFILE LISTENER
       ===================================================== */

    document.addEventListener(
        "chemlab:profile-loaded",
        function () {
            loadStudentProfile()
                .then(function () {
                    renderDashboard();
                });
        }
    );


    document.addEventListener(
        "chemlab:profile-updated",
        function () {
            loadStudentProfile()
                .then(function () {
                    renderDashboard();
                });
        }
    );


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CHEMLAB_DASHBOARD = {
        initialize,
        refresh,
        getStats: function () {
            return {
                ...DASHBOARD_STATE.stats
            };
        },
        addXP,
        setMastery,
        setStreak,
        getProfile: function () {
            return DASHBOARD_STATE.profile;
        }
    };


})();
