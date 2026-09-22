/* =========================================================
   CHEMLAB AUTH + PREMIUM
   Clean single-file version
   ========================================================= */

"use strict";

/* =========================================================
   1. CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://zscbgeaieiqwknhjxpnt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy";

const AUTH_FUNCTION_URL =
    `${SUPABASE_URL}/functions/v1/activate-premium`;

const VERIFY_FUNCTION_URL =
    `${SUPABASE_URL}/functions/v1/verify-paystack-payment`;

const CHEMLAB_CALLBACK_URL =
    "https://ernestokyere.github.io/CHEMISTRY-VIRTUAL-LAB-/";


/* =========================================================
   2. SUPABASE CLIENT
   ========================================================= */

let supabaseClient = null;
let authMode = "signin";
let authListenerRegistered = false;

function initializeSupabase() {

    if (supabaseClient) {
        return supabaseClient;
    }

    if (!window.supabase || !window.supabase.createClient) {
        console.error("Supabase library was not loaded.");
        return null;
    }

    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    return supabaseClient;
}


/* =========================================================
   3. BASIC HELPERS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}

function showAuthMessage(message, type = "info") {

    const element = getElement("authMessage");

    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = "auth-message";

    if (type === "error") {
        element.classList.add("error");
    }

    if (type === "success") {
        element.classList.add("success");
    }
}

function showAuthNotification(message, type = "info") {

    if (typeof window.showNotification === "function") {
        window.showNotification(message, type);
        return;
    }

    const notification = getElement("notification");

    if (!notification) {
        console.log(message);
        return;
    }

    notification.textContent = message;
    notification.hidden = false;

    clearTimeout(window.__chemLabNotificationTimer);

    window.__chemLabNotificationTimer = setTimeout(() => {
        notification.hidden = true;
    }, 4000);
}

function formatDate(dateValue) {

    if (!dateValue) {
        return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


/* =========================================================
   4. CURRENT USER
   ========================================================= */

async function getCurrentUser() {

    const client = initializeSupabase();

    if (!client) {
        return null;
    }

    try {

        const {
            data,
            error
        } = await client.auth.getUser();

        if (error) {
            console.error("Could not get current user:", error);
            return null;
        }

        return data?.user || null;

    } catch (error) {

        console.error("getCurrentUser error:", error);
        return null;
    }
}

async function getCurrentStudent() {
    return await getCurrentUser();
}


/* =========================================================
   5. SIGN UP
   ========================================================= */

async function signUpStudent(fullName, email, password) {

    const client = initializeSupabase();

    if (!client) {
        return {
            success: false,
            error: "Supabase is not available."
        };
    }

    const cleanName = String(fullName || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanName) {
        return {
            success: false,
            error: "Please enter your full name."
        };
    }

    if (!cleanEmail) {
        return {
            success: false,
            error: "Please enter your email."
        };
    }

    if (!password || password.length < 6) {
        return {
            success: false,
            error: "Password must be at least 6 characters."
        };
    }

    try {

        const {
            data,
            error
        } = await client.auth.signUp({
            email: cleanEmail,
            password: password,
            options: {
                data: {
                    full_name: cleanName
                }
            }
        });

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: true,
            user: data?.user || null,
            session: data?.session || null
        };

    } catch (error) {

        console.error("signUpStudent error:", error);

        return {
            success: false,
            error: error.message || "Unable to create account."
        };
    }
}


/* =========================================================
   6. LOGIN
   ========================================================= */

async function loginStudent(email, password) {

    const client = initializeSupabase();

    if (!client) {
        return {
            success: false,
            error: "Supabase is not available."
        };
    }

    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanEmail || !password) {
        return {
            success: false,
            error: "Please enter your email and password."
        };
    }

    try {

        const {
            data,
            error
        } = await client.auth.signInWithPassword({
            email: cleanEmail,
            password: password
        });

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: true,
            user: data?.user || null,
            session: data?.session || null
        };

    } catch (error) {

        console.error("loginStudent error:", error);

        return {
            success: false,
            error: error.message || "Unable to sign in."
        };
    }
}


