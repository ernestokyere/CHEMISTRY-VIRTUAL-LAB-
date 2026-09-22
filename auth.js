"use strict";

/* =========================================================
   CHEMLAB AUTH + PREMIUM SYSTEM
   Complete replacement version
========================================================= */


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


/* =========================================================
   2. SUPABASE INITIALIZATION
========================================================= */

let supabaseClient = null;

try {
    if (window.supabase && typeof window.supabase.createClient === "function") {

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );

        console.log("ChemLab: Supabase initialized successfully.");

    } else {

        console.error(
            "ChemLab: Supabase library was not loaded."
        );

    }

} catch (error) {

    console.error(
        "ChemLab: Supabase initialization failed:",
        error
    );

}


/* =========================================================
   3. HELPER FUNCTIONS
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function safeText(element, value) {
    if (!element) return;

    element.textContent =
        value === null ||
        value === undefined
            ? ""
            : String(value);
}


function showAuthMessage(message, type = "error") {

    const box = getElement("authMessage");

    if (!box) return;

    box.textContent = message;

    box.classList.remove(
        "error",
        "success"
    );

    box.classList.add(type);

    box.style.display = "block";
}


function clearAuthMessage() {

    const box = getElement("authMessage");

    if (!box) return;

    box.textContent = "";

    box.classList.remove(
        "error",
        "success"
    );

    box.style.display = "";
}


/* =========================================================
   4. MODAL CONTROL
   IMPORTANT:
   CSS uses .active, NOT .show
========================================================= */

