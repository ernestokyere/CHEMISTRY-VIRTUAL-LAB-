/* =========================================================
   CHEMLAB AUTH + PREMIUM SYSTEM
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://zscbgeaieiqwknhjxpnt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy";


/* =========================================================
   SUPABASE CLIENT
========================================================= */

let supabaseClient = null;


function initializeSupabase() {

    try {

        if (
            typeof window.supabase === "undefined"
        ) {

            console.error(
                "Supabase library was not loaded."
            );

            return null;
        }


        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        return supabaseClient;


    } catch (error) {

        console.error(
            "Supabase initialization error:",
            error
        );

        return null;
    }
}


initializeSupabase();


/* =========================================================
   SUPABASE READY
========================================================= */

function supabaseReady() {

    return (
        supabaseClient !== null
    );
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
        } = await supabaseClient.auth.getUser();


        if (error) {

            console.warn(
                "Could not get current user:",
                error
            );

            return null;
        }


        return data?.user || null;


    } catch (error) {

        console.error(
            "Current user error:",
            error
        );

        return null;
    }
}


window.getCurrentUser =
    getCurrentUser;


/* =========================================================
   ALIAS
========================================================= */

async function getCurrentStudent() {

    return await getCurrentUser();
}


window.getCurrentStudent =
    getCurrentStudent;


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
                "Authentication service is unavailable."
        };
    }


    try {

        const {
            data,
            error
        } = await supabaseClient.auth.signUp({

            email:
                email.trim(),

            password:
                password,

            options: {

                data: {

                    full_name:
                        fullName.trim()
                }
            }
        });


        if (error) {

            return {

                success: false,

                message:
                    error.message
            };
        }


        return {

            success: true,

            user:
                data?.user || null,

            session:
                data?.session || null,

            message:
                data?.session
                    ? "Account created successfully."
                    : "Account created. Please check your email to verify your account."
        };


    } catch (error) {

        console.error(
            "Sign up error:",
            error
        );


        return {

            success: false,

            message:
                "Could not create your account."
        };
    }
}


window.signUpStudent =
    signUpStudent;


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
                "Authentication service is unavailable."
        };
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email:
                    email.trim(),

                password:
                    password
            });


        if (error) {

            return {

                success: false,

                message:
                    error.message
            };
        }


        return {

            success: true,

            user:
                data?.user || null,

            session:
                data?.session || null,

            message:
                "Signed in successfully."
        };


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return {

            success: false,

            message:
                "Could not sign in."
        };
    }
}


window.loginStudent =
    loginStudent;


/* =========================================================
   LOGOUT
========================================================= */

async function logoutStudent() {

    if (!supabaseReady()) {
        return false;
    }


    try {

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return false;
        }


        return true;


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        return false;
    }
}


