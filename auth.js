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


/* =========================================================
   CREATE SUPABASE CLIENT
   ========================================================= */

let chemLabSupabase = null;

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {
    chemLabSupabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );
} else {
    console.error(
        "Supabase library was not loaded before auth.js."
    );
}


/* =========================================================
   SAFETY CHECK
   ========================================================= */

function supabaseReady() {
    if (!chemLabSupabase) {
        console.error(
            "ChemLab Supabase client is unavailable."
        );

        return false;
    }

    return true;
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
        String(fullName || "").trim();

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
                        full_name: cleanName
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
                message: error.message
            };
        }

        return {
            success: true,
            user: data?.user || null,
            session: data?.session || null,

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
                    email: cleanEmail,
                    password: password
                });

        if (error) {
            console.error(
                "Login error:",
                error
            );

            return {
                success: false,
                message: error.message
            };
        }

        return {
            success: true,
            user: data?.user || null,
            session: data?.session || null,
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
            await chemLabSupabase.auth.signOut();

        if (error) {
            console.error(
                "Logout error:",
                error
            );

            return {
                success: false,
                message: error.message
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


/*
   Compatibility alias.
   Other parts of ChemLab can still use
   getCurrentStudent().
*/

async function getCurrentStudent() {
    return await getCurrentUser();
}


/* =========================================================
   GET PREMIUM STATUS
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
                "Premium profile error:",
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
            data?.premium_expires_at || null;


        /* =================================================
           CHECK PREMIUM EXPIRATION
           ================================================= */

        if (
            isPremium &&
            expiresAt
        ) {

            const expiryDate =
                new Date(expiresAt);

            if (
                Number.isNaN(
                    expiryDate.getTime()
                )
            ) {

                isPremium = false;

            } else if (
                expiryDate <= new Date()
            ) {

                isPremium = false;
            }
        }


        /* =================================================
           GET ACTIVE SUBSCRIPTION
           ================================================= */

        let plan = null;

        if (isPremium) {

            const {
                data: subscriptionData,
                error: subscriptionError
            } =
                await chemLabSupabase
                    .from("subscriptions")
                    .select(
                        "plan, expires_at, status"
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
   FORMAT PREMIUM DATE
   ========================================================= */

function formatPremiumDate(
    dateString
) {

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
   AUTH MODAL
   ========================================================= */

function openAuthModal(
    mode = "login"
) {

    const modal =
        document.getElementById(
            "authModal"
        );

    if (!modal) {
        console.error(
            "authModal was not found."
        );

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


    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    modal.dataset.mode =
        mode;


    if (message) {
        message.textContent = "";
    }


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
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================================
   UPDATE AUTH BUTTON
   ========================================================= */

function updateAuthButton(
    user
) {

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

    if (!modal) {
        return;
    }

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

    } catch (error) {

        console.error(
            "Authentication submission error:",
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
       Supabase may not create a session
       immediately.
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
        await getCurrentUser();


    if (!user) {

        openAuthModal(
            "login"
        );

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
            user.email ||
            "—";
    }


    if (status.isPremium) {

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

        modal.classList.add(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );
    }
}


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
        "active"
    );

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

        console.error(
            "premiumModal was not found."
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
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


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


    const status =
        await getPremiumStatus();


    if (status.isPremium) {

        alert(
            "You already have an active Premium subscription."
        );

        return;
    }


    if (
        plan !== "monthly" &&
        plan !== "yearly"
    ) {

        alert(
            "Invalid Premium plan."
        );

        return;
    }


    const {
        data: sessionData,
        error: sessionError
    } =
        await chemLabSupabase.auth
            .getSession();


    if (
        sessionError ||
        !sessionData?.session
    ) {

        alert(
            "Your login session has expired. Please sign in again."
        );

        closePremiumModal();

        openAuthModal(
            "login"
        );

        return;
    }


    const accessToken =
        sessionData.session.access_token;


    const button =
        document.querySelector(
            `.premium-plan-button[data-plan="${plan}"]`
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

                    body:
                        JSON.stringify({
                            plan: plan
                        })
                }
            );


        let result = null;


        try {

            result =
                await response.json();

        } catch (jsonError) {

            console.error(
                "Could not read payment response:",
                jsonError
            );
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


        closePremiumModal();


        window.location.href =
            result.authorization_url;


    } catch (error) {

        console.error(
            "Paystack payment error:",
            error
        );

        alert(
            error?.message ||
            "Unable to start payment."
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


    const premiumStatus =
        await getPremiumStatus();


    if (
        !premiumStatus ||
        !premiumStatus.isPremium
    ) {

        if (
            typeof window.showNotification ===
            "function"
        ) {

            showNotification(
                "👑 Premium access required. Please unlock ChemLab Premium.",
                "premium"
            );

        } else {

            alert(
                "👑 Premium access required. Please unlock ChemLab Premium."
            );
        }


        const premiumSection =
            document.getElementById(
                "premiumSection"
            );


        if (premiumSection) {

            premiumSection.scrollIntoView({
                behavior: "smooth"
            });
        }


        return;
    }


    const experiment =
        button?.dataset?.experiment ||
        "";


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

            console.error(
                "Advanced Titration laboratory is not available."
            );


            if (
                typeof window.showNotification ===
                "function"
            ) {

                showNotification(
                    "The Premium laboratory could not be opened. Please refresh the page.",
                    "error"
                );

            } else {

                alert(
                    "The Premium laboratory could not be opened. Please refresh the page."
                );
            }
        }


        return;
    }


    if (
        typeof window.showNotification ===
        "function"
    ) {

        showNotification(
            "👑 This Premium experiment is coming soon.",
            "premium"
        );

    } else {

        alert(
            "👑 This Premium experiment is coming soon."
        );
    }
}


/* =========================================================
   PAYSTACK RETURN + VERIFICATION
   ========================================================= */

async function handlePaystackReturn() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const paymentStatus =
        urlParams.get(
            "payment"
        );


    const referenceFromUrl =
        urlParams.get(
            "reference"
        );


    const savedReference =
        sessionStorage.getItem(
            "chemlab_paystack_reference"
        );


    const reference =
        referenceFromUrl ||
        savedReference;


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
        await chemLabSupabase.auth
            .getSession();


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


    const verificationMessage =
        document.createElement(
            "div"
        );


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

                    body:
                        JSON.stringify({
                            reference:
                                reference
                        })
                }
            );


        let result = null;


        try {

            result =
                await response.json();

        } catch (jsonError) {

            console.error(
                "Could not read verification response:",
                jsonError
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
                "Payment verification failed."
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


            verificationMessage.textContent =
                "🎉 Payment successful! ChemLab Premium is now active.";


            verificationMessage.style.background =
                "#166534";


            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );


            const refreshedUser =
                await getCurrentUser();


            updateAuthButton(
                refreshedUser
            );


            setTimeout(
                () => {

                    if (
                        verificationMessage.parentNode
                    ) {

                        verificationMessage.remove();
                    }

                },
                5000
            );


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
                error?.message ||
                "Payment verification failed."
            );


        verificationMessage.style.background =
            "#991b1b";


        setTimeout(
            () => {

                if (
                    verificationMessage.parentNode
                ) {

                    verificationMessage.remove();
                }

            },
            7000
        );
    }
}


/* =========================================================
   INITIALIZE CHEMLAB AUTH SYSTEM
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "ChemLab authentication system starting..."
        );


        /* =================================================
           ELEMENTS
           ================================================= */

        const loginButton =
            document.getElementById("loginButton");

        const closeAuthButton =
            document.getElementById("closeAuthModal");

        const authSubmit =
            document.getElementById("authSubmit");

        const authSwitch =
            document.getElementById("authSwitch");

        const authModal =
            document.getElementById("authModal");

        const accountModal =
            document.getElementById("accountModal");

        const closeAccountButton =
            document.getElementById("closeAccountModal");

        const logoutButton =
            document.getElementById("logoutButton");

        const accountPremiumButton =
            document.getElementById("accountPremiumButton");

        const premiumModal =
            document.getElementById("premiumModal");

        const closePremiumButton =
            document.getElementById("closePremiumModal");

        const premiumUnlockButton =
            document.getElementById("premiumUnlockButton");

        const startPremiumButton =
            document.getElementById("startPremiumButton");


        /* =================================================
           IMPORTANT:
           DO NOT STOP INITIALIZATION IF SUPABASE IS NOT READY
           ================================================= */

        if (!supabaseReady()) {

            console.warn(
                "Supabase is not ready. Authentication UI will still be available."
            );
        }


        /* =================================================
           LOGIN / ACCOUNT BUTTON
           ================================================= */

        if (loginButton) {

            loginButton.addEventListener(
                "click",
                async (event) => {

                    event.preventDefault();

                    console.log(
                        "Sign In button clicked."
                    );


                    /*
                       If the user is already logged in,
                       open the account dashboard.
                    */

                    const user =
                        await getCurrentUser();


                    if (user) {

                        await openAccount();

                    } else {

                        /*
                           Otherwise open login modal.
                        */

                        openAuthModal("login");
                    }
                }
            );

        } else {

            console.error(
                "ERROR: loginButton was not found in index.html."
            );
        }


        /* =================================================
           INITIAL AUTH STATE
           ================================================= */

        if (supabaseReady()) {

            const initialUser =
                await getCurrentUser();

            updateAuthButton(
                initialUser
            );
        } else {

            updateAuthButton(
                null
            );
        }


        /* =================================================
           CLOSE AUTH MODAL
           ================================================= */

        if (closeAuthButton) {

            closeAuthButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    closeAuthModal();
                }
            );
        }


        /* =================================================
           SWITCH LOGIN / SIGNUP
           ================================================= */

        if (authSwitch) {

            authSwitch.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    const currentModal =
                        document.getElementById(
                            "authModal"
                        );

                    const currentMode =
                        currentModal?.dataset?.mode ||
                        "login";

                    openAuthModal(
                        currentMode === "login"
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
                async (event) => {

                    event.preventDefault();

                    await handleAuthSubmit();
                }
            );
        }


        /* =================================================
           ENTER KEY
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
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        handleAuthSubmit();
                    }
                }
            );
        }


        /* =================================================
           AUTH MODAL BACKDROP
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
           CLOSE ACCOUNT
           ================================================= */

        if (closeAccountButton) {

            closeAccountButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    closeAccount();
                }
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
                async (event) => {

                    event.preventDefault();

                    const status =
                        await getPremiumStatus();

                    if (
                        status &&
                        status.isPremium
                    ) {

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
                async (event) => {

                    event.preventDefault();

                    const result =
                        await logoutStudent();

                    if (!result.success) {

                        alert(
                            result.message
                        );

                        return;
                    }

                    closeAccount();

                    closePremiumModal();

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
                async (event) => {

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
                        status &&
                        status.isPremium
                    ) {

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
           CLOSE PREMIUM MODAL
           ================================================= */

        if (closePremiumButton) {

            closePremiumButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    closePremiumModal();
                }
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
                async (event) => {

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
                        status &&
                        status.isPremium
                    ) {

                        alert(
                            "Your Premium membership is already active."
                        );

                        return;
                    }

                    alert(
                        "Please select a Premium plan below."
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

        console.log(
            "Premium plan buttons found:",
            premiumPlanButtons.length
        );


        premiumPlanButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async (event) => {

                        event.preventDefault();

                        const plan =
                            button.dataset.plan;

                        console.log(
                            "Premium plan selected:",
                            plan
                        );

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

        console.log(
            "Premium experiment buttons found:",
            experimentButtons.length
        );


        experimentButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async (event) => {

                        event.preventDefault();

                        await handlePremiumExperiment(
                            button
                        );
                    }
                );
            }
        );


        /* =================================================
           SUPABASE AUTH STATE CHANGES
           ================================================= */

        if (supabaseReady()) {

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


        /* =================================================
           CHECK PAYSTACK RETURN
           ================================================= */

        if (supabaseReady()) {

            await handlePaystackReturn();
        }


        /* =================================================
           READY
           ================================================= */

        console.log(
            "ChemLab authentication system ready."
        );
    }
);
