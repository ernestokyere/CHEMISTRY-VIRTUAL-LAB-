/* =========================================================
   CHEMLAB
   AUTHENTICATION + PREMIUM SYSTEM
   Version 5.0
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const CONFIG = {

        supabaseUrl:
            "https://zscbgeaieiqwknhjxpnt.supabase.co",

        supabaseKey:
            "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy",

        activatePremiumUrl:
            "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/activate-premium",

        verifyPaymentUrl:
            "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/verify-paystack-payment",

        monthlyPrice:
            35,

        yearlyPrice:
            420
    };


    /* =====================================================
       SUPABASE CLIENT
       ===================================================== */

    function getSupabase() {

        if (window.supabaseClient) {
            return window.supabaseClient;
        }

        if (
            typeof window.supabase === "undefined" ||
            typeof window.supabase.createClient !==
                "function"
        ) {

            console.error(
                "ChemLab: Supabase library unavailable."
            );

            return null;
        }

        window.supabaseClient =
            window.supabase.createClient(
                CONFIG.supabaseUrl,
                CONFIG.supabaseKey
            );

        return window.supabaseClient;
    }


    /* =====================================================
       STATE
       ===================================================== */

    const authState = {

        mode:
            "login",

        currentUser:
            null,

        currentSession:
            null,

        premium:
            false,

        premiumDetails:
            null,

        selectedPlan:
            "yearly",

        pendingPayment:
            null
    };


    window.chemLabAuthState =
        authState;


    /* =====================================================
       ELEMENT HELPERS
       ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }


    function setText(
        id,
        value
    ) {

        const element =
            $(id);

        if (element) {
            element.textContent =
                value;
        }
    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    function notify(
        message,
        type = "info"
    ) {

        if (
            typeof window.showNotification ===
            "function"
        ) {

            window.showNotification(
                message,
                type
            );

            return;
        }

        const container =
            $("notificationContainer");

        if (!container) {

            console.log(
                `[ChemLab ${type}]`,
                message
            );

            return;
        }

        const notification =
            document.createElement(
                "div"
            );

        notification.className =
            `notification notification-${type}`;

        notification.innerHTML = `
            <span>
                ${escapeHTML(message)}
            </span>

            <button
                type="button"
                aria-label="Close"
            >
                ×
            </button>
        `;

        container.appendChild(
            notification
        );


        const close =
            notification.querySelector(
                "button"
            );

        if (close) {

            close.addEventListener(
                "click",
                () => notification.remove()
            );
        }


        setTimeout(
            () => {

                if (
                    notification.isConnected
                ) {
                    notification.remove();
                }

            },
            5000
        );
    }


    /* =====================================================
       MODAL HELPERS
       ===================================================== */

    function openModal(
        id
    ) {

        const modal =
            $(id);

        if (!modal) {
            return;
        }

        modal.classList.add(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeModal(
        id
    ) {

        const modal =
            $(id);

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }


    /* =====================================================
       AUTH MODAL
       ===================================================== */

    function openAuthModal(
        mode = "login"
    ) {

        authState.mode =
            mode === "signup"
                ? "signup"
                : "login";


        updateAuthModal();


        openModal(
            "authModal"
        );


        setTimeout(
            () => {

                const email =
                    $("authEmail");

                if (email) {
                    email.focus();
                }

            },
            100
        );
    }


    function closeAuthModal() {

        closeModal(
            "authModal"
        );
    }


    function updateAuthModal() {

        const signup =
            authState.mode ===
            "signup";


        setText(
            "authTitle",
            signup
                ? "Create your ChemLab account"
                : "Welcome back"
        );


        setText(
            "authSubtitle",
            signup
                ? "Create your student account and start learning."
                : "Sign in to continue your chemistry journey."
        );


        const nameField =
            $("nameField");

        if (nameField) {

            nameField.style.display =
                signup
                    ? ""
                    : "none";
        }


        const submit =
            $("authSubmit");

        if (submit) {

            submit.textContent =
                signup
                    ? "Create Account"
                    : "Sign In";
        }


        const switchText =
            $("authSwitchText");

        if (switchText) {

            switchText.textContent =
                signup
                    ? "Already have an account?"
                    : "Don't have an account?";
        }


        const switchButton =
            $("authSwitch");

        if (switchButton) {

            switchButton.textContent =
                signup
                    ? "Sign In"
                    : "Create Account";
        }


        clearAuthMessage();
    }


    function showAuthMessage(
        message,
        type = "error"
    ) {

        const element =
            $("authMessage");

        if (!element) {
            return;
        }

        element.textContent =
            message;

        element.className =
            `auth-message ${type}`;

        element.classList.remove(
            "hidden"
        );
    }


    function clearAuthMessage() {

        const element =
            $("authMessage");

        if (!element) {
            return;
        }

        element.textContent =
            "";

        element.className =
            "auth-message hidden";
    }


    /* =====================================================
       CURRENT USER
       ===================================================== */

    async function getCurrentUser() {

        const supabase =
            getSupabase();

        if (!supabase) {
            return null;
        }


        const {
            data,
            error
        } =
            await supabase.auth.getUser();


        if (error) {
            return null;
        }


        return data?.user || null;
    }


    async function getCurrentSession() {

        const supabase =
            getSupabase();

        if (!supabase) {
            return null;
        }


        const {
            data,
            error
        } =
            await supabase.auth.getSession();


        if (error) {
            return null;
        }


        return data?.session || null;
    }


    window.getCurrentUser =
        getCurrentUser;


    window.getCurrentSession =
        getCurrentSession;


    window.getChemLabCurrentUser =
        getCurrentUser;


    /* =====================================================
       STUDENT PROFILE
       ===================================================== */

    async function createStudentProfile(
        user,
        fullName = ""
    ) {

        if (!user) {
            return null;
        }


        const supabase =
            getSupabase();

        if (!supabase) {
            return null;
        }


        const name =
            fullName.trim() ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "ChemLab Student";


        try {

            const {
                data: existing,
                error: existingError
            } =
                await supabase
                    .from(
                        "profiles"
                    )
                    .select(
                        "id,full_name,is_premium,premium_expires_at"
                    )
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();


            if (
                existingError &&
                existingError.code !==
                    "PGRST116"
            ) {

                console.warn(
                    "Profile lookup failed:",
                    existingError
                );
            }


            if (existing) {

                return existing;
            }


            const {
                data,
                error
            } =
                await supabase
                    .from(
                        "profiles"
                    )
                    .insert({
                        id:
                            user.id,

                        full_name:
                            name,

                        is_premium:
                            false,

                        premium_expires_at:
                            null
                    })
                    .select()
                    .single();


            if (error) {

                console.warn(
                    "Profile creation failed:",
                    error
                );

                return null;
            }


            return data;

        } catch (error) {

            console.warn(
                "Profile error:",
                error
            );

            return null;
        }
    }


    /* =====================================================
       PREMIUM STATUS
       ===================================================== */

    async function getPremiumStatus(
        forceRefresh = false
    ) {

        const supabase =
            getSupabase();

        if (!supabase) {
            return false;
        }


        const user =
            authState.currentUser ||
            await getCurrentUser();


        if (!user) {

            authState.premium =
                false;

            authState.premiumDetails =
                null;

            return false;
        }


        try {

            const {
                data: profile,
                error: profileError
            } =
                await supabase
                    .from(
                        "profiles"
                    )
                    .select(
                        "id,full_name,is_premium,premium_expires_at"
                    )
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();


            if (
                profileError &&
                profileError.code !==
                    "PGRST116"
            ) {

                console.warn(
                    "Premium profile check failed:",
                    profileError
                );
            }


            const now =
                Date.now();


            let active =
                false;


            let details =
                null;


            if (profile) {

                const expiry =
                    profile.premium_expires_at
                        ? new Date(
                            profile.premium_expires_at
                        ).getTime()
                        : null;


                active =
                    Boolean(
                        profile.is_premium
                    ) &&
                    (
                        !expiry ||
                        expiry > now
                    );


                details = {
                    source:
                        "profile",

                    plan:
                        null,

                    expiresAt:
                        profile.premium_expires_at,

                    isPremium:
                        active
                };
            }


            /*
             * Check subscription table when available.
             */

            try {

                const {
                    data: subscriptions,
                    error: subscriptionError
                } =
                    await supabase
                        .from(
                            "subscriptions"
                        )
                        .select(
                            "id,plan,status,expires_at,created_at"
                        )
                        .eq(
                            "user_id",
                            user.id
                        )
                        .eq(
                            "status",
                            "active"
                        )
                        .order(
                            "created_at",
                            {
                                ascending:
                                    false
                            }
                        )
                        .limit(1);


                if (
                    !subscriptionError &&
                    subscriptions &&
                    subscriptions.length
                ) {

                    const subscription =
                        subscriptions[0];


                    const expiry =
                        subscription.expires_at
                            ? new Date(
                                subscription.expires_at
                            ).getTime()
                            : null;


                    if (
                        !expiry ||
                        expiry > now
                    ) {

                        active =
                            true;

                        details = {
                            source:
                                "subscription",

                            plan:
                                subscription.plan,

                            expiresAt:
                                subscription.expires_at,

                            isPremium:
                                true
                        };
                    }
                }

            } catch (
                subscriptionError
            ) {

                console.warn(
                    "Subscription check skipped:",
                    subscriptionError
                );
            }


            authState.premium =
                active;

            authState.premiumDetails =
                details;


            updateAccountUI();


            return active;

        } catch (error) {

            console.error(
                "Premium status error:",
                error
            );

            return false;
        }
    }


    window.getPremiumStatus =
        getPremiumStatus;


    /* =====================================================
       SIGN UP
       ===================================================== */

    async function signUpStudent() {

        const supabase =
            getSupabase();

        if (!supabase) {

            showAuthMessage(
                "Authentication service is unavailable."
            );

            return;
        }


        const name =
            $("authName")
                ?.value
                .trim() ||
            "";


        const email =
            $("authEmail")
                ?.value
                .trim() ||
            "";


        const password =
            $("authPassword")
                ?.value ||
            "";


        if (!name) {

            showAuthMessage(
                "Please enter your name."
            );

            return;
        }


        if (!email) {

            showAuthMessage(
                "Please enter your email."
            );

            return;
        }


        if (
            password.length <
            6
        ) {

            showAuthMessage(
                "Password must contain at least 6 characters."
            );

            return;
        }


        const submit =
            $("authSubmit");

        if (submit) {
            submit.disabled =
                true;

            submit.textContent =
                "Creating account...";
        }


        try {

            const {
                data,
                error
            } =
                await supabase.auth.signUp({

                    email,

                    password,

                    options: {

                        data: {

                            full_name:
                                name
                        }
                    }
                });


            if (error) {
                throw error;
            }


            /*
             * Some Supabase projects require
             * email confirmation.
             */

            if (
                data.user &&
                data.session
            ) {

                await createStudentProfile(
                    data.user,
                    name
                );


                await refreshAuthState();


                closeAuthModal();


                notify(
                    "Account created successfully. Welcome to ChemLab!",
                    "success"
                );

            } else {

                showAuthMessage(
                    "Account created. Please check your email to confirm your account.",
                    "success"
                );
            }


        } catch (error) {

            console.error(
                "Sign up error:",
                error
            );


            showAuthMessage(
                getFriendlyAuthError(
                    error
                )
            );

        } finally {

            if (submit) {

                submit.disabled =
                    false;

                submit.textContent =
                    "Create Account";
            }
        }
    }


    /* =====================================================
       LOGIN
       ===================================================== */

    async function loginStudent() {

        const supabase =
            getSupabase();

        if (!supabase) {

            showAuthMessage(
                "Authentication service is unavailable."
            );

            return;
        }


        const email =
            $("authEmail")
                ?.value
                .trim() ||
            "";


        const password =
            $("authPassword")
                ?.value ||
            "";


        if (!email) {

            showAuthMessage(
                "Please enter your email."
            );

            return;
        }


        if (!password) {

            showAuthMessage(
                "Please enter your password."
            );

            return;
        }


        const submit =
            $("authSubmit");

        if (submit) {

            submit.disabled =
                true;

            submit.textContent =
                "Signing in...";
        }


        try {

            const {
                data,
                error
            } =
                await supabase.auth.signInWithPassword({

                    email,

                    password
                });


            if (error) {
                throw error;
            }


            if (!data.user) {

                throw new Error(
                    "Login was unsuccessful."
                );
            }


            await createStudentProfile(
                data.user
            );


            await refreshAuthState();


            closeAuthModal();


            notify(
                "Welcome back to ChemLab!",
                "success"
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showAuthMessage(
                getFriendlyAuthError(
                    error
                )
            );

        } finally {

            if (submit) {

                submit.disabled =
                    false;

                submit.textContent =
                    "Sign In";
            }
        }
    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    async function logoutStudent() {

        const supabase =
            getSupabase();

        if (!supabase) {
            return;
        }


        try {

            const {
                error
            } =
                await supabase.auth.signOut();


            if (error) {
                throw error;
            }


            authState.currentUser =
                null;

            authState.currentSession =
                null;

            authState.premium =
                false;

            authState.premiumDetails =
                null;


            closeModal(
                "accountModal"
            );


            updateAuthUI();


            document.dispatchEvent(
                new CustomEvent(
                    "chemlab:auth-change",
                    {
                        detail: {
                            user:
                                null
                        }
                    }
                )
            );


            notify(
                "You have been signed out.",
                "info"
            );


        } catch (error) {

            console.error(
                "Logout error:",
                error
            );


            notify(
                "Unable to sign out right now.",
                "error"
            );
        }
    }


    /* =====================================================
       FRIENDLY AUTH ERRORS
       ===================================================== */

    function getFriendlyAuthError(
        error
    ) {

        const message =
            String(
                error?.message ||
                ""
            ).toLowerCase();


        if (
            message.includes(
                "invalid login credentials"
            )
        ) {

            return "Incorrect email or password.";
        }


        if (
            message.includes(
                "email not confirmed"
            )
        ) {

            return "Please confirm your email before signing in.";
        }


        if (
            message.includes(
                "user already registered"
            )
        ) {

            return "An account with this email already exists.";
        }


        if (
            message.includes(
                "password"
            ) &&
            message.includes(
                "characters"
            )
        ) {

            return "Your password does not meet the required length.";
        }


        if (
            message.includes(
                "rate limit"
            )
        ) {

            return "Too many attempts. Please wait a moment and try again.";
        }


        return (
            error?.message ||
            "Something went wrong. Please try again."
        );
    }


    /* =====================================================
       AUTH UI
       ===================================================== */

    function updateAuthUI() {

        const user =
            authState.currentUser;


        const loggedIn =
            Boolean(user);


        /*
         * Desktop login button
         */

        const loginButton =
            $("loginButton");

        if (loginButton) {

            loginButton.classList.toggle(
                "logged-in",
                loggedIn
            );
        }


        const loginText =
            $("loginButtonText");

        if (loginText) {

            loginText.textContent =
                loggedIn
                    ? "Account"
                    : "Sign In";
        }


        const loginIcon =
            $("loginButtonIcon");

        if (loginIcon) {

            loginIcon.textContent =
                loggedIn
                    ? "👤"
                    : "🔐";
        }


        /*
         * Mobile login button
         */

        const mobileLoginButton =
            $("mobileLoginButton");

        if (mobileLoginButton) {

            mobileLoginButton.textContent =
                loggedIn
                    ? "👤 Account"
                    : "🔐 Sign In";
        }


        /*
         * Account details
         */

        if (loggedIn) {

            const name =
                user.user_metadata?.full_name ||
                user.email?.split("@")[0] ||
                "ChemLab Student";


            setText(
                "accountName",
                name
            );


            setText(
                "accountEmail",
                user.email ||
                    ""
            );
        }


        updateMembershipUI();
    }


    /* =====================================================
       MEMBERSHIP UI
       ===================================================== */

    function updateMembershipUI() {

        const premium =
            authState.premium;


        const status =
            $("membershipStatus");

        if (status) {

            status.textContent =
                premium
                    ? "Premium Member"
                    : "Free Student";

            status.classList.toggle(
                "premium",
                premium
            );
        }


        const premiumAccountStatus =
            $("premiumAccountStatus");

        if (premiumAccountStatus) {

            premiumAccountStatus.textContent =
                premium
                    ? "Active"
                    : "Not Active";
        }


        const details =
            authState.premiumDetails;


        if (details) {

            setText(
                "accountPlan",
                details.plan
                    ? capitalize(
                        details.plan
                    )
                    : "Premium"
            );


            setText(
                "accountExpiry",
                details.expiresAt
                    ? formatDate(
                        details.expiresAt
                    )
                    : "Active"
            );
        } else {

            setText(
                "accountPlan",
                "Free"
            );


            setText(
                "accountExpiry",
                "—"
            );
        }


        const membershipIcon =
            $("membershipIcon");

        if (membershipIcon) {

            membershipIcon.textContent =
                premium
                    ? "💎"
                    : "🎓";
        }


        const premiumDetails =
            $("premiumDetails");

        if (premiumDetails) {

            premiumDetails.classList.toggle(
                "hidden",
                !premium
            );
        }


        const premiumButton =
            $("accountPremiumButton");

        if (premiumButton) {

            premiumButton.textContent =
                premium
                    ? "View Premium"
                    : "Upgrade to Premium";
        }
    }


    function capitalize(
        value
    ) {

        if (!value) {
            return "";
        }

        return (
            value.charAt(0).toUpperCase() +
            value.slice(1)
        );
    }


    function formatDate(
        value
    ) {

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "—";
        }


        return date.toLocaleDateString(
            undefined,
            {
                day:
                    "numeric",

                month:
                    "short",

                year:
                    "numeric"
            }
        );
    }


    /* =====================================================
       ACCOUNT MODAL
       ===================================================== */

    async function openAccountModal() {

        const user =
            await getCurrentUser();


        if (!user) {

            openAuthModal(
                "login"
            );

            return;
        }


        authState.currentUser =
            user;


        await getPremiumStatus(
            true
        );


        updateAuthUI();


        openModal(
            "accountModal"
        );
    }


    function closeAccountModal() {

        closeModal(
            "accountModal"
        );
    }


    /* =====================================================
       PREMIUM MODAL
       ===================================================== */

    function openPremiumModal(
        plan = "yearly"
    ) {

        authState.selectedPlan =
            plan === "monthly"
                ? "monthly"
                : "yearly";


        updatePremiumModal();


        openModal(
            "premiumModal"
        );
    }


    function closePremiumModal() {

        closeModal(
            "premiumModal"
        );
    }


    function updatePremiumModal() {

        const plan =
            authState.selectedPlan;


        const price =
            plan === "monthly"
                ? CONFIG.monthlyPrice
                : CONFIG.yearlyPrice;


        setText(
            "selectedPremiumPlan",
            plan === "monthly"
                ? "Monthly Premium"
                : "Yearly Premium"
        );


        setText(
            "selectedPremiumPrice",
            `GH₵ ${price}`
        );
    }


    function selectPremiumPlan(
        plan
    ) {

        authState.selectedPlan =
            plan === "monthly"
                ? "monthly"
                : "yearly";


        updatePremiumModal();
    }


    /* =====================================================
       PREMIUM PAGE
       ===================================================== */

    function openPremiumPage() {

        closePremiumModal();

        closeAccountModal();


        if (
            typeof window.showPage ===
            "function"
        ) {

            window.showPage(
                "premiumSection"
            );
        }
    }


    /* =====================================================
       START PREMIUM PAYMENT
       ===================================================== */

    async function requestPremiumPlan(
        plan
    ) {

        const selectedPlan =
            plan === "monthly"
                ? "monthly"
                : "yearly";


        const user =
            await getCurrentUser();


        if (!user) {

            closePremiumModal();

            openAuthModal(
                "login"
            );

            notify(
                "Please sign in before purchasing Premium.",
                "info"
            );

            return;
        }


        const active =
            await getPremiumStatus(
                true
            );


        if (active) {

            notify(
                "Your Premium membership is already active.",
                "success"
            );

            closePremiumModal();

            return;
        }


        const supabase =
            getSupabase();

        if (!supabase) {

            notify(
                "Payment service is unavailable.",
                "error"
            );

            return;
        }


        const session =
            await getCurrentSession();


        if (!session?.access_token) {

            notify(
                "Your session has expired. Please sign in again.",
                "error"
            );

            return;
        }


        const button =
            $("startPremiumButton");


        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Preparing payment...";
        }


        try {

            const response =
                await fetch(
                    CONFIG.activatePremiumUrl,
                    {
                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            apikey:
                                CONFIG.supabaseKey,

                            Authorization:
                                `Bearer ${session.access_token}`
                        },

                        body:
                            JSON.stringify({
                                plan:
                                    selectedPlan
                            })
                    }
                );


            const result =
                await response.json();


            if (
                !response.ok
            ) {

                throw new Error(
                    result?.error ||
                    "Unable to start payment."
                );
            }


            const authorizationUrl =
                result?.authorization_url ||
                result?.authorizationUrl ||
                result?.data?.authorization_url;


            const reference =
                result?.reference ||
                result?.data?.reference;


            if (!authorizationUrl) {

                throw new Error(
                    "The payment gateway did not return a checkout link."
                );
            }


            authState.pendingPayment = {

                plan:
                    selectedPlan,

                reference:
                    reference ||
                    null,

                createdAt:
                    new Date().toISOString()
            };


            localStorage.setItem(
                "chemlab_pending_payment",
                JSON.stringify(
                    authState.pendingPayment
                )
            );


            window.location.href =
                authorizationUrl;


        } catch (error) {

            console.error(
                "Premium payment error:",
                error
            );


            notify(
                error?.message ||
                "Unable to start Premium payment.",
                "error"
            );

        } finally {

            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Continue to Payment";
            }
        }
    }


    /* =====================================================
       PAYSTACK VERIFICATION
       ===================================================== */

    async function verifyPaystackPayment(
        reference
    ) {

        if (!reference) {
            return false;
        }


        const session =
            await getCurrentSession();


        if (!session?.access_token) {
            return false;
        }


        try {

            const response =
                await fetch(
                    CONFIG.verifyPaymentUrl,
                    {
                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            apikey:
                                CONFIG.supabaseKey,

                            Authorization:
                                `Bearer ${session.access_token}`
                        },

                        body:
                            JSON.stringify({
                                reference
                            })
                    }
                );


            const result =
                await response.json();


            if (
                !response.ok
            ) {

                throw new Error(
                    result?.error ||
                    "Payment verification failed."
                );
            }


            localStorage.removeItem(
                "chemlab_pending_payment"
            );


            authState.pendingPayment =
                null;


            await getPremiumStatus(
                true
            );


            updateAuthUI();


            notify(
                "Payment verified. Premium is now active!",
                "success"
            );


            if (
                typeof window.showPage ===
                "function"
            ) {

                window.showPage(
                    "premiumSection"
                );
            }


            return true;


        } catch (error) {

            console.error(
                "Payment verification error:",
                error
            );


            notify(
                error?.message ||
                "We could not verify the payment yet.",
                "error"
            );


            return false;
        }
    }


    /* =====================================================
       CHECK PENDING PAYMENT
       ===================================================== */

    async function checkPendingPayment() {

        const stored =
            localStorage.getItem(
                "chemlab_pending_payment"
            );


        if (!stored) {
            return;
        }


        let pending;


        try {

            pending =
                JSON.parse(
                    stored
                );

        } catch {

            localStorage.removeItem(
                "chemlab_pending_payment"
            );

            return;
        }


        authState.pendingPayment =
            pending;


        /*
         * Paystack commonly returns the
         * reference in the URL.
         */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const reference =
            params.get(
                "reference"
            ) ||
            params.get(
                "trxref"
            );


        if (
            reference
        ) {

            await verifyPaystackPayment(
                reference
            );


            /*
             * Remove payment parameters
             * from the browser URL.
             */

            try {

                const cleanUrl =
                    window.location.origin +
                    window.location.pathname;

                window.history.replaceState(
                    {},
                    document.title,
                    cleanUrl
                );

            } catch {
                /* Ignore URL cleanup errors */
            }


            return;
        }


        /*
         * If the payment reference was already
         * stored by the activation function,
         * attempt verification.
         */

        if (
            pending.reference
        ) {

            await verifyPaystackPayment(
                pending.reference
            );
        }
    }


    /* =====================================================
       AUTH STATE REFRESH
       ===================================================== */

    async function refreshAuthState() {

        const session =
            await getCurrentSession();


        authState.currentSession =
            session;


        authState.currentUser =
            session?.user ||
            null;


        if (
            authState.currentUser
        ) {

            await createStudentProfile(
                authState.currentUser
            );


            await getPremiumStatus(
                true
            );

        } else {

            authState.premium =
                false;

            authState.premiumDetails =
                null;
        }


        updateAuthUI();


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:auth-change",
                {
                    detail: {

                        user:
                            authState.currentUser,

                        session:
                            authState.currentSession,

                        premium:
                            authState.premium
                    }
                }
            )
        );
    }


    /* =====================================================
       AUTH LISTENER
       ===================================================== */

    function initializeAuthListener() {

        const supabase =
            getSupabase();

        if (!supabase) {
            return;
        }


        supabase.auth.onAuthStateChange(
            (
                event,
                session
            ) => {

                authState.currentSession =
                    session ||
                    null;

                authState.currentUser =
                    session?.user ||
                    null;


                /*
                 * Avoid doing heavy database work
                 * directly inside the auth callback.
                 */

                setTimeout(
                    async () => {

                        await refreshAuthState();

                    },
                    0
                );
            }
        );
    }


    /* =====================================================
       BUTTON EVENTS
       ===================================================== */

    function bindEvents() {

        /*
         * Desktop login/account button
         */

        const loginButton =
            $("loginButton");

        if (loginButton) {

            loginButton.addEventListener(
                "click",
                () => {

                    if (
                        authState.currentUser
                    ) {

                        openAccountModal();

                    } else {

                        openAuthModal(
                            "login"
                        );
                    }
                }
            );
        }


        /*
         * Mobile login/account button
         */

        const mobileLoginButton =
            $("mobileLoginButton");

        if (mobileLoginButton) {

            mobileLoginButton.addEventListener(
                "click",
                () => {

                    if (
                        authState.currentUser
                    ) {

                        openAccountModal();

                    } else {

                        openAuthModal(
                            "login"
                        );
                    }

                    if (
                        typeof window.closeMobileNavigation ===
                        "function"
                    ) {
                        window.closeMobileNavigation();
                    }
                }
            );
        }


        /*
         * Auth modal close
         */

        const closeAuth =
            $("closeAuthModal");

        if (closeAuth) {

            closeAuth.addEventListener(
                "click",
                closeAuthModal
            );
        }


        /*
         * Auth submit
         */

        const authSubmit =
            $("authSubmit");

        if (authSubmit) {

            authSubmit.addEventListener(
                "click",
                () => {

                    if (
                        authState.mode ===
                        "signup"
                    ) {

                        signUpStudent();

                    } else {

                        loginStudent();
                    }
                }
            );
        }


        /*
         * Auth switch
         */

        const authSwitch =
            $("authSwitch");

        if (authSwitch) {

            authSwitch.addEventListener(
                "click",
                () => {

                    authState.mode =
                        authState.mode ===
                        "login"
                            ? "signup"
                            : "login";

                    updateAuthModal();
                }
            );
        }


        /*
         * Enter key in auth form
         */

        [
            "authName",
            "authEmail",
            "authPassword"
        ].forEach(
            id => {

                const input =
                    $(id);

                if (!input) {
                    return;
                }

                input.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            event.preventDefault();

                            if (
                                authState.mode ===
                                "signup"
                            ) {

                                signUpStudent();

                            } else {

                                loginStudent();
                            }
                        }
                    }
                );
            }
        );


        /*
         * Account modal
         */

        const closeAccount =
            $("closeAccountModal");

        if (closeAccount) {

            closeAccount.addEventListener(
                "click",
                closeAccountModal
            );
        }


        /*
         * Logout
         */

        const logoutButton =
            $("logoutButton");

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutStudent
            );
        }


        /*
         * Account premium button
         */

        const accountPremiumButton =
            $("accountPremiumButton");

        if (accountPremiumButton) {

            accountPremiumButton.addEventListener(
                "click",
                () => {

                    if (
                        authState.premium
                    ) {

                        closeAccountModal();

                        if (
                            typeof window.showPage ===
                            "function"
                        ) {
                            window.showPage(
                                "premiumSection"
                            );
                        }

                    } else {

                        closeAccountModal();

                        openPremiumModal(
                            "yearly"
                        );
                    }
                }
            );
        }


        /*
         * Premium modal
         */

        const closePremium =
            $("closePremiumModal");

        if (closePremium) {

            closePremium.addEventListener(
                "click",
                closePremiumModal
            );
        }


        /*
         * Premium checkout
         */

        const startPremium =
            $("startPremiumButton");

        if (startPremium) {

            startPremium.addEventListener(
                "click",
                () =>
                    requestPremiumPlan(
                        authState.selectedPlan
                    )
            );
        }


        /*
         * Premium plan buttons
         */

        document
            .querySelectorAll(
                ".premium-plan-button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const plan =
                            button.dataset.plan ||
                            "yearly";

                        openPremiumModal(
                            plan
                        );
                    }
                );
            });


        /*
         * Close modal by clicking backdrop.
         */

        [
            "authModal",
            "accountModal",
            "premiumModal"
        ].forEach(
            id => {

                const modal =
                    $(id);

                if (!modal) {
                    return;
                }

                modal.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target ===
                            modal
                        ) {

                            closeModal(
                                id
                            );
                        }
                    }
                );
            }
        );


        /*
         * Escape key
         */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }

                closeAuthModal();

                closeAccountModal();

                closePremiumModal();
            }
        );
    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    async function initializeAuth() {

        bindEvents();

        initializeAuthListener();

        await refreshAuthState();

        await checkPendingPayment();

        updateAuthUI();


        console.log(
            "ChemLab authentication initialized successfully."
        );
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAuth,
            {
                once:
                    true
            }
        );

    } else {

        initializeAuth();
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.openAuthModal =
        openAuthModal;

    window.closeAuthModal =
        closeAuthModal;

    window.signUpStudent =
        signUpStudent;

    window.loginStudent =
        loginStudent;

    window.logoutStudent =
        logoutStudent;

    window.openAccountModal =
        openAccountModal;

    window.closeAccountModal =
        closeAccountModal;

    window.openPremiumModal =
        openPremiumModal;

    window.closePremiumModal =
        closePremiumModal;

    window.openPremiumPage =
        openPremiumPage;

    window.selectPremiumPlan =
        selectPremiumPlan;

    window.requestPremiumPlan =
        requestPremiumPlan;

    window.verifyPaystackPayment =
        verifyPaystackPayment;

    window.updateAuthUI =
        updateAuthUI;

})();
