/* =========================================================
   CHEMLAB
   CENTRAL APPLICATION CONFIGURATION
   Stage 1 — Foundation
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       GLOBAL CHEMLAB CONFIGURATION
       ===================================================== */

    window.CHEMLAB_CONFIG = {

        /* -------------------------------------------------
           APPLICATION
           ------------------------------------------------- */

        app: {
            name: "ChemLab",
            fullName: "ChemLab Digital Laboratory",
            version: "1.0.0",
            environment: "development",

            description:
                "A professional digital chemistry laboratory and learning platform.",

            tagline:
                "Learn. Experiment. Analyze. Master Chemistry.",

            defaultRoute: "dashboard"
        },


        /* -------------------------------------------------
           BRAND
           ------------------------------------------------- */

        brand: {
            primary: "#3157d5",
            primaryDark: "#2444b5",
            secondary: "#6c63ff",

            success: "#16a34a",
            warning: "#d97706",
            danger: "#dc2626",
            info: "#2563eb",

            premium: "#7c3aed"
        },


        /* -------------------------------------------------
           NAVIGATION
           ------------------------------------------------- */

        routes: {

            dashboard: {
                title: "Dashboard",
                label: "Dashboard",
                description:
                    "Your chemistry learning and laboratory overview."
            },

            learn: {
                title: "Learn",
                label: "Learn",
                description:
                    "Build chemistry knowledge from foundations to advanced topics."
            },

            laboratory: {
                title: "Laboratory",
                label: "Laboratory",
                description:
                    "Work with chemicals, apparatus and virtual laboratory systems."
            },

            experiments: {
                title: "Experiments",
                label: "Experiments",
                description:
                    "Explore guided and advanced chemistry experiments."
            },

            analysis: {
                title: "Analysis",
                label: "Analysis",
                description:
                    "Analyze experimental measurements, data and scientific results."
            },

            ai: {
                title: "AI Tutor",
                label: "AI Tutor",
                description:
                    "Get context-aware chemistry learning assistance."
            },

            notebook: {
                title: "Lab Notebook",
                label: "Lab Notebook",
                description:
                    "Record observations, calculations, results and conclusions."
            },

            assessments: {
                title: "Assessments",
                label: "Assessments",
                description:
                    "Test your understanding with chemistry assessments."
            },

            progress: {
                title: "My Progress",
                label: "My Progress",
                description:
                    "Track learning progress and chemistry mastery."
            },

            premium: {
                title: "ChemLab Premium",
                label: "Premium",
                description:
                    "Unlock advanced laboratory and learning capabilities."
            },

            settings: {
                title: "Settings",
                label: "Settings",
                description:
                    "Manage your ChemLab preferences."
            }
        },


        /* -------------------------------------------------
           ACADEMIC LEVELS
           ------------------------------------------------- */

        academicLevels: [
            {
                id: "foundation",
                name: "Foundation",
                description:
                    "Essential chemistry concepts and laboratory skills."
            },

            {
                id: "undergraduate",
                name: "Undergraduate",
                description:
                    "University-level chemistry theory and practical work."
            },

            {
                id: "advanced",
                name: "Advanced",
                description:
                    "Advanced chemistry, analysis and research concepts."
            }
        ],


        /* -------------------------------------------------
           LABORATORY MODES
           ------------------------------------------------- */

        laboratoryModes: {

            guided: {
                id: "guided",
                name: "Guided Laboratory",
                description:
                    "Follow structured experiments with learning guidance."
            },

            open: {
                id: "open",
                name: "Open Laboratory",
                description:
                    "Select chemicals and apparatus and design your own experiment."
            },

            research: {
                id: "research",
                name: "Research Laboratory",
                description:
                    "Plan, investigate and analyze experimental questions."
            }
        },


        /* -------------------------------------------------
           LEARNING SYSTEM
           ------------------------------------------------- */

        learning: {

            subjects: [
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
            ],

            masteryLevels: [
                "Not Started",
                "Beginning",
                "Developing",
                "Proficient",
                "Advanced",
                "Mastered"
            ]
        },


        /* -------------------------------------------------
           LABORATORY SYSTEM
           ------------------------------------------------- */

        laboratory: {

            defaultTemperature: 25,

            temperatureUnit: "°C",

            defaultVolumeUnit: "mL",

            defaultMassUnit: "g",

            defaultConcentrationUnit: "mol/L",

            defaultPressureUnit: "kPa",

            supportedVolumeUnits: [
                "mL",
                "L",
                "µL"
            ],

            supportedMassUnits: [
                "mg",
                "g",
                "kg"
            ],

            supportedConcentrationUnits: [
                "mol/L",
                "mmol/L",
                "g/L",
                "%"
            ],

            supportedPressureUnits: [
                "Pa",
                "kPa",
                "atm",
                "bar"
            ]
        },


        /* -------------------------------------------------
           EXPERIMENT SYSTEM
           ------------------------------------------------- */

        experiments: {

            categories: [
                "General Chemistry",
                "Inorganic Chemistry",
                "Organic Chemistry",
                "Physical Chemistry",
                "Analytical Chemistry",
                "Biochemistry",
                "Electrochemistry",
                "Environmental Chemistry"
            ],

            difficultyLevels: [
                "Foundation",
                "Intermediate",
                "Advanced",
                "Research"
            ],

            workflow: [
                "Learn",
                "Predict",
                "Experiment",
                "Observe",
                "Measure",
                "Analyze",
                "Conclude",
                "Reflect"
            ]
        },


        /* -------------------------------------------------
           AI SYSTEM
           ------------------------------------------------- */

        ai: {

            enabled: true,

            name: "ChemLab AI",

            defaultMode: "tutor",

            modes: {
                tutor: "Tutor",
                lab: "Laboratory Assistant",
                analysis: "Scientific Analysis",
                assessment: "Assessment Coach"
            },

            capabilities: {
                chat: true,
                imageAnalysis: false,
                voiceInput: false,
                voiceOutput: false,
                labContext: true,
                reportFeedback: true,
                misconceptionDetection: true
            },

            responseStyle:
                "Socratic, educational, scientifically accurate and level-aware."
        },


        /* -------------------------------------------------
           ASSESSMENT SYSTEM
           ------------------------------------------------- */

        assessments: {

            questionTypes: [
                "multiple-choice",
                "multiple-select",
                "numerical",
                "short-answer",
                "equation",
                "matching",
                "data-analysis",
                "graph-analysis",
                "apparatus-identification",
                "error-analysis",
                "practical-reasoning",
                "scenario"
            ],

            defaultQuestionCount: 10,

            adaptiveMode: true
        },


        /* -------------------------------------------------
           NOTEBOOK
           ------------------------------------------------- */

        notebook: {

            sections: [
                "Title",
                "Date",
                "Objective",
                "Hypothesis",
                "Materials",
                "Procedure",
                "Raw Data",
                "Calculations",
                "Graphs",
                "Results",
                "Discussion",
                "Errors",
                "Conclusion",
                "Post-Lab Assessment"
            ]
        },


        /* -------------------------------------------------
           SCIENTIFIC ANALYSIS
           ------------------------------------------------- */

        analysis: {

            capabilities: {
                tables: true,
                graphs: true,
                equations: true,
                units: true,
                significantFigures: true,
                uncertainty: true,
                percentageError: true,
                statistics: true,
                calibrationCurves: true,
                spectralAnalysis: false
            }
        },


        /* -------------------------------------------------
           PREMIUM
           ------------------------------------------------- */

        premium: {

            enabled: true,

            currency: "GHS",

            plans: {

                monthly: {
                    id: "monthly",
                    name: "Monthly",
                    price: 35,
                    interval: "month"
                },

                yearly: {
                    id: "yearly",
                    name: "Yearly",
                    price: 420,
                    interval: "year"
                }
            },

            features: [
                "Advanced experiments",
                "Expanded chemical library",
                "Expanded apparatus library",
                "Open laboratory",
                "Research laboratory",
                "Advanced AI assistance",
                "Image analysis",
                "Advanced data analysis",
                "Scientific report feedback",
                "Advanced assessments",
                "Advanced spectroscopy tools"
            ]
        },


        /* -------------------------------------------------
           SUPABASE
           -------------------------------------------------
           
           IMPORTANT:
           Never place a Supabase service-role key here.

           The public anon/publishable key is intended for
           frontend initialization when Row Level Security
           is correctly configured.
           ------------------------------------------------- */

        supabase: {

            enabled: false,

            url: "",

            publishableKey: "",

            tables: {

                profiles: "profiles",
                experiments: "experiments",
                experimentSessions: "experiment_sessions",
                notebookEntries: "notebook_entries",
                progress: "progress",
                assessments: "assessments",
                assessmentAttempts: "assessment_attempts",
                subscriptions: "subscriptions"
            }
        },


        /* -------------------------------------------------
           FEATURE FLAGS
           ------------------------------------------------- */

        features: {

            authentication: false,

            dashboard: true,

            learning: true,

            laboratory: true,

            experiments: true,

            analysis: true,

            aiTutor: true,

            notebook: true,

            assessments: true,

            progress: true,

            premium: true,

            notifications: true,

            globalSearch: true
        },


        /* -------------------------------------------------
           UI SETTINGS
           ------------------------------------------------- */

        ui: {

            toastDuration: 3500,

            animationDuration: 220,

            mobileBreakpoint: 992,

            defaultTheme: "light",

            supportedThemes: [
                "light",
                "dark"
            ]
        },


        /* -------------------------------------------------
           STORAGE
           ------------------------------------------------- */

        storage: {

            prefix: "chemlab_",

            keys: {
                theme: "theme",
                academicLevel: "academic_level",
                lastRoute: "last_route",
                sidebarState: "sidebar_state"
            }
        },


        /* -------------------------------------------------
           DEVELOPMENT
           ------------------------------------------------- */

        development: {

            debug: true,

            showLoadTime: false,

            logNavigation: false,

            logErrors: true
        }
    };


    /* =====================================================
       CONFIGURATION HELPERS
       ===================================================== */

    window.CHEMLAB_CONFIG.getRoute = function (route) {

        if (!route) {
            return null;
        }

        return this.routes[route] || null;
    };


    window.CHEMLAB_CONFIG.isFeatureEnabled = function (feature) {

        if (!feature) {
            return false;
        }

        return this.features[feature] === true;
    };


    window.CHEMLAB_CONFIG.getStorageKey = function (key) {

        const storageKeys = this.storage.keys;

        if (!storageKeys[key]) {
            return null;
        }

        return this.storage.prefix + storageKeys[key];
    };


    /* =====================================================
       DEVELOPMENT LOGGER
       ===================================================== */

    window.CHEMLAB_LOG = function () {

        if (!window.CHEMLAB_CONFIG.development.debug) {
            return;
        }

        console.log.apply(
            console,
            ["[ChemLab]"].concat(Array.from(arguments))
        );
    };


    /* =====================================================
       INITIALIZATION MESSAGE
       ===================================================== */

    CHEMLAB_LOG(
        "Configuration loaded.",
        "Version:",
        CHEMLAB_CONFIG.app.version
    );

})();
