
/* =====================================================
   CHEMLAB — ROUTER RECOVERY
   Version 4.0
   ===================================================== */

(function () {
  "use strict";

  const ROUTES = {
    dashboard: "Dashboard",
    laboratory: "Laboratory",
    experiments: "Experiments",
    analysis: "Scientific Analysis",
    academy: "Chemistry Academy",
    "ai-tutor": "AI Chemistry Tutor",
    assessments: "Assessments",
    notebook: "Lab Notebook",
    progress: "My Progress",
    premium: "ChemLab Premium",
    settings: "Settings"
  };

  const pageDescriptions = {
    laboratory: "Prepare your workspace and explore laboratory equipment.",
    experiments: "Explore guided experiments and design your own investigations.",
    analysis: "Organize measurements and analyze scientific data.",
    academy: "Study chemistry concepts, lessons, and scientific principles.",
    "ai-tutor": "Get help understanding chemistry concepts and calculations.",
    assessments: "Test your understanding of chemistry.",
    notebook: "Record observations, measurements, and conclusions.",
    progress: "Review your learning progress and completed activities.",
    premium: "Explore advanced ChemLab learning features.",
    settings: "Manage your ChemLab preferences."
  };

  const Router = {
    dashboardHTML: "",
    initialized: false,

    getRoute() {
      const route = window.location.hash
        .replace(/^#\/?/, "")
        .trim()
        .toLowerCase();

      return Object.prototype.hasOwnProperty.call(ROUTES, route)
        ? route
        : "dashboard";
    },

    navigate(route) {
      if (!Object.prototype.hasOwnProperty.call(ROUTES, route)) {
        console.error("ChemLab: Unknown route:", route);
        return;
      }

      if (this.getRoute() === route) {
        this.renderView(route);
      } else {
        window.location.hash = route;
      }
    },

    updateNavigation(route) {
      document.querySelectorAll(
        '.navigation-item, .navigation-item a, [data-route]'
      ).forEach((element) => {
        const href = element.getAttribute("href") || "";
        const dataRoute = element.getAttribute("data-route") || "";
        const active =
          href === "#" + route || dataRoute === route;

        element.classList.toggle("active", active);

        if (element.matches("a")) {
          if (active) {
            element.setAttribute("aria-current", "page");
          } else {
            element.removeAttribute("aria-current");
          }
        }
      });
    },

    renderView(route) {
      const appView = document.getElementById("appView");

      if (!appView) {
        console.error(
          "ChemLab Router: Element #appView is missing from index.html."
        );
        return;
      }

      if (route === "dashboard") {
        if (!this.dashboardHTML) {
          console.error("ChemLab Router: Dashboard template is missing.");
          return;
        }

        appView.innerHTML = this.dashboardHTML;
        appView.classList.add("dashboard");
        appView.classList.remove("route-view");
      } else {
        appView.classList.remove("dashboard");
        appView.classList.add("route-view");

        appView.innerHTML = `
          <section class="page-content">
            <header class="page-header">
              <p class="eyebrow">CHEMLAB WORKSPACE</p>
              <h1>${ROUTES[route]}</h1>
              <p>${pageDescriptions[route] || "Explore ChemLab."}</p>
            </header>

            <div class="panel">
              <h2>${ROUTES[route]}</h2>
              <p>${pageDescriptions[route] || ""}</p>
              <p class="page-status">
                Workspace loaded successfully. Detailed features
                will be connected in the next development steps.
              </p>
              <button type="button"
                      class="button button-primary"
                      data-router-home>
                Return to Dashboard
              </button>
            </div>
          </section>
        `;

        const homeButton = appView.querySelector("[data-router-home]");

        if (homeButton) {
          homeButton.addEventListener("click", () => {
            this.navigate("dashboard");
          });
        }
      }

      this.updateNavigation(route);

      const title = document.getElementById("pageTitle");
      if (title) {
        title.textContent = ROUTES[route];
      }

      document.title = ROUTES[route] + " | ChemLab";

      console.log("ChemLab: Rendered route:", route);
    },

    handleRouteChange() {
      const route = this.getRoute();
      this.renderView(route);
    },

    initialize() {
      const appView = document.getElementById("appView");

      if (!appView) {
        console.error("ChemLab: #appView was not found.");
        return;
      }

      // Capture the dashboard only once, before replacing its content.
      if (!this.dashboardHTML) {
        this.dashboardHTML = appView.innerHTML;
      }

      if (!this.initialized) {
        window.addEventListener("hashchange", () => {
          this.handleRouteChange();
        });

        // Support clicks on normal hash navigation links.
        document.addEventListener("click", (event) => {
          const link = event.target.closest('a[href^="#"]');

          if (!link) return;

          const route = link.getAttribute("href").slice(1);

          if (Object.prototype.hasOwnProperty.call(ROUTES, route)) {
            event.preventDefault();
            this.navigate(route);
          }
        });

        this.initialized = true;
      }

      this.handleRouteChange();
      console.log("ChemLab: Router ready.");
    }
  };

  window.ChemLabRouter = Router;

  function startRouter() {
    if (window.ChemLabRouter) {
      window.ChemLabRouter.initialize();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startRouter, {
      once: true
    });
  } else {
    startRouter();
  }
})();
