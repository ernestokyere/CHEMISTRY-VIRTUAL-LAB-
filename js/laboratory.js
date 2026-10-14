
/* =====================================================
   CHEMLAB — DIGITAL LABORATORY WORKSPACE
   Additive module: keeps the existing router intact.
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

  let selectedChemicals = [];
  let selectedApparatus = [];
  let experimentStarted = false;

  const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

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
          data-cl-add="${kind}" data-cl-id="${item.id}"
          aria-pressed="${active}">
          <span class="cl-item-icon">${kind === "chemical"
            ? "⚗" : item.icon}</span>
          <span class="cl-item-copy">
            <strong>${escapeHTML(item.name)}</strong>
            <small>${escapeHTML(subtitle)}</small>
          </span>
          <span class="cl-add-mark">${active ? "✓" : "+"}</span>
        </button>`;
    }).join("");
  }

  function renderBenchItems(items, kind) {
    if (!items.length) {
      return `<div class="cl-bench-empty">
        <span>＋</span>
        <strong>Your bench is empty</strong>
        <p>Select items from the libraries to build your workspace.</p>
      </div>`;
    }

    return items.map(item => `
      <div class="cl-bench-item">
        <span>${kind === "chemical" ? "⚗" : item.icon}</span>
        <div>
          <strong>${escapeHTML(item.name)}</strong>
          <small>${kind === "chemical"
            ? escapeHTML(item.formula)
            : "Apparatus"}</small>
        </div>
        <button type="button" class="cl-remove"
          data-cl-remove="${kind}" data-cl-id="${item.id}"
          aria-label="Remove ${escapeHTML(item.name)}">×</button>
      </div>`).join("");
  }

  function renderLaboratory() {
    const host = document.getElementById("appView");
    if (!host) return;

    host.classList.remove("dashboard");
    host.classList.add("route-view");

    host.innerHTML = `
      <style>
        .cl-lab{padding:24px;max-width:1500px;margin:auto;color:var(--text,#edf2ff)}
        .cl-lab *{box-sizing:border-box}
        .cl-lab-head{display:flex;justify-content:space-between;gap:16px;
          align-items:flex-start;flex-wrap:wrap;margin-bottom:22px}
        .cl-lab h1{font-size:clamp(25px,4vw,34px);margin:5px 0 8px}
        .cl-lab p{color:var(--muted,#9eabc3);line-height:1.6}
        .cl-lab .cl-eyebrow{font-size:11px;letter-spacing:1.5px;
          color:#65c9df;font-weight:800}
        .cl-status{padding:9px 12px;border-radius:20px;
          background:#163c32;color:#7ce5b5;font-size:12px}
        .cl-lab-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);
          gap:18px;align-items:start}
        .cl-panel{min-width:0;border:1px solid var(--border,#26334a);
          background:var(--panel,#111b2c);border-radius:16px;padding:18px;
          margin-bottom:18px}
        .cl-panel h2{font-size:17px;margin:0 0 6px}
        .cl-panel-intro{font-size:13px;margin:0 0 15px}
        .cl-library-list{display:grid;gap:8px}
        .cl-library-item{display:flex;align-items:center;gap:11px;width:100%;
          text-align:left;padding:12px;border:1px solid var(--border,#26334a);
          border-radius:11px;background:transparent;color:inherit;cursor:pointer}
        .cl-library-item:hover,.cl-library-item.is-selected{
          border-color:#5b8cff;background:rgba(91,140,255,.09)}
        .cl-item-icon{width:37px;height:37px;display:grid;place-items:center;
          border-radius:10px;background:rgba(91,140,255,.12);font-size:19px;
          flex-shrink:0}
        .cl-item-copy{display:grid;gap:4px;min-width:0;flex:1}
        .cl-item-copy strong,.cl-bench-item strong{font-size:13px}
        .cl-item-copy small,.cl-bench-item small{font-size:11px;
          color:var(--muted,#9eabc3)}
        .cl-add-mark{font-size:19px;color:#76a0ff}
        .cl-search{width:100%;padding:11px 12px;margin:0 0 12px;
          border:1px solid var(--border,#26334a);border-radius:10px;
          background:var(--bg,#080d18);color:inherit;font:inherit}
        .cl-bench{min-height:160px;display:grid;gap:9px}
        .cl-bench-empty{text-align:center;padding:22px 12px;
          border:1px dashed var(--border,#35435c);border-radius:12px}
        .cl-bench-empty span{font-size:26px;color:#7fa5ff}
        .cl-bench-empty strong{display:block;margin-top:8px}
        .cl-bench-empty p{font-size:12px;margin-bottom:0}
        .cl-bench-item{display:flex;align-items:center;gap:11px;padding:12px;
          border-radius:10px;background:var(--bg,#080d18)}
        .cl-bench-item>span{font-size:20px}
        .cl-bench-item>div{display:grid;gap:4px;flex:1}
        .cl-remove{border:0;background:transparent;color:#ff8997;
          font-size:22px;cursor:pointer;padding:4px 8px}
        .cl-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}
        .cl-btn{padding:11px 14px;border-radius:10px;border:1px solid
          var(--border,#35435c);background:transparent;color:inherit;
          cursor:pointer;font:inherit;font-size:13px}
        .cl-btn-primary{background:#315edb;border-color:#315edb;color:white}
        .cl-btn:disabled{opacity:.45;cursor:not-allowed}
        .cl-message{margin-top:13px;padding:12px;border-radius:10px;
          background:rgba(91,140,255,.10);font-size:13px}
        .cl-counts{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
        .cl-count{padding:8px 11px;border-radius:9px;
          background:var(--bg,#080d18);font-size:12px}
        .cl-empty{font-size:13px}
        @media(max-width:760px){
          .cl-lab{padding:14px}
          .cl-lab-grid{grid-template-columns:minmax(0,1fr)}
          .cl-panel{padding:14px}
        }
      </style>

      <div class="cl-lab">
        <header class="cl-lab-head">
          <div>
            <div class="cl-eyebrow">CHEMLAB · DIGITAL LABORATORY</div>
            <h1>Open Laboratory</h1>
            <p>Build a virtual workspace by choosing chemicals and apparatus.</p>
          </div>
          <span class="cl-status" id="clStatus">● Workspace ready</span>
        </header>

        <div class="cl-lab-grid">
          <section>
            <div class="cl-panel">
              <h2>Chemical library</h2>
              <p class="cl-panel-intro">Select a chemical to add it to your bench.</p>
              <input class="cl-search" id="clChemicalSearch"
                type="search" placeholder="Search chemicals..."
                aria-label="Search chemicals">
              <div class="cl-library-list" id="clChemicalList"></div>
            </div>

            <div class="cl-panel">
              <h2>Apparatus library</h2>
              <p class="cl-panel-intro">Choose equipment for your setup.</p>
              <input class="cl-search" id="clApparatusSearch"
                type="search" placeholder="Search apparatus..."
                aria-label="Search apparatus">
              <div class="cl-library-list" id="clApparatusList"></div>
            </div>
          </section>

          <section>
            <div class="cl-panel">
              <h2>Digital laboratory bench</h2>
              <p class="cl-panel-intro">Your selected materials appear here.</p>
              <div class="cl-counts">
                <span class="cl-count" id="clChemicalCount">Chemicals: 0</span>
                <span class="cl-count" id="clApparatusCount">Apparatus: 0</span>
              </div>
              <h3 style="font-size:13px">Selected chemicals</h3>
              <div class="cl-bench" id="clChemicalBench"></div>
              <h3 style="font-size:13px;margin-top:22px">Selected apparatus</h3>
              <div class="cl-bench" id="clApparatusBench"></div>
              <div class="cl-actions">
                <button class="cl-btn" id="clClear">Clear Workspace</button>
                <button class="cl-btn" id="clReset">Reset View</button>
                <button class="cl-btn" id="clSave">Save Setup</button>
                <button class="cl-btn cl-btn-primary" id="clBegin">
                  Begin Experiment
                </button>
              </div>
              <div class="cl-message" id="clMessage" role="status" aria-live="polite">
                Select materials to prepare your workspace.
              </div>
            </div>

            <div class="cl-panel">
              <h2>Experiment status</h2>
              <p class="cl-panel-intro" id="clExperimentStatus">
                No experiment started.
              </p>
              <p style="font-size:12px">
                This workspace is a learning simulation. It does not perform
                real chemical reactions or replace laboratory safety guidance.
              </p>
            </div>
          </section>
        </div>
      </div>`;

    updateLaboratory();
  }

  function updateLaboratory() {
    const chemicalSearch = document.getElementById("clChemicalSearch");
    const apparatusSearch = document.getElementById("clApparatusSearch");
    if (!chemicalSearch || !apparatusSearch) return;

    const cq = chemicalSearch.value.trim().toLowerCase();
    const aq = apparatusSearch.value.trim().toLowerCase();

    document.getElementById("clChemicalList").innerHTML = renderCards(
      chemicals.filter(x => (x.name + x.formula + x.type).toLowerCase().includes(cq)),
      selectedChemicals, "chemical"
    );
    document.getElementById("clApparatusList").innerHTML = renderCards(
      apparatus.filter(x => (x.name + " apparatus").toLowerCase().includes(aq)),
      selectedApparatus, "apparatus"
    );

    document.getElementById("clChemicalBench").innerHTML = renderBenchItems(
      chemicals.filter(x => selectedChemicals.includes(x.id)), "chemical"
    );
    document.getElementById("clApparatusBench").innerHTML = renderBenchItems(
      apparatus.filter(x => selectedApparatus.includes(x.id)), "apparatus"
    );

    document.getElementById("clChemicalCount").textContent =
      "Chemicals: " + selectedChemicals.length;
    document.getElementById("clApparatusCount").textContent =
      "Apparatus: " + selectedApparatus.length;
  }

  function message(text) {
    const box = document.getElementById("clMessage");
    if (box) box.textContent = text;
  }

  function clearWorkspace() {
    selectedChemicals = [];
    selectedApparatus = [];
    experimentStarted = false;
    updateLaboratory();
    document.getElementById("clStatus").textContent = "● Workspace ready";
    document.getElementById("clExperimentStatus").textContent =
      "No experiment started.";
    message("Workspace cleared. Select items to build a new setup.");
  }

  function resetView() {
    const c = document.getElementById("clChemicalSearch");
    const a = document.getElementById("clApparatusSearch");
    if (c) c.value = "";
    if (a) a.value = "";
    updateLaboratory();
    message("Library view reset. Your selected items have been kept.");
  }

  function saveSetup() {
    const setup = {
      chemicals: selectedChemicals,
      apparatus: selectedApparatus,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem("chemlab-lab-setup", JSON.stringify(setup));
      message("Setup saved on this device.");
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
    document.getElementById("clStatus").textContent = "● Simulation active";
    document.getElementById("clExperimentStatus").textContent =
      "Workspace simulation started. No real chemical reaction has been simulated yet.";
    message("Your workspace is ready for the next guided-experiment stage.");
  }

  document.addEventListener("input", event => {
    if (event.target.id === "clChemicalSearch" ||
        event.target.id === "clApparatusSearch") {
      updateLaboratory();
    }
  });

  document.addEventListener("click", event => {
    const add = event.target.closest("[data-cl-add]");
    if (add) {
      const id = add.dataset.clId;
      const list = add.dataset.clAdd === "chemical"
        ? selectedChemicals : selectedApparatus;
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
        ? selectedChemicals : selectedApparatus;
      const index = list.indexOf(remove.dataset.clId);
      if (index !== -1) list.splice(index, 1);
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
    if (route === "laboratory") renderLaboratory();
  }

  window.addEventListener("hashchange", syncWithRoute);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncWithRoute, { once: true });
  } else {
    syncWithRoute();
  }
})();
