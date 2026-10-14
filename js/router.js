
/* =========================================================
   CHEMLAB — APPLICATION ROUTER
   Version 5.0
   Hash navigation, direct links, back/forward support
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
      description: "Explore the virtual laboratory workspace."
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
      description: "Study chemistry concepts, lessons, and principles."
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
      description: "Record experimental methods, observations, and conclusions."
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
        return;
      }

      window.location.hash = targetHash;
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
        const href = link.getAttribute("href") || "";
        const active = href === "#" + route;

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
                Navigation test passed: the ${page.title} page
                has been rendered.
              </p>

              <button
                type="button"
                class="button button-primary"
                data-router-home
              >
                ← Return to Dashboard
              </button>
            </section>
          </div>
        `;
      }

      this.updateNavigation(route);
      this.updateTitle(route);

      console.log("ChemLab Router: Rendered", route);
    },

    handleRouteChange() {
      const route = this.getRoute();
      this.render(route);
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

      // Handle navigation links and the dashboard's home button.
      document.addEventListener("click", (event) => {
        const homeButton = event.target.closest("[data-router-home]");

        if (homeButton) {
          event.preventDefault();
          this.navigate("dashboard");
          return;
        }

        const link = event.target.closest(
          'a.navigation-item, a.quick-action, a.button, a.brand, a.premium-link, a.text-link'
        );

        if (!link) return;

        const href = link.getAttribute("href") || "";

        if (!href.startsWith("#")) return;

        const route = href.slice(1).replace(/^\/+/, "").toLowerCase();

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

  // Make the router available to app.js and other scripts.
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