/* =========================================================
   7. LOGOUT
   ========================================================= */

async function logoutStudent() {

    const client = initializeSupabase();

    if (!client) {
        return;
    }

    try {

        const { error } = await client.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            showAuthNotification(error.message, "error");
            return;
        }

        closeAccountModal();

        updateAuthUI(null);

        showAuthNotification(
            "You have been signed out.",
            "success"
        );

    } catch (error) {

        console.error("logoutStudent error:", error);

        showAuthNotification(
            "Unable to sign out.",
            "error"
        );
    }
}


/* =========================================================
   8. PREMIUM STATUS
   ========================================================= */

async function getPremiumStatus() {

    const client = initializeSupabase();

    if (!client) {
        return {
            loggedIn: false,
            isPremium: false,
            premium: false,
            expiresAt: null,
            plan: null
        };
    }

    try {

        const user = await getCurrentUser();

        if (!user) {

            return {
                loggedIn: false,
                isPremium: false,
                premium: false,
                expiresAt: null,
                plan: null
            };
        }

        const {
            data: profile,
            error: profileError
        } = await client
            .from("profiles")
            .select("is_premium, premium_expires_at")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
            console.error(
                "Premium profile lookup failed:",
                profileError
            );
        }

        const expiresAt =
            profile?.premium_expires_at || null;

        const expiryTime =
            expiresAt
                ? new Date(expiresAt).getTime()
                : 0;

        const notExpired =
            !expiresAt ||
            expiryTime > Date.now();

        const isPremium =
            profile?.is_premium === true &&
            notExpired;

        let plan = null;

        if (isPremium) {

            const {
                data: subscription,
                error: subscriptionError
            } = await client
                .from("subscriptions")
                .select("plan, expires_at, created_at")
                .eq("user_id", user.id)
                .eq("status", "active")
                .order("created_at", {
                    ascending: false
                })
                .limit(1)
                .maybeSingle();

            if (subscriptionError) {

                console.warn(
                    "Subscription lookup failed:",
                    subscriptionError
                );

            } else {

                plan = subscription?.plan || null;
            }
        }

        return {
            loggedIn: true,
            isPremium: isPremium,
            premium: isPremium,
            expiresAt: expiresAt,
            plan: plan
        };

    } catch (error) {

        console.error(
            "getPremiumStatus error:",
            error
        );

        return {
            loggedIn: true,
            isPremium: false,
            premium: false,
            expiresAt: null,
            plan: null
        };
    }
}


/* =========================================================
   9. AUTH MODAL
   ========================================================= */

function openAuthModal(mode = "signin") {

    const modal = getElement("authModal");

    if (!modal) {
        return;
    }

    authMode =
        mode === "signup"
            ? "signup"
            : "signin";

    updateAuthModal();

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    const email = getElement("authEmail");

    if (email) {
        setTimeout(() => email.focus(), 100);
    }
}

