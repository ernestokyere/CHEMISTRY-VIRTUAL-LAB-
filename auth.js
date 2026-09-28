/* =========================================================
   CHEMLAB
   AUTHENTICATION + PREMIUM SYSTEM
   Version 4.0
   =========================================================

   Responsibilities:
   - Student sign up
   - Student sign in
   - Student logout
   - Profile management
   - Premium status
   - Paystack checkout
   - Paystack verification
   - Account modal
   - Premium modal
   - Authentication UI
   - Auth event bridge

   Requires:
   - Supabase JS
   - app.js
   - progress.js
========================================================= */


/* =========================================================
   01. CONFIGURATION
========================================================= */

const CHEMLAB_AUTH_CONFIG = {

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


/* =========================================================
   02. AUTH CLIENT
========================================================= */

let chemLabAuthClient = null;


function getAuthClient() {

    if (
        window.supabaseClient
    ) {

        chemLabAuthClient =
            window.supabaseClient;

        return chemLabAuthClient;

    }


    if (
        chemLabAuthClient
    ) {

        return chemLabAuthClient;

    }


    if (
        typeof window.supabase ===
        "undefined" ||
        typeof window.supabase.createClient !==
        "function"
    ) {

        console.error(
            "ChemLab: Supabase library is unavailable."
        );

        return null;

    }


    chemLabAuthClient =
        window.supabase.createClient(
            CHEMLAB_AUTH_CONFIG.supabaseUrl,
            CHEMLAB_AUTH_CONFIG.supabaseKey,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );


    window.supabaseClient =
        chemLabAuthClient;


    return chemLabAuthClient;

}


/* =========================================================
   03. DOM HELPERS
========================================================= */

function authElement(id) {

    return document.getElementById(id);

}


function authText(
    id,
    value
) {

    const element =
        authElement(id);

    if (element) {

        element.textContent =
            value ?? "";

    }

}


function authShow(
    element
) {

    if (!element) return;

    element.hidden =
        false;

}


function authHide(
    element
) {

    if (!element) return;

    element.hidden =
        true;

}


function authEscapeHTML(
    value
) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   04. AUTH NOTIFICATIONS
========================================================= */

function authNotify(
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


    console.log(
        `[ChemLab ${type}] ${message}`
    );

}


/* =========================================================
   05. AUTH MODAL
========================================================= */

let currentAuthMode =
    "signin";


function openAuthModal(
    mode = "signin"
) {

    currentAuthMode =
        mode === "signup"
            ? "signup"
            : "signin";


    const modal =
        authElement("authModal");

    if (!modal) {

        console.warn(
            "ChemLab: authModal not found."
        );

        return;

    }


    const isSignup =
        currentAuthMode ===
        "signup";


    authText(
        "authTitle",
        isSignup
            ? "Create your account"
            : "Welcome back"
    );


    authText(
        "authSubtitle",
        isSignup
            ? "Create your ChemLab student account."
            : "Sign in to continue learning."
    );


    authText(
        "authSubmit",
        isSignup
            ? "Create Account"
            : "Sign In"
    );


    authText(
        "authSwitchText",
        isSignup
            ? "Already have an account?"
            : "Don't have an account?"
    );


    const switchButton =
        authElement("authSwitch");

    if (switchButton) {

        switchButton.textContent =
            isSignup
                ? "Sign In"
                : "Create Account";

    }


    const nameField =
        authElement("nameField");

    if (nameField) {

        nameField.hidden =
            !isSignup;

    }


    const nameInput =
        authElement("authName");

    if (nameInput) {

        nameInput.required =
            isSignup;

    }


    clearAuthMessage();


    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(() => {

        const email =
            authElement("authEmail");

        const name =
            authElement("authName");

        if (isSignup && name) {

            name.focus();

        } else if (email) {

            email.focus();

        }

    }, 100);

}


function closeAuthModal() {

    const modal =
        authElement("authModal");

    if (!modal) return;


    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    clearAuthMessage();

}


function clearAuthMessage() {

    const message =
        authElement("authMessage");

    if (!message) return;


    message.textContent =
        "";

    message.className =
        "auth-message";

}


function showAuthMessage(
    message,
    type = "error"
) {

    const element =
        authElement("authMessage");

    if (!element) return;


    element.textContent =
        message;

    element.className =
        `auth-message ${type}`;

}


/* =========================================================
   06. ACCOUNT MODAL
========================================================= */

function openAccountModal() {

    const modal =
        authElement("accountModal");

    if (!modal) return;


    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    updateAccountModal();

}


function closeAccountModal() {

    const modal =
        authElement("accountModal");

    if (!modal) return;


    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   07. PREMIUM MODAL
========================================================= */

let selectedPremiumPlan =
    "yearly";


function openPremiumModal(
    plan = "yearly"
) {

    selectedPremiumPlan =
        plan === "monthly"
            ? "monthly"
            : "yearly";


    const modal =
        authElement("premiumModal");

    if (!modal) {

        if (
            typeof window.showPage ===
            "function"
        ) {

            window.showPage(
                "premiumSection"
            );

        }

        return;

    }


    updatePremiumModal();


    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closePremiumModal() {

    const modal =
        authElement("premiumModal");

    if (!modal) return;


    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


function updatePremiumModal() {

    const price =
        selectedPremiumPlan ===
        "monthly"
            ? CHEMLAB_AUTH_CONFIG.monthlyPrice
            : CHEMLAB_AUTH_CONFIG.yearlyPrice;


    authText(
        "selectedPremiumPlan",
        selectedPremiumPlan ===
            "monthly"
            ? "Monthly Premium"
            : "Yearly Premium"
    );


    authText(
        "selectedPremiumPrice",
        `GHS ${price}`
    );

}


/* =========================================================
   08. CURRENT USER
========================================================= */

async function getCurrentSession() {

    const client =
        getAuthClient();


    if (!client) {
        return null;
    }


    try {

        const {
            data,
            error
        } =
            await client.auth.getSession();


        if (error) {

            console.error(
                "ChemLab session error:",
                error
            );

            return null;

        }


        return data?.session || null;

    } catch (error) {

        console.error(
            "ChemLab session exception:",
            error
        );

        return null;

    }

}


async function getCurrentUser() {

    const session =
        await getCurrentSession();


    return session?.user || null;

}


window.getCurrentSession =
    getCurrentSession;

window.getCurrentUser =
    getCurrentUser;


/* =========================================================
   09. PROFILE
========================================================= */

async function getStudentProfile(
    userId = null
) {

    const user =
        await getCurrentUser();


    const id =
        userId ||
        user?.id;


    if (!id) {
        return null;
    }


    const client =
        getAuthClient();


    if (!client) {
        return null;
    }


    try {

        const {
            data,
            error
        } =
            await client
                .from("profiles")
                .select(
                    "id,full_name,is_premium,premium_expires_at"
                )
                .eq(
                    "id",
                    id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "ChemLab profile error:",
                error
            );

            return null;

        }


        return data || null;

    } catch (error) {

        console.error(
            "ChemLab profile exception:",
            error
        );

        return null;

    }

}


async function createStudentProfile(
    user,
    fullName = ""
) {

    if (!user?.id) {
        return null;
    }


    const client =
        getAuthClient();


    if (!client) {
        return null;
    }


    const existing =
        await getStudentProfile(
            user.id
        );


    if (existing) {

        return existing;

    }


    const cleanName =
        String(
            fullName ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "ChemLab Student"
        ).trim();


    try {

        const {
            data,
            error
        } =
            await client
                .from("profiles")
                .insert({

                    id:
                        user.id,

                    full_name:
                        cleanName,

                    is_premium:
                        false,

                    premium_expires_at:
                        null

                })
                .select(
                    "id,full_name,is_premium,premium_expires_at"
                )
                .single();


        if (error) {

            /*
               A profile may have been created
               by another request at almost
               the same time. Fetch it again.
            */

            const retry =
                await getStudentProfile(
                    user.id
                );


            if (retry) {

                return retry;

            }


            console.error(
                "Profile creation error:",
                error
            );

            return null;

        }


        return data;

    } catch (error) {

        console.error(
            "Profile creation exception:",
            error
        );

        return null;

    }

}


async function ensureStudentProfile(
    user = null
) {

    const currentUser =
        user ||
        await getCurrentUser();


    if (!currentUser) {
        return null;
    }


    const existing =
        await getStudentProfile(
            currentUser.id
        );


    if (existing) {

        return existing;

    }


    return createStudentProfile(
        currentUser
    );

}


/* =========================================================
   10. PREMIUM STATUS
========================================================= */

async function getPremiumStatus() {

    const user =
        await getCurrentUser();


    if (!user) {

        return {

            isPremium:
                false,

            expiresAt:
                null,

            plan:
                null,

            subscription:
                null,

            profile:
                null

        };

    }


    const client =
        getAuthClient();


    if (!client) {

        return {

            isPremium:
                false,

            expiresAt:
                null,

            plan:
                null,

            subscription:
                null,

            profile:
                null

        };

    }


    try {

        const profile =
            await getStudentProfile(
                user.id
            );


        let isPremium =
            Boolean(
                profile?.is_premium
            );


        let expiresAt =
            profile?.premium_expires_at ||
            null;


        let plan =
            null;


        let subscription =
            null;


        /*
           Check active subscription.
        */

        const {
            data: subscriptions,
            error
        } =
            await client
                .from("subscriptions")
                .select(
                    "*"
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
                .limit(1);


        if (!error && subscriptions?.length) {

            const current =
                subscriptions[0];


            const subscriptionExpiry =
                current.expires_at ||
                null;


            const expiryValid =
                !subscriptionExpiry ||
                new Date(
                    subscriptionExpiry
                ) > new Date();


            if (expiryValid) {

                isPremium =
                    true;

                expiresAt =
                    subscriptionExpiry ||
                    expiresAt;

                plan =
                    current.plan ||
                    null;

                subscription =
                    current;

            }

        }


        /*
           Check profile expiry.
        */

        if (
            isPremium &&
            expiresAt &&
            new Date(expiresAt) <=
            new Date()
        ) {

            isPremium =
                false;

        }


        return {

            isPremium,

            expiresAt,

            plan,

            subscription,

            profile

        };

    } catch (error) {

        console.error(
            "Premium status error:",
            error
        );


        return {

            isPremium:
                false,

            expiresAt:
                null,

            plan:
                null,

            subscription:
                null,

            profile:
                null

        };

    }

}


window.getPremiumStatus =
    getPremiumStatus;


/* =========================================================
   11. SIGN UP
========================================================= */

async function signUpStudent(
    fullName,
    email,
    password
) {

    const client =
        getAuthClient();


    if (!client) {

        throw new Error(
            "Authentication service is unavailable."
        );

    }


    const cleanName =
        String(
            fullName || ""
        ).trim();


    const cleanEmail =
        String(
            email || ""
        ).trim()
        .toLowerCase();


    if (!cleanName) {

        throw new Error(
            "Please enter your full name."
        );

    }


    if (!cleanEmail) {

        throw new Error(
            "Please enter your email address."
        );

    }


    if (
        String(password || "")
            .length < 6
    ) {

        throw new Error(
            "Your password must contain at least 6 characters."
        );

    }


    const {
        data,
        error
    } =
        await client.auth.signUp({

            email:
                cleanEmail,

            password,

            options: {

                data: {

                    full_name:
                        cleanName

                }

            }

        });


    if (error) {

        throw error;

    }


    /*
       If email confirmation is disabled,
       session will already exist.
    */

    if (data?.user && data?.session) {

        await createStudentProfile(
            data.user,
            cleanName
        );

    }


    return data;

}


window.signUpStudent =
    signUpStudent;


/* =========================================================
   12. SIGN IN
========================================================= */

async function loginStudent(
    email,
    password
) {

    const client =
        getAuthClient();


    if (!client) {

        throw new Error(
            "Authentication service is unavailable."
        );

    }


    const cleanEmail =
        String(
            email || ""
        ).trim()
        .toLowerCase();


    if (!cleanEmail) {

        throw new Error(
            "Please enter your email address."
        );

    }


    if (!password) {

        throw new Error(
            "Please enter your password."
        );

    }


    const {
        data,
        error
    } =
        await client.auth.signInWithPassword({

            email:
                cleanEmail,

            password

        });


    if (error) {

        throw error;

    }


    if (data?.user) {

        await ensureStudentProfile(
            data.user
        );

    }


    return data;

}


window.loginStudent =
    loginStudent;


/* =========================================================
   13. LOGOUT
========================================================= */

async function logoutStudent() {

    const client =
        getAuthClient();


    if (!client) return;


    try {

        const {
            error
        } =
            await client.auth.signOut();


        if (error) {

            throw error;

        }


        closeAccountModal();


        updateAuthUI(
            null
        );


        authNotify(
            "You have been signed out.",
            "success"
        );


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );


        authNotify(
            "Unable to sign out. Please try again.",
            "error"
        );

    }

}


window.logoutStudent =
    logoutStudent;


/* =========================================================
   14. AUTH UI
========================================================= */

async function updateAuthUI(
    user = undefined
) {

    let currentUser =
        user;


    if (
        typeof user ===
        "undefined"
    ) {

        currentUser =
            await getCurrentUser();

    }


    const loggedIn =
        Boolean(currentUser);


    /*
       Desktop login button
    */

    const loginButton =
        authElement(
            "loginButton"
        );


    const loginIcon =
        authElement(
            "loginButtonIcon"
        );


    const loginText =
        authElement(
            "loginButtonText"
        );


    if (loginButton) {

        loginButton.classList.toggle(
            "logged-in",
            loggedIn
        );


        loginButton.setAttribute(
            "aria-label",
            loggedIn
                ? "Open My Account"
                : "Sign In"
        );

    }


    if (loginIcon) {

        loginIcon.textContent =
            loggedIn
                ? "👤"
                : "→";

    }


    if (loginText) {

        loginText.textContent =
            loggedIn
                ? "My Account"
                : "Sign In";

    }


    /*
       Mobile login button
    */

    const mobileLogin =
        authElement(
            "mobileLoginButton"
        );


    if (mobileLogin) {

        mobileLogin.textContent =
            loggedIn
                ? "My Account"
                : "Sign In";

        mobileLogin.setAttribute(
            "aria-label",
            loggedIn
                ? "Open My Account"
                : "Sign In"
        );

    }


    /*
       Account name
    */

    if (loggedIn) {

        const profile =
            await getStudentProfile(
                currentUser.id
            );


        const displayName =
            profile?.full_name ||
            currentUser.user_metadata?.full_name ||
            currentUser.email?.split("@")[0] ||
            "Student";


        authText(
            "accountName",
            displayName
        );


        authText(
            "accountEmail",
            currentUser.email
        );

    }


    /*
       Update account modal
    */

    if (loggedIn) {

        updateAccountModal();

    }


    /*
       Notify the rest of ChemLab
    */

    dispatchAuthChange(
        currentUser
    );

}


window.updateAuthUI =
    updateAuthUI;


/* =========================================================
   15. ACCOUNT MODAL CONTENT
========================================================= */

async function updateAccountModal() {

    const user =
        await getCurrentUser();


    if (!user) {

        return;

    }


    const premium =
        await getPremiumStatus();


    const profile =
        premium.profile ||
        await getStudentProfile(
            user.id
        );


    const name =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        "ChemLab Student";


    authText(
        "accountName",
        name
    );


    authText(
        "accountEmail",
        user.email
    );


    const status =
        authElement(
            "membershipStatus"
        );


    const premiumAccountStatus =
        authElement(
            "premiumAccountStatus"
        );


    const premiumDetails =
        authElement(
            "premiumDetails"
        );


    const membershipIcon =
        authElement(
            "membershipIcon"
        );


    if (premium.isPremium) {

        if (membershipIcon) {

            membershipIcon.textContent =
                "✦";

        }


        if (status) {

            status.textContent =
                "Premium Member";

            status.className =
                "membership-status premium";

        }


        if (
            premiumAccountStatus
        ) {

            premiumAccountStatus.textContent =
                "Premium Active";

        }


        if (premiumDetails) {

            premiumDetails.hidden =
                false;

        }


        authText(
            "accountPlan",
            formatPlanName(
                premium.plan
            )
        );


        authText(
            "accountExpiry",
            formatExpiryDate(
                premium.expiresAt
            )
        );


        const premiumButton =
            authElement(
                "accountPremiumButton"
            );

        if (premiumButton) {

            premiumButton.hidden =
                true;

        }

    } else {

        if (membershipIcon) {

            membershipIcon.textContent =
                "♙";

        }


        if (status) {

            status.textContent =
                "Free Student";

            status.className =
                "membership-status";

        }


        if (
            premiumAccountStatus
        ) {

            premiumAccountStatus.textContent =
                "Free Plan";

        }


        if (premiumDetails) {

            premiumDetails.hidden =
                true;

        }


        const premiumButton =
            authElement(
                "accountPremiumButton"
            );

        if (premiumButton) {

            premiumButton.hidden =
                false;

        }

    }

}


window.updateAccountModal =
    updateAccountModal;


/* =========================================================
   16. PLAN FORMATTING
========================================================= */

function formatPlanName(
    plan
) {

    if (!plan) {

        return "Premium";

    }


    const clean =
        String(plan)
            .toLowerCase();


    if (
        clean === "monthly"
    ) {

        return "Monthly Premium";

    }


    if (
        clean === "yearly" ||
        clean === "annual"
    ) {

        return "Yearly Premium";

    }


    return (
        clean.charAt(0).toUpperCase() +
        clean.slice(1)
    );

}


function formatExpiryDate(
    date
) {

    if (!date) {

        return "No expiry date";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "No expiry date";

    }


    return parsed.toLocaleDateString(
        "en-GH",
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
   17. PREMIUM PAGE
========================================================= */

function openPremiumPage() {

    closePremiumModal();


    if (
        typeof window.showPage ===
        "function"
    ) {

        window.showPage(
            "premiumSection"
        );

    }

}


window.openPremiumPage =
    openPremiumPage;


/* =========================================================
   18. REQUEST PREMIUM
========================================================= */

async function requestPremiumPlan(
    plan
) {

    const selected =
        plan === "monthly"
            ? "monthly"
            : "yearly";


    const user =
        await getCurrentUser();


    if (!user) {

        closePremiumModal();


        authNotify(
            "Please sign in before purchasing Premium.",
            "warning"
        );


        openAuthModal(
            "signin"
        );


        return;

    }


    const current =
        await getPremiumStatus();


    if (
        current.isPremium
    ) {

        authNotify(
            "Your Premium membership is already active.",
            "success"
        );


        closePremiumModal();

        return;

    }


    const session =
        await getCurrentSession();


    if (!session?.access_token) {

        authNotify(
            "Your session has expired. Please sign in again.",
            "warning"
        );


        openAuthModal(
            "signin"
        );

        return;

    }


    const buttons =
        document.querySelectorAll(
            ".premium-plan-button"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;

            button.classList.add(
                "loading"
            );

        }
    );


    const startButton =
        authElement(
            "startPremiumButton"
        );


    if (startButton) {

        startButton.disabled =
            true;

        startButton.textContent =
            "Preparing Checkout...";

    }


    try {

        const response =
            await fetch(
                CHEMLAB_AUTH_CONFIG
                    .activatePremiumUrl,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            CHEMLAB_AUTH_CONFIG
                                .supabaseKey,

                        "Authorization":
                            `Bearer ${session.access_token}`

                    },

                    body:
                        JSON.stringify({

                            plan:
                                selected

                        })

                }
            );


        let result = null;


        try {

            result =
                await response.json();

        } catch {

            result =
                null;

        }


        if (!response.ok) {

            throw new Error(
                result?.error ||
                "Unable to create Premium checkout."
            );

        }


        const authorizationUrl =
            result?.authorization_url ||
            result?.authorizationUrl;


        const reference =
            result?.reference ||
            result?.payment_reference ||
            null;


        if (!authorizationUrl) {

            throw new Error(
                "Paystack checkout URL was not returned."
            );

        }


        /*
           Save information needed after
           Paystack redirects back.
        */

        sessionStorage.setItem(
            "chemlab_pending_payment",
            JSON.stringify({

                reference,

                plan:
                    selected,

                subscription_id:
                    result?.subscription_id ||
                    null,

                created_at:
                    Date.now()

            })
        );


        /*
           Redirect to Paystack
        */

        window.location.href =
            authorizationUrl;

    } catch (error) {

        console.error(
            "Premium checkout error:",
            error
        );


        authNotify(
            error.message ||
            "Unable to start Premium checkout.",
            "error",
            5000
        );


        buttons.forEach(
            button => {

                button.disabled =
                    false;

                button.classList.remove(
                    "loading"
                );

            }
        );


        if (startButton) {

            startButton.disabled =
                false;

            startButton.textContent =
                "Continue to Payment";

        }

    }

}


window.requestPremiumPlan =
    requestPremiumPlan;


/* =========================================================
   19. PREMIUM EXPERIMENT PROTECTION
========================================================= */

async function handlePremiumExperiment(
    button = null
) {

    const user =
        await getCurrentUser();


    if (!user) {

        authNotify(
            "Sign in to unlock Premium experiments.",
            "warning"
        );


        openAuthModal(
            "signin"
        );


        return;

    }


    const premium =
        await getPremiumStatus();


    if (
        !premium.isPremium
    ) {

        openPremiumModal(
            "yearly"
        );

        return;

    }


    if (
        typeof window.openAdvancedTitration ===
        "function"
    ) {

        window.openAdvancedTitration();

    }

}


window.handlePremiumExperiment =
    handlePremiumExperiment;


/* =========================================================
   20. PAYSTACK VERIFICATION
========================================================= */

async function verifyPaystackPayment(
    reference
) {

    if (!reference) {

        throw new Error(
            "Payment reference is missing."
        );

    }


    const session =
        await getCurrentSession();


    if (!session?.access_token) {

        /*
           Preserve reference so the payment
           can be verified after login.
        */

        sessionStorage.setItem(
            "chemlab_payment_reference",
            reference
        );


        openAuthModal(
            "signin"
        );


        return false;

    }


    try {

        const response =
            await fetch(
                CHEMLAB_AUTH_CONFIG
                    .verifyPaymentUrl,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            CHEMLAB_AUTH_CONFIG
                                .supabaseKey,

                        "Authorization":
                            `Bearer ${session.access_token}`

                    },

                    body:
                        JSON.stringify({

                            reference

                        })

                }
            );


        let result = null;


        try {

            result =
                await response.json();

        } catch {

            result =
                null;

        }


        if (!response.ok) {

            throw new Error(
                result?.error ||
                "Payment verification failed."
            );

        }


        /*
           Remove pending payment data.
        */

        sessionStorage.removeItem(
            "chemlab_pending_payment"
        );

        sessionStorage.removeItem(
            "chemlab_payment_reference"
        );


        /*
           Remove Paystack parameters
           from browser URL.
        */

        try {

            const cleanUrl =
                window.location.origin +
                window.location.pathname +
                window.location.hash;

            window.history.replaceState(
                {},
                document.title,
                cleanUrl
            );

        } catch {

            /*
               Ignore URL cleanup errors.
            */

        }


        /*
           Refresh UI.
        */

        await updateAuthUI(
            session.user
        );


        await updateAccountModal();


        authNotify(
            "Payment verified. ChemLab Premium is now active!",
            "success",
            6000
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
            "Paystack verification error:",
            error
        );


        authNotify(
            error.message ||
            "We could not verify the payment yet.",
            "error",
            6000
        );


        return false;

    }

}


