/* =========================================================
   CHEMLAB
   PROFESSIONAL ROUTER
   Version 3.0
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ROUTE DEFINITIONS
       ===================================================== */

    const ROUTES = {
        dashboard: {
            title: "Dashboard",
            breadcrumb: "Dashboard"
        },

        laboratory: {
            title: "Laboratory",
            breadcrumb: "Laboratory"
        },

        experiments: {
            title: "Experiments",
            breadcrumb: "Experiments"
        },

        analysis: {
            title: "Analysis",
            breadcrumb: "Analysis"
        },

        academy: {
            title: "Chemistry Academy",
            breadcrumb: "Chemistry Academy"
        },

        "ai-tutor": {
            title: "AI ChemLab Tutor",
            breadcrumb: "AI ChemLab Tutor"
        },

        assessments: {
            title: "Assessments",
            breadcrumb: "Assessments"
        },

        notebook: {
            title: "Lab Notebook",
            breadcrumb: "Lab Notebook"
        },

        progress: {
            title: "My Progress",
            breadcrumb: "My Progress"
        },

        premium: {
            title: "Premium",
            breadcrumb: "Premium"
        },

        settings: {
            title: "Settings",
            breadcrumb: "Settings"
        }
    };


    /* =====================================================
       PAGE CONTENT
       ===================================================== */

    const VIEWS = {

      /* =========================================================
   LABORATORY VIEW
   Stage 4.1 — Digital Laboratory Workspace
   ========================================================= */

laboratory: `

    <section class="page-view laboratory-view">

        <!-- =================================================
             PAGE HEADER
             ================================================= -->

        <div class="page-header laboratory-page-header">

            <div>

                <span class="page-eyebrow">
                    DIGITAL LABORATORY
                </span>

                <h1>
                    Laboratory Workspace
                </h1>

                <p>
                    Build, configure and explore chemistry
                    experiments in a controlled digital
                    laboratory environment.
                </p>

            </div>

            <div class="laboratory-header-actions">

                <button
                    type="button"
                    class="toolbar-button"
                    id="labClearWorkspace"
                >
                    Clear Workspace
                </button>

                <button
                    type="button"
                    class="toolbar-button laboratory-primary-button"
                    id="labSaveSetup"
                >
                    Save Setup
                </button>

            </div>

        </div>


        <!-- =================================================
             LABORATORY STATUS BAR
             ================================================= -->

        <div class="laboratory-status-bar">

            <div class="laboratory-status-item">

                <span class="laboratory-status-dot"></span>

                <span>
                    Laboratory Ready
                </span>

            </div>

            <div class="laboratory-status-divider"></div>

            <div class="laboratory-status-item">

                <span class="laboratory-status-label">
                    Mode
                </span>

                <strong>
                    Open Laboratory
                </strong>

            </div>

            <div class="laboratory-status-divider"></div>

            <div class="laboratory-status-item">

                <span class="laboratory-status-label">
                    Materials
                </span>

                <strong id="labMaterialCount">
                    0
                </strong>

            </div>

            <div class="laboratory-status-divider"></div>

            <div class="laboratory-status-item">

                <span class="laboratory-status-label">
                    Apparatus
                </span>

                <strong id="labApparatusCount">
                    0
                </strong>

            </div>

        </div>


        <!-- =================================================
             LABORATORY WORKSPACE
             ================================================= -->

        <div class="laboratory-workspace">


            <!-- =============================================
                 CHEMICAL LIBRARY
                 ============================================= -->

            <aside class="laboratory-panel chemical-library-panel">

                <div class="laboratory-panel-header">

                    <div>

                        <span class="laboratory-panel-eyebrow">
                            MATERIALS
                        </span>

                        <h2>
                            Chemical Library
                        </h2>

                    </div>

                    <span class="laboratory-panel-count">
                        8
                    </span>

                </div>


                <div class="laboratory-search">

                    <span class="laboratory-search-icon">
                        ⌕
                    </span>

                    <input
                        type="search"
                        id="chemicalLibrarySearch"
                        placeholder="Search chemicals..."
                        autocomplete="off"
                    >

                </div>


                <div class="laboratory-filter-row">

                    <button
                        type="button"
                        class="laboratory-filter active"
                        data-chemical-filter="all"
                    >
                        All
                    </button>

                    <button
                        type="button"
                        class="laboratory-filter"
                        data-chemical-filter="acid"
                    >
                        Acids
                    </button>

                    <button
                        type="button"
                        class="laboratory-filter"
                        data-chemical-filter="base"
                    >
                        Bases
                    </button>

                    <button
                        type="button"
                        class="laboratory-filter"
                        data-chemical-filter="indicator"
                    >
                        Indicators
                    </button>

                </div>


                <div
                    class="laboratory-library-list"
                    id="chemicalLibraryList"
                >


                    <button
                        type="button"
                        class="laboratory-material-card"
                        data-chemical-name="Hydrochloric Acid"
                        data-chemical-formula="HCl"
                        data-chemical-type="acid"
                    >

                        <span class="material-icon acid">
                            H+
                        </span>

                        <span class="material-information">

                            <strong>
                                Hydrochloric Acid
                            </strong>

                            <small>
                                HCl · Acid
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-material-card"
                        data-chemical-name="Sulfuric Acid"
                        data-chemical-formula="H₂SO₄"
                        data-chemical-type="acid"
                    >

                        <span class="material-icon acid">
                            H+
                        </span>

                        <span class="material-information">

                            <strong>
                                Sulfuric Acid
                            </strong>

                            <small>
                                H₂SO₄ · Acid
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-material-card"
                        data-chemical-name="Sodium Hydroxide"
                        data-chemical-formula="NaOH"
                        data-chemical-type="base"
                    >

                        <span class="material-icon base">
                            OH⁻
                        </span>

                        <span class="material-information">

                            <strong>
                                Sodium Hydroxide
                            </strong>

                            <small>
                                NaOH · Base
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-material-card"
                        data-chemical-name="Potassium Hydroxide"
                        data-chemical-formula="KOH"
                        data-chemical-type="base"
                    >

                        <span class="material-icon base">
                            OH⁻
                        </span>

                        <span class="material-information">

                            <strong>
                                Potassium Hydroxide
                            </strong>

                            <small>
                                KOH · Base
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-material-card"
                        data-chemical-name="Sodium Chloride"
                        data-chemical-formula="NaCl"
                        data-chemical-type="salt"
                    >

                        <span class="material-icon salt">
                            Na+
                        </span>

                        <span class="material-information">

                            <strong>
                                Sodium Chloride
                            </strong>

                            <small>
                                NaCl · Salt
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-material-card"
                        data-chemical-name="Phenolphthalein"
                        data-chemical-formula="C₂₀H₁₄O₄"
                        data-chemical-type="indicator"
                    >

                        <span class="material-icon indicator">
                            pH
                        </span>

                        <span class="material-information">

                            <strong>
                                Phenolphthalein
                            </strong>

                            <small>
                                Indicator
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-material-card"
                        data-chemical-name="Methyl Orange"
                        data-chemical-formula="C₁₄H₁₄N₃NaO₃S"
                        data-chemical-type="indicator"
                    >

                        <span class="material-icon indicator">
                            pH
                        </span>

                        <span class="material-information">

                            <strong>
                                Methyl Orange
                            </strong>

                            <small>
                                Indicator
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-material-card"
                        data-chemical-name="Distilled Water"
                        data-chemical-formula="H₂O"
                        data-chemical-type="solvent"
                    >

                        <span class="material-icon solvent">
                            H₂O
                        </span>

                        <span class="material-information">

                            <strong>
                                Distilled Water
                            </strong>

                            <small>
                                H₂O · Solvent
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>

                </div>

            </aside>


            <!-- =============================================
                 CENTRAL WORKSPACE
                 ============================================= -->

            <main class="laboratory-workspace-center">


                <div class="laboratory-workspace-toolbar">

                    <div>

                        <span class="laboratory-panel-eyebrow">
                            EXPERIMENT WORKSPACE
                        </span>

                        <h2>
                            Digital Bench
                        </h2>

                    </div>

                    <div class="laboratory-workspace-tools">

                        <button
                            type="button"
                            class="workspace-tool-button active"
                            title="Workspace"
                        >
                            ⊞
                        </button>

                        <button
                            type="button"
                            class="workspace-tool-button"
                            title="Measurements"
                        >
                            📏
                        </button>

                        <button
                            type="button"
                            class="workspace-tool-button"
                            title="Observations"
                        >
                            ◉
                        </button>

                    </div>

                </div>


                <div
                    class="digital-lab-bench"
                    id="digitalLabBench"
                >

                    <div class="lab-bench-grid"></div>


                    <div
                        class="lab-empty-workspace"
                        id="labEmptyWorkspace"
                    >

                        <div class="lab-empty-icon">
                            ⚗
                        </div>

                        <h3>
                            Your laboratory is ready
                        </h3>

                        <p>
                            Select chemicals and apparatus
                            from the libraries to begin
                            constructing your experiment.
                        </p>

                        <span>
                            Add materials to the digital bench
                            to get started.
                        </span>

                    </div>


                    <div
                        class="lab-selected-materials"
                        id="labSelectedMaterials"
                    ></div>

                </div>


                <div class="laboratory-bench-footer">

                    <div>

                        <span>
                            Workspace
                        </span>

                        <strong>
                            Open Experiment
                        </strong>

                    </div>

                    <div class="bench-footer-actions">

                        <button
                            type="button"
                            class="toolbar-button"
                        >
                            Reset View
                        </button>

                        <button
                            type="button"
                            class="toolbar-button laboratory-primary-button"
                        >
                            Begin Experiment
                        </button>

                    </div>

                </div>

            </main>


            <!-- =============================================
                 APPARATUS LIBRARY
                 ============================================= -->

            <aside class="laboratory-panel apparatus-library-panel">

                <div class="laboratory-panel-header">

                    <div>

                        <span class="laboratory-panel-eyebrow">
                            EQUIPMENT
                        </span>

                        <h2>
                            Apparatus Library
                        </h2>

                    </div>

                    <span class="laboratory-panel-count">
                        8
                    </span>

                </div>


                <div class="laboratory-search">

                    <span class="laboratory-search-icon">
                        ⌕
                    </span>

                    <input
                        type="search"
                        id="apparatusLibrarySearch"
                        placeholder="Search apparatus..."
                        autocomplete="off"
                    >

                </div>


                <div class="laboratory-filter-row">

                    <button
                        type="button"
                        class="laboratory-filter active"
                        data-apparatus-filter="all"
                    >
                        All
                    </button>

                    <button
                        type="button"
                        class="laboratory-filter"
                        data-apparatus-filter="glassware"
                    >
                        Glassware
                    </button>

                    <button
                        type="button"
                        class="laboratory-filter"
                        data-apparatus-filter="measurement"
                    >
                        Measurement
                    </button>

                </div>


                <div
                    class="laboratory-library-list"
                    id="apparatusLibraryList"
                >


                    <button
                        type="button"
                        class="laboratory-apparatus-card"
                        data-apparatus-name="Beaker"
                        data-apparatus-type="glassware"
                    >

                        <span class="apparatus-icon">
                            ⚗
                        </span>

                        <span class="material-information">

                            <strong>
                                Beaker
                            </strong>

                            <small>
                                Glassware
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-apparatus-card"
                        data-apparatus-name="Conical Flask"
                        data-apparatus-type="glassware"
                    >

                        <span class="apparatus-icon">
                            ⚗
                        </span>

                        <span class="material-information">

                            <strong>
                                Conical Flask
                            </strong>

                            <small>
                                Glassware
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-apparatus-card"
                        data-apparatus-name="Test Tube"
                        data-apparatus-type="glassware"
                    >

                        <span class="apparatus-icon">
                            ▯
                        </span>

                        <span class="material-information">

                            <strong>
                                Test Tube
                            </strong>

                            <small>
                                Glassware
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-apparatus-card"
                        data-apparatus-name="Burette"
                        data-apparatus-type="measurement"
                    >

                        <span class="apparatus-icon">
                            │
                        </span>

                        <span class="material-information">

                            <strong>
                                Burette
                            </strong>

                            <small>
                                Measurement
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-apparatus-card"
                        data-apparatus-name="Pipette"
                        data-apparatus-type="measurement"
                    >

                        <span class="apparatus-icon">
                            ◇
                        </span>

                        <span class="material-information">

                            <strong>
                                Pipette
                            </strong>

                            <small>
                                Measurement
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-apparatus-card"
                        data-apparatus-name="Measuring Cylinder"
                        data-apparatus-type="measurement"
                    >

                        <span class="apparatus-icon">
                            ▥
                        </span>

                        <span class="material-information">

                            <strong>
                                Measuring Cylinder
                            </strong>

                            <small>
                                Measurement
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-apparatus-card"
                        data-apparatus-name="Electronic Balance"
                        data-apparatus-type="measurement"
                    >

                        <span class="apparatus-icon">
                            ⚖
                        </span>

                        <span class="material-information">

                            <strong>
                                Electronic Balance
                            </strong>

                            <small>
                                Measurement
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>


                    <button
                        type="button"
                        class="laboratory-apparatus-card"
                        data-apparatus-name="Tripod Stand"
                        data-apparatus-type="glassware"
                    >

                        <span class="apparatus-icon">
                            △
                        </span>

                        <span class="material-information">

                            <strong>
                                Tripod Stand
                            </strong>

                            <small>
                                Support Equipment
                            </small>

                        </span>

                        <span class="material-add">
                            +
                        </span>

                    </button>

                </div>

            </aside>

        </div>


        <!-- =================================================
             SELECTED MATERIALS SUMMARY
             ================================================= -->

        <section class="laboratory-selection-summary">

            <div class="selection-summary-header">

                <div>

                    <span class="laboratory-panel-eyebrow">
                        CURRENT SETUP
                    </span>

                    <h2>
                        Experiment Materials
                    </h2>

                </div>

                <span
                    class="selection-summary-count"
                    id="labSelectionCount"
                >
                    0 items
                </span>

            </div>


            <div
                class="selection-summary-list"
                id="labSelectionSummary"
            >

                <div class="selection-empty">

                    <span>
                        +
                    </span>

                    <p>
                        No materials selected yet.
                    </p>

                </div>

            </div>

        </section>


        <!-- =================================================
             LABORATORY NEXT STEP
             ================================================= -->

        <section class="laboratory-next-step">

            <div>

                <span class="laboratory-panel-eyebrow">
                    NEXT STEP
                </span>

                <h2>
                    Configure your experiment
                </h2>

                <p>
                    Select the chemicals and apparatus
                    required for your experiment. The
                    workspace will become interactive as
                    the laboratory engine develops.
                </p>

            </div>

            <div class="laboratory-next-step-icon">
                →
            </div>

        </section>

    </section>

`,

                    <div class="page-header-actions">
                        <button class="toolbar-button">
                            New Experiment
                        </button>
                    </div>
                </div>


                <div class="workspace-grid">

                    <article class="workspace-card">

                        <div class="workspace-icon">
                            ⚗
                        </div>

                        <h3>
                            Guided Laboratory
                        </h3>

                        <p>
                            Follow structured laboratory procedures
                            with step-by-step scientific guidance.
                        </p>

                        <button class="toolbar-button">
                            Explore Guided Labs
                        </button>

                    </article>


                    <article class="workspace-card">

                        <div class="workspace-icon">
                            ⚗
                        </div>

                        <h3>
                            Open Laboratory
                        </h3>

                        <p>
                            Build your own experiment using chemicals,
                            apparatus and scientific measurements.
                        </p>

                        <button class="toolbar-button">
                            Open Laboratory
                        </button>

                    </article>


                    <article class="workspace-card">

                        <div class="workspace-icon">
                            ◫
                        </div>

                        <h3>
                            Chemical Library
                        </h3>

                        <p>
                            Explore chemical substances, properties
                            and laboratory information.
                        </p>

                        <button class="toolbar-button">
                            View Chemicals
                        </button>

                    </article>


                    <article class="workspace-card">

                        <div class="workspace-icon">
                            ⚙
                        </div>

                        <h3>
                            Apparatus Library
                        </h3>

                        <p>
                            Access laboratory equipment and learn
                            how each apparatus is used.
                        </p>

                        <button class="toolbar-button">
                            View Apparatus
                        </button>

                    </article>

                </div>

            </div>
        `,


        experiments: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <span class="page-eyebrow">
                            EXPERIMENT CENTER
                        </span>

                        <h1>
                            Experiments
                        </h1>

                        <p>
                            Discover chemistry experiments and
                            build practical scientific skills.
                        </p>
                    </div>

                </div>


                <div class="workspace-grid">

                    <article class="workspace-card">

                        <div class="workspace-icon">
                            🧪
                        </div>

                        <h3>
                            Available Experiments
                        </h3>

                        <p>
                            Browse structured chemistry experiments
                            designed for progressive learning.
                        </p>

                        <button class="toolbar-button">
                            Browse Experiments
                        </button>

                    </article>


                    <article class="workspace-card">

                        <div class="workspace-icon">
                            +
                        </div>

                        <h3>
                            Create Experiment
                        </h3>

                        <p>
                            Design a custom experiment using the
                            ChemLab laboratory environment.
                        </p>

                        <button class="toolbar-button">
                            Create Experiment
                        </button>

                    </article>

                </div>

            </div>
        `,


        analysis: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <span class="page-eyebrow">
                            SCIENTIFIC ANALYSIS
                        </span>

                        <h1>
                            Analysis
                        </h1>

                        <p>
                            Analyse experimental measurements,
                            observations and scientific data.
                        </p>
                    </div>

                </div>


                <div class="workspace-grid">

                    <article class="workspace-card">

                        <div class="workspace-icon">
                            ∑
                        </div>

                        <h3>
                            Data Analysis
                        </h3>

                        <p>
                            Work with experimental measurements and
                            calculate scientific results.
                        </p>

                        <button class="toolbar-button">
                            Start Analysis
                        </button>

                    </article>


                    <article class="workspace-card">

                        <div class="workspace-icon">
                            ◫
                        </div>

                        <h3>
                            Graphing
                        </h3>

                        <p>
                            Visualize experimental data using
                            scientific graphs.
                        </p>

                        <button class="toolbar-button">
                            Open Graphing
                        </button>

                    </article>

                </div>

            </div>
        `,


        academy: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <span class="page-eyebrow">
                            CHEMISTRY ACADEMY
                        </span>

                        <h1>
                            Chemistry Academy
                        </h1>

                        <p>
                            Build deep chemistry knowledge from
                            fundamentals to advanced concepts.
                        </p>
                    </div>

                </div>


                <div class="academy-grid">

                    <article class="subject-card">
                        <span>01</span>
                        <h3>General Chemistry</h3>
                        <p>
                            Fundamental principles of chemistry.
                        </p>
                    </article>


                    <article class="subject-card">
                        <span>02</span>
                        <h3>Organic Chemistry</h3>
                        <p>
                            Structure, reactions and mechanisms.
                        </p>
                    </article>


                    <article class="subject-card">
                        <span>03</span>
                        <h3>Inorganic Chemistry</h3>
                        <p>
                            Elements, compounds and reactions.
                        </p>
                    </article>


                    <article class="subject-card">
                        <span>04</span>
                        <h3>Physical Chemistry</h3>
                        <p>
                            Energy, kinetics, equilibrium and matter.
                        </p>
                    </article>


                    <article class="subject-card">
                        <span>05</span>
                        <h3>Analytical Chemistry</h3>
                        <p>
                            Chemical identification and measurement.
                        </p>
                    </article>


                    <article class="subject-card">
                        <span>06</span>
                        <h3>Biochemistry</h3>
                        <p>
                            Chemistry of biological systems.
                        </p>
                    </article>

                </div>

            </div>
        `,


        "ai-tutor": `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <span class="page-eyebrow">
                            INTELLIGENT CHEMISTRY ASSISTANT
                        </span>

                        <h1>
                            AI ChemLab Tutor
                        </h1>

                        <p>
                            Your future intelligent chemistry
                            assistant for learning, experiments
                            and scientific reasoning.
                        </p>
                    </div>

                </div>


                <div class="ai-preview">

                    <div class="ai-preview-header">

                        <div>
                            <strong>
                                ChemLab AI
                            </strong>

                            <span class="ai-status">
                                Online
                            </span>
                        </div>

                    </div>


                    <div class="ai-message">
                        <strong>
                            ChemLab AI
                        </strong>

                        <p>
                            Hello. I am your chemistry assistant.
                            Ask me about chemistry concepts,
                            reactions, calculations or experiments.
                        </p>
                    </div>


                    <div class="ai-input-preview">
                        Ask a chemistry question...
                    </div>

                </div>

            </div>
        `,


        assessments: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <span class="page-eyebrow">
                            KNOWLEDGE ASSESSMENT
                        </span>

                        <h1>
                            Assessments
                        </h1>

                        <p>
                            Test your chemistry knowledge and
                            measure your understanding.
                        </p>
                    </div>

                </div>


                <div class="workspace-grid">

                    <article class="workspace-card">

                        <div class="workspace-icon">
                            ✓
                        </div>

                        <h3>
                            Chemistry Quizzes
                        </h3>

                        <p>
                            Test your understanding of chemistry
                            concepts.
                        </p>

                        <button class="toolbar-button">
                            Start Quiz
                        </button>

                    </article>


                    <article class="workspace-card">

                        <div class="workspace-icon">
                            ★
                        </div>

                        <h3>
                            Experiment Assessments
                        </h3>

                        <p>
                            Answer questions based on experiments
                            you have completed.
                        </p>

                        <button class="toolbar-button">
                            View Assessments
                        </button>

                    </article>

                </div>

            </div>
        `,


        notebook: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <span class="page-eyebrow">
                            SCIENTIFIC RECORD
                        </span>

                        <h1>
                            Lab Notebook
                        </h1>

                        <p>
                            Record observations, procedures,
                            measurements and scientific conclusions.
                        </p>
                    </div>

                    <div>
                        <button class="toolbar-button">
                            New Entry
                        </button>
                    </div>

                </div>


                <div class="empty-state">

                    <div class="empty-state-icon">
                        📓
                    </div>

                    <h3>
                        Your laboratory notebook is ready
                    </h3>

                    <p>
                        Completed experiments and scientific
                        observations will appear here.
                    </p>

                </div>

            </div>
        `,


        progress: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <span class="page-eyebrow">
                            LEARNING PERFORMANCE
                        </span>

                        <h1>
                            My Progress
                        </h1>

                        <p>
                            Track your chemistry learning,
                            experiments and scientific development.
                        </p>
                    </div>

                </div>


                <div class="progress-overview">

                    <div class="progress-stat">
                        <strong>0</strong>
                        <span>Experiments</span>
                    </div>

                    <div class="progress-stat">
                        <strong>0%</strong>
                        <span>Mastery</span>
                    </div>

                    <div class="progress-stat">
                        <strong>0</strong>
                        <span>Assessments</span>
                    </div>

                    <div class="progress-stat">
                        <strong>0</strong>
                        <span>Science XP</span>
                    </div>

                </div>

            </div>
        `,


        premium: `
            <div class="page-view premium-page">

                <div class="page-header">

                    <div>
                        <span class="page-eyebrow">
                            CHEMLAB PREMIUM
                        </span>

                        <h1>
                            Advanced Laboratory Tools
                        </h1>

                        <p>
                            Unlock advanced tools designed for
                            deeper chemistry learning and research.
                        </p>
                    </div>

                </div>


                <div class="premium-features">

                    <article class="workspace-card">
                        <h3>Advanced Experiments</h3>
                        <p>
                            Access more advanced laboratory
                            experiences.
                        </p>
                    </article>


                    <article class="workspace-card">
                        <h3>Advanced Analysis</h3>
                        <p>
                            Unlock enhanced scientific data tools.
                        </p>
                    </article>


                    <article class="workspace-card">
                        <h3>AI Chemistry Tools</h3>
                        <p>
                            Access advanced AI-powered chemistry
                            assistance.
                        </p>
                    </article>

                </div>

            </div>
        `,


        settings: `
            <div class="page-view">

                <div class="page-header">

                    <div>
                        <span class="page-eyebrow">
                            APPLICATION SETTINGS
                        </span>

                        <h1>
                            Settings
                        </h1>

                        <p>
                            Manage your ChemLab application
                            preferences.
                        </p>
                    </div>

                </div>


                <div class="workspace-grid">

                    <article class="workspace-card">

                        <h3>
                            Account
                        </h3>

                        <p>
                            Account and profile settings will be
                            available here.
                        </p>

                    </article>


                    <article class="workspace-card">

                        <h3>
                            Preferences
                        </h3>

                        <p>
                            Application preferences will be
                            available here.
                        </p>

                    </article>

                </div>

            </div>
        `
    };


    /* =====================================================
       ROUTER
       ===================================================== */

    const Router = {

        currentRoute: "dashboard",

        dashboardHTML: "",


        /* =================================================
           GET CURRENT ROUTE
           ================================================= */

        getRoute: function () {

            let hash =
                window.location.hash
                    .replace("#", "")
                    .trim()
                    .toLowerCase();

            if (!hash) {
                return "dashboard";
            }

            if (!ROUTES[hash]) {
                return "dashboard";
            }

            return hash;
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

            const items =
                document.querySelectorAll(
                    ".navigation-item"
                );

            items.forEach(function (item) {

                const href =
                    item.getAttribute("href");

                item.classList.remove("active");

                if (
                    href === "#" + route
                ) {
                    item.classList.add("active");
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

            const data =
                ROUTES[route];

            if (!data) {
                return;
            }

            breadcrumb.innerHTML = `
                <span>ChemLab</span>
                <span>/</span>
                <strong>${data.breadcrumb}</strong>
            `;
        },


        /* =================================================
           UPDATE PAGE TITLE
           ================================================= */

        updateTitle: function (route) {

            const data =
                ROUTES[route];

            if (!data) {
                return;
            }

            document.title =
                "ChemLab | " + data.title;
        },


        /* =================================================
           RENDER VIEW
           ================================================= */

        renderView: function (route) {

            const appView =
                document.querySelector("#appView");

            if (!appView) {

                console.error(
                    "ChemLab Router: #appView was not found."
                );

                return;
            }


            /* ---------------------------------------------
               DASHBOARD
               --------------------------------------------- */

            if (route === "dashboard") {

                if (this.dashboardHTML) {

                    appView.innerHTML =
                        this.dashboardHTML;
                }

                appView.classList.add("dashboard");
                appView.classList.remove("route-view");

                return;
            }


            /* ---------------------------------------------
               OTHER PAGE
               --------------------------------------------- */

            const view =
                VIEWS[route];

            if (!view) {

                console.error(
                    "ChemLab Router: No view found for",
                    route
                );

                return;
            }


            appView.classList.remove("dashboard");
            appView.classList.remove("route-view");

            void appView.offsetWidth;

            appView.innerHTML = view;

            appView.classList.add("route-view");

        },


        /* =================================================
           UPDATE EVERYTHING
           ================================================= */

        updateUI: function (route) {

            this.currentRoute =
                route;

            this.updateNavigation(route);

            this.updateBreadcrumb(route);

            this.updateTitle(route);

            this.renderView(route);

            console.log(
                "ChemLab route:",
                route
            );
        },


        /* =================================================
           HANDLE ROUTE
           ================================================= */

        handleRouteChange: function () {

            const route =
                this.getRoute();

            this.updateUI(route);
        },


        /* =================================================
           INITIALIZE
           ================================================= */

        initialize: function () {

            const self = this;

            const appView =
                document.querySelector("#appView");


            /*
             * Save the original dashboard
             * BEFORE replacing its content.
             */

            if (
                appView &&
                !this.dashboardHTML
            ) {

                this.dashboardHTML =
                    appView.innerHTML;
            }


            /*
             * Listen for URL changes.
             */

            window.addEventListener(
                "hashchange",
                function () {

                    self.handleRouteChange();

                }
            );


            /*
             * Handle initial page.
             */

            this.handleRouteChange();


            console.log(
                "ChemLab Router initialized."
            );
        }
    };


    /* =====================================================
       GLOBAL ACCESS
       ===================================================== */

    window.ChemLabRouter =
        Router;


})();
