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

        const button =
            $(".mobile-menu");

        const sidebar =
            $(".sidebar");

        if (!button || !sidebar) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle("open");

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                if (
                    window.innerWidth <= 800 &&
                    sidebar.classList.contains("open") &&
                    !sidebar.contains(event.target) &&
                    !button.contains(event.target)
                ) {

                    sidebar.classList.remove("open");

                }

            }
        );

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
