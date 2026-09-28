/* =========================================================
   CHEMLAB
   PROFESSIONAL AUTHENTICATION UI
   Stage 3.4
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       STATE
       ===================================================== */

    const AUTH_UI_STATE = {

        initialized: false,

        mode: "login",

        loading: false,

        lastEmail: null

    };


    window.CHEMLAB_AUTH_UI_STATE =
        AUTH_UI_STATE;


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    const get = (id) => {

        return document.getElementById(id);

    };


    const $ = (
        selector,
        parent = document
    ) => {

        return parent.querySelector(
            selector
        );

    };


    /* =====================================================
       ELEMENTS
       ===================================================== */

    let elements = {};


    function cacheElements() {

        elements = {

            modal:
                get("authModal"),

            close:
                get("authClose"),

            title:
                get("authTitle"),

            subtitle:
                get("authSubtitle"),

            loginTab:
                get("authLoginTab"),

            signupTab:
                get("authSignupTab"),

            loginForm:
                get("authLoginForm"),

            signupForm:
                get("authSignupForm"),

            loginEmail:
                get("authLoginEmail"),

            loginPassword:
                get("authLoginPassword"),

            signupName:
                get("authSignupName"),

            signupEmail:
                get("authSignupEmail"),

            signupLevel:
                get("authSignupLevel"),

            signupInstitution:
                get("authSignupInstitution"),

            signupPassword:
                get("authSignupPassword"),

            loginSubmit:
                get("authLoginSubmit"),

            signupSubmit:
                get("authSignupSubmit"),

            forgotPassword:
                get("authForgotPassword"),

            message:
                get("authMessage"),

            confirmation:
                get("authConfirmation"),

            confirmationText:
                get("authConfirmationText"),

            confirmationBack:
                get("authConfirmationBack")

        };

    }


    /* =====================================================
       MESSAGE SYSTEM
       ===================================================== */

    function clearMessage() {

        if (!elements.message) {
            return;
        }


        elements.message.textContent = "";

        elements.message.className =
            "auth-message";

    }


    function showMessage(
        message,
        type = "info"
    ) {

        if (!elements.message) {
            return;
        }


        elements.message.textContent =
            message;


        elements.message.className =
            `auth-message is-visible is-${type}`;

    }


    /* =====================================================
       MODAL
       ===================================================== */

    function open(mode = "login") {

        if (!elements.modal) {
            return;
        }


        setMode(mode);


        elements.modal.classList.add(
            "is-open"
        );


        elements.modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "auth-modal-open"
        );


        setTimeout(() => {

            if (mode === "signup") {

                elements.signupName?.focus();

            } else {

                elements.loginEmail?.focus();

            }

        }, 120);

    }


    function close() {

        if (!elements.modal) {
            return;
        }


        elements.modal.classList.remove(
            "is-open"
        );


        elements.modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "auth-modal-open"
        );


        clearMessage();


        resetConfirmation();

    }


    /* =====================================================
       MODE SWITCHING
       ===================================================== */

    function setMode(mode) {

        if (
            mode !== "login" &&
            mode !== "signup"
        ) {

            mode = "login";

        }


        AUTH_UI_STATE.mode =
            mode;


        clearMessage();


        resetConfirmation();


        if (elements.loginForm) {

            elements.loginForm.classList.toggle(
                "is-active",
                mode === "login"
            );

        }


        if (elements.signupForm) {

            elements.signupForm.classList.toggle(
                "is-active",
                mode === "signup"
            );

        }


        if (elements.loginTab) {

            elements.loginTab.classList.toggle(
                "is-active",
                mode === "login"
            );

            elements.loginTab.setAttribute(
                "aria-selected",
                String(mode === "login")
            );

        }


        if (elements.signupTab) {

            elements.signupTab.classList.toggle(
                "is-active",
                mode === "signup"
            );

            elements.signupTab.setAttribute(
                "aria-selected",
                String(mode === "signup")
            );

        }


        if (elements.title) {

            elements.title.textContent =
                mode === "login"
                    ? "Welcome back"
                    : "Create your ChemLab account";

        }


        if (elements.subtitle) {

            elements.subtitle.textContent =
                mode === "login"
                    ? "Sign in to continue your chemistry learning journey."
                    : "Create your student profile and start building your chemistry workspace.";

        }

    }


    /* =====================================================
       CONFIRMATION SCREEN
       ===================================================== */

    function showConfirmation(
        email
    ) {

        if (!elements.loginForm) {
            return;
        }


        elements.loginForm.classList.remove(
            "is-active"
        );


        elements.signupForm?.classList.remove(
            "is-active"
        );


        elements.loginTab?.classList.remove(
            "is-active"
        );


        elements.signupTab?.classList.remove(
            "is-active"
        );


        elements.confirmation?.classList.add(
            "is-visible"
        );


        if (elements.title) {

            elements.title.textContent =
                "Account created";

        }


        if (elements.subtitle) {

            elements.subtitle.textContent =
                "One final step before you enter the laboratory.";

        }


        if (elements.confirmationText) {

            elements.confirmationText.textContent =
                email
                    ? `We've sent a confirmation link to ${email}. Confirm your email address before signing in.`
                    : "We've sent a confirmation link to your email address. Confirm your email address before signing in.";

        }

    }


    function resetConfirmation() {

        elements.confirmation?.classList.remove(
            "is-visible"
        );

    }


    /* =====================================================
       LOADING STATE
       ===================================================== */

    function setLoading(
        loading,
        button
    ) {

        AUTH_UI_STATE.loading =
            loading;


        if (!button) {
            return;
        }


        button.disabled =
            loading;


        button.classList.toggle(
            "is-loading",
            loading
        );


        const text =
            $(".auth-submit-text", button);


        if (!text) {
            return;
        }


        if (loading) {

            button.dataset.originalText =
                text.textContent;


            text.innerHTML =
                `<span class="auth-spinner"></span>`;

        } else {

            text.textContent =
                button.dataset.originalText ||
                "Continue";

        }

    }


    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    function validateLogin() {

        const email =
            elements.loginEmail?.value
                .trim() || "";


        const password =
            elements.loginPassword?.value ||
            "";


        if (!email) {

            showMessage(
                "Enter your email address.",
                "error"
            );

            elements.loginEmail?.focus();

            return false;

        }


        if (!validateEmail(email)) {

            showMessage(
                "Enter a valid email address.",
                "error"
            );

            elements.loginEmail?.focus();

            return false;

        }


        if (!password) {

            showMessage(
                "Enter your password.",
                "error"
            );

            elements.loginPassword?.focus();

            return false;

        }


        return true;

    }


    function validateSignup() {

        const name =
            elements.signupName?.value
                .trim() || "";


        const email =
            elements.signupEmail?.value
                .trim() || "";


        const level =
            elements.signupLevel?.value ||
            "";


        const password =
            elements.signupPassword?.value ||
            "";


        if (!name) {

            showMessage(
                "Enter your full name.",
                "error"
            );

            elements.signupName?.focus();

            return false;

        }


        if (name.length < 2) {

            showMessage(
                "Enter a valid full name.",
                "error"
            );

            elements.signupName?.focus();

            return false;

        }


        if (!email) {

            showMessage(
                "Enter your email address.",
                "error"
            );

            elements.signupEmail?.focus();

            return false;

        }


        if (!validateEmail(email)) {

            showMessage(
                "Enter a valid email address.",
                "error"
            );

            elements.signupEmail?.focus();

            return false;

        }


        if (!level) {

            showMessage(
                "Select your academic level.",
                "error"
            );

            elements.signupLevel?.focus();

            return false;

        }


        if (password.length < 6) {

            showMessage(
                "Your password must contain at least 6 characters.",
                "error"
            );

            elements.signupPassword?.focus();

            return false;

        }


        return true;

    }


    /* =====================================================
       LOGIN
       ===================================================== */

    async function handleLogin(
        event
    ) {

        event.preventDefault();


        if (AUTH_UI_STATE.loading) {
            return;
        }


        if (!validateLogin()) {
            return;
        }


        if (
            !window.CHEMLAB_AUTH ||
            typeof window.CHEMLAB_AUTH.signIn !==
                "function"
        ) {

            showMessage(
                "The authentication system is not available.",
                "error"
            );

            return;

        }


        const email =
            elements.loginEmail.value
                .trim();


        const password =
            elements.loginPassword.value;


        setLoading(
            true,
            elements.loginSubmit
        );


        clearMessage();


        try {

            const result =
                await window.CHEMLAB_AUTH.signIn(
                    email,
                    password
                );


            if (
                !result ||
                result.success === false
            ) {

                showMessage(
                    result?.error ||
                    "We could not sign you in. Check your details and try again.",
                    "error"
                );

                return;

            }


            AUTH_UI_STATE.lastEmail =
                email;


            showMessage(
                "Signed in successfully. Loading your ChemLab workspace...",
                "success"
            );


            /*
             * Give the application time to process
             * the authentication state event.
             */

            setTimeout(() => {

                close();

            }, 500);

        } catch (error) {

            showMessage(
                getReadableError(error),
                "error"
            );

        } finally {

            setLoading(
                false,
                elements.loginSubmit
            );

        }

    }


    /* =====================================================
       SIGN UP
       ===================================================== */

    async function handleSignup(
        event
    ) {

        event.preventDefault();


        if (AUTH_UI_STATE.loading) {
            return;
        }


        if (!validateSignup()) {
            return;
        }


        if (
            !window.CHEMLAB_AUTH ||
            typeof window.CHEMLAB_AUTH.signUp !==
                "function"
        ) {

            showMessage(
                "The authentication system is not available.",
                "error"
            );

            return;

        }


        const name =
            elements.signupName.value
                .trim();


        const email =
            elements.signupEmail.value
                .trim();


        const level =
            elements.signupLevel.value;


        const institution =
            elements.signupInstitution?.value
                .trim() || "";


        const password =
            elements.signupPassword.value;


        setLoading(
            true,
            elements.signupSubmit
        );


        clearMessage();


        try {

            const result =
                await window.CHEMLAB_AUTH.signUp(
                    email,
                    password,
                    {
                        full_name:
                            name,

                        academic_level:
                            level,

                        institution:
                            institution
                    }
                );


            if (
                !result ||
                result.success === false
            ) {

                showMessage(
                    result?.error ||
                    "We could not create your account. Please try again.",
                    "error"
                );

                return;

            }


            AUTH_UI_STATE.lastEmail =
                email;


            /*
             * Supabase may require email confirmation.
             */

            if (
                result.requiresEmailConfirmation
            ) {

                showConfirmation(
                    email
                );

                return;

            }


            /*
             * If confirmation is not required,
             * the student is already authenticated.
             */

            showMessage(
                "Your ChemLab account has been created successfully.",
                "success"
            );


            setTimeout(() => {

                close();

            }, 600);

        } catch (error) {

            showMessage(
                getReadableError(error),
                "error"
            );

        } finally {

            setLoading(
                false,
                elements.signupSubmit
            );

        }

    }


    /* =====================================================
       PASSWORD RESET
       ===================================================== */

    async function handleForgotPassword() {

        clearMessage();


        const email =
            elements.loginEmail?.value
                .trim() || "";


        if (!email) {

            showMessage(
                "Enter your email address first, then select Forgot password.",
                "info"
            );

            elements.loginEmail?.focus();

            return;

        }


        if (!validateEmail(email)) {

            showMessage(
                "Enter a valid email address before requesting a password reset.",
                "error"
            );

            elements.loginEmail?.focus();

            return;

        }


        if (
            !window.CHEMLAB_AUTH ||
            typeof window.CHEMLAB_AUTH.resetPassword !==
                "function"
        ) {

            showMessage(
                "The password reset system is not available.",
                "error"
            );

            return;

        }


        try {

            const result =
                await window.CHEMLAB_AUTH.resetPassword(
                    email
                );


            if (
                !result ||
                result.success === false
            ) {

                showMessage(
                    result?.error ||
                    "We could not send the password reset email.",
                    "error"
                );

                return;

            }


            showMessage(
                "Password reset instructions have been sent to your email.",
                "success"
            );

        } catch (error) {

            showMessage(
                getReadableError(error),
                "error"
            );

        }

    }


    /* =====================================================
       READABLE ERROR
       ===================================================== */

    function getReadableError(
        error
    ) {

        if (
            window.CHEMLAB_AUTH &&
            typeof window.CHEMLAB_AUTH
                .getReadableAuthError ===
                "function"
        ) {

            return window.CHEMLAB_AUTH
                .getReadableAuthError(
                    error
                );

        }


        return (
            error?.message ||
            "Something went wrong. Please try again."
        );

    }


    /* =====================================================
       PASSWORD VISIBILITY
       ===================================================== */

    function togglePassword(
        inputId,
        button
    ) {

        const input =
            get(inputId);


        if (!input) {
            return;
        }


        const showing =
            input.type === "text";


        input.type =
            showing
                ? "password"
                : "text";


        button.setAttribute(
            "aria-label",
            showing
                ? "Show password"
                : "Hide password"
        );


        button.textContent =
            showing
                ? "◉"
                : "◎";

    }


    /* =====================================================
       EVENT BINDING
       ===================================================== */

    function bindEvents() {

        elements.close?.addEventListener(
            "click",
            close
        );


        elements.loginTab?.addEventListener(
            "click",
            () => setMode("login")
        );


        elements.signupTab?.addEventListener(
            "click",
            () => setMode("signup")
        );


        elements.loginForm?.addEventListener(
            "submit",
            handleLogin
        );


        elements.signupForm?.addEventListener(
            "submit",
            handleSignup
        );


        elements.forgotPassword?.addEventListener(
            "click",
            handleForgotPassword
        );


        elements.confirmationBack?.addEventListener(
            "click",
            () => {

                resetConfirmation();

                setMode("login");

            }
        );


        document.addEventListener(
            "click",
            (event) => {

                const switchButton =
                    event.target.closest(
                        "[data-auth-switch]"
                    );


                if (!switchButton) {
                    return;
                }


                const mode =
                    switchButton.dataset
                        .authSwitch;


                setMode(mode);

            }
        );


        document.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        "[data-password-toggle]"
                    );


                if (!button) {
                    return;
                }


                togglePassword(
                    button.dataset.passwordToggle,
                    button
                );

            }
        );


        /*
         * Close when clicking the dark
         * area outside the modal.
         */

        elements.modal?.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    elements.modal
                ) {

                    close();

                }

            }
        );


        /*
         * Escape key.
         */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    elements.modal?.classList.contains(
                        "is-open"
                    )
                ) {

                    close();

                }

            }
        );


        /*
         * Listen for authentication events.
         */

        document.addEventListener(
            "chemlab:auth-state",
            () => {

                updateAuthButton();

            }
        );


        document.addEventListener(
            "chemlab:auth-event",
            () => {

                updateAuthButton();

            }
        );

    }


    /* =====================================================
       AUTH BUTTON / PROFILE UI
       ===================================================== */

    function updateAuthButton() {

        /*
         * This supports multiple possible
         * authentication buttons in the UI.
         */

        const buttons =
            document.querySelectorAll(
                "[data-auth-action]"
            );


        const authenticated =
            window.CHEMLAB_AUTH &&
            typeof window.CHEMLAB_AUTH.isAuthenticated ===
                "function"
                ? window.CHEMLAB_AUTH.isAuthenticated()
                : false;


        buttons.forEach((button) => {

            const action =
                button.dataset.authAction;


            if (
                action === "login" ||
                action === "signin"
            ) {

                button.textContent =
                    authenticated
                        ? "Account"
                        : "Sign In";

            }


            if (
                action === "logout"
            ) {

                button.hidden =
                    !authenticated;

            }

        });

    }


    /* =====================================================
       GLOBAL OPEN API
       ===================================================== */

    function exposeAPI() {

        window.CHEMLAB_AUTH_UI = {

            open,

            close,

            setMode,

            showMessage,

            clearMessage,

            getState:
                () => ({
                    ...AUTH_UI_STATE
                })

        };

    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initialize() {

        if (
            AUTH_UI_STATE.initialized
        ) {

            return;

        }


        cacheElements();


        if (!elements.modal) {

            console.warn(
                "[ChemLab] Authentication modal was not found."
            );

            return;

        }


        bindEvents();

        exposeAPI();

        updateAuthButton();


        AUTH_UI_STATE.initialized =
            true;


        CHEMLAB_LOG(
            "Authentication UI initialized."
        );

    }


    /* =====================================================
       START
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
