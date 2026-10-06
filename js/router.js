/* =========================================================
   CHEMLAB
   APPLICATION ROUTER + VIEW ENGINE
   Version 2.0
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ROUTES
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
       VIEW TEMPLATES
       ===================================================== */

    const VIEWS = {

        laboratory: `
            <div class="page-view">

                <div class="page-header">
                    <div>
                        <p class="eyebrow">DIGITAL LABORATORY</p>

                        <h1>Laboratory</h1>

                        <p>
                            Design, perform, and document chemistry
                            experiments in your digital laboratory.
                        </p>
                    </div>

                    <a href="#experiments" class="primary-button">
                        Explore Experiments
                    </a>
                </div>


                <div class="workspace-grid">

                    <article class="workspace-card">
                        <span class="workspace-icon">⚗</span>

                        <h2>Guided Laboratory</h2>

                        <p>
                            Follow structured experiments with
                            instructions, observations, and analysis.
                        </p>

                        <a href="#experiments">
                            Start Guided Lab →
                        </a>
                    </article>


                    <article class="workspace-card">
                        <span class="workspace-icon">🧪</span>

                        <h2>Open Laboratory</h2>

                        <p>
                            Build your own experiment using chemicals
                            and laboratory apparatus.
                        </p>

                        <a href="#laboratory">
                            Open Workspace →
                        </a>
                    </article>


                    <article class="workspace-card">
                        <span class="workspace-icon">▥</span>

                        <h2>Data Analysis</h2>

                        <p>
                            Record measurements and analyze scientific
                            data from your experiments.
                        </p>

                        <a href="#analysis">
                            Open Analysis →
                        </a>
                    </article>


                    <article class="workspace-card">
                        <span class="workspace-icon">✦</span>

                        <h2>AI Laboratory Guidance</h2>

                        <p>
                            Get intelligent chemistry guidance while
                            working through your laboratory tasks.
                        </p>

                        <a href="#ai-tutor">
                            Open AI Tutor →
                        </a>
                    </article>

                </div>

            </div>
        `,


        experiments: `
            <div class="page-view">

                <div class="page-header">
                    <div>
                        <p class="eyebrow">EXPERIMENT LIBRARY</p>

                        <h1>Experiments</h1>

                        <p>
                            Explore structured chemistry experiments
                            and investigations.
                        </p>
                    </div>

                    <a href="#laboratory" class="primary-button">
                        Open Laboratory
                    </a>
                </div>


                <div class="empty-state">

                    <div class="empty-state-icon">
                        🧪
                    </div>

                    <h2>Experiment Library</h2>

                    <p>
                        Your professional chemistry experiment
                        library will be built here.
                    </p>

                    <span>
                        Experiment engine coming next.
                    </span>

                </div>

            </div>
        `,


        analysis: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <p class="eyebrow">SCIENTIFIC DATA</p>

                        <h1>Analysis</h1>

                        <p>
                            Analyze measurements, observations,
                            calculations, and experimental results.
                        </p>
                    </div>

                    <a href="#laboratory" class="primary-button">
                        Laboratory
                    </a>

                </div>


                <div class="empty-state">

                    <div class="empty-state-icon">
                        ▥
                    </div>

                    <h2>Scientific Analysis Workspace</h2>

                    <p>
                        Tables, calculations, graphs, statistics,
                        and experimental analysis tools will live here.
                    </p>

                    <span>
                        Analysis engine coming next.
                    </span>

                </div>

            </div>
        `,


        academy: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <p class="eyebrow">CHEMISTRY EDUCATION</p>

                        <h1>Chemistry Academy</h1>

                        <p>
                            Build chemistry knowledge from foundational
                            concepts to advanced university-level topics.
                        </p>

                    </div>

                    <a href="#assessments" class="primary-button">
                        Assessments
                    </a>

                </div>


                <div class="academy-grid">

                    <article class="subject-card">
                        <span>⚛</span>
                        <h2>General Chemistry</h2>
                        <p>
                            Matter, atoms, bonding, reactions,
                            stoichiometry, and chemical calculations.
                        </p>
                    </article>


                    <article class="subject-card">
                        <span>◈</span>
                        <h2>Organic Chemistry</h2>
                        <p>
                            Structure, reactions, mechanisms,
                            functional groups, and synthesis.
                        </p>
                    </article>


                    <article class="subject-card">
                        <span>△</span>
                        <h2>Physical Chemistry</h2>
                        <p>
                            Thermodynamics, kinetics, equilibrium,
                            electrochemistry, and quantum concepts.
                        </p>
                    </article>


                    <article class="subject-card">
                        <span>⌬</span>
                        <h2>Analytical Chemistry</h2>
                        <p>
                            Measurement, titration, spectroscopy,
                            separation, and quantitative analysis.
                        </p>
                    </article>

                </div>

            </div>
        `,


        "ai-tutor": `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <p class="eyebrow">INTELLIGENT CHEMISTRY ASSISTANT</p>

                        <h1>AI ChemLab Tutor</h1>

                        <p>
                            Your chemistry-focused AI assistant for
                            concepts, calculations, experiments, and analysis.
                        </p>
                    </div>

                </div>


                <div class="ai-preview">

                    <div class="ai-preview-header">
                        <span class="ai-status"></span>

                        <strong>
                            ChemLab AI
                        </strong>

                        <span>
                            Ready
                        </span>
                    </div>


                    <div class="ai-message">

                        <strong>
                            ChemLab AI
                        </strong>

                        <p>
                            Hello. I'm your chemistry assistant.
                            The full AI laboratory assistant will be
                            connected in a later stage.
                        </p>

                    </div>


                    <div class="ai-input-preview">
                        Ask a chemistry question...
                        <button type="button">
                            →
                        </button>
                    </div>

                </div>

            </div>
        `,


        assessments: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <p class="eyebrow">KNOWLEDGE CHECK</p>

                        <h1>Assessments</h1>

                        <p>
                            Test your chemistry knowledge and measure
                            your understanding.
                        </p>
                    </div>

                </div>


                <div class="empty-state">

                    <div class="empty-state-icon">
                        ✓
                    </div>

                    <h2>Assessment Center</h2>

                    <p>
                        Topic quizzes, experiment-based assessments,
                        and chemistry challenges will appear here.
                    </p>

                    <span>
                        Assessment engine coming next.
                    </span>

                </div>

            </div>
        `,


        notebook: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <p class="eyebrow">SCIENTIFIC RECORD</p>

                        <h1>Lab Notebook</h1>

                        <p>
                            Keep structured records of experiments,
                            observations, calculations, and conclusions.
                        </p>
                    </div>

                    <a href="#laboratory" class="primary-button">
                        Open Laboratory
                    </a>

                </div>


                <div class="empty-state">

                    <div class="empty-state-icon">
                        ▱
                    </div>

                    <h2>Your Digital Lab Notebook</h2>

                    <p>
                        Experiment records and scientific notes
                        will be stored here.
                    </p>

                    <span>
                        Notebook system coming next.
                    </span>

                </div>

            </div>
        `,


        progress: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <p class="eyebrow">YOUR DEVELOPMENT</p>

                        <h1>My Progress</h1>

                        <p>
                            Track your chemistry learning,
                            experiments, assessments, and mastery.
                        </p>
                    </div>

                </div>


                <div class="progress-overview">

                    <div class="progress-stat">
                        <span>Experiments</span>
                        <strong>0</strong>
                    </div>

                    <div class="progress-stat">
                        <span>Mastery</span>
                        <strong>0%</strong>
                    </div>

                    <div class="progress-stat">
                        <span>Assessments</span>
                        <strong>0</strong>
                    </div>

                    <div class="progress-stat">
                        <span>Science XP</span>
                        <strong>0</strong>
                    </div>

                </div>

            </div>
        `,


        premium: `
            <div class="page-view">

                <div class="premium-page">

                    <p class="eyebrow">
                        ADVANCED CHEMISTRY TOOLS
                    </p>

                    <h1>
                        ChemLab Premium
                    </h1>

                    <p>
                        Unlock advanced laboratory capabilities,
                        deeper analysis tools, and enhanced learning
                        features.
                    </p>

                    <div class="premium-features">

                        <div>
                            <strong>Advanced Laboratory</strong>
                            <span>Expanded experiment capabilities.</span>
                        </div>

                        <div>
                            <strong>Advanced Analysis</strong>
                            <span>More powerful scientific data tools.</span>
                        </div>

                        <div>
                            <strong>AI Chemistry Assistant</strong>
                            <span>Enhanced chemistry assistance.</span>
                        </div>

                    </div>

                </div>

            </div>
        `,


        settings: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <p class="eyebrow">APPLICATION</p>

                        <h1>Settings</h1>

                        <p>
                            Manage your ChemLab preferences and
                            application settings.
                        </p>
                    </div>

                </div>


                <div class="empty-state">

                    <div class="empty-state-icon">
                        ⚙
                    </div>

                    <h2>ChemLab Settings</h2>

                    <p>
                        Account, laboratory, notification, and
                        application preferences will appear here.
                    </p>

                </div>

            </div>
        `

    };


    /* =====================================================
       ROUTER
       ===================================================== */

    const Router = {

        currentRoute: "dashboard",


        getRoute: function () {

            const hash =
                window.location.hash.replace("#", "");

            if (!hash) {
                return "dashboard";
            }

            if (ROUTES[hash]) {
                return hash;
            }

            return "dashboard";

        },


        navigate: function (route) {

            if (!ROUTES[route]) {
                route = "dashboard";
            }

            window.location.hash = route;

        },


        updateNavigation: function (route) {

            document
                .querySelectorAll(".navigation-item")
                .forEach(function (item) {

                    const href =
                        item.getAttribute("href");


                    if (href === "#" + route) {

                        item.classList.add("active");

                    } else {

                        item.classList.remove("active");

                    }

                });

        },


        updateBreadcrumb: function (route) {

            const breadcrumb =
                document.querySelector(".breadcrumb");

            const routeConfig =
                ROUTES[route];


            if (!breadcrumb || !routeConfig) {
                return;
            }


            breadcrumb.innerHTML =
                "<span>ChemLab</span>" +
                "<span>/</span>" +
                "<strong>" +
                routeConfig.title +
                "</strong>";

        },


        updateTitle: function (route) {

            const routeConfig =
                ROUTES[route];


            if (!routeConfig) {
                return;
            }


            document.title =
                routeConfig.title + " | ChemLab";

        },


        renderView: function (route) {

            const appView =
                document.querySelector("#appView");


            if (!appView) {
                return;
            }


            /* Dashboard already exists in index.html */

            if (route === "dashboard") {

                appView.style.display = "";

                return;

            }


            const view =
                VIEWS[route];


            if (!view) {
                return;
            }


            appView.innerHTML = view;

            appView.classList.add("route-view");

        },


        updateUI: function (route) {

            if (!ROUTES[route]) {
                route = "dashboard";
            }


            this.currentRoute = route;


            this.updateNavigation(route);

            this.updateBreadcrumb(route);

            this.updateTitle(route);

            this.renderView(route);


            if (window.ChemLab) {

                window.ChemLab.currentRoute =
                    route;

            }

        },


        handleRouteChange: function () {

            const route =
                this.getRoute();


            this.updateUI(route);

        },


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
