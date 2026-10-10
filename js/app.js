/* =========================================================
   CHEMLAB
   APPLICATION CORE
   Version 3.0
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       APPLICATION STATE
       ===================================================== */

    const ChemLab = {

        version: "3.0.0",

        initialized: false,

        currentRoute: "dashboard",

        user: null,

        searchOpen: false

    };


    /* =====================================================
       HELPERS
       ===================================================== */

    function $(selector) {
        return document.querySelector(selector);
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */
   function setupMobileMenu() {

    const menuButton =
        document.querySelector(".mobile-menu");

    const sidebar =
        document.querySelector(".sidebar");

    if (!menuButton || !sidebar) {
        return;
    }

    let backdrop =
        document.querySelector(".chem-mobile-backdrop");

    if (!backdrop) {

        backdrop =
            document.createElement("div");

        backdrop.className =
            "chem-mobile-backdrop";

        document.body.appendChild(backdrop);
    }


    function openMenu() {

        sidebar.classList.add("mobile-open");

        backdrop.classList.add("active");

        document.body.classList.add(
            "mobile-menu-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );
    }


    function closeMenu() {

        sidebar.classList.remove("mobile-open");

        backdrop.classList.remove("active");

        document.body.classList.remove(
            "mobile-menu-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    menuButton.addEventListener(
        "click",
        function () {

            if (
                sidebar.classList.contains(
                    "mobile-open"
                )
            ) {

                closeMenu();

            } else {

                openMenu();

            }

        }
    );


    backdrop.addEventListener(
        "click",
        closeMenu
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                sidebar.classList.contains(
                    "mobile-open"
                )
            ) {

                closeMenu();

            }

        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 800) {

                closeMenu();

            }

        }
    );


    window.ChemLabMobileMenu = {

        open: openMenu,

        close: closeMenu

    };
}

    /* =====================================================
       CLOSE MOBILE MENU AFTER NAVIGATION
       ===================================================== */

    function setupNavigationClosing() {

        document.addEventListener(
            "click",
            function (event) {

                const link =
                    event.target.closest(
                        ".navigation-item"
                    );

                if (!link) {
                    return;
                }

                const sidebar =
                    $(".sidebar");

                if (sidebar) {
                    sidebar.classList.remove("open");
                }

            }
        );

    }


    /* =====================================================
       SIGN IN
       ===================================================== */

    function setupSignInButton() {

        const button =
            $(".sign-in-button");

        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                showToast(
                    "Authentication will be connected in a later stage."
                );

            }
        );

    }


    /* =====================================================
       SEARCH DATA
       ===================================================== */

    const SEARCH_ITEMS = [

        {
            title: "Dashboard",
            description: "ChemLab overview and learning activity",
            route: "dashboard",
            keywords: "home overview stats learning"
        },

        {
            title: "Laboratory",
            description: "Digital chemistry laboratory workspace",
            route: "laboratory",
            keywords: "lab laboratory workspace chemicals apparatus"
        },

        {
            title: "Experiments",
            description: "Explore and create chemistry experiments",
            route: "experiments",
            keywords: "experiment practical practicals chemistry"
        },

        {
            title: "Analysis",
            description: "Analyse experimental scientific data",
            route: "analysis",
            keywords: "analysis data graph calculation results"
        },

        {
            title: "Chemistry Academy",
            description: "Learn chemistry from fundamentals to advanced topics",
            route: "academy",
            keywords: "academy learning lessons chemistry topics"
        },

        {
            title: "AI ChemLab Tutor",
            description: "Intelligent chemistry learning assistant",
            route: "ai-tutor",
            keywords: "ai tutor assistant artificial intelligence help"
        },

        {
            title: "Assessments",
            description: "Test your chemistry knowledge",
            route: "assessments",
            keywords: "quiz test assessment questions"
        },

        {
            title: "Lab Notebook",
            description: "Record observations and laboratory work",
            route: "notebook",
            keywords: "notebook notes observations records"
        },

        {
            title: "My Progress",
            description: "Track chemistry learning progress",
            route: "progress",
            keywords: "progress mastery performance xp"
        },

        {
            title: "Premium",
            description: "Advanced ChemLab laboratory tools",
            route: "premium",
            keywords: "premium advanced subscription"
        },

        {
            title: "Settings",
            description: "Manage ChemLab preferences",
            route: "settings",
            keywords: "settings preferences account"
        }

    ];


    /* =====================================================
       SEARCH MODAL
       ===================================================== */

    function createSearchModal() {

        if ($("#chemLabSearchModal")) {
            return;
        }


        const modal =
            document.createElement("div");

        modal.id =
            "chemLabSearchModal";

        modal.className =
            "chem-search-modal";


        modal.innerHTML = `

            <div class="chem-search-backdrop"></div>

            <div
                class="chem-search-dialog"
                role="dialog"
                aria-modal="true"
                aria-label="Search ChemLab"
            >

                <div class="chem-search-header">

                    <div class="chem-search-input-wrap">

                        <span class="chem-search-icon">
                            ⌕
                        </span>

                        <input
                            type="search"
                            id="chemLabSearchInput"
                            class="chem-search-input"
                            placeholder="Search ChemLab..."
                            autocomplete="off"
                        >

                    </div>

                    <button
                        type="button"
                        class="chem-search-close"
                        aria-label="Close search"
                    >
                        ×
                    </button>

                </div>


                <div
                    class="chem-search-results"
                    id="chemLabSearchResults"
                ></div>


                <div class="chem-search-footer">

                    <span>
                        Search ChemLab
                    </span>

                    <span>
                        ESC to close
                    </span>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        setupSearchEvents();

    }


    /* =====================================================
       SEARCH RESULTS
       ===================================================== */

    function renderSearchResults(query) {

        const container =
            $("#chemLabSearchResults");

        if (!container) {
            return;
        }


        const value =
            query
                .trim()
                .toLowerCase();


        if (!value) {

            container.innerHTML = `

                <div class="chem-search-empty">

                    <div class="chem-search-empty-icon">
                        ⌕
                    </div>

                    <strong>
                        Search ChemLab
                    </strong>

                    <p>
                        Find laboratories, experiments,
                        analysis tools, learning areas and more.
                    </p>

                </div>

            `;

            return;
        }


        const results =
            SEARCH_ITEMS.filter(
                function (item) {

                    const searchable =
                        (
                            item.title +
                            " " +
                            item.description +
                            " " +
                            item.keywords
                        ).toLowerCase();

                    return searchable.includes(value);

                }
            );


        if (!results.length) {

            container.innerHTML = `

                <div class="chem-search-empty">

                    <div class="chem-search-empty-icon">
                        ?
                    </div>

                    <strong>
                        No results found
                    </strong>

                    <p>
                        Try another chemistry-related search.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML =
            results.map(
                function (item) {

                    return `

                        <button
                            type="button"
                            class="chem-search-result"
                            data-search-route="${item.route}"
                        >

                            <span class="chem-search-result-icon">
                                ${getSearchIcon(item.route)}
                            </span>

                            <span class="chem-search-result-content">

                                <strong>
                                    ${item.title}
                                </strong>

                                <small>
                                    ${item.description}
                                </small>

                            </span>

                            <span class="chem-search-arrow">
                                →
                            </span>

                        </button>

                    `;

                }
            ).join("");

    }


    /* =====================================================
       SEARCH ICONS
       ===================================================== */

    function getSearchIcon(route) {

        const icons = {

            dashboard: "⌂",

            laboratory: "⚗",

            experiments: "🧪",

            analysis: "∑",

            academy: "◇",

            "ai-tutor": "✦",

            assessments: "✓",

            notebook: "▤",

            progress: "↗",

            premium: "★",

            settings: "⚙"

        };


        return icons[route] || "•";

    }


    /* =====================================================
       SEARCH EVENTS
       ===================================================== */

    function setupSearchEvents() {

        const modal =
            $("#chemLabSearchModal");

        if (!modal) {
            return;
        }


        const input =
            $("#chemLabSearchInput");


        const closeButton =
            modal.querySelector(
                ".chem-search-close"
            );


        const backdrop =
            modal.querySelector(
                ".chem-search-backdrop"
            );


        if (input) {

            input.addEventListener(
                "input",
                function () {

                    renderSearchResults(
                        input.value
                    );

                }
            );

        }


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeSearch
            );

        }


        if (backdrop) {

            backdrop.addEventListener(
                "click",
                closeSearch
            );

        }


        modal.addEventListener(
            "click",
            function (event) {

                const result =
                    event.target.closest(
                        "[data-search-route]"
                    );

                if (!result) {
                    return;
                }


                const route =
                    result.getAttribute(
                        "data-search-route"
                    );


                closeSearch();


                if (
                    window.ChemLabRouter &&
                    typeof window.ChemLabRouter.navigate === "function"
                ) {

                    window.ChemLabRouter.navigate(
                        route
                    );

                }

            }
        );

    }


    /* =====================================================
       OPEN SEARCH
       ===================================================== */

    function openSearch() {

        createSearchModal();


        const modal =
            $("#chemLabSearchModal");

        const input =
            $("#chemLabSearchInput");


        if (!modal) {
            return;
        }


        modal.classList.add("active");

        ChemLab.searchOpen = true;


        document.body.classList.add(
            "search-open"
        );


        renderSearchResults("");


        setTimeout(
            function () {

                if (input) {
                    input.focus();
                }

            },
            50
        );

    }


    /* =====================================================
       CLOSE SEARCH
       ===================================================== */

    function closeSearch() {

        const modal =
            $("#chemLabSearchModal");

        if (!modal) {
            return;
        }


        modal.classList.remove("active");

        ChemLab.searchOpen = false;


        document.body.classList.remove(
            "search-open"
        );

    }


    /* =====================================================
       SEARCH BUTTON
       ===================================================== */

    function setupSearch() {

        const button =
            $(".search-button");

        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                openSearch();

            }
        );


        document.addEventListener(
            "keydown",
            function (event) {

                /*
                 * CTRL + K
                 */

                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key.toLowerCase() === "k"
                ) {

                    event.preventDefault();

                    openSearch();

                }


                /*
                 * ESC
                 */

                if (
                    event.key === "Escape" &&
                    ChemLab.searchOpen
                ) {

                    closeSearch();

                }

            }
        );

    }

   /* =====================================================
   NOTIFICATION SYSTEM
   ===================================================== */