function openAuthModal(mode = "signin") {

    const modal = getElement("authModal");

    if (!modal) {
        console.error("ChemLab: authModal not found.");
        return;
    }

    const title = getElement("authTitle");
    const subtitle = getElement("authSubtitle");
    const submit = getElement("authSubmit");
    const switchText = getElement("authSwitchText");
    const switchButton = getElement("authSwitch");
    const nameField = getElement("nameField");

    clearAuthMessage();

    if (mode === "signup") {

        if (title) {
            title.textContent = "Create Student Account";
        }

        if (subtitle) {
            subtitle.textContent =
                "Create your ChemLab account to save your progress.";
        }

        if (submit) {
            submit.textContent = "Create Account";
        }

        if (switchText) {
            switchText.textContent =
                "Already have an account?";
        }

        if (switchButton) {
            switchButton.textContent = "Sign In";
        }

        if (nameField) {
            nameField.style.display = "block";
        }

        modal.dataset.mode = "signup";

    } else {

        if (title) {
            title.textContent = "Welcome Back";
        }

        if (subtitle) {
            subtitle.textContent =
                "Sign in to continue using ChemLab.";
        }

        if (submit) {
            submit.textContent = "Sign In";
        }

        if (switchText) {
            switchText.textContent =
                "Don't have an account?";
        }

        if (switchButton) {
            switchButton.textContent = "Create Account";
        }

        if (nameField) {
            nameField.style.display = "none";
        }

        modal.dataset.mode = "signin";
    }

    modal.classList.add("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeAuthModal() {

    const modal = getElement("authModal");

    if (!modal) return;

    modal.classList.remove("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    clearAuthMessage();
}


function openAccountModal() {

    const modal = getElement("accountModal");

    if (!modal) {
        console.error(
            "ChemLab: accountModal not found."
        );
        return;
    }

    updateAccountModal();

    modal.classList.add("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeAccountModal() {

    const modal = getElement("accountModal");

    if (!modal) return;

    modal.classList.remove("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


function openPremiumModal() {

    const modal = getElement("premiumModal");

    if (!modal) {

        console.warn(
            "ChemLab: premiumModal not found. Opening Premium page directly."
        );

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

    const modal = getElement("premiumModal");

    if (!modal) return;

    modal.classList.remove("active");
    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================================
   5. PREMIUM PAGE
========================================================= */

function openPremiumPage() {

    console.log(
        "ChemLab: Opening Premium page..."
    );

    closePremiumModal();
    closeAccountModal();

    const premiumSection =
        getElement("premiumSection");

    if (!premiumSection) {

        console.error(
            "ChemLab ERROR: premiumSection was not found."
        );

        alert(
            "ChemLab error: Premium section was not found on this page."
        );

        return;
    }

    /*
       Hide every page using both the CSS class
       and inline display protection.
    */

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

            if (page.id !== "premiumSection") {
                page.style.display = "none";
            }
        });


    /*
       Show Premium page.
    */

    premiumSection.classList.add("active");

    premiumSection.style.display = "block";


    /*
       Keep ChemLab state synchronized if app.js
       exposes it.
    */

    try {

        if (
            typeof window.chemLabState === "object" &&
            window.chemLabState
        ) {
            window.chemLabState.currentPage =
                "premiumSection";
        }

    } catch (error) {

        console.warn(
            "ChemLab: Could not update page state.",
            error
        );
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    console.log(
        "ChemLab: Premium page opened successfully."
    );
}


/* =========================================================
   6. GET CURRENT USER
========================================================= */

async function getCurrentUser() {

    if (!supabaseClient) {
        console.error(
            "ChemLab: Supabase client unavailable."
        );

        return null;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getUser();

        if (error) {

            console.warn(
                "ChemLab: getUser error:",
                error.message
            );

            return null;
        }

        return data?.user || null;

    } catch (error) {

        console.error(
            "ChemLab: Failed to get current user:",
            error
        );

        return null;
    }
}


/* =========================================================
   7. GET CURRENT SESSION
========================================================= */

async function getCurrentSession() {

    if (!supabaseClient) {
        return null;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {

            console.warn(
                "ChemLab: getSession error:",
                error.message
            );

            return null;
        }

        return data?.session || null;

    } catch (error) {

        console.error(
            "ChemLab: Failed to get session:",
            error
        );

        return null;
    }
}


/* =========================================================
   8. GET PREMIUM STATUS
========================================================= */

async function getPremiumStatus() {

    const user = await getCurrentUser();

    if (!user) {

        return {
            isPremium: false,
            expiresAt: null,
            plan: null,
            subscription: null
        };
    }


    try {

        /*
           First get profile.
        */

        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select(
                "id, full_name, is_premium, premium_expires_at"
            )
            .eq("id", user.id)
            .maybeSingle();


        if (profileError) {

            console.error(
                "ChemLab: Profile query failed:",
                profileError
            );
        }


        /*
           Get active subscription if available.
        */

        let subscription = null;

        const {
            data: subscriptions,
            error: subscriptionError
        } = await supabaseClient
            .from("subscriptions")
            .select(
                "*"
            )
            .eq("user_id", user.id)
            .eq("status", "active")
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
            .limit(1);


        if (!subscriptionError &&
            subscriptions &&
            subscriptions.length > 0) {

            subscription = subscriptions[0];
        }


        let isPremium =
            Boolean(profile?.is_premium);


        let expiresAt =
            profile?.premium_expires_at || null;


        /*
           Check expiration locally too.
        */

        if (
            isPremium &&
            expiresAt
        ) {

            const expiryTime =
                new Date(expiresAt).getTime();

            if (
                Number.isFinite(expiryTime) &&
                expiryTime <= Date.now()
            ) {

                isPremium = false;
            }
        }


        if (subscription) {

            if (
                subscription.expires_at
            ) {

                expiresAt =
                    subscription.expires_at;

                const expiryTime =
                    new Date(
                        subscription.expires_at
                    ).getTime();

                if (
                    Number.isFinite(expiryTime) &&
                    expiryTime > Date.now()
                ) {

                    isPremium = true;
                }
            }
        }


        return {

            isPremium,

            expiresAt,

            plan:
                subscription?.plan || null,

            subscription,

            profile: profile || null

        };

    } catch (error) {

        console.error(
            "ChemLab: Premium status check failed:",
            error
        );

        return {
            isPremium: false,
            expiresAt: null,
            plan: null,
            subscription: null
        };
    }
}


/* =========================================================
   9. SIGN UP
========================================================= */

async function signUpStudent(
    email,
    password,
    fullName
) {

    if (!supabaseClient) {

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


    if (!password || password.length < 6) {

        throw new Error(
            "Password must be at least 6 characters."
        );
    }


    const {
        data,
        error
    } = await supabaseClient.auth.signUp({

        email: cleanEmail,

        password: password,

        options: {
            data: {
                full_name: cleanName
            }
        }

    });


    if (error) {

        throw error;
    }


    /*
       If email confirmation is disabled,
       create/update profile immediately.
    */

    if (data?.user) {

        await createStudentProfile(
            data.user.id,
            cleanName
        );
    }


    return data;
}


/* =========================================================
   10. CREATE STUDENT PROFILE
========================================================= */

async function createStudentProfile(
    userId,
    fullName
) {

    if (!supabaseClient || !userId) {
        return null;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .upsert(
                {
                    id: userId,
                    full_name:
                        fullName || "ChemLab Student",
                    is_premium: false,
                    premium_expires_at: null
                },
                {
                    onConflict: "id"
                }
            )
            .select()
            .maybeSingle();


        if (error) {

            console.warn(
                "ChemLab: Could not create/update profile:",
                error.message
            );

            return null;
        }


        return data;

    } catch (error) {

        console.warn(
            "ChemLab: Profile creation failed:",
            error
        );

        return null;
    }
}


/* =========================================================
   11. LOGIN
========================================================= */

async function loginStudent(
    email,
    password
) {

    if (!supabaseClient) {

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
    } = await supabaseClient.auth.signInWithPassword({

        email: cleanEmail,

        password: password

    });


    if (error) {

        throw error;
    }


    if (data?.user) {

        /*
           Try to ensure profile exists.
           This will not overwrite premium status
           because upsert here is avoided.
        */

        const {
            data: existingProfile
        } = await supabaseClient
            .from("profiles")
            .select("id")
            .eq("id", data.user.id)
            .maybeSingle();


        if (!existingProfile) {

            await createStudentProfile(
                data.user.id,
                data.user.user_metadata?.full_name ||
                "ChemLab Student"
            );
        }
    }


    return data;
}


/* =========================================================
   12. LOGOUT
========================================================= */

async function logoutStudent() {

    if (!supabaseClient) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient.auth.signOut();


        if (error) {

            throw error;
        }


        closeAccountModal();
        closePremiumModal();


        updateAuthUI(null);


        if (
            typeof window.showPage === "function"
        ) {

            window.showPage("home");

        } else {

            document
                .querySelectorAll(".page")
                .forEach(page => {

                    page.classList.remove("active");
                    page.style.display = "none";

                });

            const home =
                getElement("home");

            if (home) {

                home.classList.add("active");
                home.style.display = "block";
            }
        }


        if (
            typeof window.showNotification ===
            "function"
        ) {

            window.showNotification(
                "You have been signed out.",
                "success"
            );
        }


    } catch (error) {

        console.error(
            "ChemLab: Logout failed:",
            error
        );

        alert(
            "Logout failed. Please try again."
        );
    }
}


/* =========================================================
   13. UPDATE AUTH UI
========================================================= */

async function updateAuthUI(
    suppliedUser = null
) {

    const user =
        suppliedUser ||
        await getCurrentUser();


    const loginButton =
        getElement("loginButton");


    if (!loginButton) {
        return;
    }


    if (!user) {

        loginButton.textContent =
            "Sign In";

        loginButton.onclick = function () {

            openAuthModal("signin");

        };

        return;
    }


    /*
       Logged in.
    */

    loginButton.textContent =
        "My Account";


    loginButton.onclick =
        function () {

            openAccountModal();

        };


    /*
       Update account information.
    */

    await updateAccountModal(user);
}


/* =========================================================
   14. UPDATE ACCOUNT MODAL
========================================================= */

async function updateAccountModal(
    suppliedUser = null
) {

    const user =
        suppliedUser ||
        await getCurrentUser();


    if (!user) {
        return;
    }


    const premium =
        await getPremiumStatus();


    const name =
        user.user_metadata?.full_name ||
        premium.profile?.full_name ||
        "ChemLab Student";


    safeText(
        getElement("accountName"),
        name
    );


    safeText(
        getElement("accountEmail"),
        user.email || ""
    );


    const status =
        getElement("membershipStatus");


    const premiumStatus =
        getElement("premiumAccountStatus");


    const premiumDetails =
        getElement("premiumDetails");


    const accountPlan =
        getElement("accountPlan");


    const accountExpiry =
        getElement("accountExpiry");


    const membershipIcon =
        getElement("membershipIcon");


    const accountPremiumButton =
        getElement("accountPremiumButton");


    if (premium.isPremium) {

        safeText(
            membershipIcon,
            "👑"
        );


        safeText(
            status,
            "Premium Member"
        );


        safeText(
            premiumStatus,
            "Active"
        );


        if (premiumDetails) {
            premiumDetails.style.display =
                "block";
        }


        safeText(
            accountPlan,
            premium.plan
                ? premium.plan.toUpperCase()
                : "PREMIUM"
        );


        if (premium.expiresAt) {

            const date =
                new Date(
                    premium.expiresAt
                );


            safeText(
                accountExpiry,
                Number.isNaN(date.getTime())
                    ? premium.expiresAt
                    : date.toLocaleDateString()
            );

        } else {

            safeText(
                accountExpiry,
                "Active"
            );
        }


        if (accountPremiumButton) {

            accountPremiumButton.textContent =
                "Open Premium";

        }

    } else {

        safeText(
            membershipIcon,
            "🧪"
        );


        safeText(
            status,
            "Free Student"
        );


        safeText(
            premiumStatus,
            "Free"
        );


        if (premiumDetails) {
            premiumDetails.style.display =
                "none";
        }


        safeText(
            accountPlan,
            "FREE"
        );


        safeText(
            accountExpiry,
            "—"
        );


        if (accountPremiumButton) {

            accountPremiumButton.textContent =
                "Get Premium";

        }
    }
}


/* =========================================================
   15. PREMIUM PLAN REQUEST
========================================================= */

async function requestPremiumPlan(
    plan
) {

    console.log(
        "ChemLab: Premium plan selected:",
        plan
    );


    if (
        plan !== "monthly" &&
        plan !== "yearly"
    ) {

        console.error(
            "ChemLab: Invalid premium plan:",
            plan
        );

        alert(
            "Invalid Premium plan."
        );

        return;
    }


    /*
       Make sure user is logged in.
    */

    const user =
        await getCurrentUser();


    if (!user) {

        closePremiumModal();

        openAuthModal("signin");

        showAuthMessage(
            "Please sign in before choosing Premium.",
            "error"
        );

        return;
    }


    /*
       Check current Premium status.
    */

    const premium =
        await getPremiumStatus();


    if (premium.isPremium) {

        closePremiumModal();

        openAccountModal();

        if (
            typeof window.showNotification ===
            "function"
        ) {

            window.showNotification(
                "Your Premium membership is already active.",
                "success"
            );

        } else {

            alert(
                "Your Premium membership is already active."
            );
        }

        return;
    }


    /*
       Get fresh session.
    */

    const session =
        await getCurrentSession();


    if (!session?.access_token) {

        closePremiumModal();

        openAuthModal("signin");

        showAuthMessage(
            "Your session has expired. Please sign in again.",
            "error"
        );

        return;
    }


    /*
       Disable plan buttons while request is running.
    */

    const planButtons =
        document.querySelectorAll(
            ".premium-plan-button"
        );


    planButtons.forEach(button => {

        button.disabled = true;

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            "Processing...";

    });


    try {

        console.log(
            "ChemLab: Sending Premium request to Supabase..."
        );


        const response =
            await fetch(
                AUTH_FUNCTION_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${session.access_token}`
                    },

                    body: JSON.stringify({
                        plan
                    })
                }
            );


        const result =
            await response.json()
                .catch(() => ({}));


        console.log(
            "ChemLab: activate-premium response:",
            result
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
           Store payment information so that
           the callback can be verified later.
        */

        if (
            result.reference
        ) {

            sessionStorage.setItem(
                "chemLabPaystackReference",
                result.reference
            );
        }


        sessionStorage.setItem(
            "chemLabPaystackPlan",
            plan
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
           Redirect to Paystack Live Checkout.
        */

        window.location.href =
            result.authorization_url;


    } catch (error) {

        console.error(
            "ChemLab: Premium payment initialization failed:",
            error
        );


        alert(
            error.message ||
            "Unable to start Premium payment."
        );


    } finally {

        planButtons.forEach(button => {

            button.disabled = false;

            if (
                button.dataset.originalText
            ) {

                button.textContent =
                    button.dataset.originalText;

            }

        });

    }
}


/* =========================================================
   16. PREMIUM EXPERIMENT ACCESS
========================================================= */

async function handlePremiumExperiment(
    button
) {

    const user =
        await getCurrentUser();


    if (!user) {

        openAuthModal("signin");

        showAuthMessage(
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
       User has Premium.
       Open advanced titration.
    */

    if (
        typeof window.openAdvancedTitration ===
        "function"
    ) {

        window.openAdvancedTitration();

    } else {

        console.error(
            "ChemLab: openAdvancedTitration() is unavailable."
        );

        alert(
            "Advanced Chemistry Lab is still loading. Please try again."
        );
    }
}


/* =========================================================
   17. PAYSTACK RETURN VERIFICATION
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
        "ChemLab: Paystack reference detected:",
        reference
    );


    const user =
        await getCurrentUser();


    if (!user) {

        /*
           Keep reference so verification can happen
           after the student signs in.
        */

        sessionStorage.setItem(
            "chemLabPendingPaystackReference",
            reference
        );


        openAuthModal("signin");

        showAuthMessage(
            "Please sign in to complete Premium verification.",
            "success"
        );

        return;
    }


    const session =
        await getCurrentSession();


    if (!session?.access_token) {

        openAuthModal("signin");

        return;
    }


    try {

        const response =
            await fetch(
                VERIFY_FUNCTION_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${session.access_token}`
                    },

                    body: JSON.stringify({
                        reference
                    })
                }
            );


        const result =
            await response.json()
                .catch(() => ({}));


        console.log(
            "ChemLab: Paystack verification response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result?.error ||
                result?.message ||
                "Payment verification failed."
            );
        }


        /*
           Remove stored payment data.
        */

        sessionStorage.removeItem(
            "chemLabPaystackReference"
        );

        sessionStorage.removeItem(
            "chemLabPaystackPlan"
        );

        sessionStorage.removeItem(
            "chemLabSubscriptionId"
        );

        sessionStorage.removeItem(
            "chemLabPendingPaystackReference"
        );


        /*
           Remove Paystack parameters from URL.
        */

        try {

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );

        } catch (error) {

            console.warn(
                "ChemLab: Could not clean payment URL.",
                error
            );
        }


        /*
           Refresh UI.
        */

        await updateAuthUI(user);


        if (
            typeof window.showNotification ===
            "function"
        ) {

            window.showNotification(
                "🎉 Premium activated successfully!",
                "success"
            );

        } else {

            alert(
                "🎉 Premium activated successfully!"
            );
        }


        /*
           Open Premium page.
        */

        openPremiumPage();


    } catch (error) {

        console.error(
            "ChemLab: Paystack verification failed:",
            error
        );


        alert(
            error.message ||
            "Payment was received, but verification could not be completed."
        );
    }
}


/* =========================================================
   18. VERIFY PENDING PAYMENT AFTER LOGIN
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


    /*
       Temporarily put the reference in URL-style
       verification flow.
    */

    const session =
        await getCurrentSession();


    if (!session?.access_token) {
        return;
    }


    try {

        const response =
            await fetch(
                VERIFY_FUNCTION_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${session.access_token}`
                    },

                    body: JSON.stringify({
                        reference
                    })
                }
            );


        const result =
            await response.json()
                .catch(() => ({}));


        if (!response.ok) {

            console.warn(
                "ChemLab: Pending payment verification failed:",
                result
            );

            return;
        }


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


        await updateAuthUI(user);


        if (
            typeof window.showNotification ===
            "function"
        ) {

            window.showNotification(
                "🎉 Your Premium membership is now active!",
                "success"
            );
        }


        openPremiumPage();


    } catch (error) {

        console.warn(
            "ChemLab: Pending payment check failed:",
            error
        );
    }
}


/* =========================================================
   19. AUTH FORM SUBMISSION
========================================================= */

async function handleAuthSubmit() {

    const modal =
        getElement("authModal");


    if (!modal) {
        return;
    }


    const mode =
        modal.dataset.mode ||
        "signin";


    const email =
        getElement("authEmail")?.value
            ?.trim();


    const password =
        getElement("authPassword")?.value;


    const fullName =
        getElement("authName")?.value
            ?.trim();


    const submit =
        getElement("authSubmit");


    clearAuthMessage();


    if (submit) {

        submit.disabled = true;

        submit.dataset.originalText =
            submit.textContent;

        submit.textContent =
            mode === "signup"
                ? "Creating Account..."
                : "Signing In...";
    }


    try {

        if (mode === "signup") {

            await signUpStudent(
                email,
                password,
                fullName
            );


            showAuthMessage(
                "Account created successfully. Check your email if confirmation is required.",
                "success"
            );


            /*
               Give the user a moment to read
               the success message.
            */

            setTimeout(
                async function () {

                    const user =
                        await getCurrentUser();


                    if (user) {

                        closeAuthModal();

                        await updateAuthUI(user);

                        await verifyPendingPaymentAfterLogin();

                    } else {

                        openAuthModal("signin");

                    }

                },
                1200
            );


        } else {

            const data =
                await loginStudent(
                    email,
                    password
                );


            showAuthMessage(
                "Signed in successfully.",
                "success"
            );


            setTimeout(
                async function () {

                    closeAuthModal();

                    await updateAuthUI(
                        data?.user || null
                    );

                    await verifyPendingPaymentAfterLogin();

                },
                500
            );
        }


    } catch (error) {

        console.error(
            "ChemLab: Authentication error:",
            error
        );


        let message =
            error?.message ||
            "Authentication failed.";


        /*
           Make common Supabase messages
           easier for students to understand.
        */

        if (
            message
                .toLowerCase()
                .includes("invalid login credentials")
        ) {

            message =
                "Incorrect email or password.";

        } else if (
            message
                .toLowerCase()
                .includes("email not confirmed")
        ) {

            message =
                "Please confirm your email before signing in.";

        } else if (
            message
                .toLowerCase()
                .includes("user already registered")
        ) {

            message =
                "This email is already registered. Please sign in.";

        }


        showAuthMessage(
            message,
            "error"
        );


    } finally {

        if (submit) {

            submit.disabled = false;

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
   20. PREMIUM BUTTON CLICK HANDLER
========================================================= */

function setupPremiumButtons() {

    const buttons =
        document.querySelectorAll(
            ".premium-plan-button"
        );


    console.log(
        `ChemLab: Found ${buttons.length} Premium plan button(s).`
    );


    buttons.forEach(button => {

        /*
           Remove old onclick if any.
        */

        button.onclick = null;


        button.addEventListener(
            "click",
            async function(event) {

                event.preventDefault();
                event.stopPropagation();


                const plan =
                    button.dataset.plan;


                console.log(
                    "ChemLab: Premium button clicked:",
                    plan
                );


                await requestPremiumPlan(
                    plan
                );

            }
        );
    });
}


/* =========================================================
   21. PREMIUM EXPERIMENT BUTTONS
========================================================= */

function setupPremiumExperimentButtons() {

    const buttons =
        document.querySelectorAll(
            ".premium-experiment-button"
        );


    console.log(
        `ChemLab: Found ${buttons.length} Premium experiment button(s).`
    );


    buttons.forEach(button => {

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
    });
}


/* =========================================================
   22. MAIN INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "ChemLab Auth: Initialization started."
        );


        /* -----------------------------------------
           Auth modal controls
        ----------------------------------------- */

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
                function() {

                    const modal =
                        getElement("authModal");


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
            getElement("authSubmit");


        if (authSubmit) {

            authSubmit.addEventListener(
                "click",
                handleAuthSubmit
            );
        }


        const passwordInput =
            getElement("authPassword");


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


        /* -----------------------------------------
           Account modal
        ----------------------------------------- */

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
                function() {

                    closeAccountModal();

                    openPremiumPage();

                }
            );
        }


        /* -----------------------------------------
           Premium modal
        ----------------------------------------- */

        const closePremium =
            getElement("closePremiumModal");


        if (closePremium) {

            closePremium.addEventListener(
                "click",
                closePremiumModal
            );
        }


        const premiumStartButton =
            getElement("startPremiumButton");


        if (premiumStartButton) {

            premiumStartButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    openPremiumPage();

                }
            );
        }


        /* -----------------------------------------
           Premium plan buttons
        ----------------------------------------- */

        setupPremiumButtons();


        /* -----------------------------------------
           Premium experiment buttons
        ----------------------------------------- */

        setupPremiumExperimentButtons();


        /* -----------------------------------------
           Close modals by clicking backdrop
        ----------------------------------------- */

        const authModal =
            getElement("authModal");


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
            getElement("accountModal");


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
            getElement("premiumModal");


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


        /* -----------------------------------------
           Escape key
        ----------------------------------------- */

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


        /* -----------------------------------------
           Initial user
        ----------------------------------------- */

        if (supabaseClient) {

            const user =
                await getCurrentUser();


            await updateAuthUI(
                user
            );


            /*
               Listen for authentication changes.
            */

            supabaseClient.auth.onAuthStateChange(
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


                    await updateAuthUI(
                        user
                    );


                    if (
                        event ===
                        "SIGNED_IN"
                    ) {

                        await verifyPendingPaymentAfterLogin();
                    }

                }
            );
        }


        /* -----------------------------------------
           Paystack callback
        ----------------------------------------- */

        await handlePaystackReturn();


        console.log(
            "ChemLab Auth: Initialization complete."
        );

    }
);


/* =========================================================
   23. GLOBAL EXPORTS
========================================================= */

window.supabaseClient =
    supabaseClient;

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


/* =========================================================
   24. FINAL DIAGNOSTIC
========================================================= */

console.log(
    "=========================================="
);

console.log(
    "CHEMLAB AUTH SYSTEM LOADED"
);

console.log(
    "Supabase:",
    supabaseClient
        ? "CONNECTED"
        : "NOT CONNECTED"
);

console.log(
    "Premium system: READY"
);

console.log(
    "=========================================="
);
