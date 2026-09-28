/* =========================================================
   CHEMLAB
   APPLICATION CONTROLLER
   Stage 1 — Foundation
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

        error: null

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


        /*
         * Remove it from visual interaction after
         * the transition has completed.
         */

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

            CHEMLAB_LOG(
                "Unable to save theme.",
                error
            );

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
       PROFILE INITIALIZATION
       ===================================================== */

    function initializeProfileUI() {

        const profileName =
            $("[data-profile-name]");

        const profileEmail =
            $("[data-profile-email]");

        const profileAvatar =
            $("[data-profile-avatar]");


        /*
         * Stage 1 does not authenticate users yet.
         * Therefore we display the default student
         * interface until the authentication system
         * is implemented.
         */

        if (profileName) {
            profileName.textContent =
                "Student";
        }


        if (profileEmail) {
            profileEmail.textContent =
                "ChemLab Student";
        }


        if (profileAvatar) {
            profileAvatar.textContent =
                "S";
        }

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


        /*
         * Initial search results.
         */

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

    function handleNavigation(
        event
    ) {

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

    function handlePageEnter(
        event
    ) {

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


        /*
         * Give every page a small
         * initialization hook.
         *
         * Later stages can attach
         * experiment-specific logic
         * here without changing the
         * core application controller.
         */

        page.classList.add(
            "page-ready"
        );

    }


    /* =====================================================
       PAGE EXIT EVENTS
       ===================================================== */

    function handlePageExit(
        event
    ) {

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
            "----------------------------------------"
        );

    }


    /* =====================================================
       APPLICATION INITIALIZATION
       ===================================================== */

    function initializeApplication() {

        if (APP_STATE.initialized) {
            return;
        }


        APP_STATE.initialized = true;

        APP_STATE.startedAt =
            performance.now();


        try {

            /*
             * Make sure the loader is visible
             * while the application initializes.
             */

            showLoader();


            /*
             * Core UI.
             */

            initializeTheme();

            initializeProfileUI();

            initializeNavigation();

            initializeSearch();

            initializeResponsiveBehavior();

            initializeErrorHandling();

            bindApplicationEvents();


            /*
             * Allow the browser to render the
             * application before removing loader.
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