function closeAuthModal() {

    const modal = getElement("authModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

    showAuthMessage("");
}

function updateAuthModal() {

    const title = getElement("authTitle");
    const subtitle = getElement("authSubtitle");
    const nameField = getElement("nameField");
    const submit = getElement("authSubmit");
    const switchText = getElement("authSwitchText");
    const switchButton = getElement("authSwitch");

    const signup = authMode === "signup";

    if (title) {
        title.textContent =
            signup
                ? "Create Your ChemLab Account"
                : "Welcome Back";
    }

    if (subtitle) {
        subtitle.textContent =
            signup
                ? "Create your student account to continue."
                : "Sign in to continue learning.";
    }

    if (nameField) {
        nameField.style.display =
            signup ? "block" : "none";
    }

    if (submit) {
        submit.textContent =
            signup
                ? "Create Account"
                : "Sign In";
    }

    if (switchText) {
        switchText.textContent =
            signup
                ? "Already have an account?"
                : "Don't have an account?";
    }

    if (switchButton) {
        switchButton.textContent =
            signup
                ? "Sign In"
                : "Create one";
    }

    showAuthMessage("");
}

function switchAuthMode() {

    authMode =
        authMode === "signin"
            ? "signup"
            : "signin";

    updateAuthModal();
}


/* =========================================================
   10. AUTH SUBMIT
   ========================================================= */

async function submitAuthForm() {

    const submitButton = getElement("authSubmit");

    const name =
        getElement("authName")?.value.trim() || "";

    const email =
        getElement("authEmail")?.value.trim() || "";

    const password =
        getElement("authPassword")?.value || "";

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent =
            authMode === "signup"
                ? "Creating..."
                : "Signing in...";
    }

    showAuthMessage("Please wait...");

    try {

        if (authMode === "signup") {

            const result =
                await signUpStudent(
                    name,
                    email,
                    password
                );

            if (!result.success) {

                showAuthMessage(
                    result.error,
                    "error"
                );

                return;
            }

            if (!result.session) {

                showAuthMessage(
                    "Account created. Check your email to confirm your account.",
                    "success"
                );

            } else {

                showAuthMessage(
                    "Account created successfully.",
                    "success"
                );

                closeAuthModal();
            }

        } else {

            const result =
                await loginStudent(
                    email,
                    password
                );

            if (!result.success) {

                showAuthMessage(
                    result.error,
                    "error"
                );

                return;
            }

            showAuthNotification(
                "Welcome back to ChemLab!",
                "success"
            );

            closeAuthModal();

            await updateAuthUI(result.user);
            await updateAccountUI();
        }

    } catch (error) {

        console.error(
            "submitAuthForm error:",
            error
        );

        showAuthMessage(
            error.message ||
            "Something went wrong.",
            "error"
        );

    } finally {

        if (submitButton) {
            submitButton.disabled = false;

            submitButton.textContent =
                authMode === "signup"
                    ? "Create Account"
                    : "Sign In";
        }
    }
}


/* =========================================================
   11. AUTH UI
   ========================================================= */

async function updateAuthUI(user = undefined) {

    if (user === undefined) {
        user = await getCurrentUser();
    }

    const loginButton =
        getElement("loginButton");

    if (!loginButton) {
        return;
    }

    if (!user) {

        loginButton.textContent =
            "Sign In";

        loginButton.onclick = () =>
            openAuthModal("signin");

        return;
    }

    const name =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Account";

    loginButton.textContent =
        `👤 ${name}`;

    loginButton.onclick =
        openAccountModal;
}


/* =========================================================
   12. ACCOUNT MODAL
   ========================================================= */

function openAccountModal() {

    const modal =
        getElement("accountModal");

    if (!modal) {
        return;
    }

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    updateAccountUI();
}

