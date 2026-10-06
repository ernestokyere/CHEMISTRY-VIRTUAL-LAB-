/* =========================================================
   CHEMLAB
   APPLICATION CORE
   Version 2.0
   ========================================================= */

(function () {

    "use strict";


    const ChemLab = {

        version: "2.0.0",

        initialized: false,

        currentRoute: "dashboard",

        user: null

    };


    function $(selector) {
        return document.querySelector(selector);
    }


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


    function initialize() {

        if (ChemLab.initialized) {
            return;
        }


        setupMobileMenu();

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


    window.ChemLab = ChemLab;

})();
