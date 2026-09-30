/* =========================================================
   CHEMLAB
   DASHBOARD ENGINE
   Stage 4.3
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       STATE
       ===================================================== */

    const DASHBOARD_STATE = {

        initialized: false,

        loading: false,

        profile: null,

        user: null,

        stats: {
            experiments: 0,
            assessments: 0,
            mastery: 0,
            xp: 0,
            streak: 0,
            level: 1
        },

        activity: [],

        recommendations: []

    };


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const LOCAL_KEYS = {

        xp: "chemlab_science_xp",

        streak: "chemlab_learning_streak",

        activity: "chemlab_dashboard_activity",

        mastery: "chemlab_mastery"

    };


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    function $(selector) {
        return document.querySelector(selector);
    }


    function $$(selector) {
        return Array.from(
            document.querySelectorAll(selector)
        );
    }


    function setText(selector, value) {

        const element = $(selector);

        if (!element) {
            return;
        }

        element.textContent = value;
    }


    function setWidth(selector, percentage) {

        const element = $(selector);

        if (!element) {
            return;
        }

        const safeValue = Math.max(
            0,
            Math.min(
                100,
                Number(percentage) || 0
            )
        );

        element.style.width = `${safeValue}%`;
    }


    /* =====================================================
       STORAGE
       ===================================================== */

    function getNumber(key, fallback = 0) {

        try {

            const value = Number(
                localStorage.getItem(key)
            );

            return Number.isFinite(value)
                ? value
                : fallback;

        } catch (error) {

            return fallback;
        }
    }


    function setNumber(key, value) {

        try {

            localStorage.setItem(
                key,
                String(Number(value) || 0)
            );

        } catch (error) {

            console.warn(
                "ChemLab: unable to save dashboard value.",
                error
            );
        }
    }


    function getJSON(key, fallback = []) {

        try {

            const raw = localStorage.getItem(key);

            if (!raw) {
                return fallback;
            }

            const parsed = JSON.parse(raw);

            return parsed ?? fallback;

        } catch (error) {

            return fallback;
        }
    }


    function setJSON(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        } catch (error) {

            console.warn(
                "ChemLab: unable to save dashboard data.",
                error
            );
        }
    }


    /* =====================================================
       SUPABASE
       ===================================================== */

    function getSupabaseClient() {

        if (
            window.CHEMLAB_AUTH &&
            typeof window.CHEMLAB_AUTH.getClient === "function"
        ) {

            return window.CHEMLAB_AUTH.getClient();

        }

        return null;
    }


    /* =====================================================
       AUTHENTICATION
       ===================================================== */

    async function getCurrentUser() {

        if (
            !window.CHEMLAB_AUTH ||
            typeof window.CHEMLAB_AUTH.getCurrentUser !== "function"
        ) {
            return null;
        }

        try {

            return await window.CHEMLAB_AUTH.getCurrentUser();

        } catch (error) {

            console.warn(
                "ChemLab: unable to get current user.",
                error
            );

            return null;
        }
    }


    /* =====================================================
       PROFILE
       ===================================================== */

    async function loadProfile() {

        DASHBOARD_STATE.profile = null;

        if (
            !window.CHEMLAB_PROFILE ||
            typeof window.CHEMLAB_PROFILE.loadProfile !== "function"
        ) {
            return null;
        }

        try {

            const profile =
                await window.CHEMLAB_PROFILE.loadProfile();

            DASHBOARD_STATE.profile = profile || null;

            return DASHBOARD_STATE.profile;

        } catch (error) {

            console.warn(
                "ChemLab: dashboard profile loading failed.",
                error
            );

            return null;
        }
    }


    /* =====================================================
       XP / LEVEL
       ===================================================== */

    function calculateLevel(xp) {

        const safeXP = Math.max(
            0,
            Number(xp) || 0
        );

        if (safeXP < 100) return 1;
        if (safeXP < 250) return 2;
        if (safeXP < 500) return 3;
        if (safeXP < 850) return 4;
        if (safeXP < 1300) return 5;
        if (safeXP < 1900) return 6;
        if (safeXP < 2700) return 7;
        if (safeXP < 3700) return 8;
        if (safeXP < 5000) return 9;

        return 10 +
            Math.floor(
                (safeXP - 5000) / 1000
            );
    }


    function getXPProgress(xp) {

        const safeXP = Math.max(
            0,
            Number(xp) || 0
        );

        const level = calculateLevel(safeXP);

        let currentMinimum = 0;
        let nextMinimum = 100;

        if (level === 1) {
            currentMinimum = 0;
            nextMinimum = 100;
        } else if (level === 2) {
            currentMinimum = 100;
            nextMinimum = 250;
        } else if (level === 3) {
            currentMinimum = 250;
            nextMinimum = 500;
        } else if (level === 4) {
            currentMinimum = 500;
            nextMinimum = 850;
        } else if (level === 5) {
            currentMinimum = 850;
            nextMinimum = 1300;
        } else if (level === 6) {
            currentMinimum = 1300;
            nextMinimum = 1900;
        } else if (level === 7) {
            currentMinimum = 1900;
            nextMinimum = 2700;
        } else if (level === 8) {
            currentMinimum = 2700;
            nextMinimum = 3700;
        } else if (level === 9) {
            currentMinimum = 3700;
            nextMinimum = 5000;
        } else {

            currentMinimum =
                5000 + ((level - 10) * 1000);

            nextMinimum =
                currentMinimum + 1000;
        }

        const range =
            nextMinimum - currentMinimum;

        const progress =
            range > 0
                ? ((safeXP - currentMinimum) / range) * 100
                : 0;

        return {

            level,

            currentXP:
                Math.max(
                    0,
                    safeXP - currentMinimum
                ),

            requiredXP: range,

            progress:
                Math.max(
                    0,
                    Math.min(
                        100,
                        progress
                    )
                )

        };
    }


    /* =====================================================
       STREAK
       ===================================================== */

    function getStreak() {

        return Math.max(
            0,
            getNumber(
                LOCAL_KEYS.streak,
                0
            )
        );
    }


    /* =====================================================
       MASTERY
       ===================================================== */

    function getMastery() {

        return Math.max(
            0,
            Math.min(
                100,
                getNumber(
                    LOCAL_KEYS.mastery,
                    0
                )
            )
        );
    }


    /* =====================================================
       DATABASE COUNTS
       ===================================================== */

    async function countRecords(tableName) {

        const client =
            getSupabaseClient();

        const user =
            DASHBOARD_STATE.user;

        if (!client || !user) {
            return 0;
        }

        try {

            const result =
                await client
                    .from(tableName)
                    .select("*", {
                        count: "exact",
                        head: true
                    })
                    .eq(
                        "student_id",
                        user.id
                    );

            if (result.error) {

                console.warn(
                    `ChemLab: unable to count ${tableName}.`,
                    result.error
                );

                return 0;
            }

            return Number(
                result.count || 0
            );

        } catch (error) {

            console.warn(
                `ChemLab: ${tableName} count failed.`,
                error
            );

            return 0;
        }
    }


    async function loadDatabaseStats() {

        const user =
            DASHBOARD_STATE.user;

        if (!user) {
            return;
        }

        const [experiments, assessments] =
            await Promise.all([

                countRecords(
                    "experiment_sessions"
                ),

                countRecords(
                    "assessment_attempts"
                )

            ]);

        DASHBOARD_STATE.stats.experiments =
            experiments;

        DASHBOARD_STATE.stats.assessments =
            assessments;
    }


    /* =====================================================
       ACTIVITY
       ===================================================== */

    function loadActivity() {

        const stored =
            getJSON(
                LOCAL_KEYS.activity,
                []
            );

        DASHBOARD_STATE.activity =
            Array.isArray(stored)
                ? stored.slice(0, 8)
                : [];
    }


    function saveActivity(activity) {

        DASHBOARD_STATE.activity =
            Array.isArray(activity)
                ? activity.slice(0, 8)
                : [];

        setJSON(
            LOCAL_KEYS.activity,
            DASHBOARD_STATE.activity
        );
    }


    function addActivity(
        title,
        description,
        type = "learning"
    ) {

        const item = {

            title,

            description,

            type,

            timestamp:
                new Date().toISOString()

        };

        saveActivity([

            item,

            ...DASHBOARD_STATE.activity

        ]);
    }


    /* =====================================================
       RECOMMENDATIONS
       ===================================================== */

    function buildRecommendations() {

        const mastery =
            DASHBOARD_STATE.stats.mastery;

        const experiments =
            DASHBOARD_STATE.stats.experiments;

        const assessments =
            DASHBOARD_STATE.stats.assessments;

        const recommendations = [];


        if (mastery < 20) {

            recommendations.push({

                title:
                    "Start with Chemistry Foundations",

                description:
                    "Build your understanding of measurements, units and scientific notation.",

                route:
                    "learn",

                action:
                    "Start Learning"

            });

        }


        if (experiments === 0) {

            recommendations.push({

                title:
                    "Enter the Digital Laboratory",

                description:
                    "Complete your first guided virtual experiment.",

                route:
                    "laboratory",

                action:
                    "Open Laboratory"

            });

        }


        if (assessments === 0) {

            recommendations.push({

                title:
                    "Test Your Understanding",

                description:
                    "Complete an assessment after studying a topic.",

                route:
                    "assessments",

                action:
                    "View Assessments"

            });

        }


        if (
            mastery >= 20 &&
            experiments > 0
        ) {

            recommendations.push({

                title:
                    "Analyze Experimental Evidence",

                description:
                    "Use measurements and results to practice scientific analysis.",

                route:
                    "analysis",

                action:
                    "Open Analysis"

            });

        }


        if (!recommendations.length) {

            recommendations.push({

                title:
                    "Keep Building Your Mastery",

                description:
                    "Continue learning, experimenting and analyzing evidence.",

                route:
                    "learn",

                action:
                    "Continue Learning"

            });
        }


        DASHBOARD_STATE.recommendations =
            recommendations;
    }


    /* =====================================================
       RENDER PROFILE
       ===================================================== */

    function renderProfile() {

        const profile =
            DASHBOARD_STATE.profile;

        const user =
            DASHBOARD_STATE.user;

        const name =
            profile?.full_name ||
            user?.user_metadata?.full_name ||
            user?.email?.split("@")[0] ||
            "Student";


        $$("[data-dashboard-name]")
            .forEach(element => {

                element.textContent =
                    name;

            });


        $$("[data-profile-name]")
            .forEach(element => {

                element.textContent =
                    name;

            });


        $$("[data-profile-email]")
            .forEach(element => {

                element.textContent =
                    user?.email || "";

            });
    }


    /* =====================================================
       RENDER STATISTICS
       ===================================================== */

    function renderStats() {

        const stats =
            DASHBOARD_STATE.stats;

        setText(
            "#dashboardExperimentsCompleted",
            stats.experiments
        );

        setText(
            "#dashboardMasteryValue",
            `${stats.mastery}%`
        );

        setText(
            "#dashboardAssessmentsCompleted",
            stats.assessments
        );

        setText(
            "#dashboardScienceXP",
            stats.xp
        );

        setText(
            "#dashboardXpValue",
            stats.xp
        );

        setText(
            "#dashboardStreakValue",
            stats.streak
        );

        setText(
            "#dashboardLevelValue",
            stats.level
        );

        setText(
            "[data-dashboard-level]",
            `Level ${stats.level}`
        );

        setWidth(
            "#dashboardMasteryProgress",
            stats.mastery
        );
    }


    /* =====================================================
       RENDER XP
       ===================================================== */

    function renderXPProgress() {

        const progress =
            getXPProgress(
                DASHBOARD_STATE.stats.xp
            );

        setWidth(
            "#dashboardXPProgress",
            progress.progress
        );

        setText(
            "#dashboardXPProgressText",
            `${progress.currentXP} / ${progress.requiredXP} XP`
        );
    }


    /* =====================================================
       RENDER ACADEMIC STATUS
       ===================================================== */

    function renderAcademicStatus() {

        const profile =
            DASHBOARD_STATE.profile;

        const level =
            profile?.academic_level ||
            "foundation";

        const names = {

            foundation:
                "Foundation Chemistry",

            undergraduate:
                "Undergraduate Chemistry",

            advanced:
                "Advanced Chemistry"

        };

        setText(
            "#dashboardAcademicLevel",
            names[level] ||
            "Foundation Chemistry"
        );


        setText(
            "#dashboardAcademicLevelDescription",
            "Your learning path will adapt as your mastery develops."
        );
    }


    /* =====================================================
       RENDER ACTIVITY
       ===================================================== */

    function renderActivity() {

        const container =
            $("#dashboardActivityList");

        if (!container) {
            return;
        }

        if (
            !DASHBOARD_STATE.activity.length
        ) {

            container.innerHTML = `

                <div class="dashboard-empty">

                    <div class="dashboard-empty-icon">
                        ◌
                    </div>

                    <strong>
                        No activity yet
                    </strong>

                    <p>
                        Your learning and laboratory activity
                        will appear here.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML =
            DASHBOARD_STATE.activity
                .map(item => {

                    const date =
                        new Date(
                            item.timestamp
                        );

                    const readableDate =
                        Number.isNaN(
                            date.getTime()
                        )
                            ? ""
                            : date.toLocaleDateString(
                                undefined,
                                {
                                    month: "short",
                                    day: "numeric"
                                }
                            );

                    return `

                        <div class="dashboard-activity-item">

                            <div class="dashboard-activity-icon">
                                ${getActivityIcon(item.type)}
                            </div>

                            <div class="dashboard-activity-content">

                                <strong>
                                    ${escapeHTML(item.title)}
                                </strong>

                                <p>
                                    ${escapeHTML(item.description)}
                                </p>

                            </div>

                            <time>
                                ${readableDate}
                            </time>

                        </div>

                    `;

                })
                .join("");
    }


    function getActivityIcon(type) {

        const icons = {

            learning: "◉",

            laboratory: "⚗",

            assessment: "✓",

            analysis: "⌁",

            achievement: "✦"

        };

        return icons[type] || "•";
    }


    /* =====================================================
       RENDER RECOMMENDATIONS
       ===================================================== */

    function renderRecommendations() {

        const container =
            $("#dashboardRecommendations");

        if (!container) {
            return;
        }

        const recommendation =
            DASHBOARD_STATE.recommendations[0];

        if (!recommendation) {
            return;
        }

        container.innerHTML = `

            <div class="dashboard-recommendation-content">

                <span class="card-eyebrow">
                    RECOMMENDED NEXT STEP
                </span>

                <h3>
                    ${escapeHTML(
                        recommendation.title
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        recommendation.description
                    )}
                </p>

                <a
                    href="#${recommendation.route}"
                    class="button button-primary"
                    data-route="${recommendation.route}"
                >
                    ${escapeHTML(
                        recommendation.action
                    )}
                </a>

            </div>

        `;

        bindRouteLinks(
            container
        );
    }


    /* =====================================================
       ROUTE BINDING
       ===================================================== */

    function bindRouteLinks(
        root = document
    ) {

        root
            .querySelectorAll(
                "[data-route]"
            )
            .forEach(link => {

                if (
                    link.dataset.dashboardBound === "true"
                ) {
                    return;
                }

                link.dataset.dashboardBound =
                    "true";

                link.addEventListener(
                    "click",
                    function () {

                        const route =
                            this.dataset.route;

                        if (
                            window.CHEMLAB_ROUTER &&
                            typeof window.CHEMLAB_ROUTER.navigate === "function"
                        ) {

                            window.CHEMLAB_ROUTER.navigate(
                                route
                            );
                        }

                    }
                );

            });
    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /* =====================================================
       CALCULATE DASHBOARD
       ===================================================== */

    function calculateStats() {

        const xp =
            getNumber(
                LOCAL_KEYS.xp,
                0
            );

        const mastery =
            getMastery();

        const streak =
            getStreak();

        const level =
            calculateLevel(xp);


        DASHBOARD_STATE.stats.xp =
            xp;

        DASHBOARD_STATE.stats.mastery =
            mastery;

        DASHBOARD_STATE.stats.streak =
            streak;

        DASHBOARD_STATE.stats.level =
            level;
    }


    /* =====================================================
       RENDER
       ===================================================== */

    function render() {

        calculateStats();

        renderProfile();

        renderStats();

        renderXPProgress();

        renderAcademicStatus();

        buildRecommendations();

        renderActivity();

        renderRecommendations();

        bindRouteLinks();

        DASHBOARD_STATE.initialized =
            true;
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    async function initialize() {

        if (DASHBOARD_STATE.loading) {
            return;
        }

        DASHBOARD_STATE.loading =
            true;

        try {

            DASHBOARD_STATE.user =
                await getCurrentUser();

            await loadProfile();

            loadActivity();

            await loadDatabaseStats();

            render();

        } catch (error) {

            console.error(
                "ChemLab Dashboard Error:",
                error
            );

        } finally {

            DASHBOARD_STATE.loading =
                false;
        }
    }


    /* =====================================================
       REFRESH
       ===================================================== */

    async function refresh() {

        await initialize();
    }


    /* =====================================================
       EVENT LISTENERS
       ===================================================== */

    function bindEvents() {

        document.addEventListener(
            "chemlab:auth-state",
            async function () {

                await refresh();

            }
        );


        document.addEventListener(
            "chemlab:profile-loaded",
            async function () {

                await refresh();

            }
        );


        document.addEventListener(
            "chemlab:profile-updated",
            async function () {

                await refresh();

            }
        );


        document.addEventListener(
            "chemlab:dashboard-refresh",
            async function () {

                await refresh();

            }
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CHEMLAB_DASHBOARD = {

        initialize,

        refresh,

        render,

        getState: function () {

            return {
                ...DASHBOARD_STATE,

                stats: {
                    ...DASHBOARD_STATE.stats
                },

                activity: [
                    ...DASHBOARD_STATE.activity
                ],

                recommendations: [
                    ...DASHBOARD_STATE.recommendations
                ]

            };

        },

        addXP: function (amount, activity = null) {

            const value =
                Math.max(
                    0,
                    Number(amount) || 0
                );

            const currentXP =
                getNumber(
                    LOCAL_KEYS.xp,
                    0
                );

            const newXP =
                currentXP + value;

            setNumber(
                LOCAL_KEYS.xp,
                newXP
            );


            if (activity) {

                addActivity(
                    activity.title ||
                    "Learning activity completed",

                    activity.description ||
                    `You earned ${value} XP.`,

                    activity.type ||
                    "learning"
                );

            }


            render();
        },


        setMastery: function (value) {

            const mastery =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(value) || 0
                    )
                );

            setNumber(
                LOCAL_KEYS.mastery,
                mastery
            );

            render();
        },


        setStreak: function (value) {

            const streak =
                Math.max(
                    0,
                    Number(value) || 0
                );

            setNumber(
                LOCAL_KEYS.streak,
                streak
            );

            render();
        },


        addActivity,

        getXPProgress

    };


    /* =====================================================
       START
       ===================================================== */

    bindEvents();


})();
