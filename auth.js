/* =========================================================
   CHEMLAB — AUTHENTICATION + PREMIUM SYSTEM
   Complete replacement auth.js
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://zscbgeaieiqwknhjxpnt.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy";


/* =========================================================
   SUPABASE CLIENT
   ========================================================= */

let chemLabSupabase = null;


function initializeSupabase() {

    if (
        window.supabase &&
        typeof window.supabase.createClient ===
            "function"
    ) {

        chemLabSupabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );

        console.log(
            "✅ ChemLab Supabase initialized."
        );

        return true;
    }


    console.error(
        "❌ Supabase library was not loaded before auth.js."
    );

    return false;
}


initializeSupabase();


/* =========================================================
   SUPABASE READY CHECK
   ========================================================= */

function supabaseReady() {

    return !!chemLabSupabase;
}


/* =========================================================
   HELPER
   ========================================================= */

function getElement(id) {

    return document.getElementById(id);
}


/* =========================================================
   SIGN UP
   ========================================================= */

async function signUpStudent(
    fullName,
    email,
    password
) {

    if (!supabaseReady()) {

        return {
            success: false,
            message:
                "ChemLab authentication is not ready. Please refresh the page."
        };
    }


    const cleanName =
        String(fullName || "")
            .trim();


    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    if (
        !cleanName ||
        !cleanEmail ||
        !password
    ) {

        return {
            success: false,
            message:
                "Please complete all fields."
        };
    }


    if (password.length < 6) {

        return {
            success: false,
            message:
                "Password must contain at least 6 characters."
        };
    }


    try {

        const {
            data,
            error
        } =
            await chemLabSupabase.auth.signUp({
                email: cleanEmail,

                password: password,

                options: {
                    data: {
                        full_name:
                            cleanName
                    }
                }
            });


        if (error) {

            console.error(
                "Sign up error:",
                error
            );

            return {
                success: false,
                message:
                    error.message
            };
        }


        return {

            success: true,

            user:
                data?.user ||
                null,

            session:
                data?.session ||
                null,

            message:
                data?.session
                    ? "Account created successfully!"
                    : "Account created. Please check your email to confirm your account."
        };


    } catch (error) {

        console.error(
            "Unexpected sign up error:",
            error
        );


        return {
            success: false,
            message:
                "Unable to create the account right now."
        };
    }
}


/* =========================================================
   LOGIN
   ========================================================= */

