/* =========================================================
   CHEMLAB
   APPLICATION CORE
   Version 2.1
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       APPLICATION STATE
       ===================================================== */

    const ChemLab = {

        version: "2.1.0",

        initialized: false,

        currentRoute: "dashboard",

        user: null

    };


    /* =====================================================
       DOM HELPER
       ===================================================== */

    function $(selector) {

        return document.querySelector(selector);

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    function setupMobileMenu() {

        const button =
            $(".mobile-menu");

        const sidebar =
            $(".sidebar");


        if (!button || !sidebar) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle("open");

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                if (
                    window.innerWidth <= 800 &&
                    sidebar.classList.contains("open") &&
                    !sidebar.contains(event.target) &&
                    !button.contains(event.target)
                ) {

                    sidebar.classList.remove("open");

                }

            }
        );

    }


    /* =====================================================
       SIGN IN
       ===================================================== */

    function setupSignInButton() {

        const button =
            $(".sign-in-button");


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                alert(
                    "ChemLab authentication will be connected in a later stage."
                );

            }
        );

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function setupSearch() {

        const button =
            $(".search-button");


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                alert(
                    "ChemLab Search will be available in a later stage."
                );

            }
        );

    }


    /* =====================================================
       APPLICATION INITIALIZATION
       ===================================================== */

    function initialize() {

        if (ChemLab.initialized) {
            return;
        }


        /*
         * Make the global application object available
         * BEFORE any other system starts.
         */

        window.ChemLab = ChemLab;


        setupMobileMenu();

        setupSignInButton();

        setupSearch();


        /*
         * Start the router.
         */

        if (
            window.ChemLabRouter &&
            typeof window.ChemLabRouter.initialize === "function"
        ) {

            window.ChemLabRouter.initialize();

        } else {

            console.error(
                "ChemLab Router was not loaded."
            );

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

})();
