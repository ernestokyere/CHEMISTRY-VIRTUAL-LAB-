
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
     2. STAGE 04.4: RESOURCE INFORMATION
  ===================================== */

  const resourceDetails = {

    "water": {
      formula: "H₂O",
      classification: "Inorganic compound",
      properties: "Pure distilled water is a colourless, odourless liquid.",
      educationalUse: "Studied in chemistry when learning about solutions, solubility and the physical properties of water.",
      safety: "Use laboratory-labelled materials. Do not assume laboratory water is suitable for drinking."
    },

    "nacl": {
      formula: "NaCl",
      classification: "Ionic compound (salt)",
      properties: "Sodium chloride is commonly found as a white crystalline solid.",
      educationalUse: "Used to study ionic bonding, crystal structures and aqueous solutions.",
      safety: "Avoid unnecessary contact with eyes. Follow laboratory supervision requirements."
    },

    "bicarbonate": {
      formula: "NaHCO₃",
      classification: "Ionic compound; hydrogen carbonate",
      properties: "Sodium bicarbonate is commonly found as a white crystalline solid.",
      educationalUse: "Studied when learning about salts, acid-base concepts and chemical properties.",
      safety: "Avoid creating or inhaling dust. Follow the product safety information."
    },

    "citric-acid": {
      formula: "C₆H₈O₇",
      classification: "Weak organic acid",
      properties: "Citric acid is a naturally occurring organic acid found in citrus fruits.",
      educationalUse: "Used to study organic acids, molecular structures and acidity.",
      safety: "Avoid eye contact and unnecessary exposure. Use only under appropriate supervision."
    },

    "glucose": {
      formula: "C₆H₁₂O₆",
      classification: "Monosaccharide (simple carbohydrate)",
      properties: "Glucose is a simple sugar and an important energy source in living organisms.",
      educationalUse: "Studied in organic chemistry and biology, particularly carbohydrate structure.",
      safety: "Do not consume laboratory samples. Follow laboratory material-handling rules."
    },

    "litmus": {
      formula: "No single molecular formula",
      classification: "Acid-base indicator mixture",
      properties: "Litmus is a coloured indicator material used to identify acidic and alkaline conditions.",
      educationalUse: "Helps students understand indicators and the properties of acids and bases.",
      safety: "Follow the manufacturer's instructions. Do not taste or consume indicator materials."
    },

    "beaker": {
      formula: "Not applicable",
      classification: "Laboratory glassware",
      properties: "A wide-mouthed cylindrical container, commonly marked with approximate volume graduations.",
      educationalUse: "Used in laboratory demonstrations involving liquid containers, volume estimation and observations.",
      safety: "Check for damage before supervised use. Handle glassware carefully."
    },

    "conical-flask": {
      formula: "Not applicable",
      classification: "Laboratory glassware",
      properties: "A flask with a broad conical body and a narrow neck.",
      educationalUse: "Commonly studied in laboratory equipment identification and analytical chemistry.",
      safety: "Check for cracks and use only under qualified supervision."
    },

    "test-tube": {
      formula: "Not applicable",
      classification: "Laboratory glassware",
      properties: "A narrow cylindrical tube with a rounded bottom.",
      educationalUse: "Used in educational demonstrations and small-scale laboratory observations.",
      safety: "Handle carefully. Never point an open test tube towards anyone during a supervised demonstration."
    },

    "measuring-cylinder": {
      formula: "Not applicable",
      classification: "Volumetric measuring apparatus",
      properties: "A graduated cylindrical vessel designed for measuring liquid volumes.",
      educationalUse: "Helps students learn measurement, scale reading and experimental accuracy.",
      safety: "Use an appropriate measuring cylinder and handle it carefully."
    },

    "dropper": {
      formula: "Not applicable",
      classification: "Liquid-transfer apparatus",
      properties: "A small instrument designed to transfer liquid in drops.",
      educationalUse: "Introduces students to controlled liquid transfer and laboratory equipment.",
      safety: "Avoid cross-contamination. Follow appropriate laboratory procedures."
    },

    "thermometer": {
      formula: "Not applicable",
      classification: "Temperature-measuring instrument",
      properties: "An instrument designed to measure temperature.",
      educationalUse: "Used when studying temperature, thermal energy and changes in physical conditions.",
      safety: "Use an appropriate laboratory thermometer and avoid damaging it."
    },

    "balance": {
      formula: "Not applicable",
      classification: "Mass-measuring instrument",
      properties: "An instrument used to determine the mass of an object or sample.",
      educationalUse: "Helps students understand mass measurement, precision and experimental data.",
      safety: "Follow the instrument's instructions and protect it from damage."
    },

    "goggles": {
      formula: "Not applicable",
      classification: "Personal protective equipment",
      properties: "Protective eyewear designed to help shield the eyes from laboratory hazards.",
      educationalUse: "Introduces students to laboratory safety and personal protective equipment.",
      safety: "Use suitable, properly fitted protective eyewear during supervised practical activities."
    }

  };

  /* =====================================
     3. LABORATORY STATE
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
            item &&
            typeof item.id === "string" &&
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
     4. LABORATORY PAGE
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
     5. INVENTORY DISPLAY
  ===================================== */

  function renderCatalog() {
    const catalog = document.getElementById("lab-catalog");

    if (!catalog) return;

    const matches = inventory.filter(item => {

      const details = resourceDetails[item.id];

      const matchesFilter =
        activeFilter === "all" ||
        item.type === activeFilter;

      const searchText = (
        item.name + " " +
        item.description + " " +
        (details ? details.formula : "") + " " +
        (details ? details.classification : "")
      ).toLowerCase();

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

      const detailsButton = document.createElement("button");
      detailsButton.type = "button";
      detailsButton.className = "lab-details-button";
      detailsButton.dataset.labAction = "details";
      detailsButton.dataset.itemId = item.id;
      detailsButton.textContent = "View Details";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "lab-add-button";
      button.dataset.labAction = "add";
      button.dataset.itemId = item.id;
      button.textContent = "＋ Add to Bench";

      card.append(
        icon,
        title,
        description,
        type,
        detailsButton,
        button
      );

      catalog.appendChild(card);
    });
  }

  /* =====================================
     6. ADVANCED BENCH DISPLAY
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

    const categories = [
      {
        type: "chemical",
        title: "Chemicals"
      },
      {
        type: "apparatus",
        title: "Laboratory Apparatus"
      }
    ];

    categories.forEach(category => {

      const selectedItems = bench.filter(selected => {
        const item = inventoryMap.get(selected.id);

        return item && item.type === category.type;
      });

      if (selectedItems.length === 0) return;

      const section = document.createElement("section");
      section.className = "lab-bench-category";

      const heading = document.createElement("h3");
      heading.textContent = category.title;

      const list = document.createElement("div");
      list.className = "lab-bench-list";

      selectedItems.forEach(selected => {

        const item = inventoryMap.get(selected.id);

        const card = document.createElement("article");
        card.className = "lab-bench-item";

        const details = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent = item.icon + " " + item.name;

        const quantity = document.createElement("small");
        quantity.textContent =
          "Quantity: " + selected.quantity;

        details.append(title, quantity);

        const controls = document.createElement("div");
        controls.className = "lab-quantity-controls";

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.className = "lab-quantity-button";
        decrease.textContent = "−";
        decrease.title = "Decrease quantity";
        decrease.setAttribute(
          "aria-label",
          "Decrease " + item.name + " quantity"
        );
        decrease.dataset.labAction = "decrease";
        decrease.dataset.itemId = item.id;

        const amount = document.createElement("span");
        amount.className = "lab-quantity-value";
        amount.textContent = selected.quantity;

        const increase = document.createElement("button");
        increase.type = "button";
        increase.className = "lab-quantity-button";
        increase.textContent = "+";
        increase.title = "Increase quantity";
        increase.setAttribute(
          "aria-label",
          "Increase " + item.name + " quantity"
        );
        increase.dataset.labAction = "increase";
        increase.dataset.itemId = item.id;

        controls.append(decrease, amount, increase);

        card.append(details, controls);
        list.appendChild(card);
      });

      section.append(heading, list);
      container.appendChild(section);
    });
  }

  /* =====================================
     7. WORKSPACE ACTIONS
  ===================================== */

  function showMessage(title, message) {
    if (window.ChemLabModal) {
      window.ChemLabModal.open(title, message);
    } else {
      window.alert(title + "\n\n" + message);
    }
  }

  /* STAGE 04.4: RESOURCE DETAILS */

  function showResourceDetails(id) {
    const item = inventoryMap.get(id);
    const details = resourceDetails[id];

    if (!item || !details) return;

    const message = [
      "Name: " + item.name,
      "Category: " + item.type,
      "Formula: " + details.formula,
      "Classification: " + details.classification,
      "",
      "DESCRIPTION",
      item.description,
      "",
      "PROPERTIES",
      details.properties,
      "",
      "EDUCATIONAL USE",
      details.educationalUse,
      "",
      "SAFETY INFORMATION",
      details.safety
    ].join("\n");

    showMessage("Resource Information", message);
  }

  function autoSaveBench() {
    const successful = saveBench();

    if (!successful) {
      showMessage(
        "Automatic save failed",
        "Your changes could not be saved on this device. Check your browser storage."
      );
    }

    return successful;
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

    autoSaveBench();
    renderBench();
  }

  function removeItem(id) {
    const existing = bench.find(entry => entry.id === id);

    if (!existing) return;

    existing.quantity -= 1;

    if (existing.quantity <= 0) {
      bench = bench.filter(entry => entry.id !== id);
    }

    autoSaveBench();
    renderBench();
  }

  function clearWorkspace() {
    bench = [];

    autoSaveBench();
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
     8. EVENT HANDLING
  ===================================== */

  document.addEventListener("click", event => {

    const target = event.target;

    if (!(target instanceof Element)) return;

    const filterButton = target.closest(
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

    const actionButton = target.closest(
      "[data-lab-action]"
    );

    if (!actionButton) return;

    const action = actionButton.dataset.labAction;
    const id = actionButton.dataset.itemId;

    if (action === "details") {
      showResourceDetails(id);
      return;
    }

    if (action === "add" || action === "increase") {
      addItem(id);
      return;
    }

    if (action === "remove" || action === "decrease") {
      removeItem(id);
      return;
    }

    if (action === "clear") {
      clearWorkspace();
      return;
    }

    if (action === "save") {
      saveWorkspace();
    }
  });

  document.addEventListener("input", event => {

    if (!event.target || event.target.id !== "lab-search") {
      return;
    }

    searchQuery =
      event.target.value.trim().toLowerCase();

    renderCatalog();
  });

  /* =====================================
     9. PUBLIC LABORATORY MODULE
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
