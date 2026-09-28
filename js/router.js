/* =========================================================
   CHEMLAB
   APPLICATION ROUTER
   Stage 1 — Foundation
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       ROUTER STATE
       ===================================================== */

    const state = {
        currentRoute: null,
        previousRoute: null,
        initialized: false
    };


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    const $ = (selector, parent = document) => {
        return parent.querySelector(selector);
    };


    const $$ = (selector, parent = document) => {
        return Array.from(parent.querySelectorAll(selector));
    };


    /* =====================================================
       ROUTE NORMALIZATION
       ===================================================== */

    function normalizeRoute(route) {

        if (!route) {
            return "dashboard";
        }

        let normalized = String(route)
            .trim()
            .toLowerCase();

        normalized = normalized
            .replace(/^#/, "")
            .replace(/^\/+/, "")
            .replace(/\/+$/, "");

        /*
         * Allow aliases for future compatibility.
         */

        const aliases = {
            home: "dashboard",
            lab: "laboratory",
            ai: "ai",
            tutor: "ai",
            notebook: "notebook",
            assessment: "assessments",
            settings: "settings"
        };

        if (aliases[normalized]) {
            normalized = aliases[normalized];
        }

        return normalized || "dashboard";
    }


    /* =====================================================
       VALIDATE ROUTE
       ===================================================== */

    function isValidRoute(route) {

        const config =
            window.CHEMLAB_CONFIG;

        if (!config || !config.routes) {
            return false;
        }

        return Boolean(
            config.routes[route]
        );
    }


    /* =====================================================
       GET DEFAULT ROUTE
       ===================================================== */

    function getDefaultRoute() {

        return (
            window.CHEMLAB_CONFIG
                ?.app
                ?.defaultRoute ||
            "dashboard"
        );

    }


    /* =====================================================
       GET PAGE ELEMENT
       ===================================================== */

    function getPage(route) {

        return (
            document.querySelector(
                `[data-page="${route}"]`
            ) ||

            document.getElementById(
                `page-${route}`
            )
        );

    }


    /* =====================================================
       GET ALL PAGES
       ===================================================== */

    function getPages() {

        return $$(
            "[data-page], .app-page"
        );

    }


    /* =====================================================
       UPDATE PAGE VISIBILITY
       ===================================================== */

    function showPage(route) {

        const pages = getPages();

        pages.forEach((page) => {

            const pageRoute =
                page.dataset.page ||
                page.id.replace(
                    /^page-/,
                    ""
                );

            const isActive =
                pageRoute === route;

            page.classList.toggle(
                "is-active",
                isActive
            );

            page.classList.toggle(
                "active",
                isActive
            );

            page.hidden = !isActive;

            page.setAttribute(
                "aria-hidden",
                String(!isActive)
            );

        });

    }


    /* =====================================================
       UPDATE NAVIGATION
       ===================================================== */

    function updateNavigation(route) {

        $$(".nav-link").forEach((link) => {

            const targetRoute =
                normalizeRoute(
                    link.dataset.route ||
                    link.getAttribute("href")
                );

            const active =
                targetRoute === route;

            link.classList.toggle(
                "is-active",
                active
            );

            link.classList.toggle(
                "active",
                active
            );

            if (active) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        });

    }


    /* =====================================================
       UPDATE BREADCRUMB
       ===================================================== */

    function updateBreadcrumb(route) {

        const config =
            window.CHEMLAB_CONFIG;

        const routeConfig =
            config?.routes?.[route];

        if (!routeConfig) {
            return;
        }


        /*
         * Main breadcrumb label
         */

        const breadcrumb =
            $(
                "[data-breadcrumb]"
            ) ||
            $("#breadcrumbCurrent");


        if (breadcrumb) {

            breadcrumb.textContent =
                routeConfig.title;

        }


        /*
         * Optional page title.
         */

        const title =
            $(
                "[data-page-title]"
            );


        if (title) {

            title.textContent =
                routeConfig.title;

        }


        /*
         * Optional page description.
         */

        const description =
            $(
                "[data-page-description]"
            );


        if (description) {

            description.textContent =
                routeConfig.description;

        }

    }


    /* =====================================================
       UPDATE DOCUMENT TITLE
       ===================================================== */

    function updateDocumentTitle(route) {

        const routeConfig =
            window.CHEMLAB_CONFIG
                ?.routes
                ?.[route];

        const appName =
            window.CHEMLAB_CONFIG
                ?.app
                ?.name ||
            "ChemLab";

        if (!routeConfig) {

            document.title =
                `${appName}`;

            return;

        }

        document.title =
            `${routeConfig.title} | ${appName}`;

    }


    /* =====================================================
       SAVE LAST ROUTE
       ===================================================== */

    function saveLastRoute(route) {

        try {

            const key =
                window.CHEMLAB_CONFIG
                    ?.getStorageKey
                    ? window.CHEMLAB_CONFIG
                        .getStorageKey(
                            "lastRoute"
                        )
                    : "chemlab_last_route";

            localStorage.setItem(
                key,
                route
            );

        } catch (error) {

            CHEMLAB_LOG(
                "Unable to save last route.",
                error
            );

        }

    }


    /* =====================================================
       GET SAVED ROUTE
       ===================================================== */

    function getSavedRoute() {

        try {

            const key =
                window.CHEMLAB_CONFIG
                    ?.getStorageKey
                    ? window.CHEMLAB_CONFIG
                        .getStorageKey(
                            "lastRoute"
                        )
                    : "chemlab_last_route";

            return normalizeRoute(
                localStorage.getItem(key)
            );

        } catch (error) {

            return null;

        }

    }


    /* =====================================================
       UPDATE URL
       ===================================================== */

    function updateURL(route, replace = false) {

        const newHash =
            `#${route}`;

        if (window.location.hash === newHash) {
            return;
        }

        if (replace) {

            history.replaceState(
                {
                    route
                },
                "",
                newHash
            );

        } else {

            history.pushState(
                {
                    route
                },
                "",
                newHash
            );

        }

    }


    /* =====================================================
       PAGE HOOKS
       ===================================================== */

    function callPageExit(previousRoute) {

        if (!previousRoute) {
            return;
        }

        const page =
            getPage(previousRoute);

        if (!page) {
            return;
        }

        const event =
            new CustomEvent(
                "chemlab:page-exit",
                {
                    detail: {
                        route: previousRoute,
                        page
                    }
                }
            );

        document.dispatchEvent(event);

    }


    function callPageEnter(route) {

        const page =
            getPage(route);

        if (!page) {
            return;
        }

        const event =
            new CustomEvent(
                "chemlab:page-enter",
                {
                    detail: {
                        route,
                        page
                    }
                }
            );

        document.dispatchEvent(event);

    }


    /* =====================================================
       ROUTE CHANGE
       ===================================================== */

    function navigate(
        route,
        options = {}
    ) {

        const normalizedRoute =
            normalizeRoute(route);


        /*
         * Invalid route
         */

        if (
            !isValidRoute(
                normalizedRoute
            )
        ) {

            CHEMLAB_LOG(
                "Invalid route:",
                normalizedRoute
            );

            routeToDefault();

            return false;

        }


        /*
         * Ensure the requested page exists.
         */

        const page =
            getPage(normalizedRoute);

        if (!page) {

            CHEMLAB_LOG(
                "Page element not found:",
                normalizedRoute
            );

            return false;

        }


        /*
         * Exit previous page.
         */

        callPageExit(
            state.currentRoute
        );


        /*
         * Update state.
         */

        state.previousRoute =
            state.currentRoute;

        state.currentRoute =
            normalizedRoute;


        /*
         * Update interface.
         */

        showPage(
            normalizedRoute
        );

        updateNavigation(
            normalizedRoute
        );

        updateBreadcrumb(
            normalizedRoute
        );

        updateDocumentTitle(
            normalizedRoute
        );


        /*
         * URL handling.
         */

        if (options.updateURL !== false) {

            updateURL(
                normalizedRoute,
                Boolean(options.replace)
            );

        }


        /*
         * Persistence.
         */

        if (
            options.save !== false
        ) {

            saveLastRoute(
                normalizedRoute
            );

        }


        /*
         * Mobile sidebar closes after navigation.
         */

        if (
            window.CHEMLAB_UI &&
            window.CHEMLAB_UI.sidebar
        ) {

            window.CHEMLAB_UI.sidebar.close();

        }


        /*
         * Notify the application.
         */

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:navigation",
                {
                    detail: {
                        route:
                            normalizedRoute,

                        previousRoute:
                            state.previousRoute
                    }
                }
            )
        );


        /*
         * Enter new page.
         */

        requestAnimationFrame(() => {

            callPageEnter(
                normalizedRoute
            );

        });


        if (
            window.CHEMLAB_CONFIG
                ?.development
                ?.logNavigation
        ) {

            CHEMLAB_LOG(
                "Navigated to:",
                normalizedRoute
            );

        }

        return true;

    }


    /* =====================================================
       DEFAULT ROUTE
       ===================================================== */

    function routeToDefault() {

        const defaultRoute =
            getDefaultRoute();

        navigate(
            defaultRoute,
            {
                replace: true
            }
        );

    }


    /* =====================================================
       ROUTE FROM URL
       ===================================================== */

    function routeFromURL() {

        const hash =
            window.location.hash;

        if (!hash) {
            return null;
        }

        return normalizeRoute(
            hash
        );

    }


    /* =====================================================
       INITIAL ROUTE
       ===================================================== */

    function determineInitialRoute() {

        const urlRoute =
            routeFromURL();


        /*
         * URL has highest priority.
         */

        if (
            urlRoute &&
            isValidRoute(urlRoute)
        ) {

            return urlRoute;

        }


        /*
         * Otherwise use saved route.
         */

        const savedRoute =
            getSavedRoute();

        if (
            savedRoute &&
            isValidRoute(savedRoute)
        ) {

            return savedRoute;

        }


        /*
         * Otherwise use default.
         */

        return getDefaultRoute();

    }


    /* =====================================================
       LINK HANDLER
       ===================================================== */

    function handleNavigationClick(event) {

        const link =
            event.target.closest(
                "[data-route], .nav-link"
            );

        if (!link) {
            return;
        }


        /*
         * Ignore modified clicks.
         */

        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) {

            return;

        }


        const rawRoute =
            link.dataset.route ||
            link.getAttribute("href");


        if (!rawRoute) {
            return;
        }


        /*
         * Ignore normal external URLs.
         */

        if (
            rawRoute.startsWith("http://") ||
            rawRoute.startsWith("https://")
        ) {

            return;

        }


        /*
         * Ignore anchors that aren't routes.
         */

        if (
            rawRoute === "#" ||
            rawRoute === ""
        ) {

            return;

        }


        const route =
            normalizeRoute(
                rawRoute
            );


        if (
            isValidRoute(route)
        ) {

            event.preventDefault();

            navigate(route);

        }

    }


    /* =====================================================
       BROWSER BACK / FORWARD
       ===================================================== */

    function handlePopState() {

        const route =
            routeFromURL();

        if (
            route &&
            isValidRoute(route)
        ) {

            navigate(
                route,
                {
                    updateURL: false,
                    save: true
                }
            );

        } else {

            routeToDefault();

        }

    }


    /* =====================================================
       HASH CHANGE
       ===================================================== */

    function handleHashChange() {

        const route =
            routeFromURL();

        if (
            route &&
            isValidRoute(route)
        ) {

            if (
                state.currentRoute !== route
            ) {

                navigate(
                    route,
                    {
                        updateURL: false
                    }
                );

            }

        } else {

            routeToDefault();

        }

    }


    /* =====================================================
       ROUTER INITIALIZATION
       ===================================================== */

    function initializeRouter() {

        if (state.initialized) {
            return;
        }

        state.initialized = true;


        /*
         * Navigation links.
         */

        document.addEventListener(
            "click",
            handleNavigationClick
        );


        /*
         * Browser navigation.
         */

        window.addEventListener(
            "popstate",
            handlePopState
        );


        window.addEventListener(
            "hashchange",
            handleHashChange
        );


        /*
         * Initial route.
         */

        const initialRoute =
            determineInitialRoute();


        if (
            isValidRoute(initialRoute)
        ) {

            navigate(
                initialRoute,
                {
                    replace: true
                }
            );

        } else {

            routeToDefault();

        }


        CHEMLAB_LOG(
            "Router initialized."
        );

    }


    /* =====================================================
       PUBLIC ROUTER API
       ===================================================== */

    window.CHEMLAB_ROUTER = {

        state,

        navigate,

        go: navigate,

        getCurrentRoute: () => {
            return state.currentRoute;
        },

        getPreviousRoute: () => {
            return state.previousRoute;
        },

        getDefaultRoute,

        isValidRoute,

        normalizeRoute,

        initialize: initializeRouter

    };


    /* =====================================================
       DOM READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeRouter
        );

    } else {

        initializeRouter();

    }

})();
