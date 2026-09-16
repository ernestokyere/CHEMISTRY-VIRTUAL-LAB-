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