function closeAccountModal() {

    const modal =
        getElement("accountModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
}

async function updateAccountUI() {

    const user =
        await getCurrentUser();

    if (!user) {
        return;
    }

    const name =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Student";

    const accountName =
        getElement("accountName");

    const accountEmail =
        getElement("accountEmail");

    if (accountName) {
        accountName.textContent = name;
    }

    if (accountEmail) {
        accountEmail.textContent =
            user.email || "—";
    }

    const status =
        await getPremiumStatus();

    const membershipStatus =
        getElement("membershipStatus");

    const membershipIcon =
        getElement("membershipIcon");

    const premiumAccountStatus =
        getElement("premiumAccountStatus");

    const premiumDetails =
        getElement("premiumDetails");

    const accountPlan =
        getElement("accountPlan");

    const accountExpiry =
        getElement("accountExpiry");

    const accountPremiumButton =
        getElement("accountPremiumButton");

    if (status.isPremium) {

        if (membershipStatus) {
            membershipStatus.textContent =
                "PREMIUM";
        }

        if (membershipIcon) {
            membershipIcon.textContent = "👑";
        }

        if (premiumAccountStatus) {
            premiumAccountStatus.innerHTML =
                "<strong>👑 Premium Active</strong>" +
                "<span>You have access to ChemLab Premium.</span>";
        }

        if (premiumDetails) {
            premiumDetails.classList.remove("hidden");
        }

        if (accountPlan) {
            accountPlan.textContent =
                status.plan
                    ? status.plan.toUpperCase()
                    : "PREMIUM";
        }

        if (accountExpiry) {
            accountExpiry.textContent =
                formatDate(status.expiresAt);
        }

        if (accountPremiumButton) {
            accountPremiumButton.textContent =
                "👑 Premium Active";
        }

    } else {

        if (membershipStatus) {
            membershipStatus.textContent =
                "FREE";
        }

        if (membershipIcon) {
            membershipIcon.textContent = "🔒";
        }

        if (premiumAccountStatus) {
            premiumAccountStatus.innerHTML =
                "<strong>🔒 Not active</strong>" +
                "<span>Unlock advanced ChemLab features.</span>";
        }

        if (premiumDetails) {
            premiumDetails.classList.add("hidden");
        }

        if (accountPremiumButton) {
            accountPremiumButton.textContent =
                "👑 Explore Premium";
        }
    }
}


/* =========================================================
   13. PREMIUM PAGE
   ========================================================= */

function openPremiumPage() {

    closePremiumModal();
    closeAccountModal();

    const premiumSection =
        document.getElementById("premiumSection");

    if (!premiumSection) {
        console.error(
            "ChemLab: premiumSection was not found."
        );
        return;
    }

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
        page.style.display = "";
    });

    premiumSection.classList.add("active");
    premiumSection.style.display = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
/* =========================================================
   14. PREMIUM MODAL
   ========================================================= */

function openPremiumModal() {

    const modal =
        getElement("premiumModal");

    if (!modal) {
        openPremiumPage();
        return;
    }

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
}

