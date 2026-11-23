
"use strict";

(function (window, document) {

  const STORAGE_KEY = "chemlab-laboratory-bench-v1";

  /* =====================================
     1. LABORATORY INVENTORY
  ===================================== */

  const inventory = [
    {
      id: "water",
      name: "Distilled Water",
      description: "Purified water for educational laboratory studies.",
      type: "chemical",
      icon: "💧"
    },
    {
      id: "nacl",
      name: "Sodium Chloride",
      description: "Common salt; formula NaCl.",
      type: "chemical",
      icon: "🧂"
    },
    {
      id: "bicarbonate",
      name: "Sodium Bicarbonate",
      description: "A commonly studied mild alkaline compound.",
      type: "chemical",
      icon: "⚗️"
    },
    {
      id: "citric-acid",
      name: "Citric Acid",
      description: "A naturally occurring weak organic acid.",
      type: "chemical",
      icon: "🧪"
    },
    {
      id: "glucose",
      name: "Glucose",
      description: "A simple sugar with formula C₆H₁₂O₆.",
      type: "chemical",
      icon: "🍬"
    },
    {
      id: "litmus",
      name: "Litmus Paper",
      description: "An indicator used to study acidic and alkaline solutions.",
      type: "chemical",
      icon: "📄"
    },
    {
      id: "beaker",
      name: "Beaker",
      description: "Laboratory container for holding liquids.",
      type: "apparatus",
      icon: "🥛"
    },
    {
      id: "conical-flask",
      name: "Conical Flask",
      description: "A flask with a narrow neck and conical body.",
      type: "apparatus",
      icon: "⚗️"
    },
    {
      id: "test-tube",
      name: "Test Tube",
      description: "Small tube used in laboratory demonstrations.",
      type: "apparatus",
      icon: "🧪"
    },
    {
      id: "measuring-cylinder",
      name: "Measuring Cylinder",
      description: "Graduated vessel for measuring liquid volume.",
      type: "apparatus",
      icon: "📏"
    },
    {
      id: "dropper",
      name: "Dropper",
      description: "Tool for transferring small amounts of liquid.",
      type: "apparatus",
      icon: "💧"
    },
    {
      id: "thermometer",
      name: "Thermometer",
      description: "Instrument for measuring temperature.",
      type: "apparatus",
      icon: "🌡️"
    },
    {
      id: "balance",
      name: "Laboratory Balance",
      description: "Instrument for measuring mass.",
      type: "apparatus",
      icon: "⚖️"
    },
    {
      id: "goggles",
      name: "Safety Goggles",
      description: "Protective equipment for laboratory activities.",
      type: "apparatus",
      icon: "🥽"
    }
  ];

  const inventoryMap = new Map(
    inventory.map(item => [item.id, item])
  );

  /* =====================================
     2. LABORATORY STATE
  ===================================== */

  let bench = [];
  let activeFilter = "all";
  let searchQuery = "";

  function loadBench() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter(item => {
          return (
            inventoryMap.has(item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            item.quantity <= 99
          );
        })
        .map(item => ({
          id: item.id,
          quantity: item.quantity
        }));

    } catch (error) {
      console.warn("ChemLab: Could not load saved bench.", error);
      return [];
    }
  }

  function saveBench() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(bench)
      );

      return true;

    } catch (error) {
      console.error("ChemLab: Could not save laboratory setup.", error);
      return false;
    }
  }

  /* =====================================
     3. LABORATORY PAGE
  ===================================== */

  function render() {
    bench = loadBench();

    return `
      <section class="lab-workspace">

        <header class="lab-heading">
          <div>
            <span class="eyebrow">DIGITAL LABORATORY</span>
            <h2>Laboratory Workspace</h2>
            <p>
              Organise your virtual laboratory bench
              and explore the available laboratory resources.
            </p>
            <div class="lab-status">Workspace ready</div>
          </div>

          <div class="lab-heading-actions">
            <button
              type="button"
              class="secondary-button"
              data-lab-action="clear">
              Clear Workspace
            </button>

            <button
              type="button"
              class="primary-button"
              data-lab-action="save">
              Save Setup
            </button>
          </div>
        </header>

        <section class="lab-summary">

          <article class="lab-summary-card">
            <span>Available Chemicals</span>
            <strong>6</strong>
          </article>

          <article class="lab-summary-card">
            <span>Available Apparatus</span>
            <strong>8</strong>
          </article>

          <article class="lab-summary-card">
            <span>Items on Your Bench</span>
            <strong id="lab-bench-count">0</strong>
          </article>

        </section>

        <div class="lab-main-grid">

          <section class="lab-panel">

            <div class="lab-panel-header">
              <div>
                <h2>Virtual Laboratory Bench</h2>
                <p>
                  Your selected laboratory resources appear here.
                </p>
              </div>
            </div>

            <div class="lab-bench">
              <div id="lab-bench-items"></div>
            </div>

            <div class="lab-catalog">

              <div class="lab-panel-header">
                <div>
                  <h2>Laboratory Inventory</h2>
                  <p>
                    Select resources to add them to your bench.
                  </p>
                </div>
              </div>

              <div class="lab-catalog-toolbar">

                <input
                  type="search"
                  id="lab-search"
                  class="lab-search"
                  placeholder="Search chemicals or apparatus..."
                  aria-label="Search laboratory inventory">

                <div class="lab-filters">
                  <button
                    type="button"
                    class="lab-filter active"
                    data-lab-filter="all">
                    All
                  </button>

                  <button
                    type="button"
                    class="lab-filter"
                    data-lab-filter="chemical">
                    Chemicals
                  </button>

                  <button
                    type="button"
                    class="lab-filter"
                    data-lab-filter="apparatus">
                    Apparatus
                  </button>
                </div>

              </div>

              <div
                id="lab-catalog"
                class="lab-catalog-grid">
              </div>

            </div>

          </section>

          <aside class="lab-panel">

            <div class="lab-panel-header">
              <div>
                <h2>Workspace Information</h2>
                <p>Your current laboratory setup.</p>
              </div>
            </div>

            <div class="lab-workspace-info">
              <p>
                <strong>Workspace:</strong>
                General Chemistry
              </p>

              <p>
                <strong>Level:</strong>
                SHS and University
              </p>

              <p>
                <strong>Mode:</strong>
                Virtual Workspace
              </p>

              <p>
                <strong>Storage:</strong>
                This device
              </p>
            </div>

            <div class="lab-safety-note">
              <strong>Laboratory Safety Reminder</strong>
              This inventory is an educational interface.
              It does not authorise handling chemicals.
              Practical experiments must be performed only
              under qualified supervision with appropriate
              protective equipment.
            </div>

          </aside>

        </div>

      </section>
    `;
  }

  /* =====================================
     4. INVENTORY DISPLAY
  ===================================== */

  function renderCatalog() {
    const catalog = document.getElementById("lab-catalog");

    if (!catalog) return;

    const matches = inventory.filter(item => {

      const matchesFilter =
        activeFilter === "all" ||
        item.type === activeFilter;

      const searchText =
        (item.name + " " + item.description).toLowerCase();

      const matchesSearch =
        searchText.includes(searchQuery);

      return matchesFilter && matchesSearch;
    });

    catalog.replaceChildren();

    if (matches.length === 0) {
      const empty = document.createElement("p");
      empty.className = "lab-empty-results";
      empty.textContent = "No matching laboratory resources found.";

      catalog.appendChild(empty);
      return;
    }

    matches.forEach(item => {
      const card = document.createElement("article");
      card.className = "lab-catalog-card";

      const icon = document.createElement("div");
      icon.className = "lab-item-icon";
      icon.textContent = item.icon;

      const title = document.createElement("h3");
      title.textContent = item.name;

      const description = document.createElement("p");
      description.textContent = item.description;

      const type = document.createElement("span");
      type.className = "lab-item-type";
      type.textContent = item.type;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "lab-add-button";
      button.dataset.labAction = "add";
      button.dataset.itemId = item.id;
      button.textContent = "＋ Add to Bench";

      card.append(icon, title, description, type, button);
      catalog.appendChild(card);
    });
  }

  /* =====================================
     5. BENCH DISPLAY
  ===================================== */

  function renderBench() {
    const container =
      document.getElementById("lab-bench-items");

    const count =
      document.getElementById("lab-bench-count");

    if (!container || !count) return;

    const totalItems = bench.reduce(
      (total, item) => total + item.quantity,
      0
    );

    count.textContent = totalItems;

    container.replaceChildren();

    if (bench.length === 0) {
      const empty = document.createElement("div");
      empty.className = "lab-bench-empty";

      const icon = document.createElement("div");
      icon.className = "lab-bench-icon";
      icon.textContent = "⚗️";

      const title = document.createElement("strong");
      title.textContent = "Your laboratory bench is empty";

      const description = document.createElement("p");
      description.textContent =
        "Choose chemicals or apparatus from the inventory below.";

      empty.append(icon, title, description);
      container.appendChild(empty);
      return;
    }

    const list = document.createElement("div");
    list.className = "lab-bench-list";

    bench.forEach(selected => {
      const item = inventoryMap.get(selected.id);

      if (!item) return;

      const card = document.createElement("article");
      card.className = "lab-bench-item";

      const details = document.createElement("div");

      const title = document.createElement("strong");
      title.textContent = item.icon + " " + item.name;

      const quantity = document.createElement("small");
      quantity.textContent =
        item.type + " · Quantity: " + selected.quantity;

      details.append(title, quantity);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "lab-remove-button";
      remove.textContent = "−";
      remove.title = "Remove one item";
      remove.setAttribute(
        "aria-label",
        "Remove one " + item.name
      );
      remove.dataset.labAction = "remove";
      remove.dataset.itemId = item.id;

      card.append(details, remove);
      list.appendChild(card);
    });

    container.appendChild(list);
  }

  /* =====================================
     6. WORKSPACE ACTIONS
  ===================================== */

  function showMessage(title, message) {
    if (window.ChemLabModal) {
      window.ChemLabModal.open(title, message);
    } else {
      window.alert(title + "\n\n" + message);
    }
  }

  function addItem(id) {
    const item = inventoryMap.get(id);

    if (!item) return;

    const existing = bench.find(entry => entry.id === id);

    if (existing) {
      if (existing.quantity >= 99) {
        showMessage(
          "Quantity limit reached",
          "The maximum quantity for this item is 99."
        );
        return;
      }

      existing.quantity += 1;

    } else {
      bench.push({
        id,
        quantity: 1
      });
    }

    renderBench();
  }

  function removeItem(id) {
    const existing = bench.find(entry => entry.id === id);

    if (!existing) return;

    existing.quantity -= 1;

    if (existing.quantity <= 0) {
      bench = bench.filter(entry => entry.id !== id);
    }

    renderBench();
  }

  function clearWorkspace() {
    bench = [];
    saveBench();
    renderBench();

    showMessage(
      "Workspace cleared",
      "Your virtual laboratory bench is now empty."
    );
  }

  function saveWorkspace() {
    const successful = saveBench();

    showMessage(
      successful ? "Setup saved" : "Unable to save",
      successful
        ? "Your laboratory setup has been saved on this device."
        : "Your browser could not save the setup. Check available device storage."
    );
  }

  /* =====================================
     7. EVENT HANDLING
  ===================================== */

  document.addEventListener("click", event => {

    const filterButton = event.target.closest(
      "[data-lab-filter]"
    );

    if (filterButton) {
      activeFilter =
        filterButton.dataset.labFilter;

      document.querySelectorAll("[data-lab-filter]")
        .forEach(button => {
          button.classList.toggle(
            "active",
            button.dataset.labFilter === activeFilter
          );
        });

      renderCatalog();
      return;
    }

    const actionButton = event.target.closest(
      "[data-lab-action]"
    );

    if (!actionButton) return;

    const action = actionButton.dataset.labAction;
    const id = actionButton.dataset.itemId;

    if (action === "add") {
      addItem(id);
    }

    if (action === "remove") {
      removeItem(id);
    }

    if (action === "clear") {
      clearWorkspace();
    }

    if (action === "save") {
      saveWorkspace();
    }
  });

  document.addEventListener("input", event => {
    if (event.target.id !== "lab-search") return;

    searchQuery = event.target.value.trim().toLowerCase();

    renderCatalog();
  });

  /* =====================================
     8. PUBLIC LABORATORY MODULE
  ===================================== */

  window.ChemLabLaboratory = {
    render,

    initialize() {
      activeFilter = "all";
      searchQuery = "";

      renderCatalog();
      renderBench();
    },

    inventory
  };

})(window, document);
