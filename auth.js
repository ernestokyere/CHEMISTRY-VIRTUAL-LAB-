/* =========================================
   CHEMLAB AUTHENTICATION
========================================= */

const SUPABASE_URL =
    "https://zscbgeaieiqwknhjxpnt.supabase.co";


/*
 * IMPORTANT:
 * Replace the value below with your
 * Supabase PUBLISHABLE key.
 *
 * Do NOT use your OpenAI API key.
 * Do NOT use your Supabase secret/service-role key.
 */

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_blHgcaMVR5jHAl8Ixl4u3A_JMAzLquy";


/* =========================================
   CREATE SUPABASE CLIENT
========================================= */

const chemLabSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================
   SIGN UP
========================================= */

async function signUpStudent(
    email,
    password,
    fullName
) {

    try {

        const {
            data,
            error
        } =
            await chemLabSupabase.auth.signUp({

                email: email,

                password: password,

                options: {
                    data: {
                        full_name: fullName
                    }
                }

            });


        if (error) {
            throw error;
        }


        /*
         * If email confirmation is enabled,
         * Supabase may require the student
         * to confirm their email first.
         */

        if (
            data.user &&
            !data.session
        ) {

            return {
                success: true,
                message:
                    "Account created! Please check your email to confirm your account."
            };

        }


        /*
         * Create the student's profile.
         */

        if (data.user) {

            await createStudentProfile(
                data.user,
                fullName
            );

        }


        return {
            success: true,
            message:
                "Account created successfully!"
        };


    } catch (error) {

        console.error(
            "Sign-up error:",
            error
        );


        return {
            success: false,
            message:
                error.message ||
                "Unable to create your account."
        };

    }

}


/* =========================================
   CREATE STUDENT PROFILE
========================================= */

async function createStudentProfile(
    user,
    fullName
) {

    const {
        error
    } =
        await chemLabSupabase
            .from("profiles")
            .upsert({

                id:
                    user.id,

                full_name:
                    fullName || "",

                is_premium:
                    false

            });


    if (error) {

        console.error(
            "Profile creation error:",
            error
        );

    }

}


/* =========================================
   LOGIN
========================================= */

async function loginStudent(
    email,
    password
) {

    try {

        const {
            data,
            error
        } =
            await chemLabSupabase.auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        password

                });


        if (error) {
            throw error;
        }


        return {
            success: true,
            user: data.user,
            message:
                "Login successful!"
        };


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return {
            success: false,
            message:
                error.message ||
                "Unable to log in."
        };

    }

}


/* =========================================
   LOGOUT
========================================= */

async function logoutStudent() {

    const {
        error
    } =
        await chemLabSupabase.auth.signOut();


    if (error) {

        console.error(
            "Logout error:",
            error
        );

        return false;

    }


    return true;

}


/* =========================================
   GET CURRENT STUDENT
========================================= */

async function getCurrentStudent() {

    const {
        data,
        error
    } =
        await chemLabSupabase.auth
            .getUser();


    if (error) {

        console.error(
            "Get user error:",
            error
        );

        return null;

    }


    return data.user || null;

}


/* =========================================
   GET PREMIUM STATUS
========================================= */

async function getPremiumStatus() {

    const user =
        await getCurrentStudent();


    if (!user) {

        return {
            loggedIn: false,
            premium: false
        };

    }


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
            "Premium status error:",
            error
        );

        return {
            loggedIn: true,
            premium: false
        };

    }


    /*
     * Check whether a temporary premium
     * subscription has expired.
     */

    let premium =
        data?.is_premium === true;


    if (
        premium &&
        data?.premium_expires_at
    ) {

        const expiry =
            new Date(
                data.premium_expires_at
            );

        if (
            expiry <= new Date()
        ) {

            premium = false;

        }

    }


    return {

        loggedIn: true,

        premium: premium,

        expiresAt:
            data?.premium_expires_at || null

    };

}


/* =========================================
   AUTH STATE LISTENER
========================================= */

chemLabSupabase.auth
    .onAuthStateChange(
        (event, session) => {

            console.log(
                "ChemLab authentication:",
                event
            );


            /*
             * This will be connected to the
             * login interface in the next step.
             */

            if (session?.user) {

                console.log(
                    "Student logged in:",
                    session.user.email
                );

            }

        }
    );