function closePremiumModal() {

    const modal =
        getElement("premiumModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
}


/* =========================================================
   15. REQUEST PREMIUM PAYMENT
   ========================================================= */

async function requestPremiumPlan(plan) {

    const cleanPlan =
        String(plan || "").toLowerCase();

    if (
        cleanPlan !== "monthly" &&
        cleanPlan !== "yearly"
    ) {
        showAuthNotification(
            "Invalid premium plan.",
            "error"
        );

        return;
    }

    const user =
        await getCurrentUser();

    if (!user) {

        showAuthNotification(
            "Please sign in before purchasing Premium.",
            "error"
        );

        openAuthModal("signin");
        return;
    }

    const premiumStatus =
        await getPremiumStatus();

    if (premiumStatus.isPremium) {

        showAuthNotification(
            "Your Premium membership is already active.",
            "success"
        );

        openAccountModal();
        return;
    }

    const client =
        initializeSupabase();

    if (!client) {
        showAuthNotification(
            "Supabase is not available.",
            "error"
        );
        return;
    }

    showAuthNotification(
        "Preparing secure payment...",
        "info"
    );

    try {

        const {
            data: sessionData,
            error: sessionError
        } = await client.auth.getSession();

        if (sessionError) {
            throw sessionError;
        }

        const accessToken =
            sessionData?.session?.access_token;

        if (!accessToken) {

            showAuthNotification(
                "Your session has expired. Please sign in again.",
                "error"
            );

            openAuthModal("signin");
            return;
        }

        const response =
            await fetch(
                AUTH_FUNCTION_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`,

                        "apikey":
                            SUPABASE_KEY
                    },

                    body: JSON.stringify({
                        plan: cleanPlan
                    })
                }
            );

        const rawText =
            await response.text();

        let data = {};

        try {
            data = rawText
                ? JSON.parse(rawText)
                : {};
        } catch {
            data = {
                error: rawText ||
                    "Invalid server response."
            };
        }

        if (
            !response.ok ||
            !data.authorization_url
        ) {

            console.error(
                "Premium initialization failed:",
                data
            );

            throw new Error(
                data.error ||
                data.message ||
                "Unable to start Premium payment."
            );
        }

        /*
         * Save only non-sensitive transaction information.
         * Never store the Paystack secret key here.
         */
        if (data.reference) {

            sessionStorage.setItem(
                "chemlab_payment_reference",
                data.reference
            );
        }

        if (data.subscription_id) {

            sessionStorage.setItem(
                "chemlab_subscription_id",
                data.subscription_id
            );
        }

        sessionStorage.setItem(
            "chemlab_payment_plan",
            cleanPlan
        );

        /*
         * Paystack redirects the customer to the
         * callback URL configured by the backend/dashboard.
         */
        window.location.assign(
            data.authorization_url
        );

    } catch (error) {

        console.error(
            "requestPremiumPlan error:",
            error
        );

        showAuthNotification(
            error.message ||
            "Unable to start payment.",
            "error"
        );
    }
}


/* =========================================================
   16. PREMIUM EXPERIMENT ACCESS
   ========================================================= */

async function handlePremiumExperiment(button) {

    const user =
        await getCurrentUser();

    if (!user) {

        showAuthNotification(
            "Please sign in to access Premium experiments.",
            "error"
        );

        openAuthModal("signin");
        return;
    }

    const status =
        await getPremiumStatus();

    if (!status.isPremium) {

        showAuthNotification(
            "This experiment requires ChemLab Premium.",
            "error"
        );

        openPremiumModal();
        return;
    }

    const experiment =
        button?.dataset?.experiment || "";

    if (
        experiment ===
        "Advanced Acid-Base Titration"
    ) {

        if (
            typeof window.openAdvancedTitration ===
            "function"
        ) {
            window.openAdvancedTitration();
        } else {

            showAuthNotification(
                "Advanced Titration is not available yet.",
                "error"
            );
        }

        return;
    }

    showAuthNotification(
        "Premium experiment unlocked.",
        "success"
    );
}


/* =========================================================
   17. PAYSTACK RETURN HANDLER
   ========================================================= */

async function handlePaystackReturn() {

    const url =
        new URL(window.location.href);

    const referenceFromURL =
        url.searchParams.get("reference");

    const storedReference =
        sessionStorage.getItem(
            "chemlab_payment_reference"
        );

    /*
     * Paystack normally returns:
     *
     * ?reference=YOUR_REFERENCE
     *
     * The URL reference is preferred.
     */
    const reference =
        referenceFromURL ||
        storedReference;

    if (!reference) {
        return;
    }

    /*
     * Avoid repeatedly verifying the same callback
     * during the same page session.
     */
    const processingKey =
        "chemlab_processing_reference";

    const alreadyProcessing =
        sessionStorage.getItem(processingKey);

    if (alreadyProcessing === reference) {
        return;
    }

    sessionStorage.setItem(
        processingKey,
        reference
    );

    try {

        const client =
            initializeSupabase();

        if (!client) {
            throw new Error(
                "Supabase is not available."
            );
        }

        const user =
            await getCurrentUser();

        if (!user) {

            /*
             * Keep the reference so verification can
             * happen after the user signs back in.
             */
            sessionStorage.setItem(
                "chemlab_payment_reference",
                reference
            );

            showAuthNotification(
                "Please sign in to finish verifying your payment.",
                "error"
            );

            openAuthModal("signin");

            sessionStorage.removeItem(
                processingKey
            );

            return;
        }

        const {
            data: sessionData,
            error: sessionError
        } = await client.auth.getSession();

        if (sessionError) {
            throw sessionError;
        }

        const accessToken =
            sessionData?.session?.access_token;

        if (!accessToken) {
            throw new Error(
                "Your login session has expired. Please sign in again."
            );
        }

        showAuthNotification(
            "Verifying your payment...",
            "info"
        );

        const response =
            await fetch(
                VERIFY_FUNCTION_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`,

                        "apikey":
                            SUPABASE_KEY
                    },

                    body: JSON.stringify({
                        reference: reference
                    })
                }
            );

        const rawText =
            await response.text();

        let data = {};

        try {
            data = rawText
                ? JSON.parse(rawText)
                : {};
        } catch {
            data = {
                error: rawText ||
                    "Invalid verification response."
            };
        }

        if (
            !response.ok ||
            data.success !== true
        ) {

            throw new Error(
                data.error ||
                data.message ||
                "Payment could not be verified yet."
            );
        }

        /*
         * Verification succeeded.
         */
        sessionStorage.removeItem(
            "chemlab_payment_reference"
        );

        sessionStorage.removeItem(
            "chemlab_subscription_id"
        );

        sessionStorage.removeItem(
            "chemlab_payment_plan"
        );

        sessionStorage.removeItem(
            processingKey
        );

        /*
         * Remove Paystack reference from browser URL.
         */
        url.searchParams.delete("reference");
        url.searchParams.delete("payment");

        window.history.replaceState(
            {},
            document.title,
            url.pathname +
            url.search +
            url.hash
        );

        showAuthNotification(
            "🎉 Premium activated successfully!",
            "success"
        );

        await updateAccountUI();

        openPremiumPage();

    } catch (error) {

        console.error(
            "handlePaystackReturn error:",
            error
        );

        sessionStorage.removeItem(
            processingKey
        );

        /*
         * Do not delete the reference on a temporary
         * verification failure. The webhook may still
         * activate the subscription.
         */
        showAuthNotification(
            error.message ||
            "Payment verification is still processing.",
            "error"
        );
    }
}


