/* =========================================================
   CHEMLAB
   APPLICATION ROUTER
   Version 1.0
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ROUTE CONFIGURATION
       ===================================================== */

    const ROUTES = {

        dashboard: {
            title: "Dashboard"
        },

        laboratory: {
            title: "Laboratory"
        },

        experiments: {
            title: "Experiments"
        },

        analysis: {
            title: "Analysis"
        },

        academy: {
            title: "Chemistry Academy"
        },

        "ai-tutor": {
            title: "AI ChemLab Tutor"
        },

        assessments: {
            title: "Assessments"
        },

        notebook: {
            title: "Lab Notebook"
        },

        progress: {
            title: "My Progress"
        },

        premium: {
            title: "ChemLab Premium"
        },

        settings: {
            title: "Settings"
        }

    };


    /* =====================================================
       ROUTER
       ===================================================== */

    const Router = {

        currentRoute: "dashboard",


        /* =================================================
           GET CURRENT ROUTE
           ================================================= */

        getRoute: function () {

            const hash = window.location.hash.replace("#", "");

            if (!hash) {
                return "dashboard";
            }

            if (ROUTES[hash]) {
                return hash;
            }

            return "dashboard";

        },


        /* =================================================
           NAVIGATE
           ================================================= */

        navigate: function (route) {

            if (!ROUTES[route]) {
                route = "dashboard";
            }

            window.location.hash = route;

        },


        /* =================================================
           UPDATE NAVIGATION
           ================================================= */

        updateNavigation: function (route) {

            const navigationItems =
                document.querySelectorAll(".navigation-item");


            navigationItems.forEach(function (item) {

                const href =
                    item.getAttribute("href");


                if (href === "#" + route) {

                    item.classList.add("active");

                } else {

                    item.classList.remove("active");

                }

            });

        },


        /* =================================================
           UPDATE BREADCRUMB
           ================================================= */

        updateBreadcrumb: function (route) {

            const breadcrumb =
                document.querySelector(".breadcrumb");


            if (!breadcrumb) {
                return;
            }


            const routeConfig =
                ROUTES[route];


            if (!routeConfig) {
                return;
            }


            breadcrumb.textContent =
                "ChemLab / " + routeConfig.title;

        },


        /* =================================================
           UPDATE PAGE TITLE
           ================================================= */

        updateTitle: function (route) {

            const routeConfig =
                ROUTES[route];


            if (!routeConfig) {
                return;
            }


            document.title =
                routeConfig.title + " | ChemLab";

        },


        /* =================================================
           UPDATE APPLICATION
           ================================================= */

        updateUI: function (route) {

            if (!ROUTES[route]) {
                route = "dashboard";
            }


            this.currentRoute = route;


            this.updateNavigation(route);

            this.updateBreadcrumb(route);

            this.updateTitle(route);


            /*
             * Keep the main ChemLab application state
             * synchronized with the router.
             */

            if (window.ChemLab) {

                window.ChemLab.currentRoute =
                    route;

            }

        },


        /* =================================================
           HANDLE ROUTE CHANGE
           ================================================= */

        handleRouteChange: function () {

            const route =
                this.getRoute();


            this.updateUI(route);

        },


        /* =================================================
           INITIALIZE ROUTER
           ================================================= */

        initialize: function () {

            const self = this;


            window.addEventListener(
                "hashchange",
                function () {

                    self.handleRouteChange();

                }
            );


            this.handleRouteChange();

        }

    };


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ChemLabRouter = Router;


})();
