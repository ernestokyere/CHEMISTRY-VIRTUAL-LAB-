/* =========================================================
   CHEMLAB AUTHENTICATION + PREMIUM SYSTEM
   ========================================================= */

/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://zscbgeaieiqwknhjxpnt.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy";

const chemLabSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   SIGN UP
   ========================================================= */

async function signUpStudent(fullName, email, password) {

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
        return {
            success: false,
            message: "Please complete all fields."
        };
    }

    if (password.length < 6) {
        return {
            success: false,
            message: "Password must contain at least 6 characters."
        };
    }

    try {

        const {
            data,
            error
        } = await chemLabSupabase.auth.signUp({

            email: cleanEmail,

            password: password,

            options: {
                data: {
                    full_name: cleanName
                }
            }

        });

        if (error) {
            console.error("Sign up error:", error);

            return {
                success: false,
                message: error.message
            };
        }

        /*
           The database trigger automatically creates
           the student's profile.
        */

        return {
            success: true,
            user: data.user,
            session: data.session,

            message: data.session
                ? "Account created successfully!"
                : "Account created. Please check your email to confirm your account."
        };

    } catch (error) {

        console.error("Unexpected sign up error:", error);

        return {
            success: false,
            message: "Unable to create the account right now."
        };
    }
}


/* =========================================================
   LOGIN
   ========================================================= */