/* =========================================================
   18. CLOSE MODALS WITH ESCAPE
   ========================================================= */

function handleEscapeKey(event) {

    if (event.key !== "Escape") {
        return;
    }

    closeAuthModal();
    closeAccountModal();
    closePremiumModal();
}


/* =========================================================
   19. DOM INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "ChemLab auth system initializing..."
        );

        const client =
            initializeSupabase();

        if (!client) {
            console.error(
                "ChemLab could not initialize Supabase."
            );
            return;
        }

        /*
         * -----------------------------------------------
         * Auth modal buttons
         * -----------------------------------------------
         */

        const loginButton =
            getElement("loginButton");

        if (loginButton) {

            loginButton.addEventListener(
                "click",
                async function (event) {

                    /*
                     * We only use this listener if the
                     * button has not already been assigned
                     * an account action.
                     */
                    const user =
                        await getCurrentUser();

                    if (user) {
                        openAccountModal();
                    } else {
                        openAuthModal("signin");
                    }
                }
            );
        }

        const closeAuth =
            getElement("closeAuthModal");

        if (closeAuth) {

            closeAuth.addEventListener(
                "click",
                closeAuthModal
            );
        }

        const authSwitch =
            getElement("authSwitch");

        if (authSwitch) {

            authSwitch.addEventListener(
                "click",
                switchAuthMode
            );
        }

        const authSubmit =
            getElement("authSubmit");

        if (authSubmit) {

            authSubmit.addEventListener(
                "click",
                submitAuthForm
            );
        }

        const authPassword =
            getElement("authPassword");

        if (authPassword) {

            authPassword.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {
                        submitAuthForm();
                    }
                }
            );
        }

        /*
         * -----------------------------------------------
         * Account modal
         * -----------------------------------------------
         */

        const closeAccount =
            getElement("closeAccountModal");

        if (closeAccount) {

            closeAccount.addEventListener(
                "click",
                closeAccountModal
            );
        }

        const logoutButton =
            getElement("logoutButton");

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutStudent
            );
        }

        const accountPremiumButton =
            getElement("accountPremiumButton");

        if (accountPremiumButton) {

            accountPremiumButton.addEventListener(
                "click",
                async function () {

                    const status =
                        await getPremiumStatus();

                    if (status.isPremium) {
                        closeAccountModal();
                        openPremiumPage();
                    } else {
                        closeAccountModal();
                        openPremiumModal();
                    }
                }
            );
        }

        /*
         * -----------------------------------------------
         * Premium modal
         * -----------------------------------------------
         */

        const closePremium =
            getElement("closePremiumModal");

        if (closePremium) {

            closePremium.addEventListener(
                "click",
                closePremiumModal
            );
        }

        const startPremium =
            getElement("startPremiumButton");

        if (startPremium) {

            startPremium.addEventListener(
                "click",
                function () {

                    closePremiumModal();
                    openPremiumPage();
                }
            );
        }

        /*
         * -----------------------------------------------
         * Premium plan buttons
         * -----------------------------------------------
         */

        const planButtons =
            document.querySelectorAll(
                ".premium-plan-button"
            );

        planButtons.forEach(
            function (button) {

                /*
                 * Prevent duplicate listeners if
                 * initialization is accidentally called again.
                 */
                if (
                    button.dataset.chemlabAuthBound ===
                    "true"
                ) {
                    return;
                }

                button.dataset.chemlabAuthBound =
                    "true";

                button.addEventListener(
                    "click",
                    function () {

                        const plan =
                            button.dataset.plan;

                        requestPremiumPlan(plan);
                    }
                );
            }
        );

        /*
         * -----------------------------------------------
         * Premium experiment buttons
         * -----------------------------------------------
         */

        const premiumExperiments =
            document.querySelectorAll(
                ".premium-experiment-button"
            );

        premiumExperiments.forEach(
            function (button) {

                if (
                    button.dataset.chemlabAuthBound ===
                    "true"
                ) {
                    return;
                }

                button.dataset.chemlabAuthBound =
                    "true";

                button.addEventListener(
                    "click",
                    function () {
                        handlePremiumExperiment(
                            button
                        );
                    }
                );
            }
        );

        /*
         * -----------------------------------------------
         * Global keyboard handling
         * -----------------------------------------------
         */

        document.addEventListener(
            "keydown",
            handleEscapeKey
        );

        /*
         * -----------------------------------------------
         * Initial authentication state
         * -----------------------------------------------
         */

        const currentUser =
            await getCurrentUser();

        await updateAuthUI(
            currentUser
        );

        if (currentUser) {
            await updateAccountUI();
        }

        /*
         * -----------------------------------------------
         * Supabase auth state listener
         * -----------------------------------------------
         */

        if (!authListenerRegistered) {

            authListenerRegistered = true;

            client.auth.onAuthStateChange(
                async function (event, session) {

                    console.log(
                        "ChemLab auth event:",
                        event
                    );

                    const user =
                        session?.user || null;

                    await updateAuthUI(user);

                    if (user) {
                        await updateAccountUI();
                    }
                }
            );
        }

        /*
         * -----------------------------------------------
         * Paystack callback
         * -----------------------------------------------
         */

        await handlePaystackReturn();

        console.log(
            "ChemLab auth system ready."
        );
    }
);


/* =========================================================
   20. GLOBAL FUNCTIONS
   ========================================================= */

window.initializeSupabase =
    initializeSupabase;

window.getCurrentUser =
    getCurrentUser;

window.getCurrentStudent =
    getCurrentStudent;

window.signUpStudent =
    signUpStudent;

window.loginStudent =
    loginStudent;

window.logoutStudent =
    logoutStudent;

window.getPremiumStatus =
    getPremiumStatus;

window.openAuthModal =
    openAuthModal;

window.closeAuthModal =
    closeAuthModal;

window.switchAuthMode =
    switchAuthMode;

window.submitAuthForm =
    submitAuthForm;

window.openAccountModal =
    openAccountModal;

window.closeAccountModal =
    closeAccountModal;

window.updateAccountUI =
    updateAccountUI;

window.openPremiumPage =
    openPremiumPage;

window.openPremiumModal =
    openPremiumModal;

window.closePremiumModal =
    closePremiumModal;

window.requestPremiumPlan =
    requestPremiumPlan;

window.handlePremiumExperiment =
    handlePremiumExperiment;

window.handlePaystackReturn =
    handlePaystackReturn;
