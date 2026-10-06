/* =========================================================
   CHEMLAB
   APPLICATION CORE
   Version 1.0
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       APPLICATION STATE
       ===================================================== */

    const ChemLab = {

        version: "1.0.0",

        initialized: false,

        currentRoute: "dashboard",

        user: null

    };


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    function $(selector) {
        return document.querySelector(selector);
    }


    function $$(selector) {
        return document.querySelectorAll(selector);
    }


    /* =====================================================
       MOBILE SIDEBAR
       ===================================================== */

    function setupMobileMenu() {

        const button = $(".mobile-menu");
        const sidebar = $(".sidebar");

        if (!button || !sidebar) {
            return;
        }


        button.addEventListener("click", function () {

            sidebar.classList.toggle("open");

        });


        document.addEventListener("click", function (event) {

            if (
                window.innerWidth <= 800 &&
                sidebar.classList.contains("open") &&
                !sidebar.contains(event.target) &&
                !button.contains(event.target)
            ) {

                sidebar.classList.remove("open");

            }

        });

    }


    /* =====================================================
       NAVIGATION
       ===================================================== */

  function setupNavigation() {

    const navigationItems =
        $$(".navigation-item");


    navigationItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const href =
                item.getAttribute("href");


            if (
                href &&
                href.startsWith("#") &&
                window.ChemLabRouter
            ) {

                const route =
                    href.substring(1) || "dashboard";


                window.ChemLabRouter.navigate(route);

            }


            const sidebar =
                $(".sidebar");


            if (
                sidebar &&
                window.innerWidth <= 800
            ) {

                sidebar.classList.remove("open");

            }

        });

    });

}


    /* =====================================================
       DASHBOARD ACTIONS
       ===================================================== */

    function setupDashboardActions() {

        const links = $$(
            ".dashboard a[href^='#']"
        );


        links.forEach(function (link) {

            link.addEventListener("click", function () {

                const target =
                    link.getAttribute("href");

                if (!target) {
                    return;
                }

                const route =
                    target.substring(1);

                ChemLab.currentRoute =
                    route || "dashboard";

            });

        });

    }


    /* =====================================================
       SIGN IN PLACEHOLDER
       ===================================================== */

    function setupSignInButton() {

        const button = $(".sign-in-button");

        if (!button) {
            return;
        }


        button.addEventListener("click", function () {

            alert(
                "ChemLab authentication will be connected in the next stage."
            );

        });

    }


    /* =====================================================
       SEARCH PLACEHOLDER
       ===================================================== */

    function setupSearch() {

        const button = $(".search-button");

        if (!button) {
            return;
        }


        button.addEventListener("click", function () {

            alert(
                "ChemLab Search will be available in a later stage."
            );

        });

    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

  function initialize() {

    if (ChemLab.initialized) return;

    setupMobileMenu();

    setupNavigation();

    setupDashboardActions();

    setupSignInButton();

    setupSearch();


    if (window.ChemLabRouter) {
        window.ChemLabRouter.initialize();
    }


    ChemLab.initialized = true;

    console.log(
        "ChemLab initialized successfully.",
        ChemLab.version
    );

}


    /* =====================================================
       START APPLICATION
       ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ChemLab = ChemLab;

})();