async function loginStudent(email, password) {

    const cleanEmail =
        email.trim().toLowerCase();

    try {

        const {
            data,
            error
        } = await chemLabSupabase.auth.signInWithPassword({

            email: cleanEmail,

            password: password

        });

        if (error) {

            console.error("Login error:", error);

            return {
                success: false,
                message: error.message
            };
        }

        return {
            success: true,
            user: data.user,
            session: data.session,
            message: "Login successful."
        };

    } catch (error) {

        console.error("Unexpected login error:", error);

        return {
            success: false,
            message: "Unable to sign in right now."
        };
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logoutStudent() {

    try {

        const {
            error
        } = await chemLabSupabase.auth.signOut();

        if (error) {
            console.error("Logout error:", error);

            return {
                success: false,
                message: error.message
            };
        }

        return {
            success: true
        };

    } catch (error) {

        console.error("Unexpected logout error:", error);

        return {
            success: false,
            message: "Unable to sign out."
        };
    }
}


/* =========================================================
   GET CURRENT STUDENT
   ========================================================= */

async function getCurrentStudent() {

    try {

        const {
            data,
            error
        } = await chemLabSupabase.auth.getUser();

        if (error) {

            console.error(
                "Get current user error:",
                error
            );

            return null;
        }

        return data?.user || null;

    } catch (error) {

        console.error(
            "Unexpected current user error:",
            error
        );

        return null;
    }
}


/* =========================================================
   GET PREMIUM STATUS
   ========================================================= */

async function getPremiumStatus() {

    const user =
        await getCurrentStudent();

    if (!user) {

        return {
            loggedIn: false,
            premium: false,
            expiresAt: null,
            plan: null
        };
    }

    try {

        const {
            data,
            error
        } = await chemLabSupabase
            .from("profiles")
            .select(
                "is_premium, premium_expires_at"
            )
            .eq("id", user.id)
            .maybeSingle();

        if (error) {

            console.error(
                "Premium status error:",
                error
            );

            return {
                loggedIn: true,
                premium: false,
                expiresAt: null,
                plan: null
            };
        }

        let premium =
            data?.is_premium === true;

        let expiresAt =
            data?.premium_expires_at || null;

        /*
           Automatically treat expired Premium
           as inactive.
        */

        if (premium && expiresAt) {

            const expiryDate =
                new Date(expiresAt);

            if (
                Number.isNaN(
                    expiryDate.getTime()
                )
            ) {

                premium = false;

            } else if (
                expiryDate <= new Date()
            ) {

                premium = false;
            }
        }

        /*
           Get current active subscription plan.
        */

        let plan = null;

        if (premium) {

            const {
                data: subscriptionData,
                error: subscriptionError
            } = await chemLabSupabase
                .from("subscriptions")
                .select(
                    "plan, expires_at, status"
                )
                .eq("user_id", user.id)
                .eq("status", "active")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(1)
                .maybeSingle();

            if (
                !subscriptionError &&
                subscriptionData
            ) {

                plan =
                    subscriptionData.plan;

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

            premium: premium,

            expiresAt: expiresAt,

            plan: plan
        };

    } catch (error) {

        console.error(
            "Unexpected premium status error:",
            error
        );

        return {

            loggedIn: true,

            premium: false,

            expiresAt: null,

            plan: null
        };
    }
}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatPremiumDate(dateString) {

    if (!dateString) {
        return "—";
    }

    const date =
        new Date(dateString);

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


/* =========================================================
   AUTH MODAL HELPERS
   ========================================================= */

function openAuthModal(mode = "login") {

    const modal =
        document.getElementById(
            "authModal"
        );

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

    const submitButton =
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

    if (!modal) {
        return;
    }

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    if (message) {
        message.textContent = "";
    }

    modal.dataset.mode = mode;

    if (mode === "signup") {

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
}


function closeAuthModal() {

    const modal =
        document.getElementById(
            "authModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================================
   AUTH UI
   ========================================================= */

function updateAuthButton(user) {

    const loginButton =
        document.getElementById(
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
            "Sign In";

        loginButton.dataset.loggedIn =
            "false";
    }
}


/* =========================================================
   AUTH FORM SUBMISSION
   ========================================================= */

async function handleAuthSubmit() {

    const modal =
        document.getElementById(
            "authModal"
        );

    const nameInput =
        document.getElementById(
            "authName"
        );

    const emailInput =
        document.getElementById(
            "authEmail"
        );

    const passwordInput =
        document.getElementById(
            "authPassword"
        );

    const message =
        document.getElementById(
            "authMessage"
        );

    const submitButton =
        document.getElementById(
            "authSubmit"
        );

    if (!modal) {
        return;
    }

    const mode =
        modal.dataset.mode || "login";

    const name =
        nameInput?.value.trim() || "";

    const email =
        emailInput?.value.trim() || "";

    const password =
        passwordInput?.value || "";

    if (!email || !password) {

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

        submitButton.disabled = true;

        submitButton.textContent =
            mode === "signup"
                ? "Creating Account..."
                : "Signing In...";
    }

    let result;

    if (mode === "signup") {

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

    if (submitButton) {
        submitButton.disabled = false;

        submitButton.textContent =
            mode === "signup"
                ? "Create Account"
                : "Sign In";
    }

    if (!result.success) {

        if (message) {
            message.textContent =
                result.message;
        }

        return;
    }

    if (message) {
        message.textContent =
            result.message;
    }

    /*
       If email confirmation is enabled,
       there may be no session yet.
    */

    if (
        mode === "signup" &&
        !result.session
    ) {

        return;
    }

    closeAuthModal();

    updateAuthButton(
        result.user
    );
}


/* =========================================================
   ACCOUNT DASHBOARD
   ========================================================= */

async function openAccount() {

    const modal =
        document.getElementById(
            "accountModal"
        );

    const nameElement =
        document.getElementById(
            "accountName"
        );

    const emailElement =
        document.getElementById(
            "accountEmail"
        );

    const membershipStatus =
        document.getElementById(
            "membershipStatus"
        );

    const membershipIcon =
        document.getElementById(
            "membershipIcon"
        );

    const premiumAccountStatus =
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

    const accountPremiumButton =
        document.getElementById(
            "accountPremiumButton"
        );

    const user =
        await getCurrentStudent();

    if (!user) {

        openAuthModal("login");

        return;
    }

    const status =
        await getPremiumStatus();

    if (nameElement) {

        nameElement.textContent =
            user.user_metadata?.full_name ||
            "Student";
    }

    if (emailElement) {

        emailElement.textContent =
            user.email || "—";
    }

    if (status.premium) {

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
                    ? status.plan
                        .charAt(0)
                        .toUpperCase() +
                      status.plan.slice(1)
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

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );
    }
}


function closeAccount() {

    const modal =
        document.getElementById(
            "accountModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


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

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closePremiumModal() {

    const modal =
        document.getElementById(
            "premiumModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================================
   PAYSTACK PREMIUM PAYMENT
   ========================================================= */

async function requestPremiumPlan(plan) {
    const user = await getCurrentStudent();

    if (!user) {
        closePremiumModal();
        openAuthModal("login");
        return;
    }

    const status = await getPremiumStatus();

    if (status.premium) {
        alert("You already have an active Premium subscription.");
        return;
    }

    if (plan !== "monthly" && plan !== "yearly") {
        alert("Invalid Premium plan.");
        return;
    }

    const {
        data: sessionData,
        error: sessionError
    } = await chemLabSupabase.auth.getSession();

    if (
        sessionError ||
        !sessionData?.session
    ) {
        alert(
            "Your login session has expired. Please sign in again."
        );

        closePremiumModal();
        openAuthModal("login");
        return;
    }

    const accessToken =
        sessionData.session.access_token;

    const button = document.querySelector(
        `.premium-plan-button[data-plan="${plan}"]`
    );

    const originalText =
        button?.textContent || "Continue";

    if (button) {
        button.disabled = true;
        button.textContent =
            "Connecting to Paystack...";
    }

    try {

        const response = await fetch(
            `${SUPABASE_URL}/functions/v1/activate-premium`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${accessToken}`,

                    "apikey":
                        SUPABASE_PUBLISHABLE_KEY
                },

                body: JSON.stringify({
                    plan: plan
                })
            }
        );

        let result;

        try {
            result =
                await response.json();
        } catch {
            result = null;
        }

        console.log(
            "Paystack initialization response:",
            result
        );

        if (!response.ok) {
            throw new Error(
                result?.error ||
                result?.message ||
                "Could not start Paystack payment."
            );
        }

        if (
            !result?.authorization_url
        ) {
            throw new Error(
                "Paystack did not return a payment URL."
            );
        }

        // -----------------------------------------
        // SAVE PAYMENT REFERENCE
        // -----------------------------------------

        if (result.reference) {
            sessionStorage.setItem(
                "chemlab_paystack_reference",
                result.reference
            );
        }

        if (result.subscription_id) {
            sessionStorage.setItem(
                "chemlab_subscription_id",
                result.subscription_id
            );
        }

        // -----------------------------------------
        // REDIRECT TO PAYSTACK
        // -----------------------------------------

        closePremiumModal();

        window.location.href =
            result.authorization_url;

    } catch (error) {

        console.error(
            "Paystack payment error:",
            error
        );

        alert(
            error.message ||
            "Unable to start payment."
        );

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent =
                originalText;
        }
    }
}


    /* =========================================
       CHECK PREMIUM STATUS
    ========================================= */

    const status =
        await getPremiumStatus();

    if (status.premium) {

        alert(
            "You already have an active Premium subscription."
        );

        return;
    }


    /* =========================================
       VALIDATE PLAN
    ========================================= */

    if (
        plan !== "monthly" &&
        plan !== "yearly"
    ) {

        alert(
            "Invalid Premium plan."
        );

        return;
    }


    /* =========================================
       GET CURRENT SESSION
    ========================================= */

    const {
        data: sessionData,
        error: sessionError
    } =
        await chemLabSupabase.auth.getSession();

    if (
        sessionError ||
        !sessionData?.session
    ) {

        alert(
            "Your login session has expired. Please sign in again."
        );

        closePremiumModal();

        openAuthModal("login");

        return;
    }


    const accessToken =
        sessionData.session.access_token;


    /* =========================================
       FIND SELECTED PLAN BUTTON
    ========================================= */

    const button =
        document.querySelector(
            `.premium-plan-button[data-plan="${plan}"]`
        );

    const originalText =
        button?.textContent ||
        "Continue";


    if (button) {

        button.disabled = true;

        button.textContent =
            "Connecting to Paystack...";
    }


    try {

        /* =====================================
           CALL SUPABASE EDGE FUNCTION
        ===================================== */

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/activate-premium`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`,

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY
                    },

                    body: JSON.stringify({
                        plan: plan
                    })
                }
            );


        let result;

        try {

            result =
                await response.json();

        } catch {

            result = null;
        }


        console.log(
            "Paystack initialization response:",
            result
        );


        /* =====================================
           EDGE FUNCTION ERROR
        ===================================== */

        if (!response.ok) {

            throw new Error(
                result?.error ||
                result?.message ||
                "Could not start Paystack payment."
            );
        }


        /* =====================================
           CHECK PAYMENT URL
        ===================================== */

        if (
            !result?.authorization_url
        ) {

            throw new Error(
                "Paystack did not return a payment URL."
            );
        }


        /* =====================================
           SAVE REFERENCE
        ===================================== */

        if (
            result.reference
        ) {

            sessionStorage.setItem(
                "chemlab_paystack_reference",
                result.reference
            );
        }


        if (
            result.subscription_id
        ) {

            sessionStorage.setItem(
                "chemlab_subscription_id",
                result.subscription_id
            );
        }


        /* =====================================
           CLOSE PREMIUM MODAL
        ===================================== */

        closePremiumModal();


        /* =====================================
           OPEN PAYSTACK CHECKOUT
        ===================================== */

        window.location.href =
            result.authorization_url;


    } catch (error) {

        console.error(
            "Paystack payment error:",
            error
        );

        alert(
            error.message ||
            "Unable to start payment."
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                originalText;
        }
    }
}

/* =========================================================
   PREMIUM EXPERIMENT ACCESS
   ========================================================= */

async function handlePremiumExperiment(
    button
) {

    const user =
        await getCurrentStudent();

    if (!user) {

        alert(
            "Please sign in to access this experiment."
        );

        openAuthModal("login");

        return;
    }

    const status =
        await getPremiumStatus();

    if (!status.premium) {

        alert(
            "🔒 This experiment requires ChemLab Premium."
        );

        openPremiumModal();

        return;
    }

    /*
       This is where the actual experiment
       can later be opened.
    */

    const experimentName =
        button.dataset.experiment ||
        button.textContent.trim();

    alert(
        `👑 ${experimentName}\n\nPremium access confirmed.`
    );
}


/* =========================================================
   INITIALIZE EVERYTHING
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // existing ChemLab startup code

        await handlePaystackReturn();

    }
);

        /* =================================================
           ELEMENTS
           ================================================= */

        const loginButton =
            document.getElementById(
                "loginButton"
            );

        const closeAuthButton =
            document.getElementById(
                "closeAuthModal"
            );

        const authSubmit =
            document.getElementById(
                "authSubmit"
            );

        const authSwitch =
            document.getElementById(
                "authSwitch"
            );

        const authModal =
            document.getElementById(
                "authModal"
            );

        const accountModal =
            document.getElementById(
                "accountModal"
            );

        const closeAccountButton =
            document.getElementById(
                "closeAccountModal"
            );

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );

        const accountPremiumButton =
            document.getElementById(
                "accountPremiumButton"
            );

        const premiumModal =
            document.getElementById(
                "premiumModal"
            );

        const closePremiumButton =
            document.getElementById(
                "closePremiumModal"
            );

        const premiumUnlockButton =
            document.getElementById(
                "premiumUnlockButton"
            );

        const startPremiumButton =
            document.getElementById(
                "startPremiumButton"
            );


        /* =================================================
           INITIAL AUTH STATE
           ================================================= */

        const initialUser =
            await getCurrentStudent();

        updateAuthButton(
            initialUser
        );


        /* =================================================
           LOGIN / ACCOUNT BUTTON
           ================================================= */

        if (loginButton) {

            loginButton.addEventListener(
                "click",
                async () => {

                    const user =
                        await getCurrentStudent();

                    if (user) {

                        await openAccount();

                    } else {

                        openAuthModal(
                            "login"
                        );
                    }
                }
            );
        }


        /* =================================================
           CLOSE AUTH MODAL
           ================================================= */

        if (closeAuthButton) {

            closeAuthButton.addEventListener(
                "click",
                closeAuthModal
            );
        }


        /* =================================================
           SWITCH LOGIN / SIGNUP
           ================================================= */

        if (authSwitch) {

            authSwitch.addEventListener(
                "click",
                () => {

                    const modal =
                        document.getElementById(
                            "authModal"
                        );

                    const currentMode =
                        modal?.dataset.mode ||
                        "login";

                    openAuthModal(
                        currentMode ===
                            "login"
                            ? "signup"
                            : "login"
                    );
                }
            );
        }


        /* =================================================
           AUTH SUBMIT
           ================================================= */

        if (authSubmit) {

            authSubmit.addEventListener(
                "click",
                handleAuthSubmit
            );
        }


        /* =================================================
           ENTER KEY IN PASSWORD FIELD
           ================================================= */

        const passwordInput =
            document.getElementById(
                "authPassword"
            );

        if (passwordInput) {

            passwordInput.addEventListener(
                "keydown",
                (event) => {

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


        /* =================================================
           CLOSE AUTH WHEN CLICKING BACKDROP
           ================================================= */

        if (authModal) {

            authModal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        authModal
                    ) {

                        closeAuthModal();
                    }
                }
            );
        }


        /* =================================================
           ACCOUNT CLOSE
           ================================================= */

        if (closeAccountButton) {

            closeAccountButton.addEventListener(
                "click",
                closeAccount
            );
        }


        /* =================================================
           ACCOUNT BACKDROP
           ================================================= */

        if (accountModal) {

            accountModal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        accountModal
                    ) {

                        closeAccount();
                    }
                }
            );
        }


        /* =================================================
           ACCOUNT PREMIUM BUTTON
           ================================================= */

        if (accountPremiumButton) {

            accountPremiumButton.addEventListener(
                "click",
                async () => {

                    const status =
                        await getPremiumStatus();

                    if (status.premium) {

                        alert(
                            "Your Premium membership is already active."
                        );

                        return;
                    }

                    closeAccount();

                    openPremiumModal();
                }
            );
        }


        /* =================================================
           LOGOUT
           ================================================= */

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async () => {

                    const result =
                        await logoutStudent();

                    if (!result.success) {

                        alert(
                            result.message
                        );

                        return;
                    }

                    closeAccount();

                    updateAuthButton(
                        null
                    );

                    alert(
                        "You have been signed out."
                    );
                }
            );
        }


        /* =================================================
           PREMIUM UNLOCK BUTTON
           ================================================= */

        if (premiumUnlockButton) {

            premiumUnlockButton.addEventListener(
                "click",
                async () => {

                    const user =
                        await getCurrentStudent();

                    if (!user) {

                        openAuthModal(
                            "login"
                        );

                        return;
                    }

                    const status =
                        await getPremiumStatus();

                    if (status.premium) {

                        alert(
                            "👑 Your Premium membership is already active."
                        );

                        return;
                    }

                    openPremiumModal();
                }
            );
        }


        /* =================================================
           PREMIUM MODAL CLOSE
           ================================================= */

        if (closePremiumButton) {

            closePremiumButton.addEventListener(
                "click",
                closePremiumModal
            );
        }


        /* =================================================
           PREMIUM MODAL BACKDROP
           ================================================= */

        if (premiumModal) {

            premiumModal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        premiumModal
                    ) {

                        closePremiumModal();
                    }
                }
            );
        }


        /* =================================================
           START PREMIUM BUTTON
           ================================================= */

        if (startPremiumButton) {

            startPremiumButton.addEventListener(
                "click",
                async () => {

                    const user =
                        await getCurrentStudent();

                    if (!user) {

                        closePremiumModal();

                        openAuthModal(
                            "login"
                        );

                        return;
                    }

                    const status =
                        await getPremiumStatus();

                    if (status.premium) {

                        alert(
                            "Your Premium membership is already active."
                        );

                        return;
                    }

                    /*
                       Payment integration will be
                       handled through the selected
                       payment provider later.
                    */

                    alert(
                        "Premium payment setup is being prepared."
                    );
                }
            );
        }


        /* =================================================
           PREMIUM PLAN BUTTONS
           ================================================= */

        const premiumPlanButtons =
            document.querySelectorAll(
                ".premium-plan-button"
            );

        premiumPlanButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const plan =
                            button.dataset.plan;

                        await requestPremiumPlan(
                            plan
                        );
                    }
                );
            }
        );


        /* =================================================
           PREMIUM EXPERIMENT BUTTONS
           ================================================= */

        const experimentButtons =
            document.querySelectorAll(
                ".premium-experiment-button"
            );

        experimentButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        await handlePremiumExperiment(
                            button
                        );
                    }
                );
            }
        );


        /* =================================================
           AUTH STATE CHANGES
           ================================================= */

        chemLabSupabase.auth.onAuthStateChange(
            async (
                event,
                session
            ) => {

                console.log(
                    "Auth state:",
                    event
                );

                const user =
                    session?.user || null;

                updateAuthButton(
                    user
                );

                /*
                   When a user signs out,
                   close account-related UI.
                */

                if (!user) {

                    closeAccount();

                    closePremiumModal();
                }
            }
        );
    }
);

async function handlePaystackReturn() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const paymentStatus =
        urlParams.get("payment");

    const referenceFromUrl =
        urlParams.get("reference");

    const savedReference =
        sessionStorage.getItem(
            "chemlab_paystack_reference"
        );

    const reference =
        referenceFromUrl ||
        savedReference;

    // Nothing to verify
    if (
        paymentStatus !== "success" &&
        !reference
    ) {
        return;
    }

    if (!reference) {
        console.error(
            "No Paystack reference found."
        );

        return;
    }

    const {
        data: sessionData,
        error: sessionError
    } =
        await chemLabSupabase.auth.getSession();

    if (
        sessionError ||
        !sessionData?.session
    ) {
        console.error(
            "No active session for payment verification."
        );

        return;
    }

    const accessToken =
        sessionData.session.access_token;

    // -----------------------------------------
    // SHOW VERIFICATION MESSAGE
    // -----------------------------------------

    const verificationMessage =
        document.createElement("div");

    verificationMessage.id =
        "paymentVerificationMessage";

    verificationMessage.style.position =
        "fixed";

    verificationMessage.style.top =
        "20px";

    verificationMessage.style.left =
        "50%";

    verificationMessage.style.transform =
        "translateX(-50%)";

    verificationMessage.style.zIndex =
        "10000";

    verificationMessage.style.padding =
        "16px 22px";

    verificationMessage.style.borderRadius =
        "12px";

    verificationMessage.style.background =
        "#111827";

    verificationMessage.style.color =
        "#ffffff";

    verificationMessage.style.fontWeight =
        "600";

    verificationMessage.textContent =
        "🔐 Verifying your Paystack payment...";

    document.body.appendChild(
        verificationMessage
    );

    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/verify-paystack-payment`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`,

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY
                    },

                    body: JSON.stringify({
                        reference:
                            reference
                    })
                }
            );

        let result;

        try {
            result =
                await response.json();
        } catch {
            result = null;
        }

        console.log(
            "Payment verification result:",
            result
        );

        if (!response.ok) {
            throw new Error(
                result?.error ||
                "Payment verification failed."
            );
        }

        // -----------------------------------------
        // SUCCESS
        // -----------------------------------------

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

            verificationMessage.textContent =
                "🎉 Payment successful! ChemLab Premium is now active.";

            verificationMessage.style.background =
                "#166534";

            // Remove payment parameters
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );

            // Refresh account/premium UI
            if (
                typeof updateAuthUI ===
                "function"
            ) {
                await updateAuthUI();
            }

            if (
                typeof updateAccountDashboard ===
                "function"
            ) {
                await updateAccountDashboard();
            }

            // Give the student time to see message
            setTimeout(() => {
                verificationMessage.remove();
            }, 5000);

            return;
        }

        throw new Error(
            "Premium activation was not completed."
        );

    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );

        verificationMessage.textContent =
            "⚠️ " +
            (
                error.message ||
                "Payment verification failed."
            );

        verificationMessage.style.background =
            "#991b1b";

        setTimeout(() => {
            verificationMessage.remove();
        }, 7000);
    }
}async function handlePaystackReturn() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const paymentStatus =
        urlParams.get("payment");

    const referenceFromUrl =
        urlParams.get("reference");

    const savedReference =
        sessionStorage.getItem(
            "chemlab_paystack_reference"
        );

    const reference =
        referenceFromUrl ||
        savedReference;

    // Nothing to verify
    if (
        paymentStatus !== "success" &&
        !reference
    ) {
        return;
    }

    if (!reference) {
        console.error(
            "No Paystack reference found."
        );

        return;
    }

    const {
        data: sessionData,
        error: sessionError
    } =
        await chemLabSupabase.auth.getSession();

    if (
        sessionError ||
        !sessionData?.session
    ) {
        console.error(
            "No active session for payment verification."
        );

        return;
    }

    const accessToken =
        sessionData.session.access_token;

    // -----------------------------------------
    // SHOW VERIFICATION MESSAGE
    // -----------------------------------------

    const verificationMessage =
        document.createElement("div");

    verificationMessage.id =
        "paymentVerificationMessage";

    verificationMessage.style.position =
        "fixed";

    verificationMessage.style.top =
        "20px";

    verificationMessage.style.left =
        "50%";

    verificationMessage.style.transform =
        "translateX(-50%)";

    verificationMessage.style.zIndex =
        "10000";

    verificationMessage.style.padding =
        "16px 22px";

    verificationMessage.style.borderRadius =
        "12px";

    verificationMessage.style.background =
        "#111827";

    verificationMessage.style.color =
        "#ffffff";

    verificationMessage.style.fontWeight =
        "600";

    verificationMessage.textContent =
        "🔐 Verifying your Paystack payment...";

    document.body.appendChild(
        verificationMessage
    );

    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/verify-paystack-payment`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`,

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY
                    },

                    body: JSON.stringify({
                        reference:
                            reference
                    })
                }
            );

        let result;

        try {
            result =
                await response.json();
        } catch {
            result = null;
        }

        console.log(
            "Payment verification result:",
            result
        );

        if (!response.ok) {
            throw new Error(
                result?.error ||
                "Payment verification failed."
            );
        }

        // -----------------------------------------
        // SUCCESS
        // -----------------------------------------

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

            verificationMessage.textContent =
                "🎉 Payment successful! ChemLab Premium is now active.";

            verificationMessage.style.background =
                "#166534";

            // Remove payment parameters
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );

            // Refresh account/premium UI
            if (
                typeof updateAuthUI ===
                "function"
            ) {
                await updateAuthUI();
            }

            if (
                typeof updateAccountDashboard ===
                "function"
            ) {
                await updateAccountDashboard();
            }

            // Give the student time to see message
            setTimeout(() => {
                verificationMessage.remove();
            }, 5000);

            return;
        }

        throw new Error(
            "Premium activation was not completed."
        );

    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );

        verificationMessage.textContent =
            "⚠️ " +
            (
                error.message ||
                "Payment verification failed."
            );

        verificationMessage.style.background =
            "#991b1b";

        setTimeout(() => {
            verificationMessage.remove();
        }, 7000);
    }
}async function handlePaystackReturn() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const paymentStatus =
        urlParams.get("payment");

    const referenceFromUrl =
        urlParams.get("reference");

    const savedReference =
        sessionStorage.getItem(
            "chemlab_paystack_reference"
        );

    const reference =
        referenceFromUrl ||
        savedReference;

    // Nothing to verify
    if (
        paymentStatus !== "success" &&
        !reference
    ) {
        return;
    }

    if (!reference) {
        console.error(
            "No Paystack reference found."
        );

        return;
    }

    const {
        data: sessionData,
        error: sessionError
    } =
        await chemLabSupabase.auth.getSession();

    if (
        sessionError ||
        !sessionData?.session
    ) {
        console.error(
            "No active session for payment verification."
        );

        return;
    }

    const accessToken =
        sessionData.session.access_token;

    // -----------------------------------------
    // SHOW VERIFICATION MESSAGE
    // -----------------------------------------

    const verificationMessage =
        document.createElement("div");

    verificationMessage.id =
        "paymentVerificationMessage";

    verificationMessage.style.position =
        "fixed";

    verificationMessage.style.top =
        "20px";

    verificationMessage.style.left =
        "50%";

    verificationMessage.style.transform =
        "translateX(-50%)";

    verificationMessage.style.zIndex =
        "10000";

    verificationMessage.style.padding =
        "16px 22px";

    verificationMessage.style.borderRadius =
        "12px";

    verificationMessage.style.background =
        "#111827";

    verificationMessage.style.color =
        "#ffffff";

    verificationMessage.style.fontWeight =
        "600";

    verificationMessage.textContent =
        "🔐 Verifying your Paystack payment...";

    document.body.appendChild(
        verificationMessage
    );

    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/verify-paystack-payment`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`,

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY
                    },

                    body: JSON.stringify({
                        reference:
                            reference
                    })
                }
            );

        let result;

        try {
            result =
                await response.json();
        } catch {
            result = null;
        }

        console.log(
            "Payment verification result:",
            result
        );

        if (!response.ok) {
            throw new Error(
                result?.error ||
                "Payment verification failed."
            );
        }

        // -----------------------------------------
        // SUCCESS
        // -----------------------------------------

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

            verificationMessage.textContent =
                "🎉 Payment successful! ChemLab Premium is now active.";

            verificationMessage.style.background =
                "#166534";

            // Remove payment parameters
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );

            // Refresh account/premium UI
            if (
                typeof updateAuthUI ===
                "function"
            ) {
                await updateAuthUI();
            }

            if (
                typeof updateAccountDashboard ===
                "function"
            ) {
                await updateAccountDashboard();
            }

            // Give the student time to see message
            setTimeout(() => {
                verificationMessage.remove();
            }, 5000);

            return;
        }

        throw new Error(
            "Premium activation was not completed."
        );

    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );

        verificationMessage.textContent =
            "⚠️ " +
            (
                error.message ||
                "Payment verification failed."
            );

        verificationMessage.style.background =
            "#991b1b";

        setTimeout(() => {
            verificationMessage.remove();
        }, 7000);
    }
}
