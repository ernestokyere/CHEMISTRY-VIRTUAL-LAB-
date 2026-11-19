
"use strict";

(function (window) {
  const routes = {
    dashboard: {
      title: "Dashboard",
      description: "Your chemistry learning and laboratory overview.",
      eyebrow: "CHEMLAB WORKSPACE"
    },

    laboratory: {
      title: "Digital Laboratory",
      description: "Explore your virtual chemistry laboratory workspace.",
      eyebrow: "EXPERIMENTAL WORKSPACE"
    },

    experiments: {
      title: "Experiments",
      description: "Explore guided and independent chemistry experiments.",
      eyebrow: "PRACTICAL CHEMISTRY"
    },

    analysis: {
      title: "Data Analysis",
      description: "Work with scientific measurements and chemistry data.",
      eyebrow: "SCIENTIFIC ANALYSIS"
    },

    academy: {
      title: "Chemistry Academy",
      description: "Develop your chemistry knowledge from SHS to university level.",
      eyebrow: "ACADEMIC LEARNING"
    },

    tutor: {
      title: "AI Chemistry Tutor",
      description: "Your future intelligent assistant for chemistry learning.",
      eyebrow: "INTELLIGENT LEARNING"
    },

    assessments: {
      title: "Assessments",
      description: "Prepare for chemistry examinations and evaluate your knowledge.",
      eyebrow: "KNOWLEDGE EVALUATION"
    },

    notebook: {
      title: "Laboratory Notebook",
      description: "A dedicated space for recording scientific observations.",
      eyebrow: "PERSONAL WORKSPACE"
    },

    progress: {
      title: "My Progress",
      description: "Monitor your academic development and learning activities.",
      eyebrow: "LEARNING PERFORMANCE"
    },

    settings: {
      title: "Settings",
      description: "Manage your ChemLab application preferences.",
      eyebrow: "APPLICATION SETTINGS"
    }
  };

  let dashboardContent = "";
  let started = false;

  function getRoute() {
    const route = window.location.hash
      .replace(/^#\/?/, "")
      .trim()
      .toLowerCase();

    return routes[route] ? route : "dashboard";
  }

  function createPage(route) {
    const page = routes[route];

    return `
      <section class="route-page">

        <div class="route-page-header">
          <span class="eyebrow">${page.eyebrow}</span>

          <h1>${page.title}</h1>

          <p>${page.description}</p>
        </div>

        <section class="foundation-panel">
          <span class="eyebrow">CHEMLAB MODULE</span>

          <h2>${page.title} Workspace</h2>

          <p>
            This module is part of the ChemLab platform.
            Its dedicated tools and interactive features
            will be developed in their respective stages.
          </p>

          <div class="learning-steps">
            <span>SHS Chemistry</span>
            <span>University Chemistry</span>
            <span>Scientific Learning</span>
          </div>
        </section>

        <section class="route-info-grid">

          <article class="overview-card">
            <span class="card-icon">01</span>
            <h2>Academic Coverage</h2>
            <p>Advanced secondary and university chemistry.</p>
          </article>

          <article class="overview-card">
            <span class="card-icon">02</span>
            <h2>Learning Environment</h2>
            <p>Structured scientific learning and discovery.</p>
          </article>

          <article class="overview-card">
            <span class="card-icon">03</span>
            <h2>Module Development</h2>
            <p>Dedicated tools will be introduced as development progresses.</p>
          </article>

        </section>

      </section>
    `;
  }

  function updateNavigation(route) {
    document.querySelectorAll(".nav-item").forEach(link => {
      const target = link.getAttribute("href")
        .replace(/^#\/?/, "")
        .toLowerCase();

      const active = target === route;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function render() {
    const main = document.getElementById("main-content");

    if (!main) return;

    let route = getRoute();

    if (!routes[window.location.hash.replace(/^#\/?/, "").toLowerCase()]) {
      route = "dashboard";

      if (window.location.hash !== "#dashboard") {
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
          window.location.search +
          "#dashboard"
        );
      }
    }

    if (route === "dashboard") {
      main.innerHTML = dashboardContent;
    } else {
      main.innerHTML = createPage(route);
    }

    window.ChemLab.state.currentRoute = route;

    updateNavigation(route);

    document.title =
      routes[route].title + " | ChemLab";

    main.scrollTop = 0;
  }

  function start() {
    if (started) return;

    const main = document.getElementById("main-content");

    if (!main) {
      console.error("ChemLab: Main content container not found.");
      return;
    }

    dashboardContent = main.innerHTML;

    started = true;

    document.addEventListener("click", event => {
      const link = event.target.closest(
        ".nav-item, .brand"
      );

      if (!link) return;

      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return;

      const target = href.replace(/^#\/?/, "").toLowerCase();

      if (!routes[target]) return;

      event.preventDefault();

      if (window.location.hash === "#" + target) {
        render();
      } else {
        window.location.hash = target;
      }
    });

    window.addEventListener("hashchange", render);

    if (!window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname +
        window.location.search +
        "#dashboard"
      );
    }

    render();

    console.info("ChemLab Router initialized.");
  }

  window.ChemLabRouter = {
    start,
    render,
    getRoute,
    routes
  };

})(window);