async function loginStudent(
    email,
    password
) {

    if (!supabaseReady()) {

        return {
            success: false,
            message:
                "ChemLab authentication is not ready. Please refresh the page."
        };
    }


    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    if (
        !cleanEmail ||
        !password
    ) {

        return {
            success: false,
            message:
                "Please enter your email and password."
        };
    }


    try {

        const {
            data,
            error
        } =
            await chemLabSupabase.auth
                .signInWithPassword({
                    email:
                        cleanEmail,

                    password:
                        password
                });


        if (error) {

            console.error(
                "Login error:",
                error
            );


            return {
                success: false,
                message:
                    error.message
            };
        }


        return {

            success: true,

            user:
                data?.user ||
                null,

            session:
                data?.session ||
                null,

            message:
                "Login successful."
        };


    } catch (error) {

        console.error(
            "Unexpected login error:",
            error
        );


        return {
            success: false,
            message:
                "Unable to sign in right now."
        };
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logoutStudent() {

    if (!supabaseReady()) {

        return {
            success: false,
            message:
                "Authentication system is unavailable."
        };
    }


    try {

        const {
            error
        } =
            await chemLabSupabase.auth
                .signOut();


        if (error) {

            console.error(
                "Logout error:",
                error
            );


            return {
                success: false,
                message:
                    error.message
            };
        }


        return {

            success: true,

            message:
                "You have been signed out."
        };


    } catch (error) {

        console.error(
            "Unexpected logout error:",
            error
        );


        return {
            success: false,
            message:
                "Unable to sign out."
        };
    }
}


/* =========================================================
   GET CURRENT USER
   ========================================================= */

async function getCurrentUser() {

    if (!supabaseReady()) {
        return null;
    }


    try {

        const {
            data,
            error
        } =
            await chemLabSupabase.auth
                .getUser();


        if (error) {

            /*
               getUser() may return an error when there
               is no authenticated user. That is normal.
            */

            return null;
        }


        return data?.user ||
            null;


    } catch (error) {

        console.error(
            "Current user error:",
            error
        );


        return null;
    }
}


/* =========================================================
   COMPATIBILITY ALIAS
   ========================================================= */

async function getCurrentStudent() {

    return await getCurrentUser();
}


/* =========================================================
   GET CURRENT SESSION
   ========================================================= */

async function getCurrentSession() {

    if (!supabaseReady()) {
        return null;
    }


    try {

        const {
            data,
            error
        } =
            await chemLabSupabase.auth
                .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            return null;
        }


        return data?.session ||
            null;


    } catch (error) {

        console.error(
            "Unexpected session error:",
            error
        );

        return null;
    }
}


/* =========================================================
   PREMIUM STATUS
   ========================================================= */

async function getPremiumStatus() {

    const user =
        await getCurrentUser();


    if (!user) {

        return {

            loggedIn: false,

            isPremium: false,

            premium: false,

            expiresAt: null,

            plan: null
        };
    }


    if (!supabaseReady()) {

        return {

            loggedIn: true,

            isPremium: false,

            premium: false,

            expiresAt: null,

            plan: null
        };
    }


    try {

        const {
            data,
            error
        } =
            await chemLabSupabase
                .from("profiles")
                .select(
                    "is_premium, premium_expires_at"
                )
                .eq(
                    "id",
                    user.id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Premium profile query error:",
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


        let isPremium =
            data?.is_premium === true;


        let expiresAt =
            data?.premium_expires_at ||
            null;


        /*
           If there is an expiry date, make sure
           Premium has not expired.
        */

        if (
            isPremium &&
            expiresAt
        ) {

            const expiry =
                new Date(
                    expiresAt
                );


            if (
                Number.isNaN(
                    expiry.getTime()
                )
            ) {

                isPremium =
                    false;

            } else if (
                expiry <= new Date()
            ) {

                isPremium =
                    false;
            }
        }


        /*
           Find the active subscription.
        */

        let plan =
            null;


        if (isPremium) {

            const {
                data:
                    subscriptionData,
                error:
                    subscriptionError
            } =
                await chemLabSupabase
                    .from("subscriptions")
                    .select(
                        "plan, expires_at, status, created_at"
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
                    .limit(1)
                    .maybeSingle();


            if (
                !subscriptionError &&
                subscriptionData
            ) {

                plan =
                    subscriptionData.plan ||
                    null;


                if (
                    subscriptionData.expires_at
                ) {

                    expiresAt =
                        subscriptionData.expires_at;
                }
            }
        }


        return {

            loggedIn: true,

            isPremium:
                isPremium,

            premium:
                isPremium,

            expiresAt:
                expiresAt,

            plan:
                plan
        };


    } catch (error) {

        console.error(
            "Unexpected premium status error:",
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
   FORMAT DATE
   ========================================================= */

function formatPremiumDate(
    dateString
) {

    if (!dateString) {
        return "—";
    }


    const date =
        new Date(
            dateString
        );


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
            year:
                "numeric",

            month:
                "long",

            day:
                "numeric"
        }
    );
}


/* =========================================================
   AUTH MODAL
   ========================================================= */

function openAuthModal(
    mode = "login"
) {

    const modal =
        getElement(
            "authModal"
        );


    if (!modal) {

        console.error(
            "authModal was not found."
        );

        return;
    }


    const title =
        getElement(
            "authTitle"
        );


    const subtitle =
        getElement(
            "authSubtitle"
        );


    const nameField =
        getElement(
            "nameField"
        );


    const nameInput =
        getElement(
            "authName"
        );


    const emailInput =
        getElement(
            "authEmail"
        );


    const passwordInput =
        getElement(
            "authPassword"
        );


    const submitButton =
        getElement(
            "authSubmit"
        );


    const switchText =
        getElement(
            "authSwitchText"
        );


    const switchButton =
        getElement(
            "authSwitch"
        );


    const message =
        getElement(
            "authMessage"
        );


    const selectedMode =
        mode === "signup"
            ? "signup"
            : "login";


    modal.dataset.mode =
        selectedMode;


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    if (message) {
        message.textContent =
            "";
    }


    if (selectedMode === "signup") {

        if (title) {

            title.textContent =
                "Create Your Account";
        }


        if (subtitle) {

            subtitle.textContent =
                "Start exploring ChemLab.";
        }


        if (nameField) {

            nameField.classList.remove(
                "hidden"
            );
        }


        if (submitButton) {

            submitButton.textContent =
                "Create Account";
        }


        if (switchText) {

            switchText.textContent =
                "Already have an account?";
        }


        if (switchButton) {

            switchButton.textContent =
                "Sign In";
        }


    } else {

        if (title) {

            title.textContent =
                "Welcome Back";
        }


        if (subtitle) {

            subtitle.textContent =
                "Sign in to continue learning.";
        }


        if (nameField) {

            nameField.classList.add(
                "hidden"
            );
        }


        if (submitButton) {

            submitButton.textContent =
                "Sign In";
        }


        if (switchText) {

            switchText.textContent =
                "Don't have an account?";
        }


        if (switchButton) {

            switchButton.textContent =
                "Create Account";
        }
    }


    /*
       Clear password whenever the modal opens.
    */

    if (passwordInput) {

        passwordInput.value =
            "";
    }


    if (emailInput) {

        emailInput.focus();
    }
}


window.openAuthModal =
    openAuthModal;


/* =========================================================
   CLOSE AUTH MODAL
   ========================================================= */

function closeAuthModal() {

    const modal =
        getElement(
            "authModal"
        );


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
}


window.closeAuthModal =
    closeAuthModal;


/* =========================================================
   UPDATE LOGIN BUTTON
   ========================================================= */

function updateAuthButton(
    user
) {

    const loginButton =
        getElement(
            "loginButton"
        );


    if (!loginButton) {
        return;
    }


    if (user) {

        loginButton.textContent =
            "👤 Account";


        loginButton.dataset.loggedIn =
            "true";


    } else {

        loginButton.textContent =
            "👤 Sign In";


        loginButton.dataset.loggedIn =
            "false";
    }
}


window.updateAuthButton =
    updateAuthButton;


/* =========================================================
   AUTH SUBMISSION
   ========================================================= */

async function handleAuthSubmit() {

    const modal =
        getElement(
            "authModal"
        );


    if (!modal) {
        return;
    }


    const nameInput =
        getElement(
            "authName"
        );


    const emailInput =
        getElement(
            "authEmail"
        );


    const passwordInput =
        getElement(
            "authPassword"
        );


    const message =
        getElement(
            "authMessage"
        );


    const submitButton =
        getElement(
            "authSubmit"
        );


    const mode =
        modal.dataset.mode ||
        "login";


    const name =
        nameInput?.value.trim() ||
        "";


    const email =
        emailInput?.value.trim() ||
        "";


    const password =
        passwordInput?.value ||
        "";


    if (
        !email ||
        !password
    ) {

        if (message) {

            message.textContent =
                "Please enter your email and password.";
        }

        return;
    }


    if (
        mode === "signup" &&
        !name
    ) {

        if (message) {

            message.textContent =
                "Please enter your name.";
        }

        return;
    }


    if (submitButton) {

        submitButton.disabled =
            true;


        submitButton.textContent =
            mode === "signup"
                ? "Creating Account..."
                : "Signing In...";
    }


    let result;


    try {

        if (
            mode ===
            "signup"
        ) {

            result =
                await signUpStudent(
                    name,
                    email,
                    password
                );

        } else {

            result =
                await loginStudent(
                    email,
                    password
                );
        }


    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        result = {

            success: false,

            message:
                "An unexpected authentication error occurred."
        };
    }


    if (submitButton) {

        submitButton.disabled =
            false;


        submitButton.textContent =
            mode === "signup"
                ? "Create Account"
                : "Sign In";
    }


    if (
        !result ||
        !result.success
    ) {

        if (message) {

            message.textContent =
                result?.message ||
                "Authentication failed.";
        }

        return;
    }


    if (message) {

        message.textContent =
            result.message;
    }


    /*
       If email confirmation is required,
       Supabase will return no session.
    */

    if (
        mode === "signup" &&
        !result.session
    ) {

        if (message) {

            message.textContent =
                "Account created. Please check your email and confirm your account before signing in.";
        }

        return;
    }


    closeAuthModal();


    updateAuthButton(
        result.user
    );


    showNotification(
        "✅ Welcome to ChemLab!",
        "success"
    );
}


window.handleAuthSubmit =
    handleAuthSubmit;


/* =========================================================
   ACCOUNT DASHBOARD
   ========================================================= */

async function openAccount() {

    const user =
        await getCurrentUser();


    if (!user) {

        openAuthModal(
            "login"
        );

        return;
    }


    const modal =
        getElement(
            "accountModal"
        );


    const nameElement =
        getElement(
            "accountName"
        );


    const emailElement =
        getElement(
            "accountEmail"
        );


    const membershipStatus =
        getElement(
            "membershipStatus"
        );


    const membershipIcon =
        getElement(
            "membershipIcon"
        );


    const premiumAccountStatus =
        getElement(
            "premiumAccountStatus"
        );


    const premiumDetails =
        getElement(
            "premiumDetails"
        );


    const accountPlan =
        getElement(
            "accountPlan"
        );


    const accountExpiry =
        getElement(
            "accountExpiry"
        );


    const accountPremiumButton =
        getElement(
            "accountPremiumButton"
        );


    const status =
        await getPremiumStatus();


    if (nameElement) {

        nameElement.textContent =
            user.user_metadata?.full_name ||
            "Student";
    }


    if (emailElement) {

        emailElement.textContent =
            user.email ||
            "—";
    }


    if (
        status.isPremium
    ) {

        if (membershipStatus) {

            membershipStatus.textContent =
                "PREMIUM";
        }


        if (membershipIcon) {

            membershipIcon.textContent =
                "👑";
        }


        if (premiumAccountStatus) {

            premiumAccountStatus.innerHTML =
                `
                <strong>👑 Premium Active</strong>
                <span>You have access to ChemLab Premium.</span>
                `;
        }


        if (premiumDetails) {

            premiumDetails.classList.remove(
                "hidden"
            );
        }


        if (accountPlan) {

            accountPlan.textContent =
                status.plan
                    ? String(
                        status.plan
                    )
                        .charAt(0)
                        .toUpperCase() +
                      String(
                        status.plan
                    ).slice(1)
                    : "Premium";
        }


        if (accountExpiry) {

            accountExpiry.textContent =
                formatPremiumDate(
                    status.expiresAt
                );
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

            membershipIcon.textContent =
                "🔒";
        }


        if (premiumAccountStatus) {

            premiumAccountStatus.innerHTML =
                `
                <strong>🔒 Not Active</strong>
                <span>Unlock advanced ChemLab features.</span>
                `;
        }


        if (premiumDetails) {

            premiumDetails.classList.add(
                "hidden"
            );
        }


        if (accountPremiumButton) {

            accountPremiumButton.textContent =
                "👑 Explore Premium";
        }
    }


    if (modal) {

        modal.classList.add(
            "active"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );
    }
}


window.openAccount =
    openAccount;


/* =========================================================
   CLOSE ACCOUNT
   ========================================================= */

function closeAccount() {

    const modal =
        getElement(
            "accountModal"
        );


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
}


window.closeAccount =
    closeAccount;


/* =========================================================
   PREMIUM MODAL
   ========================================================= */

function openPremiumModal() {

    const modal =
        getElement(
            "premiumModal"
        );


    if (!modal) {

        console.error(
            "premiumModal was not found in index.html."
        );

        showNotification(
            "Premium window could not be opened.",
            "error"
        );

        return;
    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


window.openPremiumModal =
    openPremiumModal;


/* =========================================================
   CLOSE PREMIUM MODAL
   ========================================================= */

function closePremiumModal() {

    const modal =
        getElement(
            "premiumModal"
        );


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
}


window.closePremiumModal =
    closePremiumModal;


/* =========================================================
   REQUEST PREMIUM PLAN
   ========================================================= */

async function requestPremiumPlan(
    plan
) {

    const selectedPlan =
        String(plan || "")
            .toLowerCase();


    if (
        selectedPlan !==
            "monthly" &&
        selectedPlan !==
            "yearly"
    ) {

        showNotification(
            "Please select a valid Premium plan.",
            "error"
        );

        return;
    }


    const user =
        await getCurrentUser();


    if (!user) {

        closePremiumModal();

        openAuthModal(
            "login"
        );

        return;
    }


    const status =
        await getPremiumStatus();


    if (
        status.isPremium
    ) {

        showNotification(
            "👑 Your Premium membership is already active.",
            "premium"
        );

        return;
    }


    const session =
        await getCurrentSession();


    if (!session) {

        closePremiumModal();

        openAuthModal(
            "login"
        );

        return;
    }


    const button =
        document.querySelector(
            `.premium-plan-button[data-plan="${selectedPlan}"]`
        );


    const originalText =
        button?.textContent ||
        "Continue";


    if (button) {

        button.disabled =
            true;


        button.textContent =
            "Connecting to Paystack...";
    }


    try {

        console.log(
            "Starting Premium payment:",
            selectedPlan
        );


        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/activate-premium`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${session.access_token}`,

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY
                    },

                    body:
                        JSON.stringify({
                            plan:
                                selectedPlan
                        })
                }
            );


        let result =
            null;


        try {

            result =
                await response.json();

        } catch (error) {

            console.error(
                "Payment response JSON error:",
                error
            );
        }


        console.log(
            "Premium activation response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result?.error ||
                result?.message ||
                `Payment initialization failed (${response.status}).`
            );
        }


        const authorizationURL =
            result?.authorization_url ||
            result?.data?.authorization_url;


        if (!authorizationURL) {

            throw new Error(
                "Paystack did not return a payment URL."
            );
        }


        /*
           Save the reference so we can verify
           the payment when the user returns.
        */

        const reference =
            result?.reference ||
            result?.data?.reference ||
            null;


        if (reference) {

            sessionStorage.setItem(
                "chemlab_paystack_reference",
                reference
            );
        }


        const subscriptionId =
            result?.subscription_id ||
            result?.data?.subscription_id ||
            null;


        if (subscriptionId) {

            sessionStorage.setItem(
                "chemlab_subscription_id",
                subscriptionId
            );
        }


        /*
           Save selected plan too.
        */

        sessionStorage.setItem(
            "chemlab_selected_plan",
            selectedPlan
        );


        closePremiumModal();


        /*
           Redirect user to Paystack.
        */

        window.location.href =
            authorizationURL;


    } catch (error) {

        console.error(
            "Premium payment error:",
            error
        );


        showNotification(
            error?.message ||
            "Unable to start Premium payment.",
            "error"
        );


    } finally {

        if (button) {

            button.disabled =
                false;


            button.textContent =
                originalText;
        }
    }
}


window.requestPremiumPlan =
    requestPremiumPlan;


/* =========================================================
   PREMIUM EXPERIMENT ACCESS
   ========================================================= */

async function handlePremiumExperiment(
    button
) {

    const user =
        await getCurrentUser();


    if (!user) {

        openAuthModal(
            "login"
        );

        return;
    }


    const status =
        await getPremiumStatus();


    if (
        !status.isPremium
    ) {

        showNotification(
            "👑 Premium access is required for this experiment.",
            "premium"
        );


        const premiumSection =
            getElement(
                "premiumSection"
            );


        if (premiumSection) {

            premiumSection.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "start"
            });
        }


        return;
    }


    const experiment =
        button?.dataset?.experiment ||
        "";


    const normalized =
        experiment
            .toLowerCase()
            .trim();


    if (
        normalized.includes(
            "advanced acid-base titration"
        ) ||
        normalized.includes(
            "advanced titration"
        )
    ) {

        if (
            typeof window.openAdvancedTitration ===
            "function"
        ) {

            window.openAdvancedTitration();

        } else {

            showNotification(
                "The Advanced Titration laboratory is not available. Please refresh the page.",
                "error"
            );
        }


        return;
    }


    showNotification(
        "👑 This Premium experiment is coming soon.",
        "premium"
    );
}