/* =========================================
   AUTH UI
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const loginButton =
            document.getElementById(
                "loginButton"
            );

        const authModal =
            document.getElementById(
                "authModal"
            );

        const closeAuthModal =
            document.getElementById(
                "closeAuthModal"
            );

        const authTitle =
            document.getElementById(
                "authTitle"
            );

        const authSubtitle =
            document.getElementById(
                "authSubtitle"
            );

        const nameField =
            document.getElementById(
                "nameField"
            );

        const authName =
            document.getElementById(
                "authName"
            );

        const authEmail =
            document.getElementById(
                "authEmail"
            );

        const authPassword =
            document.getElementById(
                "authPassword"
            );

        const authMessage =
            document.getElementById(
                "authMessage"
            );

        const authSubmit =
            document.getElementById(
                "authSubmit"
            );

        const authSwitch =
            document.getElementById(
                "authSwitch"
            );

        const authSwitchText =
            document.getElementById(
                "authSwitchText"
            );


        let signUpMode = false;


        /* =====================================
           OPEN MODAL
        ===================================== */

        loginButton.addEventListener(
            "click",
            () => {

                authModal.classList.add(
                    "active"
                );

                authModal.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }
        );


        /* =====================================
           CLOSE MODAL
        ===================================== */

        closeAuthModal.addEventListener(
            "click",
            closeModal
        );


        authModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    authModal
                ) {

                    closeModal();

                }

            }
        );


        function closeModal() {

            authModal.classList.remove(
                "active"
            );

            authModal.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        /* =====================================
           SWITCH LOGIN / SIGN UP
        ===================================== */

        authSwitch.addEventListener(
            "click",
            () => {

                signUpMode =
                    !signUpMode;


                authMessage.textContent =
                    "";


                if (signUpMode) {

                    authTitle.textContent =
                        "Create your ChemLab account";

                    authSubtitle.textContent =
                        "Join ChemLab and start learning.";

                    nameField.classList.remove(
                        "hidden"
                    );

                    authSubmit.textContent =
                        "Create Account";

                    authSwitchText.textContent =
                        "Already have an account?";

                    authSwitch.textContent =
                        "Sign in";

                } else {

                    authTitle.textContent =
                        "Welcome to ChemLab";

                    authSubtitle.textContent =
                        "Sign in to continue learning.";

                    nameField.classList.add(
                        "hidden"
                    );

                    authSubmit.textContent =
                        "Sign In";

                    authSwitchText.textContent =
                        "Don't have an account?";

                    authSwitch.textContent =
                        "Create account";

                }

            }
        );


        /* =====================================
           SUBMIT
        ===================================== */

        authSubmit.addEventListener(
            "click",
            async () => {

                const email =
                    authEmail.value.trim();

                const password =
                    authPassword.value;

                const fullName =
                    authName.value.trim();


                authMessage.textContent =
                    "";


                if (!email || !password) {

                    authMessage.textContent =
                        "Please enter your email and password.";

                    return;

                }


                if (
                    signUpMode &&
                    !fullName
                ) {

                    authMessage.textContent =
                        "Please enter your name.";

                    return;

                }


                authSubmit.disabled =
                    true;

                authSubmit.textContent =
                    signUpMode
                        ? "Creating account..."
                        : "Signing in...";


                try {

                    let result;


                    if (signUpMode) {

                        result =
                            await signUpStudent(
                                email,
                                password,
                                fullName
                            );

                    } else {

                        result =
                            await loginStudent(
                                email,
                                password
                            );

                    }


                    authMessage.textContent =
                        result.message;


                    if (result.success) {

                        if (!signUpMode) {

                            setTimeout(
                                () => {

                                    closeModal();

                                },
                                800
                            );

                        }

                    }


                } catch (error) {

                    console.error(
                        error
                    );

                    authMessage.textContent =
                        "Something went wrong. Please try again.";

                }


                authSubmit.disabled =
                    false;

                authSubmit.textContent =
                    signUpMode
                        ? "Create Account"
                        : "Sign In";

            }
        );


        /* =====================================
           UPDATE ACCOUNT BUTTON
        ===================================== */

        chemLabSupabase.auth
            .onAuthStateChange(
                async (
                    event,
                    session
                ) => {

                    if (
                        session &&
                        session.user
                    ) {

                        loginButton.textContent =
                            "👤 Account";

                    } else {

                        loginButton.textContent =
                            "👤 Sign In";

                    }

                }
            );

    }
);

/* =========================================
   PREMIUM ACCESS UI
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const unlockButton =
            document.getElementById(
                "premiumUnlockButton"
            );

        const experimentButtons =
            document.querySelectorAll(
                ".premium-experiment-button"
            );


        async function checkPremium() {

            const status =
                await getPremiumStatus();


            if (
                status.loggedIn &&
                status.premium
            ) {

                unlockButton.textContent =
                    "👑 Premium Active";


                experimentButtons.forEach(
                    (button) => {

                        button.textContent =
                            "🧪 Open Experiment";

                    }
                );

            }

        }


        await checkPremium();


        /* =====================================
           UNLOCK BUTTON
        ===================================== */

        if (unlockButton) {

            unlockButton.addEventListener(
                "click",
                async () => {

                    const status =
                        await getPremiumStatus();


                    if (!status.loggedIn) {

                        alert(
                            "Please sign in or create an account first."
                        );

                        return;

                    }


                    if (status.premium) {

                        alert(
                            "Your Premium access is already active."
                        );

                        return;

                    }


                    /*
                     * Payment will be connected
                     * here in the next step.
                     */

                    alert(
                        "Premium payment will be available soon."
                    );

                }
            );

        }


        /* =====================================
           PREMIUM EXPERIMENT BUTTONS
        ===================================== */

        experimentButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const status =
                            await getPremiumStatus();


                        if (
                            !status.loggedIn
                        ) {

                            alert(
                                "Please sign in to access this experiment."
                            );

                            return;

                        }


                        if (
                            !status.premium
                        ) {

                            alert(
                                "🔒 This experiment requires ChemLab Premium."
                            );

                            return;

                        }


                        alert(
                            "Premium experiment unlocked!"
                        );

                    }
                );

            }
        );

    }
);