window.verifyPaystackPayment =
    verifyPaystackPayment;


/* =========================================================
   21. HANDLE PAYSTACK RETURN
========================================================= */

async function handlePaystackReturn() {

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


    if (!reference) {

        return;

    }


    const user =
        await getCurrentUser();


    if (!user) {

        sessionStorage.setItem(
            "chemlab_payment_reference",
            reference
        );


        authNotify(
            "Sign in to finish verifying your Premium payment.",
            "warning"
        );


        openAuthModal(
            "signin"
        );


        return;

    }


    await verifyPaystackPayment(
        reference
    );

}


/* =========================================================
   22. VERIFY PENDING PAYMENT
========================================================= */

async function verifyPendingPaymentAfterLogin() {

    const pending =
        sessionStorage.getItem(
            "chemlab_pending_payment"
        );


    const standaloneReference =
        sessionStorage.getItem(
            "chemlab_payment_reference"
        );


    let reference =
        standaloneReference;


    if (
        !reference &&
        pending
    ) {

        try {

            const data =
                JSON.parse(
                    pending
                );

            reference =
                data?.reference ||
                null;

        } catch {

            reference =
                null;

        }

    }


    if (!reference) {

        return;

    }


    /*
       Avoid verifying very old data.
    */

    if (pending) {

        try {

            const data =
                JSON.parse(
                    pending
                );


            if (
                data?.created_at &&
                Date.now() -
                    data.created_at >
                    24 * 60 * 60 * 1000
            ) {

                sessionStorage.removeItem(
                    "chemlab_pending_payment"
                );

                sessionStorage.removeItem(
                    "chemlab_payment_reference"
                );

                return;

            }

        } catch {

            /*
               Ignore malformed metadata.
            */

        }

    }


    await verifyPaystackPayment(
        reference
    );

}


