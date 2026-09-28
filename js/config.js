 /* =========================================================
    CHEMLAB
    APPLICATION CONFIGURATION
    STAGE 3.1
    Supabase Foundation
    ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       APPLICATION
       ===================================================== */

    const APP = {
        name: "ChemLab",
        fullName: "ChemLab Digital Laboratory",
        version: "3.0.0",
        environment: "production",

        description:
            "A professional digital chemistry laboratory and learning platform.",

        tagline:
            "Learn. Experiment. Analyze. Master Chemistry.",

        defaultRoute: "dashboard"
    };


    /* =====================================================
       BRAND
       ===================================================== */

    const BRAND = {
        primary: "#3157d5",
        primaryDark: "#2444b5",
        secondary: "#6c63ff"
    };


    /* =====================================================
       ROUTES
       ===================================================== */

    const ROUTES = {

        dashboard: {
            path: "dashboard",
            title: "Dashboard",
            description:
                "Your Chemistry learning and laboratory workspace."
        },

        learn: {
            path: "learn",
            title: "Learn",
            description:
                "Build chemistry knowledge from foundations to advanced topics."
        },

        laboratory: {
            path: "laboratory",
            title: "Laboratory",
            description:
                "Work with chemicals, apparatus and scientific measurements."
        },

        experiments: {
            path: "experiments",
            title: "Experiments",
            description:
                "Explore guided and advanced chemistry experiments."
        },

        analysis: {
            path: "analysis",
            title: "Analysis",
            description:
                "Analyze scientific data, calculations and experimental results."
        },

        ai: {
            path: "ai",
            title: "AI Tutor",
            description:
                "Get context-aware chemistry learning support."
        },

        notebook: {
            path: "notebook",
            title: "Lab Notebook",
            description:
                "Record observations, measurements, calculations and conclusions."
        },

        assessments: {
            path: "assessments",
            title: "Assessments",
            description:
                "Test your chemistry knowledge and practical understanding."
        },

        progress: {
            path: "progress",
            title: "My Progress",
            description:
                "Track chemistry mastery and academic development."
        },

        premium: {
            path: "premium",
            title: "ChemLab Premium",
            description:
                "Unlock advanced chemistry learning and laboratory capabilities."
        },

        settings: {
            path: "settings",
            title: "Settings",
            description:
                "Manage your ChemLab preferences and account."
        }
    };


    /* =====================================================
       ACADEMIC LEVELS
       ===================================================== */

    const ACADEMIC_LEVELS = {

        foundation: {
            id: "foundation",
            name: "Foundation",
            description:
                "Build strong chemistry fundamentals."
        },

        undergraduate: {
            id: "undergraduate",
            name: "Undergraduate",
            description:
                "University and tertiary-level chemistry."
        },

        advanced: {
            id: "advanced",
            name: "Advanced",
            description:
                "Advanced chemistry, laboratory and research concepts."
        }
    };


    /* =====================================================
       LABORATORY MODES
       ===================================================== */

    const LABORATORY_MODES = {

        guided: {
            id: "guided",
            name: "Guided Laboratory"
        },

        open: {
            id: "open",
            name: "Open Laboratory"
        },

        research: {
            id: "research",
            name: "Research Laboratory"
        }
    };


    /* =====================================================
       SUBJECT AREAS
       ===================================================== */

    const SUBJECTS = [

        "General Chemistry",
        "Inorganic Chemistry",
        "Organic Chemistry",
        "Physical Chemistry",
        "Analytical Chemistry",
        "Biochemistry",
        "Environmental Chemistry",
        "Electrochemistry",
        "Materials Chemistry",
        "Instrumental Analysis",
        "Nuclear Chemistry",
        "Research Chemistry"
    ];


    /* =====================================================
       SUPABASE
       ===================================================== */

    const SUPABASE = {

        enabled: true,

        url:
            "https://zscbgeaieiqwknhjxpnt.supabase.co",

        publishableKey:
            "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy",

        tables: {

            profiles:
                "profiles",

            experiments:
                "experiments",

            experimentSessions:
                "experiment_sessions",

            notebookEntries:
                "notebook_entries",

            progress:
                "progress",

            assessments:
                "assessments",

            assessmentAttempts:
                "assessment_attempts",

            subscriptions:
                "subscriptions"
        }
    };


    /* =====================================================
       AUTHENTICATION
       ===================================================== */

    const AUTH = {

        enabled: true,

        sessionStorageKey:
            "chemlab_session",

        profileStorageKey:
            "chemlab_profile",

        requireEmailConfirmation:
            true
    };


    /* =====================================================
       PREMIUM
       ===================================================== */

    const PREMIUM = {

        monthly: {
            id: "monthly",
            name: "Monthly",
            price: 35,
            currency: "GHS",
            interval: "month"
        },

        yearly: {
            id: "yearly",
            name: "Yearly",
            price: 420,
            currency: "GHS",
            interval: "year"
        }
    };


    /* =====================================================
       FEATURE FLAGS
       ===================================================== */

    const FEATURES = {

        authentication: true,

        studentProfiles: true,

        learningAcademy: true,

        laboratory: true,

        experiments: true,

        analysis: true,

        aiTutor: true,

        notebook: true,

        assessments: true,

        progress: true,

        premium: true,

        imageAnalysis: false,

        voiceAssistant: false,

        advancedInstrumentation: false,

        researchLaboratory: false
    };


    /* =====================================================
       UI SETTINGS
       ===================================================== */

    const UI = {

        sidebarDefault:
            true,

        animations:
            true,

        notifications:
            true,

        search:
            true
    };


    /* =====================================================
       STORAGE KEYS
       ===================================================== */

    const STORAGE_KEYS = {

        lastRoute:
            "chemlab_last_route",

        theme:
            "chemlab_theme",

        sidebar:
            "chemlab_sidebar",

        authSession:
            "chemlab_auth_session",

        profile:
            "chemlab_student_profile"
    };


    /* =====================================================
       CONFIGURATION HELPERS
       ===================================================== */

    function getRoute(route) {

        return ROUTES[route] || null;
    }


    function isFeatureEnabled(feature) {

        return FEATURES[feature] === true;
    }


    function getStorageKey(key) {

        return STORAGE_KEYS[key] || null;
    }


    function isSupabaseConfigured() {

        return Boolean(
            SUPABASE.enabled &&
            SUPABASE.url &&
            SUPABASE.publishableKey
        );
    }


    /* =====================================================
       PUBLIC CONFIGURATION
       ===================================================== */

    window.CHEMLAB_CONFIG = {

        app: APP,

        brand: BRAND,

        routes: ROUTES,

        academicLevels:
            ACADEMIC_LEVELS,

        laboratoryModes:
            LABORATORY_MODES,

        subjects:
            SUBJECTS,

        supabase:
            SUPABASE,

        auth:
            AUTH,

        premium:
            PREMIUM,

        features:
            FEATURES,

        ui:
            UI,

        storage:
            STORAGE_KEYS,

        getRoute,

        isFeatureEnabled,

        getStorageKey,

        isSupabaseConfigured
    };


    /* =====================================================
       DEVELOPMENT LOGGER
       ===================================================== */

    window.CHEMLAB_LOG = function (...args) {

        if (
            window.CHEMLAB_CONFIG?.app?.environment ===
            "development"
        ) {
            console.log(
                "[ChemLab]",
                ...args
            );
        }
    };


})();