const NOTIFICATIONS = [

    {
        id: 1,
        title: "Welcome to ChemLab",
        message:
            "Your professional digital chemistry laboratory is ready.",
        time: "Just now",
        type: "system",
        read: false
    },

    {
        id: 2,
        title: "Chemistry Academy",
        message:
            "Your learning workspace is ready for your first chemistry lesson.",
        time: "Today",
        type: "learning",
        read: false
    },

    {
        id: 3,
        title: "Laboratory",
        message:
            "Explore the digital laboratory and experiment workspace.",
        time: "Today",
        type: "laboratory",
        read: false
    }

];


function getNotificationIcon(type) {

    const icons = {

        system: "◈",

        learning: "◇",

        laboratory: "⚗",

        experiment: "🧪",

        assessment: "✓"

    };

    return icons[type] || "•";
}


function createNotificationPanel() {

    if (
        document.querySelector(
            "#chemLabNotificationPanel"
        )
    ) {
        return;
    }


    const panel =
        document.createElement("div");

    panel.id =
        "chemLabNotificationPanel";

    panel.className =
        "chem-notification-panel";


    panel.innerHTML = `

        <div class="chem-notification-header">

            <div>

                <strong>
                    Notifications
                </strong>

                <span
                    id="chemNotificationCount"
                    class="chem-notification-count"
                >
                    0
                </span>

            </div>

            <button
                type="button"
                id="chemMarkNotificationsRead"
                class="chem-notification-mark"
            >
                Mark all read
            </button>

        </div>


        <div
            id="chemNotificationList"
            class="chem-notification-list"
        ></div>


        <div class="chem-notification-footer">

            <span>
                ChemLab Activity
            </span>

        </div>

    `;


    document.body.appendChild(panel);


    renderNotifications();


    const markButton =
        document.querySelector(
            "#chemMarkNotificationsRead"
        );


    if (markButton) {

        markButton.addEventListener(
            "click",
            function () {

                NOTIFICATIONS.forEach(
                    function (notification) {

                        notification.read = true;

                    }
                );


                renderNotifications();

                showToast(
                    "All notifications marked as read."
                );

            }
        );

    }

}


