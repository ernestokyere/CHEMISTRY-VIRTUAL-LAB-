/* =====================================================
   CHEMLAB — DIGITAL LABORATORY WORKSPACE
   White and blue tabbed interface.
   Preserves the existing laboratory item IDs and
   saved setup key.
   ===================================================== */

(function () {
  "use strict";

  const chemicals = [
    { id: "hcl", name: "Hydrochloric acid", formula: "HCl", type: "Acid" },
    { id: "h2so4", name: "Sulfuric acid", formula: "H₂SO₄", type: "Acid" },
    { id: "naoh", name: "Sodium hydroxide", formula: "NaOH", type: "Base" },
    { id: "koh", name: "Potassium hydroxide", formula: "KOH", type: "Base" },
    { id: "nacl", name: "Sodium chloride", formula: "NaCl", type: "Salt" },
    { id: "phenol", name: "Phenolphthalein", formula: "Indicator", type: "Indicator" },
    { id: "methyl", name: "Methyl orange", formula: "Indicator", type: "Indicator" },
    { id: "water", name: "Distilled water", formula: "H₂O", type: "Solvent" }
  ];

  const apparatus = [
    { id: "beaker", name: "Beaker", icon: "◯" },
    { id: "flask", name: "Conical flask", icon: "⚗" },
    { id: "cylinder", name: "Measuring cylinder", icon: "▥" },
    { id: "burette", name: "Burette", icon: "│" },
    { id: "pipette", name: "Pipette", icon: "╱" },
    { id: "testtube", name: "Test tube", icon: "▯" },
    { id: "balance", name: "Balance", icon: "⚖" },
    { id: "thermometer", name: "Thermometer", icon: "🌡" }
  ];

  const STORAGE_KEY = "chemlab-lab-setup";

  let selectedChemicals = [];
  let selectedApparatus = [];
  let experimentStarted = false;
  let activeTab = "chemicals";

  const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  function restoreSavedSetup() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") return;

      const validChemicalIds = new Set(chemicals.map(item => item.id));
      const validApparatusIds = new Set(apparatus.map(item => item.id));

      if (Array.isArray(saved.chemicals)) {
        selectedChemicals = [...new Set(
          saved.chemicals.filter(id =>
            typeof id === "string" && validChemicalIds.has(id)
          )
        )];
      }

      if (Array.isArray(saved.apparatus)) {
        selectedApparatus = [...new Set(
          saved.apparatus.filter(id =>
            typeof id === "string" && validApparatusIds.has(id)
          )
        )];
      }
    } catch (error) {
      console.warn("ChemLab: Could not restore the saved laboratory setup.");
    }
  }

  restoreSavedSetup();

  function renderCards(items, selected, kind) {
    if (!items.length) {
      return '<p class="cl-empty">No matching items found.</p>';
    }

    return items.map(item => {
      const active = selected.includes(item.id);
      const subtitle = kind === "chemical"
        ? item.formula + " · " + item.type
        : "Laboratory apparatus";

      return `
        <button type="button"
          class="cl-library-item ${active ? "is-selected" : ""}"
          data-cl-add="${kind}"
          data-cl-id="${escapeHTML(item.id)}"
          aria-pressed="${active}">
          <span class="cl-item-icon" aria-hidden="true">${kind === "chemical"
            ? "⚗" : escapeHTML(item.icon)}</span>
          <span class="cl-item-copy">
            <strong>${escapeHTML(item.name)}</strong>
            <small>${escapeHTML(subtitle)}</small>
          </span>
          <span class="cl-add-mark" aria-hidden="true">${active ? "✓" : "+"}</span>
        </button>`;
    }).join("");
  }

  function renderBenchItems(items, kind) {
    if (!items.length) {
      return `<div class="cl-bench-empty">
        <span aria-hidden="true">＋</span>
        <strong>Your bench is empty</strong>
        <p>Select items from the libraries to build your workspace.</p>
      </div>`;
    }

    return items.map(item => `
      <div class="cl-bench-item">
        <span aria-hidden="true">${kind === "chemical"
          ? "⚗" : escapeHTML(item.icon)}</span>
        <div>
          <strong>${escapeHTML(item.name)}</strong>
          <small>${kind === "chemical"
            ? escapeHTML(item.formula)
            : "Apparatus"}</small>
        </div>
        <button type="button" class="cl-remove"
          data-cl-remove="${kind}"
          data-cl-id="${escapeHTML(item.id)}"
          aria-label="Remove ${escapeHTML(item.name)}">×</button>
      </div>`).join("");
  }

  function renderLaboratory() {
    const host = document.getElementById("appView");
    if (!host) return;

    host.classList.remove("dashboard");
    host.classList.add("route-view");

    host.innerHTML = `
      <div class="cl-lab">
        <header class="cl-lab-head">
          <div>
            <div class="cl-eyebrow">CHEMLAB · DIGITAL LABORATORY</div>
            <h1>Open Laboratory</h1>
            <p class="cl-description">
              Choose laboratory materials, assemble your workspace,
              and prepare for a guided investigation.
            </p>
          </div>
          <span class="cl-status" id="clStatus">● Workspace ready</span>
        </header>

        <div class="cl-summary">
          <div class="cl-summary-card">
            <span class="cl-summary-icon" aria-hidden="true">⚗</span>
            <div class="cl-summary-copy">
              <span>Chemicals selected</span>
              <strong id="clChemicalTotal">0</strong>
            </div>
          </div>
          <div class="cl-summary-card">
            <span class="cl-summary-icon" aria-hidden="true">▥</span>
            <div class="cl-summary-copy">
              <span>Apparatus selected</span>
              <strong id="clApparatusTotal">0</strong>
            </div>
          </div>
        </div>

        <nav class="cl-tabs" role="tablist" aria-label="Laboratory views">
          <button type="button" class="cl-tab is-active"
            id="clTabChemicals" role="tab"
            aria-selected="true" aria-controls="clPanelChemicals"
            data-cl-tab="chemicals">
            <span aria-hidden="true">⚗</span>
            Chemicals
            <span class="cl-tab-count" id="clChemicalTabCount">0</span>
          </button>

          <button type="button" class="cl-tab"
            id="clTabApparatus" role="tab"
            aria-selected="false" aria-controls="clPanelApparatus"
            tabindex="-1" data-cl-tab="apparatus">
            <span aria-hidden="true">▥</span>
            Apparatus
            <span class="cl-tab-count" id="clApparatusTabCount">0</span>
          </button>

          <button type="button" class="cl-tab"
            id="clTabWorkspace" role="tab"
            aria-selected="false" aria-controls="clPanelWorkspace"
            tabindex="-1" data-cl-tab="workspace">
            <span aria-hidden="true">▦</span>
            Workspace
          </button>
        </nav>

        <section class="cl-tab-panel" id="clPanelChemicals"
          role="tabpanel" aria-labelledby="clTabChemicals"
          data-cl-panel="chemicals">
          <div class="cl-panel">
            <div class="cl-panel-heading">
              <div>
                <h2>Chemical library</h2>
                <p class="cl-panel-intro">
                  Select a chemical to add or remove it from your setup.
                </p>
              </div>
            </div>
            <div class="cl-search-wrap">
              <input class="cl-search" id="clChemicalSearch"
                type="search" placeholder="Search chemicals by name, formula, or type..."
                aria-label="Search chemicals">
            </div>
            <div class="cl-library-list" id="clChemicalList"></div>
          </div>
          <div class="cl-actions">
            <button type="button" class="cl-btn cl-btn-primary"
              data-cl-go="apparatus">Continue to Apparatus →</button>
          </div>
        </section>

        <section class="cl-tab-panel" id="clPanelApparatus"
          role="tabpanel" aria-labelledby="clTabApparatus"
          data-cl-panel="apparatus" hidden>
          <div class="cl-panel">
            <div class="cl-panel-heading">
              <div>
                <h2>Apparatus library</h2>
                <p class="cl-panel-intro">
                  Select the equipment for your laboratory setup.
                </p>
              </div>
            </div>
            <div class="cl-search-wrap">
              <input class="cl-search" id="clApparatusSearch"
                type="search" placeholder="Search laboratory apparatus..."
                aria-label="Search apparatus">
            </div>
            <div class="cl-library-list" id="clApparatusList"></div>
          </div>
          <div class="cl-actions">
            <button type="button" class="cl-btn"
              data-cl-go="chemicals">← Back to Chemicals</button>
            <button type="button" class="cl-btn cl-btn-primary"
              data-cl-go="workspace">Review Workspace →</button>
          </div>
        </section>

        <section class="cl-tab-panel" id="clPanelWorkspace"
          role="tabpanel" aria-labelledby="clTabWorkspace"
          data-cl-panel="workspace" hidden>
          <div class="cl-panel">
            <div class="cl-panel-heading">
              <div>
                <h2>Digital laboratory bench</h2>
                <p class="cl-panel-intro">
                  Review and manage the items selected for your setup.
                </p>
              </div>
            </div>

            <div class="cl-counts">
              <div class="cl-count">
                <span>Chemicals</span>
                <strong id="clChemicalCount">0</strong>
              </div>
              <div class="cl-count">
                <span>Apparatus</span>
                <strong id="clApparatusCount">0</strong>
              </div>
            </div>

            <h3>Selected chemicals</h3>
            <div class="cl-bench" id="clChemicalBench"></div>

            <h3>Selected apparatus</h3>
            <div class="cl-bench" id="clApparatusBench"></div>

            <div class="cl-actions">
              <button type="button" class="cl-btn" id="clClear">
                Clear Workspace
              </button>
              <button type="button" class="cl-btn" id="clReset">
                Reset Searches
              </button>
              <button type="button" class="cl-btn" id="clSave">
                Save Setup
              </button>
              <button type="button" class="cl-btn cl-btn-primary" id="clBegin">
                Begin Experiment
              </button>
            </div>

            <div class="cl-message" id="clMessage"
              role="status" aria-live="polite">
              Select materials to prepare your workspace.
            </div>
          </div>

          <div class="cl-panel">
            <div class="cl-panel-heading">
              <div>
                <h2>Experiment status</h2>
                <p class="cl-panel-intro" id="clExperimentStatus">
                  No experiment started.
                </p>
              </div>
            </div>
            <p class="cl-experiment-note">
              This workspace is a learning simulation. Selecting materials
              does not perform real chemical reactions. Follow appropriate
              laboratory safety guidance for any real-world practical work.
            </p>
          </div>

          <div class="cl-actions">
            <button type="button" class="cl-btn"
              data-cl-go="chemicals">← Back to Chemicals</button>
            <button type="button" class="cl-btn"
              data-cl-go="apparatus">← Back to Apparatus</button>
          </div>
        </section>
      </div>`;

    setActiveTab(activeTab, false);
    updateLaboratory();
  }

  function setActiveTab(tab, focusTab) {
    const allowed = ["chemicals", "apparatus", "workspace"];
    if (!allowed.includes(tab)) return;

    activeTab = tab;

    document.querySelectorAll("[data-cl-tab]").forEach(button => {
      const active = button.dataset.clTab === tab;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;

      if (active && focusTab) button.focus();
    });

    document.querySelectorAll("[data-cl-panel]").forEach(panel => {
      panel.hidden = panel.dataset.clPanel !== tab;
    });
  }

  function updateLaboratory() {
    const chemicalSearch = document.getElementById("clChemicalSearch");
    const apparatusSearch = document.getElementById("clApparatusSearch");

    if (!chemicalSearch || !apparatusSearch) return;

    const cq = chemicalSearch.value.trim().toLowerCase();
    const aq = apparatusSearch.value.trim().toLowerCase();

    const chemicalList = document.getElementById("clChemicalList");
    const apparatusList = document.getElementById("clApparatusList");

    if (chemicalList) {
      chemicalList.innerHTML = renderCards(
        chemicals.filter(item =>
          (item.name + item.formula + item.type).toLowerCase().includes(cq)
        ),
        selectedChemicals,
        "chemical"
      );
    }

    if (apparatusList) {
      apparatusList.innerHTML = renderCards(
        apparatus.filter(item =>
          (item.name + " apparatus").toLowerCase().includes(aq)
        ),
        selectedApparatus,
        "apparatus"
      );
    }

    const chemicalBench = document.getElementById("clChemicalBench");
    const apparatusBench = document.getElementById("clApparatusBench");

    if (chemicalBench) {
      chemicalBench.innerHTML = renderBenchItems(
        chemicals.filter(item => selectedChemicals.includes(item.id)),
        "chemical"
      );
    }

    if (apparatusBench) {
      apparatusBench.innerHTML = renderBenchItems(
        apparatus.filter(item => selectedApparatus.includes(item.id)),
        "apparatus"
      );
    }

    setText("clChemicalCount", selectedChemicals.length);
    setText("clApparatusCount", selectedApparatus.length);
    setText("clChemicalTotal", selectedChemicals.length);
    setText("clApparatusTotal", selectedApparatus.length);
    setText("clChemicalTabCount", selectedChemicals.length);
    setText("clApparatusTabCount", selectedApparatus.length);
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value);
  }

  function message(text) {
    const box = document.getElementById("clMessage");
    if (box) box.textContent = text;
  }

  function setStatus(text) {
    setText("clStatus", text);
  }

  function clearWorkspace() {
    selectedChemicals = [];
    selectedApparatus = [];
    experimentStarted = false;

    updateLaboratory();
    setStatus("● Workspace ready");
    setText("clExperimentStatus", "No experiment started.");
    message("Workspace cleared. Select items to build a new setup.");
  }

  function resetView() {
    const chemicalSearch = document.getElementById("clChemicalSearch");
    const apparatusSearch = document.getElementById("clApparatusSearch");

    if (chemicalSearch) chemicalSearch.value = "";
    if (apparatusSearch) apparatusSearch.value = "";

    updateLaboratory();
    message("Searches reset. Your selected items have been kept.");
  }

  function saveSetup() {
    const setup = {
      chemicals: selectedChemicals,
      apparatus: selectedApparatus,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(setup));
      message("Setup saved on this device. You can restore it after reloading.");
    } catch (error) {
      message("Could not save this setup in the browser.");
    }
  }

  function beginExperiment() {
    if (!selectedChemicals.length && !selectedApparatus.length) {
      message("Choose at least one chemical or apparatus before starting.");
      return;
    }

    experimentStarted = true;
    setStatus("● Simulation active");

    setText(
      "clExperimentStatus",
      "Workspace simulation started. No chemical reaction or experimental result has been simulated."
    );

    message("Your workspace is ready for the next guided-experiment stage.");
  }

  document.addEventListener("input", event => {
    if (
      event.target.id === "clChemicalSearch" ||
      event.target.id === "clApparatusSearch"
    ) {
      updateLaboratory();
    }
  });

  document.addEventListener("keydown", event => {
    const tab = event.target.closest("[data-cl-tab]");
    if (!tab) return;

    const tabs = ["chemicals", "apparatus", "workspace"];
    const current = tabs.indexOf(tab.dataset.clTab);
    let next = current;

    if (event.key === "ArrowRight") {
      next = (current + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      next = (current - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveTab(tabs[next], true);
  });

  document.addEventListener("click", event => {
    const tab = event.target.closest("[data-cl-tab]");
    if (tab) {
      setActiveTab(tab.dataset.clTab, false);
      return;
    }

    const go = event.target.closest("[data-cl-go]");
    if (go) {
      setActiveTab(go.dataset.clGo, false);
      return;
    }

    const add = event.target.closest("[data-cl-add]");
    if (add) {
      const id = add.dataset.clId;
      const list = add.dataset.clAdd === "chemical"
        ? selectedChemicals
        : selectedApparatus;

      if (list.includes(id)) {
        list.splice(list.indexOf(id), 1);
      } else {
        list.push(id);
      }

      experimentStarted = false;
      updateLaboratory();
      message("Workspace selection updated.");
      return;
    }

    const remove = event.target.closest("[data-cl-remove]");
    if (remove) {
      const list = remove.dataset.clRemove === "chemical"
        ? selectedChemicals
        : selectedApparatus;

      const index = list.indexOf(remove.dataset.clId);
      if (index !== -1) list.splice(index, 1);

      experimentStarted = false;
      updateLaboratory();
      message("Item removed from the bench.");
      return;
    }

    if (event.target.closest("#clClear")) clearWorkspace();
    if (event.target.closest("#clReset")) resetView();
    if (event.target.closest("#clSave")) saveSetup();
    if (event.target.closest("#clBegin")) beginExperiment();
  });

  function syncWithRoute() {
    const route = location.hash.replace(/^#\/?/, "").toLowerCase();

    if (route === "laboratory") {
      renderLaboratory();
    }
  }

  window.addEventListener("hashchange", syncWithRoute);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncWithRoute, { once: true });
  } else {
    syncWithRoute();
  }

  // Public interface for optional future laboratory modules.
  window.ChemLabDigitalLaboratory = {
    getState() {
      return {
        chemicals: [...selectedChemicals],
        apparatus: [...selectedApparatus],
        experimentStarted,
        activeTab
      };
    },
    openTab(tab) {
      setActiveTab(tab, false);
    },
    render: renderLaboratory
  };
})();

