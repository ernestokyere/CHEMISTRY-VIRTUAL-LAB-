/* ============================================================
   CHEMLAB — APPLICATION CORE
   Version 4.1
   Compatible with js/router.js Version 5.1

   Includes:
   - Application initialization
   - Existing router integration
   - Mobile navigation
   - Search and notifications
   - Modal and toast systems
   - Chemical and apparatus libraries
   - Visible Add to Bench buttons
   - Persistent laboratory workspace
   - Experiment workspace and activity log
   - Save, clear and restore setup
   - Responsive laboratory library styling
   ============================================================ */

(function () {
  "use strict";

  if (window.ChemLab && window.ChemLab.__appV41Loaded) {
    console.warn("ChemLab application is already initialized.");
    return;
  }

  const STORAGE = {
    laboratory: "chemlab-laboratory-workspace",
    experiments: "chemlab-experiment-records",
    notifications: "chemlab-notifications"
  };

  /* ==========================================================
     CHEMICAL LIBRARY
     ========================================================== */

  const CHEMICALS = [
    {
      id: "hydrochloric-acid",
      name: "Hydrochloric acid",
      formula: "HCl",
      category: "Acid",
      description: "A strong acid used in chemistry education.",
      color: "#f2f5ff"
    },
    {
      id: "sulfuric-acid",
      name: "Sulfuric acid",
      formula: "H₂SO₄",
      category: "Acid",
      description: "A strong mineral acid.",
      color: "#fff0bd"
    },
    {
      id: "sodium-hydroxide",
      name: "Sodium hydroxide",
      formula: "NaOH",
      category: "Base",
      description: "A strong alkali.",
      color: "#d7e9ff"
    },
    {
      id: "potassium-hydroxide",
      name: "Potassium hydroxide",
      formula: "KOH",
      category: "Base",
      description: "A strong alkali.",
      color: "#d8fff0"
    },
    {
      id: "sodium-chloride",
      name: "Sodium chloride",
      formula: "NaCl",
      category: "Salt",
      description: "Common salt used in chemistry studies.",
      color: "#ffffff"
    },
    {
      id: "phenolphthalein",
      name: "Phenolphthalein",
      formula: "Indicator",
      category: "Indicator",
      description: "An acid-base indicator.",
      color: "#ffe2ef"
    },
    {
      id: "methyl-orange",
      name: "Methyl orange",
      formula: "Indicator",
      category: "Indicator",
      description: "An indicator used in acid-base studies.",
      color: "#ffdfbd"
    },
    {
      id: "distilled-water",
      name: "Distilled water",
      formula: "H₂O",
      category: "Solvent",
      description: "Purified water for laboratory studies.",
      color: "#d8f7ff"
    }
  ];

  /* ==========================================================
     APPARATUS LIBRARY
     ========================================================== */

  const APPARATUS = [
    {
      id: "beaker",
      name: "Beaker",
      description: "Holding and mixing liquids.",
      symbol: "▱"
    },
    {
      id: "conical-flask",
      name: "Conical flask",
      description: "Mixing liquids and titration.",
      symbol: "⚗"
    },
    {
      id: "measuring-cylinder",
      name: "Measuring cylinder",
      description: "Measuring liquid volume.",
      symbol: "▥"
    },
    {
      id: "test-tube",
      name: "Test tube",
      description: "Small-scale investigations.",
      symbol: "▯"
    },
    {
      id: "burette",
      name: "Burette",
      description: "Delivering measured liquid volumes.",
      symbol: "│"
    },
    {
      id: "pipette",
      name: "Pipette",
      description: "Measuring liquid portions.",
      symbol: "↗"
    },
    {
      id: "electronic-balance",
      aliases: ["balance"],
      name: "Electronic balance",
      description: "Measuring mass.",
      symbol: "⚖"
    },
    {
      id: "thermometer",
      name: "Thermometer",
      description: "Measuring temperature.",
      symbol: "🌡"
    }
  ];

  const DEFAULT_STATE = {
    chemicals: [],
    apparatus: [],
    savedAt: null
  };

  /* ==========================================================
     GENERAL UTILITIES
     ========================================================== */

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn(
        "ChemLab: Could not read local storage.",
        error
      );
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(
        "ChemLab: Could not save local data.",
        error
      );
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getElement(selector, root) {
    return (root || document).querySelector(selector);
  }

  function getElements(selector, root) {
    return Array.from(
      (root || document).querySelectorAll(selector)
    );
  }

  /* ==========================================================
     APPLICATION CORE
     ========================================================== */

  const ChemLab = window.ChemLab || {};

  ChemLab.__appV41Loaded = true;

  ChemLab.showToast = function (message, type) {
    let container = getElement("#chemlabToastContainer");

    if (!container) {
      container = document.createElement("div");
      container.id = "chemlabToastContainer";

      Object.assign(container.style, {
        position: "fixed",
        right: "20px",
        bottom: "20px",
        zIndex: "100000",
        display: "grid",
        gap: "10px",
        width: "min(360px, calc(100vw - 32px))"
      });

      document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    const colors = {
      success: "#18875d",
      error: "#bd354b",
      warning: "#a76b00",
      info: "#3157d5"
    };

    toast.textContent = String(message);

    Object.assign(toast.style, {
      padding: "14px 16px",
      borderRadius: "12px",
      background: colors[type] || colors.info,
      color: "#ffffff",
      boxShadow: "0 8px 28px rgba(0,0,0,.25)",
      fontSize: "14px",
      lineHeight: "1.5",
      overflowWrap: "anywhere"
    });

    container.appendChild(toast);

    window.setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transition = "opacity .25s";

      window.setTimeout(function () {
        toast.remove();

        if (!container.children.length) {
          container.remove();
        }
      }, 300);
    }, 3500);
  };

  ChemLab.showModal = function (title, content) {
    closeModal();

    const overlay = document.createElement("div");
    overlay.className = "chemlab-modal-overlay";
    overlay.id = "chemlabModalOverlay";
    overlay.setAttribute("role", "presentation");

    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "99990",
      display: "grid",
      placeItems: "center",
      padding: "16px",
      background: "rgba(3,8,20,.76)",
      overflowY: "auto"
    });

    const dialog = document.createElement("section");
    dialog.className = "chemlab-modal-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute(
      "aria-labelledby",
      "chemlabModalTitle"
    );

    Object.assign(dialog.style, {
      width: "min(620px, 100%)",
      maxHeight: "min(85vh, 850px)",
      overflowY: "auto",
      padding: "24px",
      borderRadius: "18px",
      background: "var(--panel, #111b2c)",
      color: "var(--text, #f4f7ff)",
      border: "1px solid var(--border, #29364d)",
      boxShadow: "0 20px 80px rgba(0,0,0,.35)"
    });

    dialog.innerHTML = `
      <div style="display:flex;align-items:center;
                  justify-content:space-between;gap:16px;
                  margin-bottom:18px">
        <h2 id="chemlabModalTitle"
            style="margin:0;font-size:21px">
          ${escapeHTML(title)}
        </h2>

        <button type="button"
                data-modal-close
                aria-label="Close dialog"
                style="font-size:24px;border:0;
                       background:transparent;
                       color:inherit;cursor:pointer">
          ×
        </button>
      </div>

      <div class="chemlab-modal-content">${content}</div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (event) {
      if (
        event.target === overlay ||
        event.target.closest("[data-modal-close]")
      ) {
        closeModal();
      }
    });

    const firstInput = getElement(
      "input, textarea, button",
      dialog
    );

    if (firstInput) firstInput.focus();

    return overlay;
  };

  function closeModal() {
    const overlay = getElement("#chemlabModalOverlay");
    if (overlay) overlay.remove();
  }

  ChemLab.closeModal = closeModal;

  ChemLab.openSignIn = function (mode) {
    if (
      window.CHEMLAB_AUTH_UI &&
      typeof window.CHEMLAB_AUTH_UI.open === "function"
    ) {
      window.CHEMLAB_AUTH_UI.open(mode || "login");
      return;
    }

    const authModal = getElement(
      "#authModal, .auth-modal"
    );

    if (authModal) {
      authModal.classList.add("open", "active");
      authModal.setAttribute("aria-hidden", "false");
      return;
    }

    ChemLab.showToast(
      "The sign-in interface is not available. Check your authentication module.",
      "warning"
    );
  };

  /* ==========================================================
     MOBILE NAVIGATION
     ========================================================== */

  function setupMobileMenu() {
    const menuButton = getElement(
      "#mobileMenu, .mobile-menu-button, [data-mobile-menu]"
    );

    const sidebar = getElement(".sidebar");

    if (!menuButton || !sidebar || menuButton.dataset.menuReady) {
      return;
    }

    menuButton.dataset.menuReady = "true";

    menuButton.addEventListener("click", function () {
      const opening = !sidebar.classList.contains("mobile-open");

      sidebar.classList.toggle("mobile-open", opening);
      sidebar.classList.toggle("open", opening);

      menuButton.setAttribute(
        "aria-expanded",
        String(opening)
      );
    });

    document.addEventListener("click", function (event) {
      if (
        window.innerWidth <= 900 &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        sidebar.classList.remove("mobile-open", "open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        sidebar.classList.remove("mobile-open", "open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ==========================================================
     GLOBAL SEARCH
     ========================================================== */

  function getSearchableItems() {
    return [
      ["Dashboard", "dashboard", "Your ChemLab home page"],
      ["Laboratory", "laboratory", "Chemicals and apparatus"],
      ["Experiments", "experiments", "Guided investigations"],
      ["Scientific Analysis", "analysis", "Experimental data"],
      ["Chemistry Academy", "academy", "Lessons and concepts"],
      ["AI Chemistry Tutor", "ai-tutor", "Chemistry assistance"],
      ["Assessments", "assessments", "Knowledge checks"],
      ["Lab Notebook", "notebook", "Experimental records"],
      ["My Progress", "progress", "Learning progress"],
      ["ChemLab Premium", "premium", "Advanced features"],
      ["Settings", "settings", "Workspace preferences"]
    ];
  }

  function openSearch() {
    ChemLab.showModal(
      "Search ChemLab",
      `
        <label for="chemlabGlobalSearch">
          Search pages and tools
        </label>

        <input id="chemlabGlobalSearch"
               type="search"
               placeholder="Try Laboratory, notebook, or assessments..."
               autocomplete="off"
               style="display:block;width:100%;
                      box-sizing:border-box;margin:10px 0 16px;
                      padding:13px;border-radius:10px;
                      border:1px solid var(--border,#334155);
                      background:var(--bg,#080d18);
                      color:inherit">

        <div id="chemlabSearchResults"
             aria-live="polite"></div>
      `
    );

    const input = getElement("#chemlabGlobalSearch");
    const results = getElement("#chemlabSearchResults");

    if (!input || !results) return;

    function renderResults() {
      const query = input.value.trim().toLowerCase();

      const matches = getSearchableItems().filter(function (item) {
        return !query ||
          (item[0] + " " + item[2])
            .toLowerCase()
            .includes(query);
      });

      results.innerHTML = matches.length
        ? matches.map(function (item) {
            return `
              <button type="button"
                      data-search-route="${escapeHTML(item[1])}"
                      style="display:block;width:100%;
                             text-align:left;padding:12px;
                             margin:5px 0;border-radius:10px;
                             border:1px solid var(--border,#334155);
                             background:transparent;color:inherit;
                             cursor:pointer">
                <strong>${escapeHTML(item[0])}</strong>

                <div style="font-size:12px;opacity:.7;
                            margin-top:4px">
                  ${escapeHTML(item[2])}
                </div>
              </button>
            `;
          }).join("")
        : "<p>No matching pages found.</p>";
    }

    input.addEventListener("input", renderResults);

    results.addEventListener("click", function (event) {
      const button = event.target.closest(
        "[data-search-route]"
      );

      if (!button) return;

      const route = button.dataset.searchRoute;

      if (
        window.ChemLabRouter &&
        typeof window.ChemLabRouter.navigate === "function"
      ) {
        window.ChemLabRouter.navigate(route);
      } else {
        window.location.hash = "#" + route;
      }

      closeModal();
    });

    renderResults();
  }

  function setupSearch() {
    document.addEventListener("click", function (event) {
      const trigger = event.target.closest(
        "#searchButton, #globalSearchButton, .search-trigger, " +
        "[data-action='search'], [data-open-search]"
      );

      if (!trigger) return;

      event.preventDefault();
      openSearch();
    });

    document.addEventListener("keydown", function (event) {
      const target = event.target;
      const tag = target && target.tagName;

      const typing = tag === "INPUT" ||
        tag === "TEXTAREA" ||
        Boolean(target && target.isContentEditable);

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        openSearch();
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        openSearch();
      }
    });
  }

  /* ==========================================================
     NOTIFICATIONS
     ========================================================== */

  function setupNotifications() {
    document.addEventListener("click", function (event) {
      const trigger = event.target.closest(
        "#notificationButton, #notificationsButton, " +
        ".notification-button, [data-action='notifications']"
      );

      if (!trigger) return;

      event.preventDefault();

      const notifications = readStorage(
        STORAGE.notifications,
        [
          {
            id: "welcome",
            title: "Welcome to ChemLab",
            message: "Your digital chemistry workspace is ready.",
            time: "ChemLab",
            read: false
          }
        ]
      );

      ChemLab.showModal(
        "Notifications",
        notifications.length
          ? notifications.map(function (item) {
              return `
                <article style="padding:12px 0;
                                border-bottom:1px solid
                                var(--border,#334155)">
                  <strong>
                    ${escapeHTML(item.title || "Notification")}
                  </strong>

                  <p style="margin:6px 0">
                    ${escapeHTML(item.message || "")}
                  </p>

                  <small style="opacity:.7">
                    ${escapeHTML(item.time || "")}
                  </small>
                </article>
              `;
            }).join("")
          : "<p>You have no notifications.</p>"
      );

      writeStorage(
        STORAGE.notifications,
        notifications.map(function (item) {
          return Object.assign({}, item, { read: true });
        })
      );

      const badge = getElement(
        ".notification-badge, [data-notification-count]"
      );

      if (badge) badge.textContent = "";
    });
  }

  /* ==========================================================
     GENERAL MODALS AND AUTHENTICATION
     ========================================================== */

  function setupGeneralActions() {
    document.addEventListener("click", function (event) {
      const authTrigger = event.target.closest(
        "[data-auth-action], .sign-in-button, " +
        "[data-action='signin'], [data-action='signup']"
      );

      if (authTrigger) {
        const action = authTrigger.dataset.authAction ||
          authTrigger.dataset.action ||
          "signin";

        if (action === "signin" || action === "login") {
          event.preventDefault();
          ChemLab.openSignIn("login");
        } else if (
          action === "signup" ||
          action === "register"
        ) {
          event.preventDefault();
          ChemLab.openSignIn("signup");
        }
      }

      const closeTrigger = event.target.closest(
        "[data-close-modal], .modal-close"
      );

      if (closeTrigger) {
        const modal = closeTrigger.closest(
          ".modal, .auth-modal, [role='dialog']"
        );

        if (modal && modal.id !== "chemlabModalOverlay") {
          modal.classList.remove("open", "active");
          modal.setAttribute("aria-hidden", "true");
        }
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeModal();
    });
  }

  /* ==========================================================
     LABORATORY STATE
     ========================================================== */

  function normalizeState(value) {
    const state = value && typeof value === "object"
      ? value
      : {};

    const validChemicalIds = CHEMICALS.map(function (item) {
      return item.id;
    });

    const validApparatusIds = APPARATUS.map(function (item) {
      return item.id;
    });

    return {
      chemicals: Array.isArray(state.chemicals)
        ? Array.from(
            new Set(
              state.chemicals.map(function (id) {
                return id;
              })
            )
          ).filter(function (id) {
            return validChemicalIds.includes(id);
          })
        : [],

      apparatus: Array.isArray(state.apparatus)
        ? Array.from(
            new Set(
              state.apparatus.map(function (id) {
                return id === "balance"
                  ? "electronic-balance"
                  : id;
              })
            )
          ).filter(function (id) {
            return validApparatusIds.includes(id);
          })
        : [],

      savedAt: state.savedAt || null
    };
  }

  let laboratoryState = normalizeState(
    readStorage(STORAGE.laboratory, DEFAULT_STATE)
  );

  function persistLaboratoryState() {
    return writeStorage(STORAGE.laboratory, laboratoryState);
  }

  function getChemical(id) {
    return CHEMICALS.find(function (item) {
      return item.id === id;
    });
  }

  function getApparatus(id) {
    return APPARATUS.find(function (item) {
      return item.id === id ||
        (item.aliases || []).includes(id);
    });
  }

  /* ==========================================================
     CHEMICAL LIBRARY RENDERING
     ========================================================== */

  function renderChemicalLibrary() {
    const list = getElement(".laboratory-library-list");
    if (!list) return;

    const search = getElement("#labChemicalSearch");
    const query = search
      ? search.value.trim().toLowerCase()
      : "";

    const filtered = CHEMICALS.filter(function (chemical) {
      return (
        chemical.name + " " +
        chemical.formula + " " +
        chemical.category
      ).toLowerCase().includes(query);
    });

    if (!filtered.length) {
      list.innerHTML = `
        <p class="laboratory-empty-state">
          No chemicals match your search.
        </p>
      `;
      return;
    }

    list.innerHTML = filtered.map(function (chemical) {
      const selected = laboratoryState.chemicals.includes(
        chemical.id
      );

      return `
        <article
          class="laboratory-chemical-card ${selected ? "selected" : ""}"
          data-chemical-card="${escapeHTML(chemical.id)}"
          style="--chemical-color:${escapeHTML(chemical.color)}">

          <div class="chemical-card-main">
            <span class="chemical-formula">
              ${escapeHTML(chemical.formula)}
            </span>

            <div class="chemical-card-details">
              <strong>${escapeHTML(chemical.name)}</strong>
              <span>${escapeHTML(chemical.category)}</span>
              <small>${escapeHTML(chemical.description)}</small>
            </div>
          </div>

          <button
            type="button"
            class="button ${selected ? "button-secondary" : "button-primary"}"
            data-toggle-chemical="${escapeHTML(chemical.id)}"
            aria-pressed="${selected}">
            ${selected ? "Remove" : "Add"}
          </button>
        </article>
      `;
    }).join("");
  }

  /* ==========================================================
     APPARATUS LIBRARY RENDERING — FIXED
     Every apparatus has a visible Add to Bench button.
     ========================================================== */

  function renderApparatusLibrary() {
    const container = getElement(
      ".laboratory-apparatus-library"
    );

    if (!container) return;

    APPARATUS.forEach(function (apparatus) {
      let card = container.querySelector(
        '[data-apparatus-id="' + apparatus.id + '"]'
      );

      // Support the older "balance" identifier.
      if (!card && apparatus.aliases) {
        card = container.querySelector(
          '[data-apparatus-id="' + apparatus.aliases[0] + '"]'
        );
      }

      // Create the card if the router did not provide one.
      if (!card) {
        card = document.createElement("article");
        container.appendChild(card);
      }

      const selected = laboratoryState.apparatus.includes(
        apparatus.id
      );

      card.className = "laboratory-apparatus-card";
      card.dataset.apparatusId = apparatus.id;

      // The button handles interaction; the card itself
      // must not behave like a second button.
      card.removeAttribute("role");
      card.removeAttribute("tabindex");
      card.removeAttribute("aria-pressed");

      card.classList.toggle("selected", selected);

      card.innerHTML = `
        <div class="apparatus-card-icon" aria-hidden="true">
          ${escapeHTML(apparatus.symbol)}
        </div>

        <div class="apparatus-card-info">
          <strong>${escapeHTML(apparatus.name)}</strong>
          <p>${escapeHTML(apparatus.description)}</p>
        </div>

        <button
          type="button"
          class="apparatus-add-button ${selected ? "is-selected" : ""}"
          data-toggle-apparatus="${escapeHTML(apparatus.id)}"
          aria-pressed="${selected}">
          ${selected ? "✓ Added" : "+ Add to Bench"}
        </button>
      `;
    });

    // Remove obsolete/duplicate apparatus cards.
    getElements(
      ".laboratory-apparatus-card",
      container
    ).forEach(function (card) {
      const item = getApparatus(card.dataset.apparatusId);

      if (!item) {
        card.remove();
        return;
      }

      // Normalize old aliases and identifiers.
      card.dataset.apparatusId = item.id;
    });
  }

  /* ==========================================================
     DIGITAL LAB BENCH
     ========================================================== */

  function renderBench() {
    const bench = getElement(".digital-lab-bench");
    if (!bench) return;

    const selectedChemicals = laboratoryState.chemicals
      .map(getChemical)
      .filter(Boolean);

    const selectedApparatus = laboratoryState.apparatus
      .map(getApparatus)
      .filter(Boolean);

    if (
      !selectedChemicals.length &&
      !selectedApparatus.length
    ) {
      bench.innerHTML = `
        <div class="laboratory-bench-placeholder">
          <span class="bench-placeholder-icon">⚗</span>

          <h3>Your laboratory bench is ready</h3>

          <p>
            Select chemicals and apparatus from the libraries
            to prepare your workspace.
          </p>
        </div>
      `;
      return;
    }

    bench.innerHTML = `
      <div class="laboratory-bench-items">

        ${selectedApparatus.map(function (item) {
          return `
            <div
              class="bench-apparatus-item"
              data-bench-apparatus="${escapeHTML(item.id)}">

              <span class="apparatus-symbol">
                ${escapeHTML(item.symbol)}
              </span>

              <strong>${escapeHTML(item.name)}</strong>

              <button
                type="button"
                data-remove-apparatus="${escapeHTML(item.id)}"
                aria-label="Remove ${escapeHTML(item.name)}">
                Remove
              </button>
            </div>
          `;
        }).join("")}

        ${selectedChemicals.map(function (item) {
          return `
            <div
              class="bench-chemical-item"
              data-bench-chemical="${escapeHTML(item.id)}">

              <span class="chemical-formula">
                ${escapeHTML(item.formula)}
              </span>

              <strong>${escapeHTML(item.name)}</strong>

              <button
                type="button"
                data-remove-chemical="${escapeHTML(item.id)}"
                aria-label="Remove ${escapeHTML(item.name)}">
                Remove
              </button>
            </div>
          `;
        }).join("")}

      </div>
    `;
  }

  /* ==========================================================
     SELECTION SUMMARY
     ========================================================== */

  function renderSelectionSummary() {
    const summary = getElement(".selection-summary-list");
    if (!summary) return;

    const selectedChemicals = laboratoryState.chemicals
      .map(getChemical)
      .filter(Boolean);

    const selectedApparatus = laboratoryState.apparatus
      .map(getApparatus)
      .filter(Boolean);

    if (
      !selectedChemicals.length &&
      !selectedApparatus.length
    ) {
      summary.innerHTML = `
        <p>No materials or apparatus selected yet.</p>
      `;
      return;
    }

    summary.innerHTML = `
      <div class="selection-summary-group">
        <strong>Chemicals (${selectedChemicals.length})</strong>

        <ul>
          ${selectedChemicals.map(function (item) {
            return `
              <li>
                ${escapeHTML(item.name)}
                (${escapeHTML(item.formula)})
              </li>
            `;
          }).join("") || "<li>None selected</li>"}
        </ul>
      </div>

      <div class="selection-summary-group">
        <strong>Apparatus (${selectedApparatus.length})</strong>

        <ul>
          ${selectedApparatus.map(function (item) {
            return `
              <li>${escapeHTML(item.name)}</li>
            `;
          }).join("") || "<li>None selected</li>"}
        </ul>
      </div>
    `;
  }

  /* ==========================================================
     LABORATORY STATE RENDERING
     ========================================================== */

  function renderLaboratoryState() {
    const view = getElement(".laboratory-view");
    if (!view) return;

    renderChemicalLibrary();
    renderApparatusLibrary();
    renderBench();
    renderSelectionSummary();

    const chemicalCount = getElement(
      "[data-lab-material-count]"
    );

    const apparatusCount = getElement(
      "[data-lab-apparatus-count]"
    );

    const status = getElement("[data-lab-status]");

    if (chemicalCount) {
      chemicalCount.textContent =
        laboratoryState.chemicals.length;
    }

    if (apparatusCount) {
      apparatusCount.textContent =
        laboratoryState.apparatus.length;
    }

    if (status) {
      status.textContent =
        laboratoryState.chemicals.length ||
        laboratoryState.apparatus.length
          ? "Configured"
          : "Ready";
    }

    const materialsStatus = getElement(
      ".laboratory-status-item[data-status='materials']"
    );

    if (materialsStatus) {
      materialsStatus.setAttribute(
        "data-count",
        String(laboratoryState.chemicals.length)
      );
    }

    const apparatusStatus = getElement(
      ".laboratory-status-item[data-status='apparatus']"
    );

    if (apparatusStatus) {
      apparatusStatus.setAttribute(
        "data-count",
        String(laboratoryState.apparatus.length)
      );
    }
  }

  /* ==========================================================
     LABORATORY ACTIONS
     ========================================================== */

  function toggleChemical(id) {
    if (!getChemical(id)) return;

    if (laboratoryState.chemicals.includes(id)) {
      laboratoryState.chemicals =
        laboratoryState.chemicals.filter(function (item) {
          return item !== id;
        });
    } else {
      laboratoryState.chemicals.push(id);
    }

    persistLaboratoryState();
    renderLaboratoryState();
  }

  function toggleApparatus(id) {
    const item = getApparatus(id);
    if (!item) return;

    if (laboratoryState.apparatus.includes(item.id)) {
      laboratoryState.apparatus =
        laboratoryState.apparatus.filter(function (value) {
          return value !== item.id;
        });
    } else {
      laboratoryState.apparatus.push(item.id);
    }

    persistLaboratoryState();
    renderLaboratoryState();
  }

  function clearLaboratory() {
    laboratoryState = {
      chemicals: [],
      apparatus: [],
      savedAt: null
    };

    persistLaboratoryState();
    renderLaboratoryState();

    ChemLab.showToast(
      "Laboratory workspace cleared.",
      "success"
    );
  }

  function saveLaboratory() {
    laboratoryState.savedAt = new Date().toISOString();

    const saved = persistLaboratoryState();

    if (saved) {
      ChemLab.showToast(
        "Workspace saved on this device.",
        "success"
      );
    } else {
      ChemLab.showToast(
        "The workspace could not be saved. Check browser storage settings.",
        "error"
      );
    }
  }

  /* ==========================================================
     EXPERIMENT WORKSPACE
     ========================================================== */

  let activeExperiment = null;

  function getExperimentRecords() {
    const records = readStorage(STORAGE.experiments, []);
    return Array.isArray(records) ? records : [];
  }

  function startExperiment() {
    if (
      !laboratoryState.chemicals.length &&
      !laboratoryState.apparatus.length
    ) {
      ChemLab.showToast(
        "Select at least one chemical or apparatus first.",
        "warning"
      );
      return;
    }

    activeExperiment = {
      id: "exp-" + Date.now(),
      title: "Open Laboratory Investigation",
      startedAt: new Date().toISOString(),
      chemicals: laboratoryState.chemicals.slice(),
      apparatus: laboratoryState.apparatus.slice(),
      observations: [],
      measurements: [],
      status: "In progress"
    };

    renderExperimentModal();
  }

  function renderExperimentModal() {
    if (!activeExperiment) return;

    const chemicals = activeExperiment.chemicals
      .map(getChemical)
      .filter(Boolean);

    const apparatus = activeExperiment.apparatus
      .map(getApparatus)
      .filter(Boolean);

    ChemLab.showModal(
      "Experiment Workspace",
      `
        <p>
          Record observations and measurements for this
          digital learning activity.
        </p>

        <div style="padding:12px;border-radius:10px;
                    background:rgba(49,87,213,.12);
                    margin:12px 0">

          <strong>Investigation materials</strong>

          <p>
            ${chemicals.map(function (item) {
              return escapeHTML(item.name) + " (" +
                escapeHTML(item.formula) + ")";
            }).join(", ") || "No chemicals selected"}
          </p>

          <strong>Apparatus</strong>

          <p>
            ${apparatus.map(function (item) {
              return escapeHTML(item.name);
            }).join(", ") || "No apparatus selected"}
          </p>
        </div>

        <form id="chemlabObservationForm">
          <label for="chemlabObservation">
            Observation
          </label>

          <textarea
            id="chemlabObservation"
            name="observation"
            rows="3"
            required
            placeholder="Describe what you observed..."
            style="display:block;box-sizing:border-box;
                   width:100%;margin:8px 0 14px;
                   padding:12px;border-radius:10px;
                   background:var(--bg,#080d18);
                   color:inherit;
                   border:1px solid var(--border,#334155)">
          </textarea>

          <label for="chemlabMeasurement">
            Measurement (optional)
          </label>

          <input
            id="chemlabMeasurement"
            name="measurement"
            placeholder="e.g. 25 mL or 28 °C"
            style="display:block;box-sizing:border-box;
                   width:100%;margin:8px 0 14px;
                   padding:12px;border-radius:10px;
                   background:var(--bg,#080d18);
                   color:inherit;
                   border:1px solid var(--border,#334155)">

          <button
            type="submit"
            class="button button-primary"
            style="padding:11px 16px;cursor:pointer">
            Record Entry
          </button>
        </form>

        <div style="margin-top:20px">
          <h3>Experiment log</h3>

          <div id="chemlabExperimentLog">
            ${renderExperimentLog()}
          </div>
        </div>

        <div style="margin-top:18px">
          <p style="font-size:12px;opacity:.8">
            Educational workspace only. This does not simulate
            chemical reactions or certify experimental safety.
            Do not use it as instructions for handling hazardous
            chemicals.
          </p>

          <button
            type="button"
            id="chemlabFinishExperiment"
            class="button button-secondary"
            style="padding:11px 16px;cursor:pointer">
            Finish and Save Record
          </button>
        </div>
      `
    );

    const form = getElement("#chemlabObservationForm");
    const finishButton = getElement(
      "#chemlabFinishExperiment"
    );

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!activeExperiment) return;

        const observation = getElement(
          "#chemlabObservation"
        ).value.trim();

        const measurement = getElement(
          "#chemlabMeasurement"
        ).value.trim();

        if (!observation) {
          ChemLab.showToast(
            "Enter an observation before recording the entry.",
            "warning"
          );
          return;
        }

        const now = new Date().toISOString();

        activeExperiment.observations.push({
          text: observation,
          time: now
        });

        if (measurement) {
          activeExperiment.measurements.push({
            value: measurement,
            time: now
          });
        }

        renderExperimentModal();

        ChemLab.showToast(
          "Experiment entry recorded.",
          "success"
        );
      });
    }

    if (finishButton) {
      finishButton.addEventListener(
        "click",
        finishExperiment
      );
    }
  }

  function renderExperimentLog() {
    if (!activeExperiment) {
      return "<p>No entries yet.</p>";
    }

    const entries = [];

    activeExperiment.observations.forEach(function (item) {
      entries.push({
        time: item.time,
        label: "Observation",
        value: item.text
      });
    });

    activeExperiment.measurements.forEach(function (item) {
      entries.push({
        time: item.time,
        label: "Measurement",
        value: item.value
      });
    });

    entries.sort(function (a, b) {
      return a.time.localeCompare(b.time);
    });

    if (!entries.length) {
      return "<p>No entries recorded yet.</p>";
    }

    return entries.map(function (item) {
      return `
        <article style="padding:10px 0;
                        border-bottom:1px solid
                        var(--border,#334155)">
          <strong>${escapeHTML(item.label)}</strong>

          <p>${escapeHTML(item.value)}</p>

          <small style="opacity:.7">
            ${escapeHTML(
              new Date(item.time).toLocaleString()
            )}
          </small>
        </article>
      `;
    }).join("");
  }

  function finishExperiment() {
    if (!activeExperiment) return;

    activeExperiment.status = "Completed";
    activeExperiment.finishedAt = new Date().toISOString();

    const records = getExperimentRecords();
    records.unshift(activeExperiment);

    if (!writeStorage(STORAGE.experiments, records)) {
      ChemLab.showToast(
        "Could not save the experiment record.",
        "error"
      );
      return;
    }

    activeExperiment = null;
    closeModal();

    ChemLab.showToast(
      "Experiment record saved on this device.",
      "success"
    );
  }

  /* ==========================================================
     LABORATORY EVENT DELEGATION — FIXED
     ========================================================== */

  function setupLaboratoryEvents() {
    if (document.documentElement.dataset.labEventsReady) {
      return;
    }

    document.documentElement.dataset.labEventsReady = "true";

    document.addEventListener("input", function (event) {
      if (event.target.id === "labChemicalSearch") {
        renderChemicalLibrary();
      }
    });

    document.addEventListener("click", function (event) {
      // Apparatus Add/Remove button.
      // Handle this before any other apparatus action.
      const apparatusButton = event.target.closest(
        "[data-toggle-apparatus]"
      );

      if (apparatusButton) {
        event.preventDefault();
        event.stopPropagation();

        toggleApparatus(
          apparatusButton.dataset.toggleApparatus
        );

        return;
      }

      const chemicalButton = event.target.closest(
        "[data-toggle-chemical]"
      );

      if (chemicalButton) {
        event.preventDefault();

        toggleChemical(
          chemicalButton.dataset.toggleChemical
        );

        return;
      }

      const removeChemical = event.target.closest(
        "[data-remove-chemical]"
      );

      if (removeChemical) {
        toggleChemical(
          removeChemical.dataset.removeChemical
        );

        return;
      }

      const removeApparatus = event.target.closest(
        "[data-remove-apparatus]"
      );

      if (removeApparatus) {
        toggleApparatus(
          removeApparatus.dataset.removeApparatus
        );

        return;
      }

      const clearButton = event.target.closest(
        "#labClearWorkspace"
      );

      if (clearButton) {
        clearLaboratory();
        return;
      }

      const saveButton = event.target.closest(
        "#labSaveSetup"
      );

      if (saveButton) {
        saveLaboratory();
        return;
      }

      const beginButton = event.target.closest(
        "#labBeginExperiment"
      );

      if (beginButton) {
        startExperiment();
      }
    });

    // No card-level Enter/Space handler is required:
    // the Add to Bench button is a native accessible button.
  }

  /* ==========================================================
     LABORATORY STYLES
     ========================================================== */

  function injectLaboratoryStyles() {
    if (getElement("#chemlabLaboratoryAppStyles")) return;

    const style = document.createElement("style");
    style.id = "chemlabLaboratoryAppStyles";

    style.textContent = `
      .laboratory-apparatus-library {
        display: grid;
        grid-template-columns:
          repeat(auto-fit, minmax(min(100%, 220px), 1fr));
        gap: 14px;
        align-items: stretch;
      }

      .laboratory-apparatus-card {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr);
        gap: 10px 12px;
        align-content: start;
        min-width: 0;
        padding: 16px;
        border: 1px solid var(--border, #29364d);
        border-radius: 14px;
        background: var(--panel, #111b2c);
        color: var(--text, #f4f7ff);
        transition:
          border-color .18s ease,
          background .18s ease,
          transform .18s ease;
      }

      .laboratory-apparatus-card:hover {
        border-color: var(--primary, #5b8cff);
        transform: translateY(-2px);
      }

      .laboratory-apparatus-card.selected {
        border-color: var(--primary, #5b8cff);
        background:
          color-mix(
            in srgb,
            var(--primary, #5b8cff) 10%,
            var(--panel, #111b2c)
          );
      }

      .apparatus-card-icon {
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(91, 140, 255, .13);
        color: var(--primary, #5b8cff);
        font-size: 27px;
        grid-row: span 2;
      }

      .apparatus-card-info {
        min-width: 0;
        align-self: center;
      }

      .apparatus-card-info strong {
        display: block;
        line-height: 1.4;
        overflow-wrap: anywhere;
      }

      .apparatus-card-info p {
        margin: 5px 0 0;
        font-size: 13px;
        line-height: 1.5;
        opacity: .75;
        overflow-wrap: anywhere;
      }

      .apparatus-add-button {
        grid-column: 1 / -1;
        width: 100%;
        min-height: 40px;
        padding: 10px 12px;
        border: 1px solid var(--primary, #5b8cff);
        border-radius: 9px;
        background: var(--primary, #5b8cff);
        color: #fff;
        font: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition:
          background .18s ease,
          border-color .18s ease,
          opacity .18s ease;
      }

      .apparatus-add-button:hover {
        opacity: .9;
      }

      .apparatus-add-button:focus-visible {
        outline: 3px solid var(--cyan, #47d7e8);
        outline-offset: 3px;
      }

      .apparatus-add-button.is-selected {
        background: transparent;
        border-color: var(--success, #4cdb9a);
        color: var(--success, #4cdb9a);
      }

      .laboratory-bench-items {
        display: grid;
        grid-template-columns:
          repeat(auto-fit, minmax(min(100%, 180px), 1fr));
        gap: 12px;
      }

      .bench-apparatus-item,
      .bench-chemical-item {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        min-width: 0;
        padding: 12px;
        border: 1px solid var(--border, #29364d);
        border-radius: 12px;
        background: var(--panel, #111b2c);
      }

      .bench-apparatus-item strong,
      .bench-chemical-item strong {
        flex: 1 1 90px;
        overflow-wrap: anywhere;
      }

      .bench-apparatus-item button,
      .bench-chemical-item button {
        padding: 7px 10px;
        border: 1px solid var(--border, #29364d);
        border-radius: 8px;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }

      @media (max-width: 480px) {
        .laboratory-apparatus-card {
          padding: 12px;
        }

        .apparatus-card-icon {
          width: 42px;
          height: 42px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ==========================================================
     ROUTE INTEGRATION
     ========================================================== */

  function onRouteRendered(event) {
    if (
      !event.detail ||
      event.detail.route !== "laboratory"
    ) {
      return;
    }

    renderLaboratoryState();
  }

  function initialize() {
    injectLaboratoryStyles();

    setupMobileMenu();
    setupSearch();
    setupNotifications();
    setupGeneralActions();
    setupLaboratoryEvents();

    document.addEventListener(
      "chemlab:route-rendered",
      onRouteRendered
    );

    // Render if the Laboratory view already exists.
    renderLaboratoryState();

    // Keep the existing router. Do not replace it.
    if (
      window.ChemLabRouter &&
      typeof window.ChemLabRouter.initialize === "function"
    ) {
      window.ChemLabRouter.initialize();
    }

    console.log(
      "ChemLab application core Version 4.1 initialized."
    );
  }

  /* ==========================================================
     PUBLIC LABORATORY API
     ========================================================== */

  window.ChemLabLaboratory = {
    getState: function () {
      return JSON.parse(
        JSON.stringify(laboratoryState)
      );
    },

    getChemicals: function () {
      return CHEMICALS.map(function (item) {
        return Object.assign({}, item);
      });
    },

    getApparatus: function () {
      return APPARATUS.map(function (item) {
        return Object.assign({}, item);
      });
    },

    getExperimentRecords: function () {
      return getExperimentRecords();
    },

    render: renderLaboratoryState,

    clear: clearLaboratory,

    save: saveLaboratory,

    startExperiment: startExperiment
  };

  window.ChemLab = ChemLab;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();