function renderNotifications() {

    const list =
        document.querySelector(
            "#chemNotificationList"
        );

    const count =
        document.querySelector(
            "#chemNotificationCount"
        );


    if (!list) {
        return;
    }


    const unread =
        NOTIFICATIONS.filter(
            function (notification) {

                return !notification.read;

            }
        ).length;


    if (count) {

        count.textContent =
            unread;

        count.style.display =
            unread > 0
                ? "inline-flex"
                : "none";

    }


    if (!NOTIFICATIONS.length) {

        list.innerHTML = `

            <div class="chem-notification-empty">

                <div class="chem-notification-empty-icon">
                    ✓
                </div>

                <strong>
                    You're all caught up
                </strong>

                <p>
                    New ChemLab activity will appear here.
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML =
        NOTIFICATIONS.map(
            function (notification) {

                return `

                    <button
                        type="button"
                        class="
                            chem-notification-item
                            ${notification.read ? "read" : "unread"}
                        "
                        data-notification-id="${notification.id}"
                    >

                        <span
                            class="
                                chem-notification-icon
                                ${notification.type}
                            "
                        >
                            ${getNotificationIcon(
                                notification.type
                            )}
                        </span>


                        <span
                            class="chem-notification-content"
                        >

                            <strong>
                                ${notification.title}
                            </strong>

                            <small>
                                ${notification.message}
                            </small>

                            <time>
                                ${notification.time}
                            </time>

                        </span>


                        ${
                            notification.read
                                ? ""
                                : `
                                    <span
                                        class="chem-notification-unread-dot"
                                    ></span>
                                `
                        }

                    </button>

                `;

            }
        ).join("");


    const items =
        list.querySelectorAll(
            "[data-notification-id]"
        );


    items.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            item.getAttribute(
                                "data-notification-id"
                            )
                        );


                    const notification =
                        NOTIFICATIONS.find(
                            function (entry) {

                                return entry.id === id;

                            }
                        );


                    if (notification) {

                        notification.read = true;

                        renderNotifications();

                    }

                }
            );

        }
    );

}


function openNotifications() {

    createNotificationPanel();


    const panel =
        document.querySelector(
            "#chemLabNotificationPanel"
        );


    if (!panel) {
        return;
    }


    panel.classList.add("active");

}


function closeNotifications() {

    const panel =
        document.querySelector(
            "#chemLabNotificationPanel"
        );


    if (!panel) {
        return;
    }


    panel.classList.remove("active");

}


function setupNotifications() {

    const button =
        document.querySelector(
            ".notification-button"
        );


    if (!button) {

        console.warn(
            "ChemLab notification button was not found."
        );

        return;

    }


    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const panel =
                document.querySelector(
                    "#chemLabNotificationPanel"
                );


            if (
                panel &&
                panel.classList.contains("active")
            ) {

                closeNotifications();

            } else {

                openNotifications();

            }

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            const panel =
                document.querySelector(
                    "#chemLabNotificationPanel"
                );


            if (!panel) {
                return;
            }


            if (
                !panel.contains(event.target) &&
                !button.contains(event.target)
            ) {

                closeNotifications();

            }

        }
    );

}

   /* =========================================================
   CHEMLAB MODAL SYSTEM
   ========================================================= */

function createModalSystem() {

    if (document.querySelector("#chemLabModal")) {
        return;
    }


    const modal =
        document.createElement("div");

    modal.id =
        "chemLabModal";

    modal.className =
        "chem-modal";


    modal.innerHTML = `

        <div
            class="chem-modal-backdrop"
            data-modal-close
        ></div>


        <div
            class="chem-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chemModalTitle"
        >

            <div class="chem-modal-header">

                <div>

                    <span
                        class="chem-modal-eyebrow"
                        id="chemModalEyebrow"
                    >
                        CHEMLAB
                    </span>

                    <h2 id="chemModalTitle">
                        ChemLab
                    </h2>

                </div>


                <button
                    type="button"
                    class="chem-modal-close"
                    aria-label="Close dialog"
                    data-modal-close
                >
                    ×
                </button>

            </div>


            <div
                class="chem-modal-body"
                id="chemModalBody"
            ></div>


            <div
                class="chem-modal-footer"
                id="chemModalFooter"
            ></div>

        </div>

    `;


    document.body.appendChild(modal);


    setupModalEvents();

}


/* =========================================================
   MODAL EVENTS
   ========================================================= */

function setupModalEvents() {

    const modal =
        document.querySelector(
            "#chemLabModal"
        );


    if (!modal) {
        return;
    }


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest(
                    "[data-modal-close]"
                )
            ) {

                closeModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeModal();

            }

        }
    );

}


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openModal(options) {

    createModalSystem();


    const modal =
        document.querySelector(
            "#chemLabModal"
        );


    if (!modal) {
        return;
    }


    const eyebrow =
        document.querySelector(
            "#chemModalEyebrow"
        );


    const title =
        document.querySelector(
            "#chemModalTitle"
        );


    const body =
        document.querySelector(
            "#chemModalBody"
        );


    const footer =
        document.querySelector(
            "#chemModalFooter"
        );


    options =
        options || {};


    if (eyebrow) {

        eyebrow.textContent =
            options.eyebrow ||
            "CHEMLAB";

    }


    if (title) {

        title.textContent =
            options.title ||
            "ChemLab";

    }


    if (body) {

        body.innerHTML =
            options.content ||
            "";

    }


    if (footer) {

        footer.innerHTML =
            options.footer ||
            "";

    }


    modal.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );


    /*
     * Focus the first usable element.
     */

    setTimeout(
        function () {

            const firstInput =
                modal.querySelector(
                    "input, select, textarea, button:not(.chem-modal-close)"
                );


            if (firstInput) {
                firstInput.focus();
            }

        },
        50
    );

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    const modal =
        document.querySelector(
            "#chemLabModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   CONFIRMATION DIALOG
   ========================================================= */

function showConfirmation(options) {

    options =
        options || {};


    openModal({

        eyebrow:
            options.eyebrow ||
            "CONFIRM ACTION",

        title:
            options.title ||
            "Are you sure?",

        content: `

            <div class="chem-confirmation">

                <div class="chem-confirmation-icon">
                    !
                </div>

                <p>
                    ${
                        options.message ||
                        "Please confirm this action."
                    }
                </p>

            </div>

        `,

        footer: `

            <button
                type="button"
                class="toolbar-button chem-modal-secondary"
                data-modal-close
            >
                Cancel
            </button>


            <button
                type="button"
                class="toolbar-button chem-modal-primary"
                id="chemConfirmAction"
            >
                ${
                    options.confirmText ||
                    "Confirm"
                }
            </button>

        `

    });


    const confirmButton =
        document.querySelector(
            "#chemConfirmAction"
        );


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            function () {

                closeModal();


                if (
                    typeof options.onConfirm ===
                    "function"
                ) {

                    options.onConfirm();

                }

            }
        );

    }

}


/* =========================================================
   EXPOSE MODAL API
   ========================================================= */

window.ChemLabModal = {

    open: openModal,

    close: closeModal,

    confirm: showConfirmation

};

   /* =========================================================
   CHEMLAB LOADING SYSTEM
   ========================================================= */

function createLoadingSystem() {

    if (document.querySelector("#chemLabLoader")) {
        return;
    }

    const loader = document.createElement("div");

    loader.id = "chemLabLoader";
    loader.className = "chem-loader";

    loader.innerHTML = `
        <div class="chem-loader-backdrop"></div>

        <div class="chem-loader-card">

            <div class="chem-loader-spinner">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div class="chem-loader-content">

                <strong id="chemLoaderTitle">
                    Loading ChemLab
                </strong>

                <span id="chemLoaderMessage">
                    Preparing your laboratory workspace...
                </span>

            </div>

        </div>
    `;

    document.body.appendChild(loader);
}


/* =========================================================
   SHOW LOADER
   ========================================================= */

function showLoader(options) {

    createLoadingSystem();

    const loader = document.querySelector("#chemLabLoader");

    if (!loader) {
        return;
    }

    options = options || {};

    const title = document.querySelector("#chemLoaderTitle");
    const message = document.querySelector("#chemLoaderMessage");

    if (title) {
        title.textContent =
            options.title || "Loading ChemLab";
    }

    if (message) {
        message.textContent =
            options.message ||
            "Preparing your laboratory workspace...";
    }

    loader.classList.add("active");

    document.body.classList.add("loader-open");
}


/* =========================================================
   HIDE LOADER
   ========================================================= */

function hideLoader() {

    const loader = document.querySelector("#chemLabLoader");

    if (!loader) {
        return;
    }

    loader.classList.remove("active");

    document.body.classList.remove("loader-open");
}


/* =========================================================
   PUBLIC LOADER API
   ========================================================= */

window.ChemLabLoader = {

    show: showLoader,

    hide: hideLoader

};
   
    /* =====================================================
       TOAST SYSTEM
       ===================================================== */

    function showToast(message) {

        let container =
            $("#chemLabToastContainer");


        if (!container) {

            container =
                document.createElement("div");

            container.id =
                "chemLabToastContainer";

            container.className =
                "chem-toast-container";

            document.body.appendChild(
                container
            );

        }


        const toast =
            document.createElement("div");

        toast.className =
            "chem-toast";

        toast.textContent =
            message;


        container.appendChild(
            toast
        );


        setTimeout(
            function () {

                toast.classList.add(
                    "closing"
                );

                setTimeout(
                    function () {

                        toast.remove();

                    },
                    250
                );

            },
            3000
        );

    }


    /* =====================================================
       ROUTE TRACKING
       ===================================================== */

    function setupRouteTracking() {

        window.addEventListener(
            "hashchange",
            function () {

                ChemLab.currentRoute =
                    window.location.hash
                        .replace("#", "")
                        .trim()
                        .toLowerCase() ||
                    "dashboard";

            }
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initialize() {

        if (ChemLab.initialized) {
            return;
        }


        /*
         * Make ChemLab globally available
         * before the router starts.
         */

        window.ChemLab =
            ChemLab;


        setupMobileMenu();
setupNavigationClosing();
setupSignInButton();
setupSearch();
setupNotifications();
createModalSystem();
createLoadingSystem();
setupRouteTracking();
       
        /*
         * Start router AFTER application
         * systems are available.
         */

        if (
            window.ChemLabRouter &&
            typeof window.ChemLabRouter.initialize ===
                "function"
        ) {

            window.ChemLabRouter.initialize();

        } else {

            console.error(
                "ChemLab Router was not loaded."
            );

        }


        ChemLab.initialized =
            true;


        console.log(
            "ChemLab initialized successfully.",
            ChemLab.version
        );

    }


    /* =====================================================
       START APPLICATION
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }


})();

/* =========================================================
   CHEMLAB
   STAGE 4.2 — INTERACTIVE LABORATORY LIBRARY
   Chemical + Apparatus Selection Engine
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       STATE
       ===================================================== */

    const LAB_STATE = {
        chemicals: [],
        apparatus: [],
        chemicalFilter: "all",
        apparatusFilter: "all",
        chemicalSearch: "",
        apparatusSearch: ""
    };


    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE_KEY = "chemlab-laboratory-workspace";


    function saveLabState() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    chemicals: LAB_STATE.chemicals,
                    apparatus: LAB_STATE.apparatus
                })
            );
        } catch (error) {
            console.warn("ChemLab: unable to save laboratory state.", error);
        }
    }


    function loadLabState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return;
            }

            const parsed = JSON.parse(saved);

            LAB_STATE.chemicals =
                Array.isArray(parsed.chemicals)
                    ? parsed.chemicals
                    : [];

            LAB_STATE.apparatus =
                Array.isArray(parsed.apparatus)
                    ? parsed.apparatus
                    : [];

        } catch (error) {
            console.warn("ChemLab: unable to restore laboratory state.", error);

            LAB_STATE.chemicals = [];
            LAB_STATE.apparatus = [];
        }
    }


    /* =====================================================
       HELPERS
       ===================================================== */

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getLabView() {
        return document.querySelector(".laboratory-view");
    }


    function getChemicalLibrary() {
        return document.querySelector(".laboratory-library-list");
    }


    function getApparatusLibrary() {
        return document.querySelector(
            ".laboratory-apparatus-card"
        )
            ? document.querySelector(
                ".laboratory-apparatus-card"
            ).parentElement
            : null;
    }


    /* =====================================================
       CHEMICAL DATA
       ===================================================== */

    const CHEMICALS = [
        {
            id: "hcl",
            name: "Hydrochloric Acid",
            formula: "HCl",
            category: "acid",
            icon: "A"
        },
        {
            id: "h2so4",
            name: "Sulfuric Acid",
            formula: "H₂SO₄",
            category: "acid",
            icon: "A"
        },
        {
            id: "naoh",
            name: "Sodium Hydroxide",
            formula: "NaOH",
            category: "base",
            icon: "B"
        },
        {
            id: "koh",
            name: "Potassium Hydroxide",
            formula: "KOH",
            category: "base",
            icon: "B"
        },
        {
            id: "nacl",
            name: "Sodium Chloride",
            formula: "NaCl",
            category: "salt",
            icon: "S"
        },
        {
            id: "phenolphthalein",
            name: "Phenolphthalein",
            formula: "C₂₀H₁₄O₄",
            category: "indicator",
            icon: "I"
        },
        {
            id: "methyl-orange",
            name: "Methyl Orange",
            formula: "C₁₄H₁₄N₃NaO₃S",
            category: "indicator",
            icon: "I"
        },
        {
            id: "water",
            name: "Distilled Water",
            formula: "H₂O",
            category: "solvent",
            icon: "W"
        }
    ];


    /* =====================================================
       APPARATUS DATA
       ===================================================== */

    const APPARATUS = [
        {
            id: "beaker",
            name: "Beaker",
            type: "glassware",
            icon: "B"
        },
        {
            id: "conical-flask",
            name: "Conical Flask",
            type: "glassware",
            icon: "F"
        },
        {
            id: "test-tube",
            name: "Test Tube",
            type: "glassware",
            icon: "T"
        },
        {
            id: "burette",
            name: "Burette",
            type: "measurement",
            icon: "U"
        },
        {
            id: "pipette",
            name: "Pipette",
            type: "measurement",
            icon: "P"
        },
        {
            id: "measuring-cylinder",
            name: "Measuring Cylinder",
            type: "measurement",
            icon: "C"
        },
        {
            id: "electronic-balance",
            name: "Electronic Balance",
            type: "measurement",
            icon: "E"
        },
        {
            id: "tripod-stand",
            name: "Tripod Stand",
            type: "support",
            icon: "S"
        }
    ];


    /* =====================================================
       FIND ITEMS
       ===================================================== */

    function findChemical(id) {
        return CHEMICALS.find(function (item) {
            return item.id === id;
        });
    }


    function findApparatus(id) {
        return APPARATUS.find(function (item) {
            return item.id === id;
        });
    }


    /* =====================================================
       SELECTION CHECKS
       ===================================================== */

    function isChemicalSelected(id) {
        return LAB_STATE.chemicals.some(function (item) {
            return item.id === id;
        });
    }


    function isApparatusSelected(id) {
        return LAB_STATE.apparatus.some(function (item) {
            return item.id === id;
        });
    }


    /* =====================================================
       ADD CHEMICAL
       ===================================================== */

    function addChemical(id) {
        const chemical = findChemical(id);

        if (!chemical) {
            return;
        }

        if (isChemicalSelected(id)) {
            showLabToast(
                chemical.name + " is already on the laboratory bench."
            );
            return;
        }

        LAB_STATE.chemicals.push({
            id: chemical.id,
            name: chemical.name,
            formula: chemical.formula,
            category: chemical.category
        });

        saveLabState();
        renderLaboratoryState();

        showLabToast(
            chemical.name + " added to the laboratory."
        );
    }


    /* =====================================================
       REMOVE CHEMICAL
       ===================================================== */

    function removeChemical(id) {
        const chemical = findChemical(id);

        LAB_STATE.chemicals =
            LAB_STATE.chemicals.filter(function (item) {
                return item.id !== id;
            });

        saveLabState();
        renderLaboratoryState();

        if (chemical) {
            showLabToast(
                chemical.name + " removed from the laboratory."
            );
        }
    }


    /* =====================================================
       ADD APPARATUS
       ===================================================== */

    function addApparatus(id) {
        const apparatus = findApparatus(id);

        if (!apparatus) {
            return;
        }

        if (isApparatusSelected(id)) {
            showLabToast(
                apparatus.name + " is already on the laboratory bench."
            );
            return;
        }

        LAB_STATE.apparatus.push({
            id: apparatus.id,
            name: apparatus.name,
            type: apparatus.type
        });

        saveLabState();
        renderLaboratoryState();

        showLabToast(
            apparatus.name + " added to the laboratory."
        );
    }


    /* =====================================================
       REMOVE APPARATUS
       ===================================================== */

    function removeApparatus(id) {
        const apparatus = findApparatus(id);

        LAB_STATE.apparatus =
            LAB_STATE.apparatus.filter(function (item) {
                return item.id !== id;
            });

        saveLabState();
        renderLaboratoryState();

        if (apparatus) {
            showLabToast(
                apparatus.name + " removed from the laboratory."
            );
        }
    }


    /* =====================================================
       CLEAR WORKSPACE
       ===================================================== */

    function clearWorkspace() {
        if (
            LAB_STATE.chemicals.length === 0 &&
            LAB_STATE.apparatus.length === 0
        ) {
            showLabToast("The laboratory workspace is already empty.");
            return;
        }

        LAB_STATE.chemicals = [];
        LAB_STATE.apparatus = [];

        saveLabState();
        renderLaboratoryState();

        showLabToast("Laboratory workspace cleared.");
    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showLabToast(message) {
        if (
            window.ChemLab &&
            typeof window.ChemLab.showToast === "function"
        ) {
            window.ChemLab.showToast(message);
            return;
        }

        let toast = document.querySelector("#chemLabLabToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "chemLabLabToast";
            toast.className = "chem-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("active");

        clearTimeout(toast._timeout);

        toast._timeout = setTimeout(function () {
            toast.classList.remove("active");
        }, 2500);
    }


    /* =====================================================
       CHEMICAL LIBRARY RENDERING
       ===================================================== */

    function renderChemicalLibrary() {
        const container = getChemicalLibrary();

        if (!container) {
            return;
        }

        const search =
            LAB_STATE.chemicalSearch.trim().toLowerCase();

        const filtered = CHEMICALS.filter(function (chemical) {

            const matchesCategory =
                LAB_STATE.chemicalFilter === "all" ||
                chemical.category === LAB_STATE.chemicalFilter;

            const matchesSearch =
                !search ||
                chemical.name.toLowerCase().includes(search) ||
                chemical.formula.toLowerCase().includes(search);

            return matchesCategory && matchesSearch;
        });


        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="laboratory-library-empty">
                    <div class="laboratory-library-empty-icon">⌕</div>
                    <strong>No chemicals found</strong>
                    <span>Try another search or category.</span>
                </div>
            `;

            return;
        }


        container.innerHTML = filtered.map(function (chemical) {

            const selected = isChemicalSelected(chemical.id);

            return `
                <article
                    class="laboratory-material-card ${
                        selected ? "is-selected" : ""
                    }"
                    data-chemical-id="${escapeHTML(chemical.id)}"
                >

                    <div class="material-icon ${escapeHTML(chemical.category)}">
                        ${escapeHTML(chemical.icon)}
                    </div>

                    <div class="material-information">

                        <strong>
                            ${escapeHTML(chemical.name)}
                        </strong>

                        <span>
                            ${escapeHTML(chemical.formula)}
                        </span>

                        <small>
                            ${escapeHTML(chemical.category)}
                        </small>

                    </div>

                    <button
                        type="button"
                        class="material-add ${
                            selected ? "is-added" : ""
                        }"
                        data-add-chemical="${escapeHTML(chemical.id)}"
                        ${selected ? "disabled" : ""}
                    >
                        ${selected ? "Added" : "Add"}
                    </button>

                </article>
            `;
        }).join("");
    }


    /* =====================================================
       APPARATUS LIBRARY RENDERING
       ===================================================== */

    function renderApparatusLibrary() {
        const cards = document.querySelectorAll(
            ".laboratory-apparatus-card"
        );

        if (!cards.length) {
            return;
        }

        cards.forEach(function (card) {

            const id =
                card.getAttribute("data-apparatus-id");

            if (!id) {
                return;
            }

            const apparatus = findApparatus(id);

            if (!apparatus) {
                return;
            }

            const selected =
                isApparatusSelected(apparatus.id);

            card.classList.toggle("is-selected", selected);

            const button =
                card.querySelector("[data-add-apparatus]");

            if (button) {
                button.disabled = selected;
                button.textContent =
                    selected ? "Added" : "Add";
                button.classList.toggle(
                    "is-added",
                    selected
                );
            }
        });


        const apparatusContainer =
            document.querySelector(
                ".laboratory-apparatus-library"
            );

        if (apparatusContainer) {

            const search =
                LAB_STATE.apparatusSearch
                    .trim()
                    .toLowerCase();

            const cardsToDisplay =
                APPARATUS.filter(function (apparatus) {

                    const categoryMatch =
                        LAB_STATE.apparatusFilter === "all" ||
                        apparatus.type === LAB_STATE.apparatusFilter;

                    const searchMatch =
                        !search ||
                        apparatus.name
                            .toLowerCase()
                            .includes(search);

                    return categoryMatch && searchMatch;
                });

            const allowedIds =
                cardsToDisplay.map(function (item) {
                    return item.id;
                });

            cards.forEach(function (card) {
                const id =
                    card.getAttribute("data-apparatus-id");

                card.style.display =
                    allowedIds.includes(id)
                        ? ""
                        : "none";
            });
        }
    }


    /* =====================================================
       SELECTED MATERIALS
       ===================================================== */

    function renderSelectedMaterials() {
        const container =
            document.querySelector(
                ".selection-summary-list"
            );

        if (!container) {
            return;
        }


        if (
            LAB_STATE.chemicals.length === 0 &&
            LAB_STATE.apparatus.length === 0
        ) {
            container.innerHTML = `
                <div class="selection-empty">
                    <div class="selection-empty-icon">＋</div>
                    <strong>No items selected</strong>
                    <span>
                        Add chemicals or apparatus from the libraries.
                    </span>
                </div>
            `;

            return;
        }


        const chemicalHTML =
            LAB_STATE.chemicals.map(function (chemical) {
                return `
                    <div class="selection-item">

                        <div>
                            <strong>
                                ${escapeHTML(chemical.name)}
                            </strong>

                            <span>
                                ${escapeHTML(chemical.formula)}
                            </span>
                        </div>

                        <button
                            type="button"
                            class="selection-remove"
                            data-remove-chemical="${escapeHTML(
                                chemical.id
                            )}"
                            aria-label="Remove ${escapeHTML(
                                chemical.name
                            )}"
                        >
                            ×
                        </button>

                    </div>
                `;
            }).join("");


        const apparatusHTML =
            LAB_STATE.apparatus.map(function (apparatus) {
                return `
                    <div class="selection-item">

                        <div>
                            <strong>
                                ${escapeHTML(apparatus.name)}
                            </strong>

                            <span>
                                ${escapeHTML(apparatus.type)}
                            </span>
                        </div>

                        <button
                            type="button"
                            class="selection-remove"
                            data-remove-apparatus="${escapeHTML(
                                apparatus.id
                            )}"
                            aria-label="Remove ${escapeHTML(
                                apparatus.name
                            )}"
                        >
                            ×
                        </button>

                    </div>
                `;
            }).join("");


        container.innerHTML =
            chemicalHTML + apparatusHTML;
    }


    /* =====================================================
       BENCH
       ===================================================== */

    function renderBench() {
        const bench =
            document.querySelector(".digital-lab-bench");

        if (!bench) {
            return;
        }

        const emptyState =
            bench.querySelector(".lab-empty-workspace");

        const selectedContainer =
            bench.querySelector(".lab-selected-materials");

        const total =
            LAB_STATE.chemicals.length +
            LAB_STATE.apparatus.length;


        if (total === 0) {

            if (emptyState) {
                emptyState.style.display = "";
            }

            if (selectedContainer) {
                selectedContainer.innerHTML = "";
                selectedContainer.style.display = "none";
            }

            return;
        }


        if (emptyState) {
            emptyState.style.display = "none";
        }


        if (!selectedContainer) {
            return;
        }


        selectedContainer.style.display = "grid";


        selectedContainer.innerHTML = `

            ${LAB_STATE.chemicals.map(function (chemical) {
                return `
                    <div
                        class="bench-item bench-chemical"
                        data-bench-chemical="${escapeHTML(
                            chemical.id
                        )}"
                    >
                        <span class="bench-item-type">
                            CHEMICAL
                        </span>

                        <strong>
                            ${escapeHTML(chemical.name)}
                        </strong>

                        <span>
                            ${escapeHTML(chemical.formula)}
                        </span>

                        <button
                            type="button"
                            data-remove-chemical="${escapeHTML(
                                chemical.id
                            )}"
                            aria-label="Remove chemical"
                        >
                            ×
                        </button>
                    </div>
                `;
            }).join("")}

            ${LAB_STATE.apparatus.map(function (apparatus) {
                return `
                    <div
                        class="bench-item bench-apparatus"
                        data-bench-apparatus="${escapeHTML(
                            apparatus.id
                        )}"
                    >
                        <span class="bench-item-type">
                            APPARATUS
                        </span>

                        <strong>
                            ${escapeHTML(apparatus.name)}
                        </strong>

                        <span>
                            ${escapeHTML(apparatus.type)}
                        </span>

                        <button
                            type="button"
                            data-remove-apparatus="${escapeHTML(
                                apparatus.id
                            )}"
                            aria-label="Remove apparatus"
                        >
                            ×
                        </button>
                    </div>
                `;
            }).join("")}
        `;
    }


    /* =====================================================
       COUNTERS
       ===================================================== */

    function updateCounters() {

        const materialCount =
            document.querySelector(
                ".laboratory-status-item[data-status='materials']"
            );

        const apparatusCount =
            document.querySelector(
                ".laboratory-status-item[data-status='apparatus']"
            );


        if (materialCount) {
            const value =
                materialCount.querySelector(
                    ".laboratory-status-value"
                );

            if (value) {
                value.textContent =
                    LAB_STATE.chemicals.length;
            }
        }


        if (apparatusCount) {
            const value =
                apparatusCount.querySelector(
                    ".laboratory-status-value"
                );

            if (value) {
                value.textContent =
                    LAB_STATE.apparatus.length;
            }
        }


        const genericValues =
            document.querySelectorAll(
                "[data-lab-material-count]"
            );

        genericValues.forEach(function (element) {
            element.textContent =
                LAB_STATE.chemicals.length;
        });


        const genericApparatus =
            document.querySelectorAll(
                "[data-lab-apparatus-count]"
            );

        genericApparatus.forEach(function (element) {
            element.textContent =
                LAB_STATE.apparatus.length;
        });
    }


    /* =====================================================
       COMPLETE LAB RENDER
       ===================================================== */

    function renderLaboratoryState() {

        if (!getLabView()) {
            return;
        }

        renderChemicalLibrary();
        renderApparatusLibrary();
        renderSelectedMaterials();
        renderBench();
        updateCounters();
        updateNextStep();
    }


    /* =====================================================
       NEXT STEP
       ===================================================== */

    function updateNextStep() {

        const nextStep =
            document.querySelector(
                ".laboratory-next-step"
            );

        if (!nextStep) {
            return;
        }


        const chemicalCount =
            LAB_STATE.chemicals.length;

        const apparatusCount =
            LAB_STATE.apparatus.length;


        const description =
            nextStep.querySelector(
                ".laboratory-next-step-description"
            );

        const button =
            nextStep.querySelector(
                ".laboratory-next-step-button"
            );


        if (chemicalCount === 0 && apparatusCount === 0) {

            if (description) {
                description.textContent =
                    "Select chemicals and apparatus to begin building your digital laboratory setup.";
            }

            if (button) {
                button.disabled = true;
                button.textContent = "Add Laboratory Items";
            }

            return;
        }


        if (description) {
            description.textContent =
                `${chemicalCount} chemical${
                    chemicalCount === 1 ? "" : "s"
                } and ${apparatusCount} apparatus item${
                    apparatusCount === 1 ? "" : "s"
                } selected. Your digital bench is ready for the next stage.`;
        }


        if (button) {
            button.disabled = false;
            button.textContent = "Continue to Experiment Setup";
        }
    }


    /* =====================================================
       FILTERS
       ===================================================== */

    function setChemicalFilter(filter) {

        LAB_STATE.chemicalFilter = filter;

        document
            .querySelectorAll(
                "[data-chemical-filter]"
            )
            .forEach(function (button) {

                button.classList.toggle(
                    "active",
                    button.getAttribute(
                        "data-chemical-filter"
                    ) === filter
                );
            });

        renderChemicalLibrary();
    }


    function setApparatusFilter(filter) {

        LAB_STATE.apparatusFilter = filter;

        document
            .querySelectorAll(
                "[data-apparatus-filter]"
            )
            .forEach(function (button) {

                button.classList.toggle(
                    "active",
                    button.getAttribute(
                        "data-apparatus-filter"
                    ) === filter
                );
            });

        renderApparatusLibrary();
    }


    /* =====================================================
       EVENT DELEGATION
       ===================================================== */

    function setupLaboratoryEvents() {

        if (window.ChemLabStage42Ready) {
            return;
        }

        window.ChemLabStage42Ready = true;


        document.addEventListener(
            "click",
            function (event) {

                const addChemicalButton =
                    event.target.closest(
                        "[data-add-chemical]"
                    );

                if (addChemicalButton) {

                    addChemical(
                        addChemicalButton.getAttribute(
                            "data-add-chemical"
                        )
                    );

                    return;
                }


                const removeChemicalButton =
                    event.target.closest(
                        "[data-remove-chemical]"
                    );

                if (removeChemicalButton) {

                    removeChemical(
                        removeChemicalButton.getAttribute(
                            "data-remove-chemical"
                        )
                    );

                    return;
                }


                const addApparatusButton =
                    event.target.closest(
                        "[data-add-apparatus]"
                    );

                if (addApparatusButton) {

                    addApparatus(
                        addApparatusButton.getAttribute(
                            "data-add-apparatus"
                        )
                    );

                    return;
                }


                const removeApparatusButton =
                    event.target.closest(
                        "[data-remove-apparatus]"
                    );

                if (removeApparatusButton) {

                    removeApparatus(
                        removeApparatusButton.getAttribute(
                            "data-remove-apparatus"
                        )
                    );

                    return;
                }


                const chemicalFilter =
                    event.target.closest(
                        "[data-chemical-filter]"
                    );

                if (chemicalFilter) {

                    setChemicalFilter(
                        chemicalFilter.getAttribute(
                            "data-chemical-filter"
                        )
                    );

                    return;
                }


                const apparatusFilter =
                    event.target.closest(
                        "[data-apparatus-filter]"
                    );

                if (apparatusFilter) {

                    setApparatusFilter(
                        apparatusFilter.getAttribute(
                            "data-apparatus-filter"
                        )
                    );

                    return;
                }


                const clearButton =
                    event.target.closest(
                        "[data-lab-clear]"
                    );

                if (clearButton) {

                    clearWorkspace();

                    return;
                }
            }
        );


        document.addEventListener(
            "input",
            function (event) {

                if (
                    event.target.matches(
                        "[data-chemical-search]"
                    )
                ) {

                    LAB_STATE.chemicalSearch =
                        event.target.value;

                    renderChemicalLibrary();

                    return;
                }


                if (
                    event.target.matches(
                        "[data-apparatus-search]"
                    )
                ) {

                    LAB_STATE.apparatusSearch =
                        event.target.value;

                    renderApparatusLibrary();

                    return;
                }
            }
        );


        window.addEventListener(
            "hashchange",
            function () {

                setTimeout(function () {

                    if (
                        window.location.hash ===
                        "#laboratory"
                    ) {
                        renderLaboratoryState();
                    }

                }, 50);
            }
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ChemLabLaboratory = {

        getState: function () {
            return {
                chemicals: LAB_STATE.chemicals,
                apparatus: LAB_STATE.apparatus
            };
        },

        addChemical: addChemical,

        removeChemical: removeChemical,

        addApparatus: addApparatus,

        removeApparatus: removeApparatus,

        clearWorkspace: clearWorkspace,

        render: renderLaboratoryState
    };


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initializeStage42() {

        loadLabState();
        setupLaboratoryEvents();

        if (
            window.location.hash === "#laboratory"
        ) {
            setTimeout(
                renderLaboratoryState,
                100
            );
        }
    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeStage42
        );

    } else {

        initializeStage42();
    }

})();

