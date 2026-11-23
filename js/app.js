"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     1. CORE APPLICATION INITIALIZATION
  ===================================== */

  if (!window.ChemLab) {
    console.error("ChemLab core failed to load.");
    return;
  }

  if (!window.ChemLabRouter) {
    console.error("ChemLab router failed to load.");
    return;
  }

  ChemLab.init();

  const yearElement =
    document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  document.documentElement.dataset.theme = "light";

  ChemLabRouter.start();


  /* =====================================
     2. GLOBAL ELEMENTS
  ===================================== */

  const searchToggle =
    document.getElementById("search-toggle");

  const searchOverlay =
    document.getElementById("search-overlay");

  const searchInput =
    document.getElementById("global-search-input");

  const searchResults =
    document.getElementById("search-results");

  const notificationToggle =
    document.getElementById("notification-toggle");

  const notificationPanel =
    document.getElementById("notification-panel");

  const notificationList =
    document.getElementById("notification-list");

  const notificationIndicator =
    document.getElementById("notification-indicator");

  const markAllReadButton =
    document.getElementById("mark-all-read");

  const modalOverlay =
    document.getElementById("modal-overlay");

  const modalTitle =
    document.getElementById("modal-title");

  const modalBody =
    document.getElementById("modal-body");

  const modalActions =
    document.getElementById("modal-actions");


  /* =====================================
     3. GLOBAL SEARCH DATA
  ===================================== */

  const searchItems = [
    {
      title: "Dashboard",
      description: "Your ChemLab workspace.",
      type: "Page",
      route: "dashboard"
    },
    {
      title: "Digital Laboratory",
      description: "Virtual chemistry laboratory workspace.",
      type: "Page",
      route: "laboratory"
    },
    {
      title: "Experiments",
      description: "Guided and independent chemistry experiments.",
      type: "Page",
      route: "experiments"
    },
    {
      title: "Data Analysis",
      description: "Scientific calculations and data interpretation.",
      type: "Page",
      route: "analysis"
    },
    {
      title: "Chemistry Academy",
      description: "SHS and university chemistry learning.",
      type: "Page",
      route: "academy"
    },
    {
      title: "AI Chemistry Tutor",
      description: "Chemistry learning assistance.",
      type: "Page",
      route: "tutor"
    },
    {
      title: "Assessments",
      description: "Chemistry tests and examinations.",
      type: "Page",
      route: "assessments"
    },
    {
      title: "Laboratory Notebook",
      description: "Record observations and scientific notes.",
      type: "Page",
      route: "notebook"
    },
    {
      title: "My Progress",
      description: "Monitor your learning development.",
      type: "Page",
      route: "progress"
    },
    {
      title: "Settings",
      description: "Manage ChemLab preferences.",
      type: "Page",
      route: "settings"
    },
    {
      title: "Atomic Structure",
      description: "Atoms, protons, neutrons and electrons.",
      type: "Topic"
    },
    {
      title: "Chemical Bonding",
      description: "Ionic, covalent and metallic bonding.",
      type: "Topic"
    },
    {
      title: "Acids and Bases",
      description: "Acidity, alkalinity and pH.",
      type: "Topic"
    },
    {
      title: "Stoichiometry",
      description: "Chemical equations and mole calculations.",
      type: "Topic"
    },
    {
      title: "Periodic Table",
      description: "Elements and periodic properties.",
      type: "Topic"
    },
    {
      title: "Chemical Equilibrium",
      description: "Reversible reactions and equilibrium.",
      type: "Topic"
    }
  ];


  /* =====================================
     4. SEARCH FUNCTIONS
  ===================================== */

  function openSearch() {
    if (!searchOverlay) return;

    closeNotifications();

    searchOverlay.classList.add("active");
    searchOverlay.setAttribute("aria-hidden", "false");

    if (searchInput) {
      searchInput.value = "";
      renderSearchResults("");
      searchInput.focus();
    }
  }

  function closeSearch() {
    if (!searchOverlay) return;

    searchOverlay.classList.remove("active");
    searchOverlay.setAttribute("aria-hidden", "true");
  }

  function renderSearchResults(query) {
    if (!searchResults) return;

    searchResults.replaceChildren();

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      const message = document.createElement("p");
      message.textContent =
        "Start typing to search ChemLab pages and chemistry topics.";

      searchResults.appendChild(message);
      return;
    }

    const matches = searchItems.filter(item => {
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery)
      );
    });

    if (matches.length === 0) {
      const message = document.createElement("p");
      message.textContent = "No matching results found.";

      searchResults.appendChild(message);
      return;
    }

    matches.forEach(item => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "search-result";

      const title = document.createElement("strong");
      title.textContent = item.title;

      const description = document.createElement("small");
      description.textContent =
        item.type + " · " + item.description;

      button.append(title, description);

      button.addEventListener("click", () => {
        if (item.route) {
          closeSearch();
          window.location.hash = item.route;
        } else {
          closeSearch();

          ChemLabModal.open(
            item.title,
            item.description +
            " Detailed learning materials will be developed in the Chemistry Academy."
          );
        }
      });

      searchResults.appendChild(button);
    });
  }

  if (searchToggle) {
    searchToggle.addEventListener("click", openSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("input", event => {
      renderSearchResults(event.target.value);
    });
  }


  /* =====================================
     5. NOTIFICATION SYSTEM
  ===================================== */

  let notifications = [
    {
      id: 1,
      title: "Welcome to ChemLab",
      message: "Your digital chemistry learning workspace is ready.",
      read: false
    },
    {
      id: 2,
      title: "Platform Update",
      message: "ChemLab Stage 03 interface has been introduced.",
      read: false
    }
  ];

  function renderNotifications() {
    if (!notificationList) return;

    notificationList.replaceChildren();

    if (notifications.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No notifications available.";

      notificationList.appendChild(empty);
    }

    notifications.forEach(notification => {
      const item = document.createElement("article");
      item.className = "notification-item";

      if (!notification.read) {
        item.classList.add("unread");
      }

      const title = document.createElement("strong");
      title.textContent = notification.title;

      const message = document.createElement("p");
      message.textContent = notification.message;

      item.append(title, message);
      notificationList.appendChild(item);
    });

    updateNotificationIndicator();
  }

  function updateNotificationIndicator() {
    if (!notificationIndicator) return;

    const unreadCount =
      notifications.filter(item => !item.read).length;

    notificationIndicator.style.display =
      unreadCount > 0 ? "block" : "none";
  }

  function openNotifications() {
    if (!notificationPanel) return;

    closeSearch();

    notificationPanel.classList.add("active");
    notificationPanel.setAttribute("aria-hidden", "false");

    if (notificationToggle) {
      notificationToggle.setAttribute("aria-expanded", "true");
    }
  }

  function closeNotifications() {
    if (!notificationPanel) return;

    notificationPanel.classList.remove("active");
    notificationPanel.setAttribute("aria-hidden", "true");

    if (notificationToggle) {
      notificationToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (notificationToggle) {
    notificationToggle.addEventListener(
      "click",
      () => {
        const isOpen =
          notificationPanel.classList.contains("active");

        if (isOpen) {
          closeNotifications();
        } else {
          openNotifications();
        }
      }
    );
  }

  if (markAllReadButton) {
    markAllReadButton.addEventListener("click", () => {
      notifications = notifications.map(item => ({
        ...item,
        read: true
      }));

      renderNotifications();
    });
  }

  renderNotifications();


  /* =====================================
     6. REUSABLE MODAL SYSTEM
  ===================================== */

  const ChemLabModal = {

    open(title, message) {
      if (!modalOverlay || !modalTitle || !modalBody) {
        return;
      }

      closeSearch();
      closeNotifications();

      modalTitle.textContent = title;
      modalBody.textContent = message;

      if (modalActions) {
        modalActions.replaceChildren();

        const closeButton = document.createElement("button");

        closeButton.type = "button";
        closeButton.className = "primary-button";
        closeButton.textContent = "Close";

        closeButton.addEventListener("click", () => {
          this.close();
        });

        modalActions.appendChild(closeButton);
      }

      modalOverlay.classList.add("active");
      modalOverlay.setAttribute("aria-hidden", "false");

      if (modalActions) {
        const closeButton =
          modalActions.querySelector("button");

        if (closeButton) closeButton.focus();
      }
    },

    close() {
      if (!modalOverlay) return;

      modalOverlay.classList.remove("active");
      modalOverlay.setAttribute("aria-hidden", "true");
    }

  };

  window.ChemLabModal = ChemLabModal;


  /* =====================================
     7. CLOSE BUTTONS AND OVERLAYS
  ===================================== */

  document.querySelectorAll("[data-close-overlay]").forEach(button => {
    button.addEventListener("click", () => {
      const targetId =
        button.getAttribute("data-close-overlay");

      const target = document.getElementById(targetId);

      if (target) {
        target.classList.remove("active");
        target.setAttribute("aria-hidden", "true");
      }
    });
  });

  document.querySelectorAll("[data-close-notifications]").forEach(button => {
    button.addEventListener("click", closeNotifications);
  });

  document.querySelectorAll("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => {
      ChemLabModal.close();
    });
  });

  if (searchOverlay) {
    searchOverlay.addEventListener("click", event => {
      if (event.target === searchOverlay) {
        closeSearch();
      }
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", event => {
      if (event.target === modalOverlay) {
        ChemLabModal.close();
      }
    });
  }


  /* =====================================
     8. KEYBOARD SUPPORT
  ===================================== */

  document.addEventListener("keydown", event => {

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {
      event.preventDefault();
      openSearch();
      return;
    }

    if (event.key === "Escape") {
      closeSearch();
      closeNotifications();
      ChemLabModal.close();
    }

  });


  console.info("ChemLab Stage 03 systems initialized.");
  console.info("ChemLab application ready.");

});
