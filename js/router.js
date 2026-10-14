/* =========================================================
   CHEMLAB — APPLICATION ROUTER
   Version 5.1
   Dashboard preservation, route rendering and laboratory UI
   ========================================================= */

(function () {
  "use strict";

  const ROUTES = {
    dashboard: {
      title: "Dashboard",
      description: "Your chemistry learning workspace."
    },
    laboratory: {
      title: "Laboratory",
      description: "Configure materials, arrange apparatus and prepare experiments."
    },
    experiments: {
      title: "Experiments",
      description: "Explore guided investigations and experimental procedures."
    },
    analysis: {
      title: "Scientific Analysis",
      description: "Organize measurements and interpret scientific data."
    },
    academy: {
      title: "Chemistry Academy",
      description: "Study chemistry concepts, lessons and principles."
    },
    "ai-tutor": {
      title: "AI Chemistry Tutor",
      description: "Get help understanding chemistry concepts and calculations."
    },
    assessments: {
      title: "Assessments",
      description: "Check your chemistry knowledge and understanding."
    },
    notebook: {
      title: "Lab Notebook",
      description: "Record experimental methods, observations and conclusions."
    },
    progress: {
      title: "My Progress",
      description: "Review your learning activities and progress."
    },
    premium: {
      title: "ChemLab Premium",
      description: "Explore advanced learning tools and features."
    },
    settings: {
      title: "Settings",
      description: "Manage your ChemLab workspace preferences."
    }
  };

  const Router = {
    dashboardHTML: "",
    initialized: false,
    dashboardCaptured: false,

    getRoute() {
      const rawHash = window.location.hash
        .replace(/^#\/?/, "")
        .trim()
        .toLowerCase();

      if (!rawHash) return "dashboard";

      return Object.prototype.hasOwnProperty.call(ROUTES, rawHash)
        ? rawHash
        : "dashboard";
    },

    navigate(route) {
      if (!Object.prototype.hasOwnProperty.call(ROUTES, route)) {
        console.error("ChemLab Router: Unknown route:", route);
        return;
      }

      const targetHash = "#" + route;

      if (window.location.hash === targetHash) {
        this.render(route);
      } else {
        window.location.hash = targetHash;
      }
    },

    captureDashboard() {
      const appView = document.getElementById("appView");

      if (!appView) {
        console.error(
          "ChemLab Router: #appView was not found in index.html."
        );
        return false;
      }

      if (!this.dashboardCaptured) {
        this.dashboardHTML = appView.innerHTML;
        this.dashboardCaptured = true;
      }

      return true;
    },

    updateNavigation(route) {
      document.querySelectorAll(".navigation-item").forEach((link) => {
        const href = (link.getAttribute("href") || "")
          .replace(/^#\/?/, "")
          .toLowerCase();

        const active = href === route;

        link.classList.toggle("active", active);

        if (active) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },

    updateTitle(route) {
      const page = ROUTES[route];
      const titleElement = document.getElementById("pageTitle");

      if (titleElement) {
        titleElement.textContent = page.title;
      }

      document.title = page.title + " | ChemLab";
    },

    laboratoryHTML() {
      return `
        <div class="page-content laboratory-view">

          <header class="page-header">
            <div class="eyebrow">
              <span class="status-dot"></span>
              CHEMLAB DIGITAL LABORATORY
            </div>

            <h1>Laboratory</h1>

            <p>
              Prepare your workspace, select materials and equipment,
              and organize an experiment.
            </p>
          </header>

          <div class="laboratory-status-grid">

            <section class="panel laboratory-status-item"
                     data-status="materials">
              <div class="eyebrow">SELECTED MATERIALS</div>
              <h2 data-lab-material-count>0</h2>
              <p>Chemicals and solutions</p>
            </section>

            <section class="panel laboratory-status-item"
                     data-status="apparatus">
              <div class="eyebrow">SELECTED APPARATUS</div>
              <h2 data-lab-apparatus-count>0</h2>
              <p>Equipment on your bench</p>
            </section>

            <section class="panel laboratory-status-item"
                     data-status="experiment">
              <div class="eyebrow">WORKSPACE STATUS</div>
              <h2 data-lab-status>Ready</h2>
              <p>Open laboratory</p>
            </section>

          </div>

          <div class="laboratory-workspace">

            <section class="panel laboratory-library-panel">

              <div class="panel-heading">
                <div>
                  <div class="eyebrow">MATERIALS</div>
                  <h2>Chemical Library</h2>
                </div>
                <span class="panel-icon" aria-hidden="true">⚗</span>
              </div>

              <p class="panel-description">
                Select the chemicals required for your planned experiment.
              </p>

              <label class="laboratory-search-label"
                     for="labChemicalSearch">
                Search chemicals
              </label>

              <input
                id="labChemicalSearch"
                class="laboratory-search"
                type="search"
                placeholder="Search by name or formula..."
                autocomplete="off"
              />

              <div class="laboratory-library-list"
                   aria-live="polite">
                <p class="laboratory-empty-state">
                  Loading available chemicals...
                </p>
              </div>

            </section>

            <section class="panel laboratory-apparatus-panel">

              <div class="panel-heading">
                <div>
                  <div class="eyebrow">EQUIPMENT</div>
                  <h2>Apparatus Library</h2>
                </div>
                <span class="panel-icon" aria-hidden="true">♜</span>
              </div>

              <p class="panel-description">
                Choose suitable equipment for your experiment.
              </p>

              <div class="laboratory-apparatus-library"
                   aria-live="polite">

                <div class="laboratory-apparatus-card"
                     data-apparatus-id="beaker"
                     tabindex="0"
                     role="button"
                     aria-pressed="false">
                  <span class="apparatus-symbol">▱</span>
                  <strong>Beaker</strong>
                  <span>Mixing and holding liquids</span>
                </div>

                <div class="laboratory-apparatus-card"
                     data-apparatus-id="conical-flask"
                     tabindex="0"
                     role="button"
                     aria-pressed="false">
                  <span class="apparatus-symbol">⚗</span>
                  <strong>Conical flask</strong>
                  <span>Mixing and titration</span>
                </div>

                <div class="laboratory-apparatus-card"
                     data-apparatus-id="measuring-cylinder"
                     tabindex="0"
                     role="button"
                     aria-pressed="false">
                  <span class="apparatus-symbol">▥</span>
                  <strong>Measuring cylinder</strong>
                  <span>Measuring liquid volume</span>
                </div>

                <div class="laboratory-apparatus-card"
                     data-apparatus-id="test-tube"
                     tabindex="0"
                     role="button"
                     aria-pressed="false">
                  <span class="apparatus-symbol">▯</span>
                  <strong>Test tube</strong>
                  <span>Small-scale reactions</span>
                </div>

                <div class="laboratory-apparatus-card"
                     data-apparatus-id="burette"
                     tabindex="0"
                     role="button"
                     aria-pressed="false">
                  <span class="apparatus-symbol">│</span>
                  <strong>Burette</strong>
                  <span>Accurate liquid delivery</span>
                </div>

                <div class="laboratory-apparatus-card"
                     data-apparatus-id="pipette"
                     tabindex="0"
                     role="button"
                     aria-pressed="false">
                  <span class="apparatus-symbol">↗</span>
                  <strong>Pipette</strong>
                  <span>Measuring liquid portions</span>
                </div>

                <div class="laboratory-apparatus-card"
                     data-apparatus-id="balance"
                     tabindex="0"
                     role="button"
                     aria-pressed="false">
                  <span class="apparatus-symbol">⚖</span>
                  <strong>Balance</strong>
                  <span>Measuring mass</span>
                </div>

                <div class="laboratory-apparatus-card"
                     data-apparatus-id="thermometer"
                     tabindex="0"
                     role="button"
                     aria-pressed="false">
                  <span class="apparatus-symbol">🌡</span>
                  <strong>Thermometer</strong>
                  <span>Measuring temperature</span>
                </div>

              </div>

            </section>

          </div>

          <section class="panel laboratory-bench-panel">

            <div class="panel-heading">
              <div>
                <div class="eyebrow">EXPERIMENT SETUP</div>
                <h2>Digital Laboratory Bench</h2>
              </div>
              <span class="panel-icon" aria-hidden="true">⌘</span>
            </div>

            <p class="panel-description">
              Your selected materials and equipment will appear here
              when connected to the laboratory engine.
            </p>

            <div class="digital-lab-bench"
                 aria-live="polite">
              <div class="laboratory-bench-placeholder">
                <span class="bench-placeholder-icon">⚗</span>
                <h3>Your laboratory bench is ready</h3>
                <p>
                  Select chemicals and apparatus from the libraries
                  to begin preparing your workspace.
                </p>
              </div>
            </div>

            <div class="laboratory-selection-summary">
              <div>
                <h3>Workspace selection</h3>
                <p>Review the materials and equipment you have selected.</p>
              </div>

              <div class="selection-summary-list">
                <p>No materials or apparatus selected yet.</p>
              </div>
            </div>

            <div class="laboratory-actions">
              <button
                type="button"
                class="button button-secondary"
                id="labClearWorkspace">
                Clear Workspace
              </button>

              <button
                type="button"
                class="button button-secondary"
                id="labSaveSetup">
                Save Setup
              </button>

              <button
                type="button"
                class="button button-primary"
                id="labBeginExperiment">
                Begin Experiment
              </button>
            </div>

            <p class="laboratory-safety-note">
              <strong>Safety first:</strong>
              Follow appropriate laboratory safety procedures.
              This digital workspace does not replace qualified
              supervision or real laboratory safety equipment.
            </p>

          </section>

        </div>
      `;
    },

    render(route) {
      const appView = document.getElementById("appView");

      if (!appView) {
        console.error(
          "ChemLab Router: Cannot render because #appView is missing."
        );
        return;
      }

      if (route === "dashboard") {
        if (!this.dashboardCaptured) {
          console.error("ChemLab Router: Dashboard was not captured.");
          return;
        }

        appView.innerHTML = this.dashboardHTML;
        appView.classList.add("dashboard");
        appView.classList.remove("route-view");
      } else if (route === "laboratory") {
        appView.classList.remove("dashboard");
        appView.classList.add("route-view");
        appView.innerHTML = this.laboratoryHTML();
      } else {
        const page = ROUTES[route];

        appView.classList.remove("dashboard");
        appView.classList.add("route-view");

        appView.innerHTML = `
          <div class="page-content">
            <header class="page-header">
              <div class="eyebrow">
                <span class="status-dot"></span>
                CHEMLAB WORKSPACE
              </div>

              <h1>${page.title}</h1>
              <p>${page.description}</p>
            </header>

            <section class="panel">
              <div class="panel-heading">
                <div>
                  <div class="eyebrow">WORKSPACE STATUS</div>
                  <h2>${page.title}</h2>
                </div>
                <span class="panel-icon" aria-hidden="true">⚗</span>
              </div>

              <p>
                This page is connected to ChemLab navigation.
                Its full features will be implemented in the
                corresponding development stage.
              </p>

              <p class="page-status">
                Navigation test passed: the ${page.title}
                page has been rendered.
              </p>

              <button
                type="button"
                class="button button-primary"
                data-router-home>
                ← Return to Dashboard
              </button>
            </section>
          </div>
        `;
      }

      this.updateNavigation(route);
      this.updateTitle(route);

      // Let app.js and the laboratory engine respond to route changes.
      document.dispatchEvent(
        new CustomEvent("chemlab:route-rendered", {
          detail: { route: route }
        })
      );

      console.log("ChemLab Router: Rendered", route);
    },

    handleRouteChange() {
      this.render(this.getRoute());
    },

    initialize() {
      if (!this.captureDashboard()) return;

      if (this.initialized) {
        this.handleRouteChange();
        return;
      }

      window.addEventListener("hashchange", () => {
        this.handleRouteChange();
      });

      document.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        const homeButton = target.closest("[data-router-home]");

        if (homeButton) {
          event.preventDefault();
          this.navigate("dashboard");
          return;
        }

        const link = target.closest(
          'a.navigation-item, a.quick-action, a.button, a.brand, a.premium-link, a.text-link'
        );

        if (!link) return;

        const href = link.getAttribute("href") || "";

        if (!href.startsWith("#")) return;

        const route = href
          .slice(1)
          .replace(/^\/+/, "")
          .toLowerCase();

        if (!Object.prototype.hasOwnProperty.call(ROUTES, route)) {
          return;
        }

        event.preventDefault();
        this.navigate(route);
      });

      this.initialized = true;
      this.handleRouteChange();

      console.log("ChemLab Router: Initialized successfully.");
    }
  };

  window.ChemLabRouter = Router;

  function startRouter() {
    window.ChemLabRouter.initialize();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startRouter, {
      once: true
    });
  } else {
    startRouter();
  }
})();