window.verifyPendingPaymentAfterLogin =
    verifyPendingPaymentAfterLogin;


/* =========================================================
   23. AUTH FORM SUBMISSION
========================================================= */

async function handleAuthSubmit(
    event
) {

    if (event) {

        event.preventDefault();

    }


    const submitButton =
        authElement(
            "authSubmit"
        );


    const name =
        authElement(
            "authName"
        )?.value ||
        "";


    const email =
        authElement(
            "authEmail"
        )?.value ||
        "";


    const password =
        authElement(
            "authPassword"
        )?.value ||
        "";


    clearAuthMessage();


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.classList.add(
            "loading"
        );

    }


    try {

        if (
            currentAuthMode ===
            "signup"
        ) {

            const result =
                await signUpStudent(
                    name,
                    email,
                    password
                );


            if (
                result?.session
            ) {

                closeAuthModal();


                authNotify(
                    "Account created successfully. Welcome to ChemLab!",
                    "success"
                );


                await updateAuthUI(
                    result.user
                );


            } else {

                showAuthMessage(
                    "Account created. Please check your email to confirm your account.",
                    "success"
                );

            }

        } else {

            const result =
                await loginStudent(
                    email,
                    password
                );


            closeAuthModal();


            authNotify(
                "Welcome back to ChemLab!",
                "success"
            );


            await updateAuthUI(
                result.user
            );


            await verifyPendingPaymentAfterLogin();

        }

    } catch (error) {

        console.error(
            "Auth submission error:",
            error
        );


        let message =
            error?.message ||
            "Authentication failed. Please try again.";


        /*
           Make common Supabase errors
           easier for students to understand.
        */

        if (
            message
                .toLowerCase()
                .includes(
                    "invalid login credentials"
                )
        ) {

            message =
                "Incorrect email or password.";

        }


        if (
            message
                .toLowerCase()
                .includes(
                    "email not confirmed"
                )
        ) {

            message =
                "Please confirm your email before signing in.";

        }


        if (
            message
                .toLowerCase()
                .includes(
                    "user already registered"
                )
        ) {

            message =
                "An account with this email already exists. Try signing in.";

        }


        showAuthMessage(
            message,
            "error"
        );

    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.classList.remove(
                "loading"
            );

        }

    }

}


