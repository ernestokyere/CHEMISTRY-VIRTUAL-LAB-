/* =========================================================
   CHEMLAB
   APPLICATION CONTROLLER
   Stage 3 — Authentication & Profile Integration
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       APPLICATION STATE
       ===================================================== */

    const APP_STATE = {

        initialized: false,

        startedAt: null,

        readyAt: null,

        isReady: false,

        error: null,

        authInitialized: false,

        profileInitialized: false

    };


    window.CHEMLAB_APP_STATE = APP_STATE;


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    const $ = (selector, parent = document) => {
        return parent.querySelector(selector);
    };


    const get = (id) => {
        return document.getElementById(id);
    };


    /* =====================================================
       APP LOADER
       ===================================================== */

    function getLoader() {

        return (
            get("appLoader") ||
            $(".app-loader")
        );

    }


    function showLoader() {

        const loader = getLoader();

        if (!loader) {
            return;
        }

        loader.classList.remove("is-hidden");
        loader.classList.add("is-visible");

        loader.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function hideLoader() {

        const loader = getLoader();

        if (!loader) {
            return;
        }

        loader.classList.remove("is-visible");
        loader.classList.add("is-hidden");

        loader.setAttribute(
            "aria-hidden",
            "true"
        );


        setTimeout(() => {

            if (
                loader &&
                !loader.classList.contains(
                    "is-visible"
                )
            ) {

                loader.style.pointerEvents =
                    "none";

            }

        }, 350);

    }


    /* =====================================================
       APP READY STATE
       ===================================================== */

    function markAppReady() {

        APP_STATE.readyAt =
            performance.now();

        APP_STATE.isReady = true;

        document.documentElement
            .classList
            .add("chemlab-ready");

        document.body
            .classList
            .add("app-ready");


        hideLoader();


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:ready",
                {
                    detail: {
                        state: APP_STATE
                    }
                }
            )
        );

    }


    /* =====================================================
       APPLICATION ERROR
       ===================================================== */

    function handleApplicationError(
        error,
        context = "Application"
    ) {

        APP_STATE.error = error;


        if (
            window.CHEMLAB_CONFIG
                ?.development
                ?.logErrors
        ) {

            console.error(
                `[ChemLab] ${context}:`,
                error
            );

        }


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:error",
                {
                    detail: {
                        error,
                        context
                    }
                }
            )
        );

    }


    /* =====================================================
       THEME
       ===================================================== */

    function getThemeStorageKey() {

        return (
            window.CHEMLAB_CONFIG
                ?.getStorageKey
                ? window.CHEMLAB_CONFIG
                    .getStorageKey("theme")
                : "chemlab_theme"
        );

    }


    function getStoredTheme() {

        try {

            return localStorage.getItem(
                getThemeStorageKey()
            );

        } catch (error) {

            return null;

        }

    }


    function applyTheme(theme) {

        const supportedThemes =
            window.CHEMLAB_CONFIG
                ?.ui
                ?.supportedThemes ||
            ["light", "dark"];


        if (
            !supportedThemes.includes(theme)
        ) {

            theme =
                window.CHEMLAB_CONFIG
                    ?.ui
                    ?.defaultTheme ||
                "light";

        }


        document.documentElement
            .setAttribute(
                "data-theme",
                theme
            );


        try {

            localStorage.setItem(
                getThemeStorageKey(),
                theme
            );

        } catch (error) {

            if (typeof CHEMLAB_LOG === "function") {

                CHEMLAB_LOG(
                    "Unable to save theme.",
                    error
                );

            }

        }

    }


    function initializeTheme() {

        const storedTheme =
            getStoredTheme();


        if (storedTheme) {

            applyTheme(
                storedTheme
            );

            return;

        }


        const configuredTheme =
            window.CHEMLAB_CONFIG
                ?.ui
                ?.defaultTheme ||
            "light";


        applyTheme(
            configuredTheme
        );

    }


    /* =====================================================
       AUTHENTICATION INITIALIZATION
       ===================================================== */

    async function initializeAuthentication() {

        if (
            !window.CHEMLAB_AUTH ||
            typeof window.CHEMLAB_AUTH.initialize !==
                "function"
        ) {

            CHEMLAB_LOG(
                "Authentication module is unavailable."
            );

            return;

        }


        try {

            await window.CHEMLAB_AUTH.initialize();

            APP_STATE.authInitialized = true;


            CHEMLAB_LOG(
                "Authentication system initialized."
            );


            /*
             * Notify the rest of the application.
             */

            document.dispatchEvent(
                new CustomEvent(
                    "chemlab:auth-initialized",
                    {
                        detail: {
                            state:
                                window.CHEMLAB_AUTH
                                    .getAuthState
                                    ? window.CHEMLAB_AUTH
                                        .getAuthState()
                                    : null
                        }
                    }
                )
            );


        } catch (error) {

            handleApplicationError(
                error,
                "Authentication Initialization"
            );

        }

    }


    /* =====================================================
       PROFILE INITIALIZATION
       ===================================================== */

    async function initializeStudentProfile() {

        if (
            !window.CHEMLAB_PROFILE ||
            typeof window.CHEMLAB_PROFILE.loadProfile !==
                "function"
        ) {

            CHEMLAB_LOG(
                "Profile module is unavailable."
            );

            return;

        }


        /*
         * Only attempt to load a profile
         * when the student is authenticated.
         */

        if (
            !window.CHEMLAB_AUTH ||
            typeof window.CHEMLAB_AUTH.isAuthenticated !==
                "function"
        ) {

            return;

        }


        if (
            !window.CHEMLAB_AUTH.isAuthenticated()
        ) {

            CHEMLAB_LOG(
                "No authenticated student. Profile loading skipped."
            );

            return;

        }


        try {

            await window.CHEMLAB_PROFILE.loadProfile();

            APP_STATE.profileInitialized = true;


            CHEMLAB_LOG(
                "Student profile initialized."
            );


            document.dispatchEvent(
                new CustomEvent(
                    "chemlab:profile-initialized",
                    {
                        detail: {
                            profile:
                                window.CHEMLAB_PROFILE
                                    .getProfile
                                    ? window.CHEMLAB_PROFILE
                                        .getProfile()
                                    : null
                        }
                    }
                )
            );


        } catch (error) {

            handleApplicationError(
                error,
                "Student Profile Initialization"
            );

        }

    }


    /* =====================================================
       PROFILE UI
       ===================================================== */

    function initializeProfileUI() {

        const profileName =
            $("[data-profile-name]");

        const profileEmail =
            $("[data-profile-email]");

        const profileAvatar =
            $("[data-profile-avatar]");


        /*
         * Default unauthenticated state.
         */

        let name = "Student";

        let email = "ChemLab Student";

        let avatar = "S";


        /*
         * Read authenticated user.
         */

        if (
            window.CHEMLAB_AUTH &&
            typeof window.CHEMLAB_AUTH.isAuthenticated ===
                "function" &&
            window.CHEMLAB_AUTH.isAuthenticated()
        ) {

            const authState =
                typeof window.CHEMLAB_AUTH.getAuthState ===
                    "function"
                    ? window.CHEMLAB_AUTH.getAuthState()
                    : null;


            const user =
                authState?.user || null;


            if (user) {

                email =
                    user.email ||
                    "ChemLab Student";


                const metadata =
                    user.user_metadata ||
                    {};


                name =
                    metadata.full_name ||
                    user.email?.split("@")[0] ||
                    "Student";

            }

        }


        /*
         * Prefer the Supabase profile
         * when it exists.
         */

        if (
            window.CHEMLAB_PROFILE &&
            typeof window.CHEMLAB_PROFILE.getProfile ===
                "function"
        ) {

            const profile =
                window.CHEMLAB_PROFILE.getProfile();


            if (profile) {

                name =
                    profile.full_name ||
                    name;


                if (
                    profile.avatar_url
                ) {

                    avatar =
                        profile.avatar_url;

                }

            }

        }


        /*
         * Generate avatar initials when
         * no image URL is available.
         */

        if (
            avatar === "S" &&
            name
        ) {

            const words =
                name
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);


            if (words.length >= 2) {

                avatar =
                    (
                        words[0][0] +
                        words[words.length - 1][0]
                    ).toUpperCase();

            } else if (words.length === 1) {

                avatar =
                    words[0]
                        .substring(0, 2)
                        .toUpperCase();

            }

        }


        /*
         * Update DOM.
         */

        if (profileName) {

            profileName.textContent =
                name;

        }


        if (profileEmail) {

            profileEmail.textContent =
                email;

        }


        if (profileAvatar) {

            /*
             * If avatar is an image URL,
             * use it as an image.
             */

            if (
                typeof avatar === "string" &&
                (
                    avatar.startsWith("http://") ||
                    avatar.startsWith("https://")
                )
            ) {

                profileAvatar.textContent = "";

                profileAvatar.style.backgroundImage =
                    `url("${avatar}")`;

                profileAvatar.style.backgroundSize =
                    "cover";

                profileAvatar.style.backgroundPosition =
                    "center";

            } else {

                profileAvatar.style.backgroundImage =
                    "";

                profileAvatar.textContent =
                    avatar;

            }

        }

    }


    /* =====================================================
       AUTH STATE EVENTS
       ===================================================== */

    function handleAuthStateChange(event) {

        const detail =
            event.detail || {};


        CHEMLAB_LOG(
            "Authentication state changed.",
            detail
        );


        /*
         * Refresh profile information.
         */

        initializeProfileUI();


        /*
         * If a student has just signed in,
         * load their profile.
         */

        if (
            window.CHEMLAB_AUTH &&
            typeof window.CHEMLAB_AUTH.isAuthenticated ===
                "function" &&
            window.CHEMLAB_AUTH.isAuthenticated()
        ) {

            initializeStudentProfile()
                .then(() => {

                    initializeProfileUI();

                })
                .catch((error) => {

                    handleApplicationError(
                        error,
                        "Authentication Profile Refresh"
                    );

                });

        }

    }


    function handleProfileLoaded() {

        initializeProfileUI();

    }


    function handleProfileUpdated() {

        initializeProfileUI();

    }


    /* =====================================================
       NAVIGATION UI
       ===================================================== */

    function initializeNavigation() {

        if (
            !window.CHEMLAB_ROUTER
        ) {

            handleApplicationError(
                new Error(
                    "Router is unavailable."
                ),
                "Navigation"
            );

            return;

        }


        CHEMLAB_LOG(
            "Navigation system connected."
        );

    }


    /* =====================================================
       SEARCH UI
       ===================================================== */

    function initializeSearch() {

        if (
            !window.CHEMLAB_UI ||
            !window.CHEMLAB_UI.search
        ) {

            return;

        }


        window.CHEMLAB_UI.search.render(
            ""
        );

    }


    /* =====================================================
       RESPONSIVE BEHAVIOR
       ===================================================== */

    function initializeResponsiveBehavior() {

        const mobileBreakpoint =
            window.CHEMLAB_CONFIG
                ?.ui
                ?.mobileBreakpoint ||
            992;


        function handleViewportChange() {

            if (
                window.innerWidth >
                mobileBreakpoint
            ) {

                if (
                    window.CHEMLAB_UI
                        ?.state
                        ?.sidebarOpen
                ) {

                    window.CHEMLAB_UI
                        .sidebar
                        .close();

                }

            }

        }


        window.addEventListener(
            "resize",
            handleViewportChange
        );


        handleViewportChange();

    }


    /* =====================================================
       NAVIGATION EVENTS
       ===================================================== */

    function handleNavigation(event) {

        const detail =
            event.detail;


        if (!detail) {
            return;
        }


        CHEMLAB_LOG(
            "Route changed:",
            detail.route
        );

    }


    /* =====================================================
       PAGE ENTER EVENTS
       ===================================================== */

    function handlePageEnter(event) {

        const detail =
            event.detail;


        if (!detail) {
            return;
        }


        const page =
            detail.page;


        if (!page) {
            return;
        }


        page.classList.add(
            "page-ready"
        );

    }


    /* =====================================================
       PAGE EXIT EVENTS
       ===================================================== */

    function handlePageExit(event) {

        const detail =
            event.detail;


        if (!detail) {
            return;
        }


        const page =
            detail.page;


        if (!page) {
            return;
        }


        page.classList.remove(
            "page-ready"
        );

    }


    /* =====================================================
       GLOBAL ERROR HANDLING
       ===================================================== */

    function initializeErrorHandling() {

        window.addEventListener(
            "error",
            (event) => {

                if (!event.error) {
                    return;
                }


                handleApplicationError(
                    event.error,
                    "Runtime Error"
                );

            }
        );


        window.addEventListener(
            "unhandledrejection",
            (event) => {

                const reason =
                    event.reason instanceof Error
                        ? event.reason
                        : new Error(
                            String(
                                event.reason
                            )
                        );


                handleApplicationError(
                    reason,
                    "Unhandled Promise Rejection"
                );

            }
        );

    }


    /* =====================================================
       APP EVENT LISTENERS
       ===================================================== */

    function bindApplicationEvents() {

        document.addEventListener(
            "chemlab:navigation",
            handleNavigation
        );


        document.addEventListener(
            "chemlab:page-enter",
            handlePageEnter
        );


        document.addEventListener(
            "chemlab:page-exit",
            handlePageExit
        );


        /*
         * Authentication events.
         */

        document.addEventListener(
            "chemlab:auth-state",
            handleAuthStateChange
        );


        document.addEventListener(
            "chemlab:auth-event",
            handleAuthStateChange
        );


        /*
         * Profile events.
         */

        document.addEventListener(
            "chemlab:profile-loaded",
            handleProfileLoaded
        );


        document.addEventListener(
            "chemlab:profile-updated",
            handleProfileUpdated
        );

    }


    /* =====================================================
       DEVELOPMENT INFORMATION
       ===================================================== */

    function logStartupInformation() {

        const config =
            window.CHEMLAB_CONFIG;


        if (!config) {
            return;
        }


        CHEMLAB_LOG(
            "----------------------------------------"
        );


        CHEMLAB_LOG(
            `${config.app.name} initialized`
        );


        CHEMLAB_LOG(
            `Version: ${config.app.version}`
        );


        CHEMLAB_LOG(
            `Environment: ${config.app.environment}`
        );


        CHEMLAB_LOG(
            `Authentication: ${
                APP_STATE.authInitialized
                    ? "Ready"
                    : "Unavailable"
            }`
        );


        CHEMLAB_LOG(
            `Profile: ${
                APP_STATE.profileInitialized
                    ? "Ready"
                    : "Not loaded"
            }`
        );


        CHEMLAB_LOG(
            "----------------------------------------"
        );

    }


    /* =====================================================
       APPLICATION INITIALIZATION
       ===================================================== */

    async function initializeApplication() {

        if (APP_STATE.initialized) {
            return;
        }


        APP_STATE.initialized = true;


        APP_STATE.startedAt =
            performance.now();


        try {

            /*
             * Keep the application loader visible
             * while the complete startup sequence
             * is running.
             */

            showLoader();


            /* ---------------------------------------------
               CORE SYSTEMS
               --------------------------------------------- */

            initializeTheme();

            initializeErrorHandling();

            bindApplicationEvents();


            /* ---------------------------------------------
               AUTHENTICATION
               --------------------------------------------- */

            await initializeAuthentication();


            /* ---------------------------------------------
               STUDENT PROFILE
               --------------------------------------------- */

            await initializeStudentProfile();


            /* ---------------------------------------------
               PROFILE UI
               --------------------------------------------- */

            initializeProfileUI();


            /* ---------------------------------------------
               NAVIGATION
               --------------------------------------------- */

            initializeNavigation();


            /* ---------------------------------------------
               SEARCH
               --------------------------------------------- */

            initializeSearch();


            /* ---------------------------------------------
               RESPONSIVE BEHAVIOR
               --------------------------------------------- */

            initializeResponsiveBehavior();


            /*
             * Allow the browser to render the complete
             * application before removing the loader.
             */

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    markAppReady();

                    logStartupInformation();

                });

            });

        } catch (error) {

            handleApplicationError(
                error,
                "Application Initialization"
            );


            hideLoader();

        }

    }


    /* =====================================================
       PUBLIC APPLICATION API
       ===================================================== */

    window.CHEMLAB_APP = {

        state: APP_STATE,


        initialize:
            initializeApplication,


        theme: {

            apply:
                applyTheme,

            initialize:
                initializeTheme,

            getStored:
                getStoredTheme

        },


        loader: {

            show:
                showLoader,

            hide:
                hideLoader

        },


        authentication: {

            initialize:
                initializeAuthentication

        },


        profile: {

            initialize:
                initializeStudentProfile,

            refreshUI:
                initializeProfileUI

        }

    };


    /* =====================================================
       START APPLICATION
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeApplication
        );

    } else {

        initializeApplication();

    }

})();