window.logoutStudent =
    logoutStudent;


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
            data: profile,
            error
        } =
            await supabaseClient
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

            console.warn(
                "Premium profile lookup error:",
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


        const isPremiumFlag =
            profile?.is_premium === true;


        const expiresAt =
            profile?.premium_expires_at ||
            null;


        let isPremium =
            isPremiumFlag;


        /*
           If an expiry date exists, make sure it
           has not already passed.
        */

        if (expiresAt) {

            const expiry =
                new Date(expiresAt);


            if (
                !Number.isNaN(
                    expiry.getTime()
                ) &&
                expiry <= new Date()
            ) {

                isPremium = false;
            }
        }


        let plan = null;


        /*
           Only look for subscription information
           when the profile says the student is premium.
        */

        if (isPremium) {

            try {

                const {
                    data: subscription
                } =
                    await supabaseClient
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
                                ascending: false
                            }
                        )
                        .limit(1)
                        .maybeSingle();


                if (subscription) {

                    plan =
                        subscription.plan ||
                        null;
                }

            } catch (subscriptionError) {

                console.warn(
                    "Subscription lookup failed:",
                    subscriptionError
                );
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
            "Premium status error:",
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


window.getPremiumStatus =
    getPremiumStatus;


/* =========================================================
   FORMAT PREMIUM DATE
========================================================= */

function formatPremiumDate(dateValue) {

    if (!dateValue) {
        return "—";
    }


    const date =
        new Date(dateValue);


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
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


window.formatPremiumDate =
    formatPremiumDate;


/* =========================================================
   AUTH MODAL
========================================================= */

let authMode =
    "login";


function openAuthModal(
    mode = "login"
) {

    authMode =
        mode === "signup"
            ? "signup"
            : "login";


    const modal =
        document.getElementById(
            "authModal"
        );


    if (!modal) {
        return;
    }


    const title =
        document.getElementById(
            "authTitle"
        );


    const subtitle =
        document.getElementById(
            "authSubtitle"
        );


    const nameField =
        document.getElementById(
            "nameField"
        );


    const submit =
        document.getElementById(
            "authSubmit"
        );


    const switchText =
        document.getElementById(
            "authSwitchText"
        );


    const switchButton =
        document.getElementById(
            "authSwitch"
        );


    const message =
        document.getElementById(
            "authMessage"
        );


    if (authMode === "signup") {

        if (title) {
            title.textContent =
                "Create Your Account";
        }


        if (subtitle) {
            subtitle.textContent =
                "Create a ChemLab student account.";
        }


        if (nameField) {

            nameField.classList.remove(
                "hidden"
            );
        }


        if (submit) {
            submit.textContent =
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


        if (submit) {
            submit.textContent =
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


    if (message) {

        message.textContent =
            "";

        message.className =
            "auth-message";
    }


    modal.classList.add(
        "open"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(
        function () {

            const email =
                document.getElementById(
                    "authEmail"
                );

            if (email) {
                email.focus();
            }

        },
        100
    );
}


window.openAuthModal =
    openAuthModal;


/* =========================================================
   CLOSE AUTH MODAL
========================================================= */

function closeAuthModal() {

    const modal =
        document.getElementById(
            "authModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


window.closeAuthModal =
    closeAuthModal;


/* =========================================================
   AUTH BUTTON
========================================================= */

function updateAuthButton(
    user
) {

    const button =
        document.getElementById(
            "loginButton"
        );


    if (!button) {
        return;
    }


    if (user) {

        button.textContent =
            "👤 Account";

    } else {

        button.textContent =
            "👤 Sign In";
    }
}


window.updateAuthButton =
    updateAuthButton;


/* =========================================================
   AUTH MESSAGE
========================================================= */

function showAuthMessage(
    message,
    type = "error"
) {

    const element =
        document.getElementById(
            "authMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        `auth-message ${type}`;
}


/* =========================================================
   HANDLE AUTH SUBMIT
========================================================= */

async function handleAuthSubmit() {

    const email =
        document.getElementById(
            "authEmail"
        )?.value.trim();


    const password =
        document.getElementById(
            "authPassword"
        )?.value;


    const name =
        document.getElementById(
            "authName"
        )?.value.trim();


    const submit =
        document.getElementById(
            "authSubmit"
        );


    if (!email || !password) {

        showAuthMessage(
            "Please enter your email and password."
        );

        return;
    }


    if (
        authMode === "signup" &&
        !name
    ) {

        showAuthMessage(
            "Please enter your full name."
        );

        return;
    }


    if (submit) {

        submit.disabled =
            true;

        submit.textContent =
            authMode === "signup"
                ? "Creating Account..."
                : "Signing In...";
    }


    try {

        let result;


        if (authMode === "signup") {

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


        if (!result.success) {

            showAuthMessage(
                result.message ||
                "Authentication failed."
            );

            return;
        }


        if (authMode === "signup") {

            showAuthMessage(
                result.message,
                "success"
            );


            if (result.session) {

                setTimeout(
                    closeAuthModal,
                    700
                );

            } else {

                /*
                   Email confirmation may be enabled.
                */

                return;
            }

        } else {

            closeAuthModal();


            updateAuthButton(
                result.user
            );


            showNotification(
                "Welcome back to ChemLab!",
                "success"
            );


            /*
               Refresh account information.
            */

            await updateAccountUI();
        }


    } catch (error) {

        console.error(
            "Authentication submit error:",
            error
        );


        showAuthMessage(
            error.message ||
            "Something went wrong."
        );

    } finally {

        if (submit) {

            submit.disabled =
                false;


            submit.textContent =
                authMode === "signup"
                    ? "Create Account"
                    : "Sign In";
        }
    }
}


window.handleAuthSubmit =
    handleAuthSubmit;


/* =========================================================
   ACCOUNT MODAL
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
        document.getElementById(
            "accountModal"
        );


    if (!modal) {
        return;
    }


    await updateAccountUI();


    modal.classList.add(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


window.openAccount =
    openAccount;


/* =========================================================
   CLOSE ACCOUNT
========================================================= */

function closeAccount() {

    const modal =
        document.getElementById(
            "accountModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


window.closeAccount =
    closeAccount;


/* =========================================================
   UPDATE ACCOUNT UI
========================================================= */

async function updateAccountUI() {

    const user =
        await getCurrentUser();


    if (!user) {
        return;
    }


    const accountName =
        document.getElementById(
            "accountName"
        );


    const accountEmail =
        document.getElementById(
            "accountEmail"
        );


    const metadata =
        user.user_metadata ||
        {};


    const name =
        metadata.full_name ||
        metadata.name ||
        "Student";


    if (accountName) {

        accountName.textContent =
            name;
    }


    if (accountEmail) {

        accountEmail.textContent =
            user.email ||
            "—";
    }


    const status =
        await getPremiumStatus();


    const membershipStatus =
        document.getElementById(
            "membershipStatus"
        );


    const membershipIcon =
        document.getElementById(
            "membershipIcon"
        );


    const premiumStatus =
        document.getElementById(
            "premiumAccountStatus"
        );


    const premiumDetails =
        document.getElementById(
            "premiumDetails"
        );


    const accountPlan =
        document.getElementById(
            "accountPlan"
        );


    const accountExpiry =
        document.getElementById(
            "accountExpiry"
        );


    if (status.isPremium) {

        if (membershipStatus) {

            membershipStatus.textContent =
                "PREMIUM";
        }


        if (membershipIcon) {

            membershipIcon.textContent =
                "👑";
        }


        if (premiumStatus) {

            premiumStatus.innerHTML =
                "<strong>👑 Premium Active</strong><span>Your ChemLab Premium access is active.</span>";
        }


        if (premiumDetails) {

            premiumDetails.classList.remove(
                "hidden"
            );
        }


        if (accountPlan) {

            accountPlan.textContent =
                status.plan ||
                "Premium";
        }


        if (accountExpiry) {

            accountExpiry.textContent =
                formatPremiumDate(
                    status.expiresAt
                );
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


        if (premiumStatus) {

            premiumStatus.innerHTML =
                "<strong>🔒 Not Active</strong><span>Unlock advanced ChemLab features.</span>";
        }


        if (premiumDetails) {

            premiumDetails.classList.add(
                "hidden"
            );
        }
    }
}


window.updateAccountUI =
    updateAccountUI;


/* =========================================================
   OPEN PREMIUM PAGE
========================================================= */

async function openPremiumPage() {

    const user =
        await getCurrentUser();


    if (!user) {

        openAuthModal(
            "login"
        );

        return;
    }


    /*
       This is the important fix:
       Premium is a .page in your current index.html,
       so we use showPage('premiumSection').
    */

    if (
        typeof showPage ===
        "function"
    ) {

        showPage(
            "premiumSection"
        );

    } else {

        const pages =
            document.querySelectorAll(
                ".page"
            );


        pages.forEach(
            function (page) {

                page.classList.remove(
                    "active"
                );

                page.style.display =
                    "none";
            }
        );


        const premium =
            document.getElementById(
                "premiumSection"
            );


        if (premium) {

            premium.classList.add(
                "active"
            );

            premium.style.display =
                "block";
        }
    }


    /*
       Scroll to the pricing section.
    */

    setTimeout(
        function () {

            const pricing =
                document.querySelector(
                    "#premiumSection .pricing-section"
                );


            if (pricing) {

                pricing.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        },
        150
    );
}


window.openPremiumPage =
    openPremiumPage;


/* =========================================================
   PREMIUM MODAL
========================================================= */

function openPremiumModal() {

    const modal =
        document.getElementById(
            "premiumModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        "open"
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
        document.getElementById(
            "premiumModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "open"
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

    const user =
        await getCurrentUser();


    if (!user) {

        closePremiumModal();

        openAuthModal(
            "login"
        );

        return;
    }


    if (
        plan !== "monthly" &&
        plan !== "yearly"
    ) {

        showNotification(
            "Please select a valid Premium plan.",
            "error"
        );

        return;
    }


    const status =
        await getPremiumStatus();


    if (status.isPremium) {

        closePremiumModal();

        showNotification(
            "Your Premium membership is already active.",
            "success"
        );


        return;
    }


    if (!supabaseReady()) {

        showNotification(
            "Payment service is unavailable.",
            "error"
        );

        return;
    }


    try {

        const {
            data: sessionData,
            error: sessionError
        } =
            await supabaseClient.auth.getSession();


        if (
            sessionError ||
            !sessionData?.session
        ) {

            openAuthModal(
                "login"
            );

            return;
        }


        const accessToken =
            sessionData.session.access_token;


        showNotification(
            "Preparing your Paystack checkout...",
            "success"
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
                            `Bearer ${accessToken}`,

                        "apikey":
                            SUPABASE_KEY
                    },

                    body:
                        JSON.stringify({
                            plan:
                                plan
                        })
                }
            );


        const raw =
            await response.text();


        let data = null;


        try {

            data =
                raw
                    ? JSON.parse(raw)
                    : null;

        } catch (error) {

            console.error(
                "Payment response JSON error:",
                error
            );
        }


        if (!response.ok) {

            throw new Error(

                data?.error ||

                data?.message ||

                `Payment initialization failed (${response.status}).`
            );
        }


        if (
            !data?.authorization_url
        ) {

            console.error(
                "Unexpected payment response:",
                data
            );


            throw new Error(
                "Paystack authorization link was not returned."
            );
        }


        /*
           Save reference so the return page can
           verify the payment.
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
            "chemlab_selected_plan",
            plan
        );


        /*
           Redirect to Paystack.
        */

        window.location.href =
            data.authorization_url;


    } catch (error) {

        console.error(
            "Premium payment error:",
            error
        );


        showNotification(
            error.message ||
            "Could not start Premium payment.",
            "error"
        );
    }
}


window.requestPremiumPlan =
    requestPremiumPlan;


/* =========================================================
   HANDLE PREMIUM EXPERIMENT
========================================================= */

async function handlePremiumExperiment(
    button
) {

    if (!button) {
        return;
    }


    const user =
        await getCurrentUser();


    /*
       Not logged in.
    */

    if (!user) {

        openAuthModal(
            "login"
        );

        return;
    }


    const status =
        await getPremiumStatus();


    /*
       Student is logged in but not Premium.
    */

    if (!status.isPremium) {

        openPremiumPage();

        return;
    }


    const experiment =
        button.dataset.experiment;


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

            showNotification(
                "Advanced Chemistry Lab is loading. Please try again.",
                "error"
            );
        }

        return;
    }


    showNotification(
        "This Premium experiment is not available yet.",
        "error"
    );
}


window.handlePremiumExperiment =
    handlePremiumExperiment;


/* =========================================================
   PAYSTACK RETURN
========================================================= */

async function handlePaystackReturn() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const payment =
        params.get(
            "payment"
        );


    const reference =
        params.get(
            "reference"
        ) ||
        sessionStorage.getItem(
            "chemlab_payment_reference"
        );


    if (
        payment !== "success" &&
        !reference
    ) {

        return;
    }


    const user =
        await getCurrentUser();


    if (!user) {
        return;
    }


    const {
        data: sessionData
    } =
        await supabaseClient.auth.getSession();


    const accessToken =
        sessionData?.session?.access_token;


    if (!accessToken) {
        return;
    }


    try {

        showNotification(
            "Verifying your Premium payment...",
            "success"
        );


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
                            `Bearer ${accessToken}`,

                        "apikey":
                            SUPABASE_KEY
                    },

                    body:
                        JSON.stringify({
                            reference:
                                reference
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data?.error ||
                data?.message ||
                "Payment verification failed."
            );
        }


        if (
            data?.success &&
            data?.premium
        ) {

            sessionStorage.removeItem(
                "chemlab_payment_reference"
            );


            sessionStorage.removeItem(
                "chemlab_subscription_id"
            );


            sessionStorage.removeItem(
                "chemlab_selected_plan"
            );


            showNotification(
                "🎉 ChemLab Premium is now active!",
                "success"
            );


            /*
               Remove payment parameters from URL.
            */

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );


            await updateAccountUI();


            setTimeout(
                function () {

                    openPremiumPage();

                },
                800
            );
        }


    } catch (error) {

        console.error(
            "Paystack verification error:",
            error
        );


        showNotification(
            error.message ||
            "Could not verify your payment.",
            "error"
        );
    }
}


window.handlePaystackReturn =
    handlePaystackReturn;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "ChemLab authentication system initialized."
        );


        /* -------------------------------------------------
           LOGIN / ACCOUNT BUTTON
        ------------------------------------------------- */

        const loginButton =
            document.getElementById(
                "loginButton"
            );


        if (loginButton) {

            loginButton.onclick =
                async function () {

                    const user =
                        await getCurrentUser();


                    if (user) {

                        openAccount();

                    } else {

                        openAuthModal(
                            "login"
                        );
                    }
                };
        }


        /* -------------------------------------------------
           AUTH MODAL CLOSE
        ------------------------------------------------- */

        const closeAuth =
            document.getElementById(
                "closeAuthModal"
            );


        if (closeAuth) {

            closeAuth.onclick =
                closeAuthModal;
        }


        /* -------------------------------------------------
           AUTH SWITCH
        ------------------------------------------------- */

        const authSwitch =
            document.getElementById(
                "authSwitch"
            );


        if (authSwitch) {

            authSwitch.onclick =
                function () {

                    openAuthModal(
                        authMode === "login"
                            ? "signup"
                            : "login"
                    );
                };
        }


        /* -------------------------------------------------
           AUTH SUBMIT
        ------------------------------------------------- */

        const authSubmit =
            document.getElementById(
                "authSubmit"
            );


        if (authSubmit) {

            authSubmit.onclick =
                handleAuthSubmit;
        }


        /* -------------------------------------------------
           AUTH ENTER KEY
        ------------------------------------------------- */

        const authInputs =
            document.querySelectorAll(
                "#authModal input"
            );


        authInputs.forEach(
            function (input) {

                input.addEventListener(
                    "keydown",
                    function (event) {

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
        );


        /* -------------------------------------------------
           ACCOUNT CLOSE
        ------------------------------------------------- */

        const closeAccountButton =
            document.getElementById(
                "closeAccountModal"
            );


        if (closeAccountButton) {

            closeAccountButton.onclick =
                closeAccount;
        }


        /* -------------------------------------------------
           ACCOUNT PREMIUM BUTTON
        ------------------------------------------------- */

        const accountPremiumButton =
            document.getElementById(
                "accountPremiumButton"
            );


        if (accountPremiumButton) {

            accountPremiumButton.onclick =
                async function () {

                    closeAccount();

                    await openPremiumPage();
                };
        }


        /* -------------------------------------------------
           LOGOUT
        ------------------------------------------------- */

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.onclick =
                async function () {

                    const success =
                        await logoutStudent();


                    if (success) {

                        closeAccount();

                        updateAuthButton(
                            null
                        );


                        showNotification(
                            "You have been signed out.",
                            "success"
                        );
                    }
                };
        }


        /* -------------------------------------------------
           PREMIUM EXPERIMENT BUTTONS
        ------------------------------------------------- */

        const premiumExperimentButtons =
            document.querySelectorAll(
                ".premium-experiment-button"
            );


        premiumExperimentButtons.forEach(
            function (button) {

                button.onclick =
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        handlePremiumExperiment(
                            button
                        );
                    };
            }
        );


        /* -------------------------------------------------
           PREMIUM PLAN BUTTONS
        ------------------------------------------------- */

        const premiumPlanButtons =
            document.querySelectorAll(
                ".premium-plan-button"
            );


        premiumPlanButtons.forEach(
            function (button) {

                button.onclick =
                    function () {

                        const plan =
                            button.dataset.plan;


                        requestPremiumPlan(
                            plan
                        );
                    };
            }
        );


        /* -------------------------------------------------
           PREMIUM MODAL CLOSE
        ------------------------------------------------- */

        const closePremium =
            document.getElementById(
                "closePremiumModal"
            );


        if (closePremium) {

            closePremium.onclick =
                closePremiumModal;
        }


        /* -------------------------------------------------
           PREMIUM MODAL CONTINUE
        ------------------------------------------------- */

        const startPremiumButton =
            document.getElementById(
                "startPremiumButton"
            );


        if (startPremiumButton) {

            startPremiumButton.onclick =
                function () {

                    showNotification(
                        "Choose Monthly or Yearly to continue.",
                        "success"
                    );
                };
        }


        /* -------------------------------------------------
           BACKDROP CLOSE
        ------------------------------------------------- */

        const authModal =
            document.getElementById(
                "authModal"
            );


        if (authModal) {

            authModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        authModal
                    ) {

                        closeAuthModal();
                    }
                }
            );
        }


        const accountModal =
            document.getElementById(
                "accountModal"
            );


        if (accountModal) {

            accountModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        accountModal
                    ) {

                        closeAccount();
                    }
                }
            );
        }


        const premiumModal =
            document.getElementById(
                "premiumModal"
            );


        if (premiumModal) {

            premiumModal.addEventListener(
                "click",
                function (event) {

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
           INITIAL AUTH STATE
        ------------------------------------------------- */

        const user =
            await getCurrentUser();


        updateAuthButton(
            user
        );


        if (user) {

            await updateAccountUI();
        }


        /* -------------------------------------------------
           AUTH STATE CHANGES
        ------------------------------------------------- */

        if (supabaseReady()) {

            supabaseClient.auth.onAuthStateChange(
                async function (
                    event,
                    session
                ) {

                    console.log(
                        "Auth event:",
                        event
                    );


                    const currentUser =
                        session?.user ||
                        null;


                    updateAuthButton(
                        currentUser
                    );


                    if (
                        currentUser
                    ) {

                        await updateAccountUI();
                    }
                }
            );
        }


        /* -------------------------------------------------
           PAYMENT RETURN
        ------------------------------------------------- */

        await handlePaystackReturn();

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;
        }


        closeAuthModal();

        closeAccount();

        closePremiumModal();
    }
);