/* =========================================================
   24. SWITCH AUTH MODE
========================================================= */

function switchAuthMode() {

    openAuthModal(
        currentAuthMode ===
            "signin"
            ? "signup"
            : "signin"
    );

}


/* =========================================================
   25. AUTH EVENT BRIDGE
========================================================= */

function dispatchAuthChange(
    user
) {

    document.dispatchEvent(
        new CustomEvent(
            "chemlab:auth-change",
            {

                detail: {

                    user:
                        user || null

                }

            }
        )
    );

}


/* =========================================================
   26. SETUP AUTH BUTTONS
========================================================= */

function setupAuthButtons() {

    const loginButton =
        authElement(
            "loginButton"
        );


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            async () => {

                const user =
                    await getCurrentUser();


                if (user) {

                    openAccountModal();

                } else {

                    openAuthModal(
                        "signin"
                    );

                }

            }
        );

    }


    const mobileLogin =
        authElement(
            "mobileLoginButton"
        );


    if (mobileLogin) {

        mobileLogin.addEventListener(
            "click",
            async () => {

                const user =
                    await getCurrentUser();


                if (user) {

                    openAccountModal();

                } else {

                    openAuthModal(
                        "signin"
                    );

                }

            }
        );

    }


    const authSubmit =
        authElement(
            "authSubmit"
        );


    if (authSubmit) {

        authSubmit.addEventListener(
            "click",
            handleAuthSubmit
        );

    }


    const authSwitch =
        authElement(
            "authSwitch"
        );


    if (authSwitch) {

        authSwitch.addEventListener(
            "click",
            switchAuthMode
        );

    }


    const closeAuth =
        authElement(
            "closeAuthModal"
        );


    if (closeAuth) {

        closeAuth.addEventListener(
            "click",
            closeAuthModal
        );

    }


    const closeAccount =
        authElement(
            "closeAccountModal"
        );


    if (closeAccount) {

        closeAccount.addEventListener(
            "click",
            closeAccountModal
        );

    }


    const closePremium =
        authElement(
            "closePremiumModal"
        );


    if (closePremium) {

        closePremium.addEventListener(
            "click",
            closePremiumModal
        );

    }


    const logout =
        authElement(
            "logoutButton"
        );


    if (logout) {

        logout.addEventListener(
            "click",
            logoutStudent
        );

    }


    const accountPremium =
        authElement(
            "accountPremiumButton"
        );


    if (accountPremium) {

        accountPremium.addEventListener(
            "click",
            () => {

                closeAccountModal();

                openPremiumModal(
                    "yearly"
                );

            }
        );

    }


    const startPremium =
        authElement(
            "startPremiumButton"
        );


    if (startPremium) {

        startPremium.addEventListener(
            "click",
            () =>
                requestPremiumPlan(
                    selectedPremiumPlan
                )
        );

    }

}