window.handlePremiumExperiment =
    handlePremiumExperiment;


/* =========================================================
   PAYSTACK RETURN
   ========================================================= */

async function handlePaystackReturn() {

    if (!supabaseReady()) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const paymentStatus =
        params.get(
            "payment"
        );


    const referenceFromURL =
        params.get(
            "reference"
        );


    const savedReference =
        sessionStorage.getItem(
            "chemlab_paystack_reference"
        );


    const reference =
        referenceFromURL ||
        savedReference;


    /*
       If this doesn't look like a Paystack return,
       don't do anything.
    */

    if (
        paymentStatus !== "success" &&
        !reference
    ) {

        return;
    }


    if (!reference) {

        console.warn(
            "Paystack return detected, but no reference was found."
        );

        return;
    }


    const session =
        await getCurrentSession();


    if (!session) {

        console.warn(
            "No active session for payment verification."
        );

        return;
    }


    const message =
        document.createElement(
            "div"
        );


    message.id =
        "paymentVerificationMessage";


    message.style.position =
        "fixed";


    message.style.top =
        "20px";


    message.style.left =
        "50%";


    message.style.transform =
        "translateX(-50%)";


    message.style.zIndex =
        "99999";


    message.style.padding =
        "15px 22px";


    message.style.borderRadius =
        "12px";


    message.style.background =
        "#111827";


    message.style.color =
        "#ffffff";


    message.style.fontWeight =
        "600";


    message.style.maxWidth =
        "calc(100% - 30px)";


    message.style.textAlign =
        "center";


    message.textContent =
        "🔐 Verifying your Paystack payment...";


    document.body.appendChild(
        message
    );


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/verify-paystack-payment`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${session.access_token}`,

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY
                    },

                    body:
                        JSON.stringify({
                            reference:
                                reference
                        })
                }
            );


        let result =
            null;


        try {

            result =
                await response.json();

        } catch (error) {

            console.error(
                "Verification JSON error:",
                error
            );
        }


        console.log(
            "Payment verification result:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result?.error ||
                result?.message ||
                `Payment verification failed (${response.status}).`
            );
        }


        if (
            result?.success &&
            result?.premium
        ) {

            sessionStorage.removeItem(
                "chemlab_paystack_reference"
            );


            sessionStorage.removeItem(
                "chemlab_subscription_id"
            );


            sessionStorage.removeItem(
                "chemlab_selected_plan"
            );


            message.textContent =
                "🎉 Payment successful! ChemLab Premium is now active.";


            message.style.background =
                "#166534";


            /*
               Remove query parameters from URL.
            */

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );


            const user =
                await getCurrentUser();


            updateAuthButton(
                user
            );


            /*
               Give the database a moment to settle
               before refreshing Premium status.
            */

            setTimeout(
                async () => {

                    const status =
                        await getPremiumStatus();


                    console.log(
                        "Updated Premium status:",
                        status
                    );


                    if (
                        message.parentNode
                    ) {

                        message.remove();
                    }

                },
                3000
            );


            return;
        }


        throw new Error(
            result?.message ||
            "Premium activation was not completed."
        );


    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );


        message.textContent =
            "⚠️ " +
            (
                error?.message ||
                "Payment verification failed."
            );


        message.style.background =
            "#991b1b";


        setTimeout(
            () => {

                if (
                    message.parentNode
                ) {

                    message.remove();
                }

            },
            7000
        );
    }
}


