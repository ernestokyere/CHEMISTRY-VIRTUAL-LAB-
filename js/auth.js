/* =========================================================
   CHEMLAB
   STUDENT AUTHENTICATION ENGINE
   STAGE 3.2 — REVISED
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       INTERNAL STATE
       ===================================================== */

    const AUTH_STATE = {

        initialized: false,

        loading: false,

        authenticated: false,

        session: null,

        user: null
    };


    /* =====================================================
       SUPABASE CLIENT
       ===================================================== */

    let supabaseClient = null;


    /* =====================================================
       HELPERS
       ===================================================== */

    function config() {

        return window.CHEMLAB_CONFIG || {};
    }


    function supabaseConfig() {

        return config().supabase || {};
    }


    function authConfig() {

        return config().auth || {};
    }


    function isConfigured() {

        const settings =
            supabaseConfig();

        return Boolean(
            settings.enabled &&
            settings.url &&
            settings.publishableKey
        );
    }


    function log(...args) {

        if (
            typeof window.CHEMLAB_LOG ===
            "function"
        ) {

            window.CHEMLAB_LOG(
                "[AUTH]",
                ...args
            );
        }
    }


    function createError(
        message,
        originalError = null
    ) {

        const error =
            new Error(message);

        error.originalError =
            originalError;

        return error;
    }


    /* =====================================================
       APPLICATION URL
       ===================================================== */

    function getApplicationUrl() {

        const origin =
            window.location.origin;

        const pathname =
            window.location.pathname || "/";

        return `${origin}${pathname}`;
    }


    /* =====================================================
       LOAD SUPABASE LIBRARY
       ===================================================== */

    function loadSupabaseLibrary() {

        return new Promise(
            (resolve, reject) => {

                if (
                    window.supabase &&
                    typeof window.supabase.createClient ===
                    "function"
                ) {

                    resolve();

                    return;
                }


                const existingScript =
                    document.querySelector(
                        'script[data-chemlab-supabase]'
                    );


                if (existingScript) {

                    existingScript.addEventListener(
                        "load",
                        () => resolve(),
                        { once: true }
                    );


                    existingScript.addEventListener(
                        "error",
                        () =>
                            reject(
                                createError(
                                    "Unable to load the Supabase library."
                                )
                            ),
                        { once: true }
                    );


                    return;
                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


                script.async = true;


                script.dataset.chemlabSupabase =
                    "true";


                script.onload = () => {

                    if (
                        window.supabase &&
                        typeof window.supabase.createClient ===
                        "function"
                    ) {

                        resolve();

                    } else {

                        reject(
                            createError(
                                "Supabase loaded, but the client library is unavailable."
                            )
                        );
                    }
                };


                script.onerror = () => {

                    reject(
                        createError(
                            "Unable to load the Supabase library."
                        )
                    );
                };


                document.head.appendChild(
                    script
                );
            }
        );
    }


    /* =====================================================
       INITIALIZE CLIENT
       ===================================================== */

    async function initializeClient() {

        if (supabaseClient) {

            return supabaseClient;
        }


        if (!isConfigured()) {

            throw createError(
                "Supabase is not configured. Check js/config.js."
            );
        }


        await loadSupabaseLibrary();


        const settings =
            supabaseConfig();


        supabaseClient =
            window.supabase.createClient(
                settings.url,
                settings.publishableKey,
                {
                    auth: {

                        persistSession:
                            true,

                        autoRefreshToken:
                            true,

                        detectSessionInUrl:
                            true
                    }
                }
            );


        log(
            "Supabase client initialized."
        );


        return supabaseClient;
    }


    /* =====================================================
       LOCAL SESSION STORAGE
       ===================================================== */

    function saveSession(
        session
    ) {

        try {

            const key =
                authConfig().sessionStorageKey ||
                "chemlab_session";


            if (session) {

                localStorage.setItem(
                    key,
                    JSON.stringify(session)
                );

            } else {

                localStorage.removeItem(
                    key
                );
            }

        } catch (error) {

            log(
                "Unable to save session locally.",
                error
            );
        }
    }


    function saveUserProfile(
        profile
    ) {

        try {

            const key =
                authConfig().profileStorageKey ||
                "chemlab_profile";


            if (profile) {

                localStorage.setItem(
                    key,
                    JSON.stringify(profile)
                );

            } else {

                localStorage.removeItem(
                    key
                );
            }

        } catch (error) {

            log(
                "Unable to save profile locally.",
                error
            );
        }
    }


    function clearLocalAuth() {

        try {

            const sessionKey =
                authConfig().sessionStorageKey ||
                "chemlab_session";


            const profileKey =
                authConfig().profileStorageKey ||
                "chemlab_profile";


            localStorage.removeItem(
                sessionKey
            );


            localStorage.removeItem(
                profileKey
            );

        } catch (error) {

            log(
                "Unable to clear local authentication data.",
                error
            );
        }
    }


    /* =====================================================
       UPDATE AUTH STATE
       ===================================================== */

    function updateState(
        session
    ) {

        AUTH_STATE.session =
            session || null;


        AUTH_STATE.user =
            session?.user || null;


        AUTH_STATE.authenticated =
            Boolean(
                session?.user
            );


        saveSession(
            session || null
        );


        window.dispatchEvent(
            new CustomEvent(
                "chemlab:auth-state",
                {
                    detail: {

                        authenticated:
                            AUTH_STATE.authenticated,

                        session:
                            AUTH_STATE.session,

                        user:
                            AUTH_STATE.user
                    }
                }
            )
        );
    }


    /* =====================================================
       INITIALIZE AUTHENTICATION
       ===================================================== */

    async function initialize() {

        if (
            AUTH_STATE.initialized
        ) {

            return getAuthState();
        }


        AUTH_STATE.loading =
            true;


        try {

            await initializeClient();


            const {
                data,
                error
            } =
                await supabaseClient.auth.getSession();


            if (error) {

                throw error;
            }


            updateState(
                data?.session || null
            );


            supabaseClient.auth.onAuthStateChange(
                (
                    event,
                    session
                ) => {

                    log(
                        "Auth event:",
                        event
                    );


                    updateState(
                        session || null
                    );


                    window.dispatchEvent(
                        new CustomEvent(
                            "chemlab:auth-event",
                            {
                                detail: {

                                    event,

                                    session
                                }
                            }
                        )
                    );
                }
            );


            AUTH_STATE.initialized =
                true;


            log(
                "Authentication initialized."
            );


            return getAuthState();

        } catch (error) {

            log(
                "Authentication initialization failed.",
                error
            );


            updateState(
                null
            );


            throw createError(
                getReadableAuthError(
                    error
                ),
                error
            );

        } finally {

            AUTH_STATE.loading =
                false;
        }
    }


    /* =====================================================
       SIGN UP
       ===================================================== */

    async function signUp(
        email,
        password,
        metadata = {}
    ) {

        await initializeClient();


        const cleanEmail =
            String(
                email || ""
            )
                .trim()
                .toLowerCase();


        const cleanPassword =
            String(
                password || ""
            );


        if (!cleanEmail) {

            throw createError(
                "Please enter your email address."
            );
        }


        if (!isValidEmail(cleanEmail)) {

            throw createError(
                "Please enter a valid email address."
            );
        }


        if (!cleanPassword) {

            throw createError(
                "Please enter a password."
            );
        }


        if (
            cleanPassword.length < 6
        ) {

            throw createError(
                "Your password must contain at least 6 characters."
            );
        }


        AUTH_STATE.loading =
            true;


        try {

            /*
             * The confirmation redirect should return
             * the student to the ChemLab application.
             */
            const redirectTo =
                getApplicationUrl();


            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email:
                        cleanEmail,

                    password:
                        cleanPassword,

                    options: {

                        redirectTo,

                        data: {

                            full_name:
                                String(
                                    metadata.full_name ||
                                    ""
                                ).trim(),

                            academic_level:
                                String(
                                    metadata.academic_level ||
                                    ""
                                ).trim(),

                            institution:
                                String(
                                    metadata.institution ||
                                    ""
                                ).trim()
                        }
                    }
                });


            /*
             * IMPORTANT:
             * Keep the real Supabase response in
             * the console while we are testing.
             *
             * No password is logged.
             */
            log(
                "Signup response:",
                {
                    hasUser:
                        Boolean(data?.user),

                    hasSession:
                        Boolean(data?.session),

                    userId:
                        data?.user?.id || null,

                    email:
                        data?.user?.email || null,

                    confirmedAt:
                        data?.user?.email_confirmed_at ||
                        null,

                    confirmationSentAt:
                        data?.user?.confirmation_sent_at ||
                        null,

                    error:
                        error || null
                }
            );


            if (error) {

                throw error;
            }


            if (!data?.user) {

                throw createError(
                    "Supabase did not return a student account. Please try again."
                );
            }


            /*
             * If Supabase returns a session,
             * the student is already authenticated.
             */
            if (data?.session) {

                updateState(
                    data.session
                );


                return {

                    success:
                        true,

                    user:
                        data.user,

                    session:
                        data.session,

                    requiresEmailConfirmation:
                        false,

                    confirmationSent:
                        false
                };
            }


            /*
             * Supabase returns a user with no session
             * when email confirmation is required.
             */
            const confirmationRequired =
                !data.user.email_confirmed_at;


            updateState(
                null
            );


            return {

                success:
                    true,

                user:
                    data.user,

                session:
                    null,

                requiresEmailConfirmation:
                    confirmationRequired,

                confirmationSent:
                    Boolean(
                        data.user.confirmation_sent_at
                    )
            };

        } catch (error) {

            log(
                "Signup failed:",
                error
            );


            throw createError(
                getReadableAuthError(
                    error
                ),
                error
            );

        } finally {

            AUTH_STATE.loading =
                false;
        }
    }


    /* =====================================================
       SIGN IN
       ===================================================== */

    async function signIn(
        email,
        password
    ) {

        await initializeClient();


        const cleanEmail =
            String(
                email || ""
            )
                .trim()
                .toLowerCase();


        const cleanPassword =
            String(
                password || ""
            );


        if (!cleanEmail) {

            throw createError(
                "Please enter your email address."
            );
        }


        if (!isValidEmail(cleanEmail)) {

            throw createError(
                "Please enter a valid email address."
            );
        }


        if (!cleanPassword) {

            throw createError(
                "Please enter your password."
            );
        }


        AUTH_STATE.loading =
            true;


        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({

                        email:
                            cleanEmail,

                        password:
                            cleanPassword
                    });


            if (error) {

                throw error;
            }


            updateState(
                data?.session || null
            );


            return {

                success:
                    true,

                user:
                    data?.user || null,

                session:
                    data?.session || null
            };

        } catch (error) {

            log(
                "Sign in failed:",
                error
            );


            throw createError(
                getReadableAuthError(
                    error
                ),
                error
            );

        } finally {

            AUTH_STATE.loading =
                false;
        }
    }


    /* =====================================================
       SIGN OUT
       ===================================================== */

    async function signOut() {

        await initializeClient();


        AUTH_STATE.loading =
            true;


        try {

            const {
                error
            } =
                await supabaseClient.auth.signOut();


            if (error) {

                throw error;
            }


            updateState(
                null
            );


            clearLocalAuth();


            saveUserProfile(
                null
            );


            return {

                success:
                    true
            };

        } catch (error) {

            throw createError(
                getReadableAuthError(
                    error
                ),
                error
            );

        } finally {

            AUTH_STATE.loading =
                false;
        }
    }


    /* =====================================================
       CURRENT SESSION
       ===================================================== */

    async function getSession() {

        await initializeClient();


        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            throw error;
        }


        updateState(
            data?.session || null
        );


        return (
            data?.session ||
            null
        );
    }


    /* =====================================================
       CURRENT USER
       ===================================================== */

    async function getCurrentUser() {

        await initializeClient();


        const {
            data,
            error
        } =
            await supabaseClient.auth.getUser();


        if (error) {

            if (
                error.message &&
                error.message
                    .toLowerCase()
                    .includes(
                        "not authenticated"
                    )
            ) {

                return null;
            }


            throw error;
        }


        return data?.user || null;
    }


    /* =====================================================
       PASSWORD RESET
       ===================================================== */

    async function resetPassword(
        email
    ) {

        await initializeClient();


        const cleanEmail =
            String(
                email || ""
            )
                .trim()
                .toLowerCase();


        if (!cleanEmail) {

            throw createError(
                "Please enter your email address."
            );
        }


        if (!isValidEmail(cleanEmail)) {

            throw createError(
                "Please enter a valid email address."
            );
        }


        const redirectUrl =
            getApplicationUrl();


        try {

            const {
                error
            } =
                await supabaseClient.auth
                    .resetPasswordForEmail(
                        cleanEmail,
                        {
                            redirectTo:
                                redirectUrl
                        }
                    );


            if (error) {

                throw error;
            }


            return {

                success:
                    true
            };

        } catch (error) {

            throw createError(
                getReadableAuthError(
                    error
                ),
                error
            );
        }
    }


    /* =====================================================
       EMAIL VALIDATION
       ===================================================== */

    function isValidEmail(
        email
    ) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }


    /* =====================================================
       AUTH ERROR TRANSLATION
       ===================================================== */

    function getReadableAuthError(
        error
    ) {

        if (!error) {

            return (
                "An unknown authentication error occurred."
            );
        }


        const message =
            String(
                error.message ||
                error.error_description ||
                error
            );


        const lower =
            message.toLowerCase();


        if (
            lower.includes(
                "invalid login credentials"
            )
        ) {

            return (
                "The email or password is incorrect."
            );
        }


        if (
            lower.includes(
                "email not confirmed"
            )
        ) {

            return (
                "Please confirm your email address before signing in."
            );
        }


        if (
            lower.includes(
                "user already registered"
            )
        ) {

            return (
                "An account with this email already exists."
            );
        }


        if (
            lower.includes(
                "password should be at least"
            )
        ) {

            return (
                "Your password does not meet the minimum requirements."
            );
        }


        if (
            lower.includes(
                "rate limit"
            )
        ) {

            return (
                "Too many attempts. Please wait a moment and try again."
            );
        }


        if (
            lower.includes(
                "email rate limit"
            )
        ) {

            return (
                "Too many confirmation emails were requested. Please wait before trying again."
            );
        }


        if (
            lower.includes(
                "redirect"
            ) &&
            lower.includes(
                "not allowed"
            )
        ) {

            return (
                "ChemLab's confirmation redirect URL is not allowed by Supabase. Check the Supabase URL Configuration."
            );
        }


        if (
            lower.includes(
                "network"
            ) ||
            lower.includes(
                "fetch"
            )
        ) {

            return (
                "Unable to connect to the authentication service. Check your internet connection."
            );
        }


        return message;
    }


    /* =====================================================
       AUTH STATE ACCESS
       ===================================================== */

    function getAuthState() {

        return {

            initialized:
                AUTH_STATE.initialized,

            loading:
                AUTH_STATE.loading,

            authenticated:
                AUTH_STATE.authenticated,

            session:
                AUTH_STATE.session,

            user:
                AUTH_STATE.user
        };
    }


    function isAuthenticated() {

        return AUTH_STATE.authenticated;
    }


    /* =====================================================
       SUPABASE CLIENT ACCESS
       ===================================================== */

    function getClient() {

        return supabaseClient;
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CHEMLAB_AUTH = {

        initialize,

        signUp,

        signIn,

        signOut,

        getSession,

        getCurrentUser,

        resetPassword,

        getAuthState,

        isAuthenticated,

        getClient,

        isConfigured,

        getReadableAuthError
    };


})();