/* =========================================================
   27. PREMIUM PLAN BUTTONS
========================================================= */

function setupPremiumButtons() {

    document
        .querySelectorAll(
            ".premium-plan-button"
        )
        .forEach(
            button => {

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

            }
        );

}


/* =========================================================
   28. PREMIUM EXPERIMENT BUTTONS
========================================================= */

function setupPremiumExperimentButtons() {

    document
        .querySelectorAll(
            ".premium-experiment-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () =>
                        handlePremiumExperiment(
                            button
                        )
                );

            }
        );

}


/* =========================================================
   29. MODAL BACKDROPS
========================================================= */

function setupModalBackdrops() {

    [
        "authModal",
        "accountModal",
        "premiumModal"

    ].forEach(
        id => {

            const modal =
                authElement(id);


            if (!modal) return;


            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target !==
                        modal
                    ) {

                        return;

                    }


                    if (
                        id ===
                        "authModal"
                    ) {

                        closeAuthModal();

                    }


                    if (
                        id ===
                        "accountModal"
                    ) {

                        closeAccountModal();

                    }


                    if (
                        id ===
                        "premiumModal"
                    ) {

                        closePremiumModal();

                    }

                }
            );

        }
    );

}


/* =========================================================
   30. ESCAPE KEY
========================================================= */

