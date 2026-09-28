/* =========================================================
   CHEMLAB
   USER INTERFACE CONTROLLER
   Stage 1 — Foundation
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    const $ = (selector, parent = document) => {
        return parent.querySelector(selector);
    };


    const $$ = (selector, parent = document) => {
        return Array.from(parent.querySelectorAll(selector));
    };


    const get = (id) => {
        return document.getElementById(id);
    };


    /* =====================================================
       UI STATE
       ===================================================== */

    const UI_STATE = {

        sidebarOpen: false,

        searchOpen: false,

        notificationOpen: false,

        profileOpen: false,

        activeModal: null

    };


    window.CHEMLAB_UI_STATE = UI_STATE;


    /* =====================================================
       CLASS HELPERS
       ===================================================== */

    function addClass(element, className) {

        if (!element) {
            return;
        }

        element.classList.add(className);
    }


    function removeClass(element, className) {

        if (!element) {
            return;
        }

        element.classList.remove(className);
    }


    function toggleClass(element, className, force) {

        if (!element) {
            return;
        }

        element.classList.toggle(className, force);
    }


    /* =====================================================
       SIDEBAR
       ===================================================== */

    function getSidebar() {
        return $(".sidebar");
    }


    function getSidebarOverlay() {
        return $(".sidebar-overlay");
    }


    function openSidebar() {

        const sidebar = getSidebar();
        const overlay = getSidebarOverlay();

        if (!sidebar) {
            return;
        }

        addClass(sidebar, "is-open");

        if (overlay) {
            addClass(overlay, "is-visible");
        }

        UI_STATE.sidebarOpen = true;

        document.body.classList.add("sidebar-open");
    }


    function closeSidebar() {

        const sidebar = getSidebar();
        const overlay = getSidebarOverlay();

        if (!sidebar) {
            return;
        }

        removeClass(sidebar, "is-open");

        if (overlay) {
            removeClass(overlay, "is-visible");
        }

        UI_STATE.sidebarOpen = false;

        document.body.classList.remove("sidebar-open");
    }


    function toggleSidebar() {

        if (UI_STATE.sidebarOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }


    window.openChemLabSidebar = openSidebar;
    window.closeChemLabSidebar = closeSidebar;
    window.toggleChemLabSidebar = toggleSidebar;


    /* =====================================================
       SEARCH
       ===================================================== */

    function getSearchModal() {
        return get("globalSearchModal") || $(".search-modal-wrapper");
    }


    function getSearchInput() {

        return (
            get("globalSearchInput") ||
            get("searchInput") ||
            $(".search-input")
        );

    }


    function openSearch() {

        const modal = getSearchModal();

        if (!modal) {
            return;
        }

        addClass(modal, "is-open");

        UI_STATE.searchOpen = true;

        document.body.classList.add("modal-open");

        const input = getSearchInput();

        if (input) {

            setTimeout(() => {

                input.focus();

                if (typeof input.select === "function") {
                    input.select();
                }

            }, 80);

        }
    }


    function closeSearch() {

        const modal = getSearchModal();

        if (!modal) {
            return;
        }

        removeClass(modal, "is-open");

        UI_STATE.searchOpen = false;

        if (!UI_STATE.activeModal) {
            document.body.classList.remove("modal-open");
        }
    }


    function toggleSearch() {

        if (UI_STATE.searchOpen) {
            closeSearch();
        } else {
            openSearch();
        }
    }


    window.openChemLabSearch = openSearch;
    window.closeChemLabSearch = closeSearch;
    window.toggleChemLabSearch = toggleSearch;


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    function getNotificationPanel() {
        return (
            get("notificationPanel") ||
            $(".notification-panel")
        );
    }


    function closeNotifications() {

        const panel = getNotificationPanel();

        if (!panel) {
            return;
        }

        removeClass(panel, "is-open");

        UI_STATE.notificationOpen = false;
    }


    function openNotifications() {

        const panel = getNotificationPanel();

        if (!panel) {
            return;
        }

        closeProfile();

        addClass(panel, "is-open");

        UI_STATE.notificationOpen = true;
    }


    function toggleNotifications() {

        if (UI_STATE.notificationOpen) {
            closeNotifications();
        } else {
            openNotifications();
        }
    }


    window.openChemLabNotifications = openNotifications;
    window.closeChemLabNotifications = closeNotifications;
    window.toggleChemLabNotifications = toggleNotifications;


    /* =====================================================
       PROFILE PANEL
       ===================================================== */

    function getProfilePanel() {

        return (
            get("profilePanel") ||
            $(".profile-panel")
        );
    }


    function closeProfile() {

        const panel = getProfilePanel();

        if (!panel) {
            return;
        }

        removeClass(panel, "is-open");

        UI_STATE.profileOpen = false;
    }


    function openProfile() {

        const panel = getProfilePanel();

        if (!panel) {
            return;
        }

        closeNotifications();

        addClass(panel, "is-open");

        UI_STATE.profileOpen = true;
    }


    function toggleProfile() {

        if (UI_STATE.profileOpen) {
            closeProfile();
        } else {
            openProfile();
        }
    }


    window.openChemLabProfile = openProfile;
    window.closeChemLabProfile = closeProfile;
    window.toggleChemLabProfile = toggleProfile;


    /* =====================================================
       MODALS
       ===================================================== */

    function openModal(modal) {

        if (!modal) {
            return;
        }

        if (typeof modal === "string") {
            modal = get(modal) || $(modal);
        }

        if (!modal) {
            return;
        }

        addClass(modal, "is-open");

        UI_STATE.activeModal = modal;

        document.body.classList.add("modal-open");
    }


    function closeModal(modal) {

        if (!modal) {
            modal = UI_STATE.activeModal;
        }

        if (!modal) {
            return;
        }

        if (typeof modal === "string") {
            modal = get(modal) || $(modal);
        }

        if (!modal) {
            return;
        }

        removeClass(modal, "is-open");

        if (UI_STATE.activeModal === modal) {
            UI_STATE.activeModal = null;
        }

        if (
            !UI_STATE.searchOpen &&
            !UI_STATE.activeModal
        ) {
            document.body.classList.remove("modal-open");
        }
    }


    function closeAllModals() {

        $$(".modal.is-open").forEach((modal) => {
            removeClass(modal, "is-open");
        });

        UI_STATE.activeModal = null;

        if (!UI_STATE.searchOpen) {
            document.body.classList.remove("modal-open");
        }
    }


    window.openChemLabModal = openModal;
    window.closeChemLabModal = closeModal;
    window.closeAllChemLabModals = closeAllModals;


    /* =====================================================
       TOAST SYSTEM
       ===================================================== */

    function getToastContainer() {

        let container = get("toastContainer");

        if (!container) {

            container = document.createElement("div");

            container.id = "toastContainer";

            container.className = "toast-container";

            document.body.appendChild(container);
        }

        return container;
    }


    function showToast(message, type = "info", duration) {

        if (!message) {
            return;
        }

        const container = getToastContainer();

        const toast = document.createElement("div");

        toast.className = `toast toast-${type}`;

        toast.setAttribute("role", "status");

        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message"></span>
            </div>

            <button
                class="toast-close"
                type="button"
                aria-label="Close notification"
            >
                ×
            </button>
        `;

        const messageElement = $(".toast-message", toast);

        if (messageElement) {
            messageElement.textContent = message;
        }

        container.appendChild(toast);

        requestAnimationFrame(() => {
            addClass(toast, "is-visible");
        });

        const closeButton = $(".toast-close", toast);

        const removeToast = () => {

            removeClass(toast, "is-visible");

            setTimeout(() => {

                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }

            }, 220);
        };

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                removeToast
            );
        }

        const timeout =
            duration ||
            window.CHEMLAB_CONFIG?.ui?.toastDuration ||
            3500;

        setTimeout(removeToast, timeout);
    }


    window.showChemLabToast = showToast;


    /* =====================================================
       ALERT HELPERS
       ===================================================== */

    function showSuccess(message) {
        showToast(message, "success");
    }


    function showError(message) {
        showToast(message, "error");
    }


    function showWarning(message) {
        showToast(message, "warning");
    }


    function showInfo(message) {
        showToast(message, "info");
    }


    window.showChemLabSuccess = showSuccess;
    window.showChemLabError = showError;
    window.showChemLabWarning = showWarning;
    window.showChemLabInfo = showInfo;


    /* =====================================================
       GLOBAL SEARCH
       ===================================================== */

    const SEARCH_INDEX = [

        {
            title: "Dashboard",
            description: "View your ChemLab overview.",
            route: "dashboard",
            keywords: [
                "home",
                "overview",
                "dashboard"
            ]
        },

        {
            title: "Learn",
            description: "Study chemistry concepts and topics.",
            route: "learn",
            keywords: [
                "study",
                "lessons",
                "topics",
                "chemistry"
            ]
        },

        {
            title: "Laboratory",
            description: "Enter the virtual chemistry laboratory.",
            route: "laboratory",
            keywords: [
                "lab",
                "laboratory",
                "chemicals",
                "apparatus"
            ]
        },

        {
            title: "Experiments",
            description: "Explore chemistry experiments.",
            route: "experiments",
            keywords: [
                "experiment",
                "practical",
                "experiments"
            ]
        },

        {
            title: "Analysis",
            description: "Analyze scientific data and results.",
            route: "analysis",
            keywords: [
                "data",
                "graphs",
                "analysis",
                "statistics"
            ]
        },

        {
            title: "AI Tutor",
            description: "Get chemistry learning assistance.",
            route: "ai",
            keywords: [
                "ai",
                "tutor",
                "assistant",
                "question"
            ]
        },

        {
            title: "Lab Notebook",
            description: "Record your laboratory work.",
            route: "notebook",
            keywords: [
                "notebook",
                "notes",
                "report",
                "results"
            ]
        },

        {
            title: "Assessments",
            description: "Complete chemistry assessments.",
            route: "assessments",
            keywords: [
                "quiz",
                "test",
                "assessment",
                "questions"
            ]
        },

        {
            title: "My Progress",
            description: "Track your chemistry mastery.",
            route: "progress",
            keywords: [
                "progress",
                "mastery",
                "performance"
            ]
        },

        {
            title: "ChemLab Premium",
            description: "Explore premium laboratory capabilities.",
            route: "premium",
            keywords: [
                "premium",
                "subscription",
                "advanced"
            ]
        },

        {
            title: "Settings",
            description: "Manage ChemLab preferences.",
            route: "settings",
            keywords: [
                "settings",
                "preferences",
                "account"
            ]
        }

    ];


    function searchChemLab(query) {

        const normalizedQuery =
            String(query || "")
                .trim()
                .toLowerCase();

        if (!normalizedQuery) {
            return SEARCH_INDEX.slice(0, 6);
        }

        return SEARCH_INDEX.filter((item) => {

            const searchableText = [
                item.title,
                item.description,
                item.route,
                ...item.keywords
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
                normalizedQuery
            );

        });

    }


    function renderSearchResults(query) {

        const resultsContainer =
            get("globalSearchResults") ||
            $(".search-results");

        if (!resultsContainer) {
            return;
        }

        const results =
            searchChemLab(query);

        resultsContainer.innerHTML = "";

        if (!results.length) {

            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⌕</div>

                    <h3>No results found</h3>

                    <p>
                        Try searching for a different
                        chemistry feature or section.
                    </p>
                </div>
            `;

            return;
        }

        results.forEach((item) => {

            const result = document.createElement("button");

            result.type = "button";

            result.className = "search-result";

            result.innerHTML = `
                <span class="search-result-icon">⌕</span>

                <span class="search-result-content">
                    <strong>${escapeHTML(item.title)}</strong>

                    <small>
                        ${escapeHTML(item.description)}
                    </small>
                </span>
            `;

            result.addEventListener("click", () => {

                closeSearch();

                if (
                    window.CHEMLAB_ROUTER &&
                    typeof window.CHEMLAB_ROUTER.navigate ===
                    "function"
                ) {

                    window.CHEMLAB_ROUTER.navigate(
                        item.route
                    );

                }

            });

            resultsContainer.appendChild(result);

        });
    }


    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    window.searchChemLab = searchChemLab;
    window.renderChemLabSearchResults = renderSearchResults;


    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    function handleKeyboard(event) {

        /* Escape */

        if (event.key === "Escape") {

            if (UI_STATE.searchOpen) {
                closeSearch();
                return;
            }

            if (UI_STATE.activeModal) {
                closeModal();
                return;
            }

            if (UI_STATE.notificationOpen) {
                closeNotifications();
                return;
            }

            if (UI_STATE.profileOpen) {
                closeProfile();
                return;
            }

            if (UI_STATE.sidebarOpen) {
                closeSidebar();
                return;
            }
        }


        /* Ctrl + K / Command + K */

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            toggleSearch();
        }

    }


    /* =====================================================
       CLICK OUTSIDE HANDLER
       ===================================================== */

    function handleDocumentClick(event) {

        const target = event.target;


        /* Notification panel */

        if (UI_STATE.notificationOpen) {

            const panel =
                getNotificationPanel();

            const trigger =
                target.closest(
                    "[data-action='notifications']"
                );

            if (
                panel &&
                !panel.contains(target) &&
                !trigger
            ) {

                closeNotifications();
            }
        }


        /* Profile panel */

        if (UI_STATE.profileOpen) {

            const panel =
                getProfilePanel();

            const trigger =
                target.closest(
                    "[data-action='profile']"
                );

            if (
                panel &&
                !panel.contains(target) &&
                !trigger
            ) {

                closeProfile();
            }
        }

    }


    /* =====================================================
       EVENT BINDING
       ===================================================== */

    function bindUIEvents() {


        /* -------------------------------------------------
           SIDEBAR
           ------------------------------------------------- */

        $$(
            "[data-action='open-sidebar'], " +
            "[data-action='menu']"
        ).forEach((button) => {

            button.addEventListener(
                "click",
                toggleSidebar
            );

        });


        $$(
            "[data-action='close-sidebar']"
        ).forEach((button) => {

            button.addEventListener(
                "click",
                closeSidebar
            );

        });


        const overlay =
            getSidebarOverlay();

        if (overlay) {

            overlay.addEventListener(
                "click",
                closeSidebar
            );

        }


        /* -------------------------------------------------
           SEARCH
           ------------------------------------------------- */

        $$(
            "[data-action='search']"
        ).forEach((button) => {

            button.addEventListener(
                "click",
                openSearch
            );

        });


        $$(
            "[data-action='close-search']"
        ).forEach((button) => {

            button.addEventListener(
                "click",
                closeSearch
            );

        });


        const searchInput =
            getSearchInput();

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                (event) => {

                    renderSearchResults(
                        event.target.value
                    );

                }
            );

        }


        /* -------------------------------------------------
           NOTIFICATIONS
           ------------------------------------------------- */

        $$(
            "[data-action='notifications']"
        ).forEach((button) => {

            button.addEventListener(
                "click",
                toggleNotifications
            );

        });


        /* -------------------------------------------------
           PROFILE
           ------------------------------------------------- */

        $$(
            "[data-action='profile']"
        ).forEach((button) => {

            button.addEventListener(
                "click",
                toggleProfile
            );

        });


        /* -------------------------------------------------
           MODAL CLOSE BUTTONS
           ------------------------------------------------- */

        $$(
            "[data-action='close-modal']"
        ).forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const modal =
                        button.closest(".modal");

                    closeModal(modal);

                }
            );

        });


        /* -------------------------------------------------
           MODAL BACKDROPS
           ------------------------------------------------- */

        $$(".modal").forEach((modal) => {

            modal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target === modal &&
                        modal.dataset.closeOnBackdrop !== "false"
                    ) {

                        closeModal(modal);

                    }

                }
            );

        });


        /* -------------------------------------------------
           DOCUMENT
           ------------------------------------------------- */

        document.addEventListener(
            "keydown",
            handleKeyboard
        );

        document.addEventListener(
            "click",
            handleDocumentClick
        );


        /* -------------------------------------------------
           MOBILE NAVIGATION
           ------------------------------------------------- */

        $$(".nav-link").forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <=
                        (
                            window.CHEMLAB_CONFIG
                                ?.ui
                                ?.mobileBreakpoint ||
                            992
                        )
                    ) {

                        closeSidebar();

                    }

                }
            );

        });

    }


    /* =====================================================
       RESPONSIVE UI
       ===================================================== */

    function handleResize() {

        const breakpoint =
            window.CHEMLAB_CONFIG
                ?.ui
                ?.mobileBreakpoint || 992;

        if (
            window.innerWidth > breakpoint &&
            UI_STATE.sidebarOpen
        ) {

            closeSidebar();

        }

    }


    /* =====================================================
       INITIAL UI SETUP
       ===================================================== */

    function initializeUI() {

        bindUIEvents();

        window.addEventListener(
            "resize",
            handleResize
        );

        renderSearchResults("");

        CHEMLAB_LOG(
            "UI controller initialized."
        );

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CHEMLAB_UI = {

        state: UI_STATE,

        sidebar: {
            open: openSidebar,
            close: closeSidebar,
            toggle: toggleSidebar
        },

        search: {
            open: openSearch,
            close: closeSearch,
            toggle: toggleSearch,
            search: searchChemLab,
            render: renderSearchResults
        },

        notifications: {
            open: openNotifications,
            close: closeNotifications,
            toggle: toggleNotifications
        },

        profile: {
            open: openProfile,
            close: closeProfile,
            toggle: toggleProfile
        },

        modal: {
            open: openModal,
            close: closeModal,
            closeAll: closeAllModals
        },

        toast: {
            show: showToast,
            success: showSuccess,
            error: showError,
            warning: showWarning,
            info: showInfo
        }

    };


    /* =====================================================
       DOM READY
       ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeUI
        );

    } else {

        initializeUI();

    }

})();