/* =========================================================
   CHEMLAB STAGE 4.3
   SAFE EXPERIMENT START ENGINE
   ========================================================= */

(function () {
    "use strict";

    function getLabState() {
        if (
            window.ChemLabLaboratory &&
            typeof window.ChemLabLaboratory.getState === "function"
        ) {
            return window.ChemLabLaboratory.getState();
        }

        return {
            chemicals: [],
            apparatus: []
        };
    }

    function showMessage(message) {
        if (
            window.ChemLabModal &&
            typeof window.ChemLabModal.open === "function"
        ) {
            window.ChemLabModal.open({
                eyebrow: "CHEMLAB LABORATORY",
                title: "Experiment Setup",
                content: `
                    <div style="
                        padding:20px;
                        background:#f8faff;
                        border:1px solid #e4e7ec;
                        border-radius:12px;
                    ">
                        <p style="
                            margin:0;
                            color:#667085;
                            line-height:1.6;
                        ">
                            ${message}
                        </p>
                    </div>
                `,
                footer: `
                    <button
                        type="button"
                        class="toolbar-button chem-modal-primary"
                        data-modal-close
                    >
                        Continue
                    </button>
                `
            });

            return;
        }

        alert(message);
    }


    function beginExperiment() {

        const state = getLabState();

        const chemicals =
            Array.isArray(state.chemicals)
                ? state.chemicals
                : [];

        const apparatus =
            Array.isArray(state.apparatus)
                ? state.apparatus
                : [];


        if (
            chemicals.length === 0 &&
            apparatus.length === 0
        ) {
            showMessage(
                "Your digital laboratory is currently empty. Select at least one chemical or apparatus before starting an experiment."
            );

            return;
        }


        const chemicalList =
            chemicals.length
                ? chemicals
                    .map(function (item) {
                        return `
                            <li>
                                <strong>
                                    ${item.name || item.label || item.id}
                                </strong>
                                ${
                                    item.formula
                                        ? `<span>${item.formula}</span>`
                                        : ""
                                }
                            </li>
                        `;
                    })
                    .join("")
                : `<li>No chemicals selected.</li>`;


        const apparatusList =
            apparatus.length
                ? apparatus
                    .map(function (item) {
                        return `
                            <li>
                                <strong>
                                    ${item.name || item.label || item.id}
                                </strong>
                            </li>
                        `;
                    })
                    .join("")
                : `<li>No apparatus selected.</li>`;


        if (
            !window.ChemLabModal ||
            typeof window.ChemLabModal.open !== "function"
        ) {
            showMessage(
                "The experiment interface is not ready yet."
            );

            return;
        }


        window.ChemLabModal.open({

            eyebrow: "EXPERIMENT SETUP",

            title: "Ready to Begin",

            content: `

                <div style="
                    display:grid;
                    gap:16px;
                ">

                    <div style="
                        padding:16px;
                        background:#f8faff;
                        border:1px solid #e4e7ec;
                        border-radius:12px;
                    ">

                        <strong style="
                            display:block;
                            color:#172033;
                            margin-bottom:6px;
                        ">
                            Digital Chemistry Investigation
                        </strong>

                        <p style="
                            margin:0;
                            color:#667085;
                            font-size:13px;
                            line-height:1.6;
                        ">
                            Your selected laboratory resources are ready.
                            The next stage will provide the interactive
                            experiment workspace.
                        </p>

                    </div>


                    <div style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:12px;
                    ">

                        <div style="
                            padding:14px;
                            border:1px solid #e4e7ec;
                            border-radius:10px;
                        ">

                            <small style="
                                display:block;
                                color:#98a2b3;
                                margin-bottom:7px;
                            ">
                                MATERIALS
                            </small>

                            <strong style="
                                color:#3157d5;
                                font-size:20px;
                            ">
                                ${chemicals.length}
                            </strong>

                        </div>


                        <div style="
                            padding:14px;
                            border:1px solid #e4e7ec;
                            border-radius:10px;
                        ">

                            <small style="
                                display:block;
                                color:#98a2b3;
                                margin-bottom:7px;
                            ">
                                APPARATUS
                            </small>

                            <strong style="
                                color:#3157d5;
                                font-size:20px;
                            ">
                                ${apparatus.length}
                            </strong>

                        </div>

                    </div>


                    <div>

                        <strong style="
                            display:block;
                            color:#344054;
                            margin-bottom:8px;
                        ">
                            Selected Materials
                        </strong>

                        <ul style="
                            margin:0;
                            padding-left:20px;
                            color:#667085;
                            font-size:12px;
                            line-height:1.8;
                        ">
                            ${chemicalList}
                        </ul>

                    </div>


                    <div>

                        <strong style="
                            display:block;
                            color:#344054;
                            margin-bottom:8px;
                        ">
                            Selected Apparatus
                        </strong>

                        <ul style="
                            margin:0;
                            padding-left:20px;
                            color:#667085;
                            font-size:12px;
                            line-height:1.8;
                        ">
                            ${apparatusList}
                        </ul>

                    </div>

                </div>

            `,

            footer: `

                <button
                    type="button"
                    class="toolbar-button chem-modal-secondary"
                    data-modal-close
                >
                    Cancel
                </button>

                <button
                    type="button"
                    class="toolbar-button chem-modal-primary"
                    id="chemLabLaunchExperiment"
                >
                    Enter Experiment
                </button>

            `
        });


        setTimeout(function () {

            const launch =
                document.querySelector(
                    "#chemLabLaunchExperiment"
                );

            if (!launch) return;


            launch.addEventListener(
                "click",
                function () {

                    window.ChemLabModal.close();

                    openExperimentWorkspace();

                }
            );

        }, 50);
    }


    function openExperimentWorkspace() {

        let workspace =
            document.querySelector(
                "#chemLabExperimentWorkspace"
            );


        if (!workspace) {

            workspace =
                document.createElement("div");

            workspace.id =
                "chemLabExperimentWorkspace";

            workspace.innerHTML = `

                <div style="
                    position:fixed;
                    inset:0;
                    z-index:99998;
                    background:#f5f7fb;
                    overflow:auto;
                ">

                    <div style="
                        min-height:100%;
                        display:flex;
                        flex-direction:column;
                    ">

                        <header style="
                            height:72px;
                            background:#ffffff;
                            border-bottom:1px solid #e4e7ec;
                            display:flex;
                            align-items:center;
                            justify-content:space-between;
                            padding:0 24px;
                            position:sticky;
                            top:0;
                            z-index:2;
                        ">

                            <div>

                                <div style="
                                    color:#98a2b3;
                                    font-size:9px;
                                    font-weight:800;
                                    letter-spacing:.12em;
                                ">
                                    CHEMLAB DIGITAL LABORATORY
                                </div>

                                <h1 style="
                                    margin:4px 0 0;
                                    color:#172033;
                                    font-size:20px;
                                ">
                                    Experiment Workspace
                                </h1>

                            </div>


                            <button
                                type="button"
                                id="chemLabExitExperiment"
                                style="
                                    border:1px solid #e4e7ec;
                                    background:#ffffff;
                                    color:#667085;
                                    border-radius:9px;
                                    padding:9px 14px;
                                    cursor:pointer;
                                    font-weight:700;
                                "
                            >
                                Exit Experiment
                            </button>

                        </header>


                        <main style="
                            flex:1;
                            padding:24px;
                        ">

                            <div style="
                                max-width:1200px;
                                margin:0 auto;
                                display:grid;
                                grid-template-columns:260px minmax(0,1fr) 280px;
                                gap:18px;
                            ">


                                <section style="
                                    background:#ffffff;
                                    border:1px solid #e4e7ec;
                                    border-radius:14px;
                                    padding:18px;
                                ">

                                    <div style="
                                        color:#98a2b3;
                                        font-size:9px;
                                        font-weight:800;
                                        letter-spacing:.12em;
                                        margin-bottom:12px;
                                    ">
                                        RESOURCES
                                    </div>

                                    <div id="chemLabExperimentResources"></div>

                                </section>


                                <section style="
                                    background:#ffffff;
                                    border:1px solid #e4e7ec;
                                    border-radius:14px;
                                    padding:20px;
                                    min-height:500px;
                                ">

                                    <div style="
                                        display:flex;
                                        justify-content:space-between;
                                        align-items:center;
                                        margin-bottom:20px;
                                    ">

                                        <div>

                                            <div style="
                                                color:#98a2b3;
                                                font-size:9px;
                                                font-weight:800;
                                                letter-spacing:.12em;
                                            ">
                                                DIGITAL BENCH
                                            </div>

                                            <h2 style="
                                                margin:5px 0 0;
                                                color:#172033;
                                                font-size:18px;
                                            ">
                                                Laboratory Workspace
                                            </h2>

                                        </div>

                                        <span style="
                                            color:#12b76a;
                                            font-size:11px;
                                            font-weight:700;
                                        ">
                                            ● READY
                                        </span>

                                    </div>


                                    <div style="
                                        min-height:360px;
                                        border:1px solid #e4e7ec;
                                        border-radius:12px;
                                        background:#f8faff;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        text-align:center;
                                        padding:20px;
                                    ">

                                        <div>

                                            <div style="
                                                font-size:50px;
                                                margin-bottom:14px;
                                            ">
                                                ⚗
                                            </div>

                                            <h3 style="
                                                margin:0;
                                                color:#172033;
                                            ">
                                                Experiment Ready
                                            </h3>

                                            <p style="
                                                max-width:380px;
                                                color:#667085;
                                                font-size:12px;
                                                line-height:1.6;
                                                margin:8px auto 0;
                                            ">
                                                This is your digital experiment
                                                bench. Interactive laboratory
                                                actions will be added here as
                                                the experiment engine develops.
                                            </p>

                                        </div>

                                    </div>


                                    <div style="
                                        display:flex;
                                        gap:10px;
                                        flex-wrap:wrap;
                                        margin-top:16px;
                                    ">

                                        <button
                                            type="button"
                                            class="toolbar-button chem-modal-primary"
                                            id="chemLabMeasureAction"
                                        >
                                            Measure
                                        </button>

                                        <button
                                            type="button"
                                            class="toolbar-button"
                                            id="chemLabObserveAction"
                                        >
                                            Record Observation
                                        </button>

                                        <button
                                            type="button"
                                            class="toolbar-button"
                                            id="chemLabActionButton"
                                        >
                                            Perform Digital Action
                                        </button>

                                    </div>

                                </section>


                                <section style="
                                    background:#ffffff;
                                    border:1px solid #e4e7ec;
                                    border-radius:14px;
                                    padding:18px;
                                ">

                                    <div style="
                                        color:#98a2b3;
                                        font-size:9px;
                                        font-weight:800;
                                        letter-spacing:.12em;
                                        margin-bottom:12px;
                                    ">
                                        EXPERIMENT LOG
                                    </div>

                                    <div
                                        id="chemLabExperimentLog"
                                        style="
                                            color:#667085;
                                            font-size:12px;
                                            line-height:1.7;
                                        "
                                    >
                                        Experiment started.
                                    </div>

                                </section>

                            </div>

                        </main>

                    </div>

                </div>

            `;

            document.body.appendChild(workspace);

        }


        renderExperimentResources();

        document.body.classList.add(
            "experiment-workspace-open"
        );


        const exit =
            document.querySelector(
                "#chemLabExitExperiment"
            );

        if (exit) {

            exit.onclick =
                function () {

                    workspace.remove();

                    document.body.classList.remove(
                        "experiment-workspace-open"
                    );

                };

        }


        setupExperimentActions();
    }


    function renderExperimentResources() {

        const container =
            document.querySelector(
                "#chemLabExperimentResources"
            );

        if (!container) return;


        const state = getLabState();


        const chemicals =
            Array.isArray(state.chemicals)
                ? state.chemicals
                : [];


        const apparatus =
            Array.isArray(state.apparatus)
                ? state.apparatus
                : [];


        let html = "";


        chemicals.forEach(function (item) {

            html += `
                <div style="
                    padding:10px;
                    background:#f8faff;
                    border:1px solid #eef1f5;
                    border-radius:9px;
                    margin-bottom:8px;
                ">
                    <strong style="
                        display:block;
                        color:#172033;
                        font-size:11px;
                    ">
                        ${item.name || item.label || item.id}
                    </strong>

                    <small style="
                        color:#98a2b3;
                        font-size:9px;
                    ">
                        ${item.formula || "Chemical"}
                    </small>
                </div>
            `;

        });


        apparatus.forEach(function (item) {

            html += `
                <div style="
                    padding:10px;
                    background:#f8faff;
                    border:1px solid #eef1f5;
                    border-radius:9px;
                    margin-bottom:8px;
                ">
                    <strong style="
                        color:#172033;
                        font-size:11px;
                    ">
                        ${item.name || item.label || item.id}
                    </strong>
                </div>
            `;

        });


        container.innerHTML =
            html ||
            `
                <p style="
                    color:#98a2b3;
                    font-size:11px;
                ">
                    No resources selected.
                </p>
            `;
    }


    function addExperimentLog(message) {

        const log =
            document.querySelector(
                "#chemLabExperimentLog"
            );

        if (!log) return;


        const item =
            document.createElement("div");


        item.style.cssText =
            "padding:8px 0;border-bottom:1px solid #eef1f5;";


        item.textContent =
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ) +
            " — " +
            message;


        log.appendChild(item);

    }


    function setupExperimentActions() {

        const measure =
            document.querySelector(
                "#chemLabMeasureAction"
            );

        const observe =
            document.querySelector(
                "#chemLabObserveAction"
            );

        const action =
            document.querySelector(
                "#chemLabActionButton"
            );


        if (measure) {

            measure.onclick =
                function () {

                    const value =
                        prompt(
                            "Enter a simulated measurement value:"
                        );

                    if (
                        value === null ||
                        value.trim() === ""
                    ) {
                        return;
                    }

                    addExperimentLog(
                        "Measurement recorded: " +
                        value
                    );

                };

        }


        if (observe) {

            observe.onclick =
                function () {

                    const observation =
                        prompt(
                            "Enter your observation:"
                        );

                    if (
                        observation === null ||
                        observation.trim() === ""
                    ) {
                        return;
                    }

                    addExperimentLog(
                        "Observation recorded."
                    );

                };

        }


        if (action) {

            action.onclick =
                function () {

                    addExperimentLog(
                        "Digital laboratory action performed."
                    );

                };

        }

    }


    function findBeginExperimentButton() {

        const buttons =
            document.querySelectorAll(
                "button"
            );


        buttons.forEach(function (button) {

            const text =
                button.textContent
                    .trim()
                    .toLowerCase();


            if (
                text === "begin experiment"
            ) {

                button.setAttribute(
                    "data-chemlab-begin-experiment",
                    "true"
                );

            }

        });

    }


    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-chemlab-begin-experiment]"
                );


            if (!button) return;


            event.preventDefault();

            beginExperiment();

        }
    );


    function initialize() {

        findBeginExperimentButton();


        const appView =
            document.querySelector(
                "#appView"
            );


        if (appView) {

            const observer =
                new MutationObserver(
                    function () {

                        findBeginExperimentButton();

                    }
                );


            observer.observe(
                appView,
                {
                    childList: true,
                    subtree: true
                }
            );

        }

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();