function setupAuthEscapeKey() {

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


/* =========================================================
   31. SUPABASE AUTH LISTENER
========================================================= */

function setupSupabaseAuthListener() {

    const client =
        getAuthClient();


    if (!client) return;


    client.auth.onAuthStateChange(
        async (
            event,
            session
        ) => {

            console.log(
                "ChemLab auth event:",
                event
            );


            const user =
                session?.user ||
                null;


            /*
               Do not perform heavy Supabase
               queries directly inside the
               auth callback when avoidable.
            */

            setTimeout(
                async () => {

                    if (user) {

                        await ensureStudentProfile(
                            user
                        );

                    }


                    await updateAuthUI(
                        user
                    );


                    if (
                        event ===
                        "SIGNED_IN"
                    ) {

                        await verifyPendingPaymentAfterLogin();

                    }

                },
                0
            );

        }
    );

}


/* =========================================================
   32. INITIAL AUTH STATE
========================================================= */

async function initializeInitialAuthState() {

    const user =
        await getCurrentUser();


    if (user) {

        await ensureStudentProfile(
            user
        );

    }


    await updateAuthUI(
        user
    );

}


/* =========================================================
   33. INITIALIZE AUTH SYSTEM
========================================================= */

async function initializeChemLabAuth() {

    if (
        window.__CHEMLAB_AUTH_INITIALIZED
    ) {

        return;

    }


    window.__CHEMLAB_AUTH_INITIALIZED =
        true;


    console.log(
        "ChemLab: initializing authentication..."
    );


    getAuthClient();


    setupAuthButtons();

    setupPremiumButtons();

    setupPremiumExperimentButtons();

    setupModalBackdrops();

    setupAuthEscapeKey();

    setupSupabaseAuthListener();


    await initializeInitialAuthState();


    /*
       Check whether Paystack redirected
       the student back to ChemLab.
    */

    await handlePaystackReturn();


    console.log(
        "ChemLab: authentication ready."
    );

}


/* =========================================================
   34. PUBLIC API
========================================================= */

window.openAuthModal =
    openAuthModal;

window.closeAuthModal =
    closeAuthModal;

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

window.signUpStudent =
    signUpStudent;

window.loginStudent =
    loginStudent;

window.logoutStudent =
    logoutStudent;

window.getStudentProfile =
    getStudentProfile;

window.createStudentProfile =
    createStudentProfile;

window.ensureStudentProfile =
    ensureStudentProfile;

window.getPremiumStatus =
    getPremiumStatus;

window.requestPremiumPlan =
    requestPremiumPlan;

window.handlePremiumExperiment =
    handlePremiumExperiment;

window.updateAuthUI =
    updateAuthUI;

window.updateAccountModal =
    updateAccountModal;

window.verifyPaystackPayment =
    verifyPaystackPayment;

window.verifyPendingPaymentAfterLogin =
    verifyPendingPaymentAfterLogin;

window.handlePaystackReturn =
    handlePaystackReturn;


/* =========================================================
   35. DOM READY
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChemLabAuth,
        {
            once: true
        }
    );

} else {

    initializeChemLabAuth();

}
