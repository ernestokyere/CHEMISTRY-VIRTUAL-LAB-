"use strict";

/* =========================================================
   CHEMLAB AUTH + PREMIUM SYSTEM
   CLEAN REPLACEMENT VERSION
   =========================================================
   Responsibilities:
   - Supabase authentication
   - Student account creation
   - Login / logout
   - Profile management
   - Premium status
   - Paystack Premium initialization
   - Paystack payment verification
   - Premium experiment protection
   - Auth UI
   - Account modal
   - Premium modal
   - Auth events for app.js
   ========================================================= */


/* =========================================================
   1. CONFIGURATION
   ========================================================= */

const CHEMLAB_AUTH_CONFIG = Object.freeze({

    SUPABASE_URL:
        "https://zscbgeaieiqwknhjxpnt.supabase.co",

    SUPABASE_KEY:
        "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy",

    ACTIVATE_PREMIUM_URL:
        "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/activate-premium",

    VERIFY_PAYMENT_URL:
        "https://zscbgeaieiqwknhjxpnt.supabase.co/functions/v1/verify-paystack-payment"

});


/* =========================================================
   2. SUPABASE CLIENT
   ========================================================= */

/*
   Important:
   We DO NOT declare another global "supabaseClient"
   variable here.

   app.js may already have created one.

   This prevents:
       Identifier 'supabaseClient' has already been declared
*/

let chemLabAuthClient = null;