window.handlePaystackReturn =
    handlePaystackReturn;


/* =========================================================
   AUTH STATE
   ========================================================= */

function setupAuthStateListener() {

    if (!supabaseReady()) {
        return;
    }


    chemLabSupabase.auth.onAuthStateChange(
        (
            event,
            session
        ) => {

            console.log(
                "ChemLab Auth State:",
                event
            );


            const user =
                session?.user ||
                null;


            updateAuthButton(
                user
            );


            if (!user) {

                closeAccount();

                closePremiumModal();
            }
        }
    );
}


/* =========================================================
   DOM INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "🧪 ChemLab authentication system starting..."
        );


        /* -------------------------------------------------
           ELEMENTS
           ------------------------------------------------- */

        const loginButton =
            getElement(
                "loginButton"
            );


        const closeAuthButton =
            getElement(
                "closeAuthModal"
            );


        const authSubmit =
            getElement(
                "authSubmit"
            );


        const authSwitch =
            getElement(
                "authSwitch"
            );


        const authModal =
            getElement(
                "authModal"
            );


        const accountModal =
            getElement(
                "accountModal"
            );


        const closeAccountButton =
            getElement(
                "closeAccountModal"
            );


        const logoutButton =
            getElement(
                "logoutButton"
            );


        const accountPremiumButton =
            getElement(
                "accountPremiumButton"
            );


        const premiumModal =
            getElement(
                "premiumModal"
            );


        const closePremiumButton =
            getElement(
                "closePremiumModal"
            );


        const premiumUnlockButton =
            getElement(
                "premiumUnlockButton"
            );


        const startPremiumButton =
            getElement(
                "startPremiumButton"
            );


        /* -------------------------------------------------
           LOGIN / ACCOUNT
           ------------------------------------------------- */

        if (loginButton) {

            loginButton.addEventListener(
                "click",
                async event => {

                    event.preventDefault();


                    const user =
                        await getCurrentUser();


                    if (user) {

                        await openAccount();

                    } else {

                        openAuthModal(
                            "login"
                        );
                    }
                }
            );

        } else {

            console.error(
                "❌ loginButton was not found."
            );
        }


        /* -------------------------------------------------
           INITIAL AUTH STATE
           ------------------------------------------------- */

        if (
            supabaseReady()
        ) {

            const user =
                await getCurrentUser();


            updateAuthButton(
                user
            );

        } else {

            updateAuthButton(
                null
            );
        }


        /* -------------------------------------------------
           CLOSE AUTH
           ------------------------------------------------- */

        if (closeAuthButton) {

            closeAuthButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    closeAuthModal();
                }
            );
        }


        /* -------------------------------------------------
           SWITCH LOGIN / SIGNUP
           ------------------------------------------------- */

        if (authSwitch) {

            authSwitch.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const mode =
                        authModal?.dataset?.mode ||
                        "login";


                    openAuthModal(
                        mode === "login"
                            ? "signup"
                            : "login"
                    );
                }
            );
        }


        /* -------------------------------------------------
           AUTH SUBMIT
           ------------------------------------------------- */

        if (authSubmit) {

            authSubmit.addEventListener(
                "click",
                async event => {

                    event.preventDefault();

                    await handleAuthSubmit();
                }
            );
        }


        /* -------------------------------------------------
           ENTER KEY
           ------------------------------------------------- */

        const passwordInput =
            getElement(
                "authPassword"
            );


        if (passwordInput) {

            passwordInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        handleAuthSubmit();
                    }
                }
            );
        }


        /* -------------------------------------------------
           AUTH BACKDROP
           ------------------------------------------------- */

        if (authModal) {

            authModal.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        authModal
                    ) {

                        closeAuthModal();
                    }
                }
            );
        }


        /* -------------------------------------------------
           CLOSE ACCOUNT
           ------------------------------------------------- */

        if (closeAccountButton) {

            closeAccountButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    closeAccount();
                }
            );
        }


        /* -------------------------------------------------
           ACCOUNT BACKDROP
           ------------------------------------------------- */

        if (accountModal) {

            accountModal.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        accountModal
                    ) {

                        closeAccount();
                    }
                }
            );
        }


        /* -------------------------------------------------
           ACCOUNT PREMIUM
           ------------------------------------------------- */

        if (accountPremiumButton) {

            accountPremiumButton.addEventListener(
                "click",
                async event => {

                    event.preventDefault();


                    const status =
                        await getPremiumStatus();


                    if (
                        status.isPremium
                    ) {

                        showNotification(
                            "👑 Your Premium membership is already active.",
                            "premium"
                        );

                        return;
                    }


                    closeAccount();


                    openPremiumModal();
                }
            );
        }


        /* -------------------------------------------------
           LOGOUT
           ------------------------------------------------- */

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async event => {

                    event.preventDefault();


                    const result =
                        await logoutStudent();


                    if (!result.success) {

                        showNotification(
                            result.message,
                            "error"
                        );

                        return;
                    }


                    closeAccount();


                    closePremiumModal();


                    updateAuthButton(
                        null
                    );


                    showNotification(
                        "You have been signed out.",
                        "success"
                    );
                }
            );
        }


        /* -------------------------------------------------
           PREMIUM UNLOCK
           ------------------------------------------------- */

        if (premiumUnlockButton) {

            premiumUnlockButton.addEventListener(
                "click",
                async event => {

                    event.preventDefault();


                    const user =
                        await getCurrentUser();


                    if (!user) {

                        openAuthModal(
                            "login"
                        );

                        return;
                    }


                    const status =
                        await getPremiumStatus();


                    if (
                        status.isPremium
                    ) {

                        showNotification(
                            "👑 Your Premium membership is already active.",
                            "premium"
                        );

                        return;
                    }


                    openPremiumModal();
                }
            );
        }


        /* -------------------------------------------------
           CLOSE PREMIUM
           ------------------------------------------------- */

        if (closePremiumButton) {

            closePremiumButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    closePremiumModal();
                }
            );
        }


        /* -------------------------------------------------
           PREMIUM BACKDROP
           ------------------------------------------------- */

        if (premiumModal) {

            premiumModal.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        premiumModal
                    ) {

                        closePremiumModal();
                    }
                }
            );
        }


        /* -------------------------------------------------
           START PREMIUM
           ------------------------------------------------- */

        if (startPremiumButton) {

            startPremiumButton.addEventListener(
                "click",
                async event => {

                    event.preventDefault();


                    const user =
                        await getCurrentUser();


                    if (!user) {

                        closePremiumModal();

                        openAuthModal(
                            "login"
                        );

                        return;
                    }


                    const status =
                        await getPremiumStatus();


                    if (
                        status.isPremium
                    ) {

                        showNotification(
                            "👑 Your Premium membership is already active.",
                            "premium"
                        );

                        return;
                    }


                    const firstPlan =
                        document.querySelector(
                            ".premium-plan-button[data-plan='monthly']"
                        );


                    if (firstPlan) {

                        firstPlan.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "center"
                        });

                    } else {

                        showNotification(
                            "Please select a Premium plan.",
                            "premium"
                        );
                    }
                }
            );
        }


        /* -------------------------------------------------
           PREMIUM PLAN BUTTONS
           ------------------------------------------------- */

        const premiumPlanButtons =
            document.querySelectorAll(
                ".premium-plan-button"
            );


        console.log(
            "Premium plan buttons:",
            premiumPlanButtons.length
        );


        premiumPlanButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    async event => {

                        event.preventDefault();


                        const plan =
                            button.dataset.plan;


                        await requestPremiumPlan(
                            plan
                        );
                    }
                );
            }
        );


        /* -------------------------------------------------
           PREMIUM EXPERIMENT BUTTONS
           ------------------------------------------------- */

        const experimentButtons =
            document.querySelectorAll(
                ".premium-experiment-button"
            );


        console.log(
            "Premium experiment buttons:",
            experimentButtons.length
        );


        experimentButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    async event => {

                        event.preventDefault();


                        await handlePremiumExperiment(
                            button
                        );
                    }
                );
            }
        );


        /* -------------------------------------------------
           AUTH STATE LISTENER
           ------------------------------------------------- */

        setupAuthStateListener();


        /* -------------------------------------------------
           PAYSTACK RETURN
           ------------------------------------------------- */

        await handlePaystackReturn();


        /* -------------------------------------------------
           READY
           ------------------------------------------------- */

        console.log(
            "✅ ChemLab authentication system ready."
        );
    }
);