try {

    /*
       Reuse the client created by app.js when available.
    */

    if (
        window.supabaseClient &&
        typeof window.supabaseClient.auth?.getUser === "function"
    ) {

        chemLabAuthClient =
            window.supabaseClient;

        console.log(
            "ChemLab Auth: Reusing existing Supabase client."
        );

    }

    /*
       Otherwise create the client here.
    */

    else if (
        window.supabase &&
        typeof window.supabase.createClient === "function"
    ) {

        chemLabAuthClient =
            window.supabase.createClient(
                CHEMLAB_AUTH_CONFIG.SUPABASE_URL,
                CHEMLAB_AUTH_CONFIG.SUPABASE_KEY,
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

        console.log(
            "ChemLab Auth: Supabase client created."
        );

    }

    else {

        console.error(
            "ChemLab Auth: Supabase library is unavailable."
        );

    }

}
catch (error) {

    console.error(
        "ChemLab Auth: Supabase initialization failed:",
        error
    );

}


/* =========================================================
   3. INTERNAL HELPERS
   ========================================================= */

function authGetElement(id) {

    return document.getElementById(id);

}


function authSetText(id, value) {

    const element =
        authGetElement(id);

    if (!element) {
        return;
    }

    element.textContent =
        value === null ||
        value === undefined
            ? ""
            : String(value);

}


function authShowMessage(
    message,
    type = "error"
) {

    const box =
        authGetElement("authMessage");

    if (!box) {
        return;
    }

    box.textContent =
        message || "";

    box.classList.remove(
        "error",
        "success"
    );

    box.classList.add(
        type === "success"
            ? "success"
            : "error"
    );

    box.style.display =
        "block";

}


function authClearMessage() {

    const box =
        authGetElement("authMessage");

    if (!box) {
        return;
    }

    box.textContent =
        "";

    box.classList.remove(
        "error",
        "success"
    );

    box.style.display =
        "";

}


function authNotify(
    message,
    type = "success"
) {

    if (
        typeof window.showNotification ===
        "function"
    ) {

        window.showNotification(
            message,
            type
        );

    }
    else {

        alert(message);

    }

}


/* =========================================================
   4. AUTH MODAL
   ========================================================= */

function openAuthModal(
    mode = "signin"
) {

    const modal =
        authGetElement("authModal");

    if (!modal) {

        console.error(
            "ChemLab Auth: authModal not found."
        );

        return;

    }


    const title =
        authGetElement("authTitle");

    const subtitle =
        authGetElement("authSubtitle");

    const submit =
        authGetElement("authSubmit");

    const switchText =
        authGetElement("authSwitchText");

    const switchButton =
        authGetElement("authSwitch");

    const nameField =
        authGetElement("nameField");

    const normalizedMode =
        mode === "signup"
            ? "signup"
            : "signin";


    authClearMessage();


    if (normalizedMode === "signup") {

        if (title) {

            title.textContent =
                "Create Student Account";

        }

        if (subtitle) {

            subtitle.textContent =
                "Create your ChemLab account to save your progress.";

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

        if (nameField) {

            nameField.style.display =
                "block";

        }

    }

    else {

        if (title) {

            title.textContent =
                "Welcome Back";

        }

        if (subtitle) {

            subtitle.textContent =
                "Sign in to continue using ChemLab.";

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

        if (nameField) {

            nameField.style.display =
                "none";

        }

    }


    modal.dataset.mode =
        normalizedMode;

    modal.classList.add("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    const email =
        authGetElement("authEmail");

    if (email) {

        setTimeout(
            () => email.focus(),
            50
        );

    }

}


function closeAuthModal() {

    const modal =
        authGetElement("authModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    authClearMessage();

}


/* =========================================================
   5. ACCOUNT MODAL
   ========================================================= */

function openAccountModal() {

    const modal =
        authGetElement("accountModal");

    if (!modal) {

        console.error(
            "ChemLab Auth: accountModal not found."
        );

        return;

    }

    modal.classList.add("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    updateAccountModal();

}


function closeAccountModal() {

    const modal =
        authGetElement("accountModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   6. PREMIUM MODAL
   ========================================================= */

function openPremiumModal() {

    const modal =
        authGetElement("premiumModal");

    if (!modal) {

        openPremiumPage();

        return;

    }

    modal.classList.add("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closePremiumModal() {

    const modal =
        authGetElement("premiumModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   7. PREMIUM PAGE
   ========================================================= */

function openPremiumPage() {

    closePremiumModal();
    closeAccountModal();


    /*
       Prefer app.js navigation when available.
    */

    if (
        typeof window.showPage ===
        "function"
    ) {

        window.showPage(
            "premiumSection"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;

    }


    /*
       Safe fallback if app.js navigation
       is unavailable.
    */

    const premiumPage =
        authGetElement("premiumSection");

    if (!premiumPage) {

        console.error(
            "ChemLab Auth: premiumSection not found."
        );

        return;

    }


    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

            page.style.display =
                "none";

        });


    premiumPage.classList.add(
        "active"
    );

    premiumPage.style.display =
        "block";


    if (
        window.chemLabState &&
        typeof window.chemLabState === "object"
    ) {

        window.chemLabState.currentPage =
            "premiumSection";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   8. CURRENT USER
   ========================================================= */

async function getCurrentUser() {

    if (!chemLabAuthClient) {

        return null;

    }


    try {

        const {
            data,
            error
        } =
            await chemLabAuthClient.auth.getUser();


        if (error) {

            /*
               A missing session is normal.
            */

            if (
                error.message &&
                !error.message
                    .toLowerCase()
                    .includes("session")
            ) {

                console.warn(
                    "ChemLab Auth: getUser:",
                    error.message
                );

            }

            return null;

        }


        return data?.user || null;

    }
    catch (error) {

        console.error(
            "ChemLab Auth: getCurrentUser failed:",
            error
        );

        return null;

    }

}


/* =========================================================
   9. CURRENT SESSION
   ========================================================= */

async function getCurrentSession() {

    if (!chemLabAuthClient) {
        return null;
    }


    try {

        const {
            data,
            error
        } =
            await chemLabAuthClient.auth.getSession();


        if (error) {

            console.warn(
                "ChemLab Auth: getSession:",
                error.message
            );

            return null;

        }


        return data?.session || null;

    }
    catch (error) {

        console.error(
            "ChemLab Auth: getCurrentSession failed:",
            error
        );

        return null;

    }

}


/* =========================================================
   10. CREATE / ENSURE PROFILE
   ========================================================= */

async function createStudentProfile(
    userId,
    fullName = "ChemLab Student"
) {

    if (
        !chemLabAuthClient ||
        !userId
    ) {

        return null;

    }


    try {

        /*
           First check whether the profile already exists.
           This prevents accidentally resetting Premium.
        */

        const {
            data: existing,
            error: existingError
        } =
            await chemLabAuthClient
                .from("profiles")
                .select(
                    "id, full_name, is_premium, premium_expires_at"
                )
                .eq("id", userId)
                .maybeSingle();


        if (
            !existingError &&
            existing
        ) {

            return existing;

        }


        /*
           Only create a profile when one doesn't exist.
        */

        const {
            data,
            error
        } =
            await chemLabAuthClient
                .from("profiles")
                .insert({
                    id: userId,

                    full_name:
                        String(fullName || "")
                            .trim() ||
                        "ChemLab Student",

                    is_premium:
                        false,

                    premium_expires_at:
                        null
                })
                .select()
                .maybeSingle();


        if (error) {

            /*
               Another auth process may have created it
               between the check and insert.
            */

            console.warn(
                "ChemLab Auth: Profile creation:",
                error.message
            );

            return null;

        }


        return data || null;

    }
    catch (error) {

        console.warn(
            "ChemLab Auth: createStudentProfile:",
            error
        );

        return null;

    }

}


/* =========================================================
   11. ENSURE PROFILE AFTER LOGIN
   ========================================================= */

async function ensureStudentProfile(
    user
) {

    if (!user?.id) {
        return null;
    }


    try {

        const {
            data: profile,
            error
        } =
            await chemLabAuthClient
                .from("profiles")
                .select(
                    "id, full_name, is_premium, premium_expires_at"
                )
                .eq("id", user.id)
                .maybeSingle();


        if (!error && profile) {

            return profile;

        }


        return await createStudentProfile(
            user.id,
            user.user_metadata?.full_name ||
            "ChemLab Student"
        );

    }
    catch (error) {

        console.warn(
            "ChemLab Auth: ensureStudentProfile:",
            error
        );

        return null;

    }

}


/* =========================================================
   12. PREMIUM STATUS
   ========================================================= */

async function getPremiumStatus() {

    const user =
        await getCurrentUser();


    if (!user) {

        return {

            isPremium: false,

            expiresAt: null,

            plan: null,

            subscription: null,

            profile: null

        };

    }


    try {

        /*
           Get profile.
        */

        const {
            data: profile,
            error: profileError
        } =
            await chemLabAuthClient
                .from("profiles")
                .select(
                    "id, full_name, is_premium, premium_expires_at"
                )
                .eq("id", user.id)
                .maybeSingle();


        if (profileError) {

            console.warn(
                "ChemLab Auth: Profile status query:",
                profileError.message
            );

        }


        /*
           Get newest active subscription.
        */

        const {
            data: subscriptions,
            error: subscriptionError
        } =
            await chemLabAuthClient
                .from("subscriptions")
                .select("*")
                .eq("user_id", user.id)
                .eq("status", "active")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(1);


        let subscription =
            null;


        if (
            !subscriptionError &&
            Array.isArray(subscriptions) &&
            subscriptions.length
        ) {

            subscription =
                subscriptions[0];

        }


        /*
           Start with the profile state.
        */

        let isPremium =
            Boolean(
                profile?.is_premium
            );


        let expiresAt =
            profile?.premium_expires_at ||
            null;


        let plan =
            null;


        /*
           Check profile expiry.
        */

        if (
            isPremium &&
            expiresAt
        ) {

            const expiry =
                new Date(
                    expiresAt
                ).getTime();


            if (
                Number.isFinite(expiry) &&
                expiry <= Date.now()
            ) {

                isPremium =
                    false;

            }

        }


        /*
           Active subscription can confirm Premium.
        */

        if (subscription) {

            plan =
                subscription.plan ||
                null;


            if (
                subscription.expires_at
            ) {

                expiresAt =
                    subscription.expires_at;


                const expiry =
                    new Date(
                        subscription.expires_at
                    ).getTime();


                if (
                    Number.isFinite(expiry) &&
                    expiry > Date.now()
                ) {

                    isPremium =
                        true;

                }

                else if (
                    Number.isFinite(expiry)
                ) {

                    isPremium =
                        false;

                }

            }

        }


        return {

            isPremium,

            expiresAt,

            plan,

            subscription,

            profile:
                profile || null

        };

    }
    catch (error) {

        console.error(
            "ChemLab Auth: Premium status failed:",
            error
        );

        return {

            isPremium: false,

            expiresAt: null,

            plan: null,

            subscription: null,

            profile: null

        };

    }

}


/* =========================================================
   13. SIGN UP
   ========================================================= */

async function signUpStudent(
    email,
    password,
    fullName
) {

    if (!chemLabAuthClient) {

        throw new Error(
            "Supabase is not available."
        );

    }


    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    const cleanName =
        String(fullName || "")
            .trim();


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
        !password ||
        password.length < 6
    ) {

        throw new Error(
            "Password must be at least 6 characters."
        );

    }


    const {
        data,
        error
    } =
        await chemLabAuthClient.auth.signUp({

            email:
                cleanEmail,

            password:
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
       If Supabase automatically authenticated the user,
       create the profile now.

       If email confirmation is required, the profile
       will be created after the first successful login.
    */

    if (
        data?.user &&
        data?.session
    ) {

        await ensureStudentProfile(
            data.user
        );

    }


    return data;

}


/* =========================================================
   14. LOGIN
   ========================================================= */

async function loginStudent(
    email,
    password
) {

    if (!chemLabAuthClient) {

        throw new Error(
            "Supabase is not available."
        );

    }


    const cleanEmail =
        String(email || "")
            .trim()
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
        await chemLabAuthClient.auth
            .signInWithPassword({

                email:
                    cleanEmail,

                password:
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


/* =========================================================
   15. LOGOUT
   ========================================================= */

async function logoutStudent() {

    if (!chemLabAuthClient) {
        return;
    }


    try {

        const {
            error
        } =
            await chemLabAuthClient.auth.signOut();


        if (error) {

            throw error;

        }


        closeAccountModal();
        closePremiumModal();
        closeAuthModal();


        updateAuthUI(
            null
        );


        /*
           Tell the rest of ChemLab.
        */

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:auth-change",
                {
                    detail: {
                        event:
                            "SIGNED_OUT",

                        user:
                            null,

                        session:
                            null
                    }
                }
            )
        );


        /*
           Return to home.
        */

        if (
            typeof window.showPage ===
            "function"
        ) {

            window.showPage(
                "home"
            );

        }


        authNotify(
            "You have been signed out.",
            "success"
        );

    }
    catch (error) {

        console.error(
            "ChemLab Auth: Logout failed:",
            error
        );

        authNotify(
            "Logout failed. Please try again.",
            "error"
        );

    }

}


/* =========================================================
   16. UPDATE AUTH UI
   ========================================================= */

async function updateAuthUI(
    suppliedUser = null
) {

    const loginButton =
        authGetElement("loginButton");


    const user =
        suppliedUser !== null
            ? suppliedUser
            : await getCurrentUser();


    if (!loginButton) {

        /*
           Auth can still function even if the
           navigation login button isn't present.
        */

        return;

    }


    if (!user) {

        loginButton.textContent =
            "Sign In";

        loginButton.onclick =
            function(event) {

                if (event) {
                    event.preventDefault();
                }

                openAuthModal(
                    "signin"
                );

            };

        return;

    }


    loginButton.textContent =
        "My Account";


    loginButton.onclick =
        function(event) {

            if (event) {
                event.preventDefault();
            }

            openAccountModal();

        };


    await updateAccountModal(
        user
    );

}


/* =========================================================
   17. UPDATE ACCOUNT MODAL
   ========================================================= */

async function updateAccountModal(
    suppliedUser = null
) {

    const user =
        suppliedUser !== null
            ? suppliedUser
            : await getCurrentUser();


    if (!user) {
        return;
    }


    const premium =
        await getPremiumStatus();


    const fullName =
        user.user_metadata?.full_name ||
        premium.profile?.full_name ||
        "ChemLab Student";


    authSetText(
        "accountName",
        fullName
    );


    authSetText(
        "accountEmail",
        user.email || ""
    );


    const premiumDetails =
        authGetElement(
            "premiumDetails"
        );


    const accountPremiumButton =
        authGetElement(
            "accountPremiumButton"
        );


    if (premium.isPremium) {

        authSetText(
            "membershipIcon",
            "👑"
        );

        authSetText(
            "membershipStatus",
            "Premium Member"
        );

        authSetText(
            "premiumAccountStatus",
            "Active"
        );

        if (premiumDetails) {

            premiumDetails.style.display =
                "block";

        }


        authSetText(
            "accountPlan",
            premium.plan
                ? String(
                    premium.plan
                ).toUpperCase()
                : "PREMIUM"
        );


        if (premium.expiresAt) {

            const expiry =
                new Date(
                    premium.expiresAt
                );


            authSetText(
                "accountExpiry",

                Number.isNaN(
                    expiry.getTime()
                )
                    ? premium.expiresAt
                    : expiry.toLocaleDateString()
            );

        }

        else {

            authSetText(
                "accountExpiry",
                "Active"
            );

        }


        if (accountPremiumButton) {

            accountPremiumButton.textContent =
                "Open Premium";

        }

    }

    else {

        authSetText(
            "membershipIcon",
            "🧪"
        );

        authSetText(
            "membershipStatus",
            "Free Student"
        );

        authSetText(
            "premiumAccountStatus",
            "Free"
        );


        if (premiumDetails) {

            premiumDetails.style.display =
                "none";

        }


        authSetText(
            "accountPlan",
            "FREE"
        );

        authSetText(
            "accountExpiry",
            "—"
        );


        if (accountPremiumButton) {

            accountPremiumButton.textContent =
                "Get Premium";

        }

    }

}


/* =========================================================
   18. PREMIUM PAYMENT INITIALIZATION
   ========================================================= */

async function requestPremiumPlan(
    plan
) {

    const selectedPlan =
        String(plan || "")
            .trim()
            .toLowerCase();


    if (
        selectedPlan !== "monthly" &&
        selectedPlan !== "yearly"
    ) {

        authNotify(
            "Invalid Premium plan.",
            "error"
        );

        return;

    }


    /*
       User must be authenticated.
    */

    const user =
        await getCurrentUser();


    if (!user) {

        closePremiumModal();

        openAuthModal(
            "signin"
        );

        authShowMessage(
            "Please sign in before choosing Premium.",
            "error"
        );

        return;

    }


    /*
       Check whether Premium is already active.
    */

    const premium =
        await getPremiumStatus();


    if (premium.isPremium) {

        closePremiumModal();

        openAccountModal();

        authNotify(
            "Your Premium membership is already active.",
            "success"
        );

        return;

    }


    /*
       Get a fresh session.
    */

    const session =
        await getCurrentSession();


    if (!session?.access_token) {

        closePremiumModal();

        openAuthModal(
            "signin"
        );

        authShowMessage(
            "Your session has expired. Please sign in again.",
            "error"
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

            if (
                !button.dataset.originalText
            ) {

                button.dataset.originalText =
                    button.textContent;

            }

            button.textContent =
                "Processing...";

        }
    );


    try {

        const response =
            await fetch(
                CHEMLAB_AUTH_CONFIG
                    .ACTIVATE_PREMIUM_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
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
            await response
                .json()
                .catch(
                    () => ({})
                );


        if (!response.ok) {

            throw new Error(
                result?.error ||
                result?.message ||
                "Unable to start Premium payment."
            );

        }


        if (
            !result?.authorization_url
        ) {

            throw new Error(
                "Paystack did not return a payment URL."
            );

        }


        /*
           Save payment information.
        */

        if (result.reference) {

            sessionStorage.setItem(
                "chemLabPaystackReference",
                result.reference
            );

        }


        sessionStorage.setItem(
            "chemLabPaystackPlan",
            selectedPlan
        );


        if (
            result.subscription_id
        ) {

            sessionStorage.setItem(
                "chemLabSubscriptionId",
                result.subscription_id
            );

        }


        /*
           Redirect to Paystack.
        */

        window.location.href =
            result.authorization_url;

    }
    catch (error) {

        console.error(
            "ChemLab Auth: Premium initialization failed:",
            error
        );


        authNotify(
            error?.message ||
            "Unable to start Premium payment.",
            "error"
        );

    }
    finally {

        buttons.forEach(
            button => {

                button.disabled =
                    false;

                if (
                    button.dataset.originalText
                ) {

                    button.textContent =
                        button.dataset.originalText;

                }

            }
        );

    }

}


/* =========================================================
   19. PREMIUM EXPERIMENT ACCESS
   ========================================================= */

async function handlePremiumExperiment(
    button = null
) {

    const user =
        await getCurrentUser();


    if (!user) {

        openAuthModal(
            "signin"
        );

        authShowMessage(
            "Please sign in to access Premium experiments.",
            "error"
        );

        return;

    }


    const premium =
        await getPremiumStatus();


    if (!premium.isPremium) {

        openPremiumModal();

        return;

    }


    /*
       Premium confirmed.
    */

    if (
        typeof window.openAdvancedTitration ===
        "function"
    ) {

        window.openAdvancedTitration();

    }

    else if (
        typeof window.showPage ===
        "function"
    ) {

        window.showPage(
            "advancedTitrationPage"
        );

    }

    else {

        console.error(
            "ChemLab Auth: Advanced Titration function unavailable."
        );

        authNotify(
            "Advanced Chemistry Lab is still loading. Please try again.",
            "error"
        );

    }

}


/* =========================================================
   20. VERIFY PAYSTACK PAYMENT
   ========================================================= */

async function verifyPaystackPayment(
    reference
) {

    if (!reference) {

        throw new Error(
            "Payment reference is missing."
        );

    }


    const user =
        await getCurrentUser();


    if (!user) {

        sessionStorage.setItem(
            "chemLabPendingPaystackReference",
            reference
        );

        openAuthModal(
            "signin"
        );

        authShowMessage(
            "Please sign in to complete Premium verification.",
            "success"
        );

        return false;

    }


    const session =
        await getCurrentSession();


    if (!session?.access_token) {

        sessionStorage.setItem(
            "chemLabPendingPaystackReference",
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
                    .VERIFY_PAYMENT_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${session.access_token}`

                    },

                    body:
                        JSON.stringify({
                            reference
                        })

                }
            );


        const result =
            await response
                .json()
                .catch(
                    () => ({})
                );


        if (!response.ok) {

            throw new Error(
                result?.error ||
                result?.message ||
                "Payment verification failed."
            );

        }


        /*
           Remove temporary payment information.
        */

        sessionStorage.removeItem(
            "chemLabPendingPaystackReference"
        );

        sessionStorage.removeItem(
            "chemLabPaystackReference"
        );

        sessionStorage.removeItem(
            "chemLabPaystackPlan"
        );

        sessionStorage.removeItem(
            "chemLabSubscriptionId"
        );


        /*
           Remove Paystack query parameters.
        */

        try {

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );

        }
        catch (error) {

            console.warn(
                "ChemLab Auth: URL cleanup failed:",
                error
            );

        }


        /*
           Refresh account information.
        */

        await updateAuthUI(
            user
        );


        authNotify(
            "🎉 Premium activated successfully!",
            "success"
        );


        openPremiumPage();


        return true;

    }
    catch (error) {

        console.error(
            "ChemLab Auth: Payment verification failed:",
            error
        );


        /*
           Keep the reference so verification can
           be retried after the webhook/transaction
           becomes available.
        */

        sessionStorage.setItem(
            "chemLabPendingPaystackReference",
            reference
        );


        authNotify(
            error?.message ||
            "Payment verification could not be completed yet.",
            "error"
        );


        return false;

    }

}


/* =========================================================
   21. PAYSTACK RETURN
   ========================================================= */

async function handlePaystackReturn() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const reference =
        params.get("reference") ||
        params.get("trxref");


    if (!reference) {

        return;

    }


    console.log(
        "ChemLab Auth: Paystack reference detected."
    );


    await verifyPaystackPayment(
        reference
    );

}


/* =========================================================
   22. VERIFY PENDING PAYMENT
   ========================================================= */

async function verifyPendingPaymentAfterLogin() {

    const reference =
        sessionStorage.getItem(
            "chemLabPendingPaystackReference"
        );


    if (!reference) {

        return;

    }


    const user =
        await getCurrentUser();


    if (!user) {

        return;

    }


    await verifyPaystackPayment(
        reference
    );

}


/* =========================================================
   23. AUTH FORM SUBMISSION
   ========================================================= */

async function handleAuthSubmit() {

    const modal =
        authGetElement(
            "authModal"
        );


    if (!modal) {
        return;
    }


    const mode =
        modal.dataset.mode ||
        "signin";


    const email =
        authGetElement(
            "authEmail"
        )?.value
            ?.trim();


    const password =
        authGetElement(
            "authPassword"
        )?.value;


    const fullName =
        authGetElement(
            "authName"
        )?.value
            ?.trim();


    const submit =
        authGetElement(
            "authSubmit"
        );


    authClearMessage();


    if (submit) {

        submit.disabled =
            true;

        submit.dataset.originalText =
            submit.textContent;

        submit.textContent =
            mode === "signup"
                ? "Creating Account..."
                : "Signing In...";

    }


    try {

        if (mode === "signup") {

            const data =
                await signUpStudent(
                    email,
                    password,
                    fullName
                );


            /*
               If email confirmation is required,
               no active session exists yet.
            */

            if (!data?.session) {

                authShowMessage(
                    "Account created. Please check your email and confirm your account before signing in.",
                    "success"
                );

                return;

            }


            authShowMessage(
                "Account created successfully.",
                "success"
            );


            await updateAuthUI(
                data.user
            );


            await verifyPendingPaymentAfterLogin();


            setTimeout(
                () => {
                    closeAuthModal();
                },
                700
            );

        }

        else {

            const data =
                await loginStudent(
                    email,
                    password
                );


            authShowMessage(
                "Signed in successfully.",
                "success"
            );


            await updateAuthUI(
                data?.user ||
                null
            );


            await verifyPendingPaymentAfterLogin();


            setTimeout(
                () => {
                    closeAuthModal();
                },
                500
            );

        }

    }
    catch (error) {

        console.error(
            "ChemLab Auth: Authentication failed:",
            error
        );


        let message =
            error?.message ||
            "Authentication failed.";


        const lower =
            message.toLowerCase();


        if (
            lower.includes(
                "invalid login credentials"
            )
        ) {

            message =
                "Incorrect email or password.";

        }

        else if (
            lower.includes(
                "email not confirmed"
            )
        ) {

            message =
                "Please confirm your email before signing in.";

        }

        else if (
            lower.includes(
                "user already registered"
            )
        ) {

            message =
                "This email is already registered. Please sign in.";

        }

        else if (
            lower.includes(
                "password should be at least"
            )
        ) {

            message =
                "Your password must be at least 6 characters.";

        }


        authShowMessage(
            message,
            "error"
        );

    }
    finally {

        if (submit) {

            submit.disabled =
                false;

            submit.textContent =
                submit.dataset.originalText ||
                (
                    mode === "signup"
                        ? "Create Account"
                        : "Sign In"
                );

        }

    }

}


/* =========================================================
   24. PREMIUM PLAN BUTTONS
   ========================================================= */

function setupPremiumButtons() {

    const buttons =
        document.querySelectorAll(
            ".premium-plan-button"
        );


    console.log(
        `ChemLab Auth: ${buttons.length} Premium plan button(s) found.`
    );


    buttons.forEach(
        button => {

            /*
               Prevent duplicate listeners.
            */

            if (
                button.dataset.authPremiumBound ===
                "true"
            ) {

                return;

            }


            button.dataset.authPremiumBound =
                "true";


            button.addEventListener(
                "click",
                async function(event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const plan =
                        button.dataset.plan;


                    await requestPremiumPlan(
                        plan
                    );

                }
            );

        }
    );

}


/* =========================================================
   25. PREMIUM EXPERIMENT BUTTONS
   ========================================================= */

function setupPremiumExperimentButtons() {

    const buttons =
        document.querySelectorAll(
            ".premium-experiment-button"
        );


    console.log(
        `ChemLab Auth: ${buttons.length} Premium experiment button(s) found.`
    );


    buttons.forEach(
        button => {

            if (
                button.dataset.authPremiumExperimentBound ===
                "true"
            ) {

                return;

            }


            button.dataset.authPremiumExperimentBound =
                "true";


            button.addEventListener(
                "click",
                async function(event) {

                    event.preventDefault();
                    event.stopPropagation();


                    await handlePremiumExperiment(
                        button
                    );

                }
            );

        }
    );

}


/* =========================================================
   26. AUTH STATE EVENT
   ========================================================= */

function dispatchChemLabAuthEvent(
    eventName,
    session
) {

    const user =
        session?.user ||
        null;


    document.dispatchEvent(
        new CustomEvent(
            "chemlab:auth-change",
            {
                detail: {

                    event:
                        eventName,

                    user,

                    session:
                        session || null

                }
            }
        )
    );

}


/* =========================================================
   27. INITIALIZATION
   ========================================================= */

let chemLabAuthInitialized =
    false;


async function initializeChemLabAuth() {

    if (chemLabAuthInitialized) {

        return;

    }


    chemLabAuthInitialized =
        true;


    console.log(
        "ChemLab Auth: Initialization started."
    );


    /* -----------------------------------------------------
       AUTH MODAL
       ----------------------------------------------------- */

    const closeAuth =
        authGetElement(
            "closeAuthModal"
        );


    if (closeAuth) {

        closeAuth.addEventListener(
            "click",
            closeAuthModal
        );

    }


    const authSwitch =
        authGetElement(
            "authSwitch"
        );


    if (authSwitch) {

        authSwitch.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const modal =
                    authGetElement(
                        "authModal"
                    );


                const currentMode =
                    modal?.dataset.mode ||
                    "signin";


                openAuthModal(
                    currentMode === "signin"
                        ? "signup"
                        : "signin"
                );

            }
        );

    }


    const authSubmit =
        authGetElement(
            "authSubmit"
        );


    if (authSubmit) {

        authSubmit.addEventListener(
            "click",
            handleAuthSubmit
        );

    }


    const passwordInput =
        authGetElement(
            "authPassword"
        );


    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    handleAuthSubmit();

                }

            }
        );

    }


    /* -----------------------------------------------------
       ACCOUNT MODAL
       ----------------------------------------------------- */

    const closeAccount =
        authGetElement(
            "closeAccountModal"
        );


    if (closeAccount) {

        closeAccount.addEventListener(
            "click",
            closeAccountModal
        );

    }


    const logoutButton =
        authGetElement(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutStudent
        );

    }


    const accountPremiumButton =
        authGetElement(
            "accountPremiumButton"
        );


    if (accountPremiumButton) {

        accountPremiumButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                closeAccountModal();

                openPremiumPage();

            }
        );

    }


    /* -----------------------------------------------------
       PREMIUM MODAL
       ----------------------------------------------------- */

    const closePremium =
        authGetElement(
            "closePremiumModal"
        );


    if (closePremium) {

        closePremium.addEventListener(
            "click",
            closePremiumModal
        );

    }


    const startPremiumButton =
        authGetElement(
            "startPremiumButton"
        );


    if (startPremiumButton) {

        startPremiumButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                openPremiumPage();

            }
        );

    }


    /* -----------------------------------------------------
       PREMIUM BUTTONS
       ----------------------------------------------------- */

    setupPremiumButtons();

    setupPremiumExperimentButtons();


    /* -----------------------------------------------------
       BACKDROP CLOSING
       ----------------------------------------------------- */

    const authModal =
        authGetElement(
            "authModal"
        );


    if (authModal) {

        authModal.addEventListener(
            "click",
            function(event) {

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
        authGetElement(
            "accountModal"
        );


    if (accountModal) {

        accountModal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    accountModal
                ) {

                    closeAccountModal();

                }

            }
        );

    }


    const premiumModal =
        authGetElement(
            "premiumModal"
        );


    if (premiumModal) {

        premiumModal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    premiumModal
                ) {

                    closePremiumModal();

                }

            }
        );

    }


    /* -----------------------------------------------------
       ESCAPE KEY
       ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            closeAuthModal();
            closeAccountModal();
            closePremiumModal();

        }
    );


    /* -----------------------------------------------------
       SUPABASE AUTH
       ----------------------------------------------------- */

    if (chemLabAuthClient) {

        /*
           Initial session.
        */

        const session =
            await getCurrentSession();


        const user =
            session?.user ||
            null;


        if (user) {

            await ensureStudentProfile(
                user
            );

        }


        await updateAuthUI(
            user
        );


        /*
           Auth state listener.
        */

        chemLabAuthClient.auth
            .onAuthStateChange(
                async function(
                    event,
                    session
                ) {

                    console.log(
                        "ChemLab Auth State:",
                        event
                    );


                    const user =
                        session?.user ||
                        null;


                    if (user) {

                        /*
                           Avoid changing Premium
                           fields when ensuring profile.
                        */

                        await ensureStudentProfile(
                            user
                        );

                    }


                    await updateAuthUI(
                        user
                    );


                    dispatchChemLabAuthEvent(
                        event,
                        session
                    );


                    /*
                       Verify pending payment after
                       successful authentication.
                    */

                    if (
                        event ===
                        "SIGNED_IN"
                    ) {

                        /*
                           Small delay prevents Supabase
                           auth state timing conflicts.
                        */

                        setTimeout(
                            () => {

                                verifyPendingPaymentAfterLogin();

                            },
                            300
                        );

                    }

                }
            );

    }


    /* -----------------------------------------------------
       PAYSTACK RETURN
       ----------------------------------------------------- */

    await handlePaystackReturn();


    console.log(
        "ChemLab Auth: Initialization complete."
    );

}


/* =========================================================
   28. DOM READY
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

}

else {

    initializeChemLabAuth();

}


/* =========================================================
   29. GLOBAL API
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

window.getCurrentUser =
    getCurrentUser;

window.getCurrentSession =
    getCurrentSession;

window.getPremiumStatus =
    getPremiumStatus;

window.signUpStudent =
    signUpStudent;

window.loginStudent =
    loginStudent;

window.logoutStudent =
    logoutStudent;

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


/* =========================================================
   30. DIAGNOSTIC
   ========================================================= */

console.log(
    "=========================================="
);

console.log(
    "CHEMLAB AUTH SYSTEM LOADED"
);

console.log(
    "Supabase:",
    chemLabAuthClient
        ? "CONNECTED"
        : "NOT CONNECTED"
);

console.log(
    "Authentication: READY"
);

console.log(
    "Premium: READY"
);

console.log(
    "Paystack: READY"
);

console.log(
    "=========================================="
);
