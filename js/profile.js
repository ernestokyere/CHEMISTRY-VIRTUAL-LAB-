/* =========================================================
   CHEMLAB
   STUDENT PROFILE ENGINE
   STAGE 3.3
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       STATE
       ===================================================== */

    const PROFILE_STATE = {

        loading: false,

        profile: null
    };


    /* =====================================================
       HELPERS
       ===================================================== */

    function getClient() {

        if (
            !window.CHEMLAB_AUTH ||
            typeof window.CHEMLAB_AUTH.getClient !==
            "function"
        ) {

            throw new Error(
                "ChemLab authentication engine is unavailable."
            );
        }


        const client =
            window.CHEMLAB_AUTH.getClient();


        if (!client) {

            throw new Error(
                "Supabase authentication has not been initialized."
            );
        }


        return client;
    }


    function getProfileTable() {

        return (
            window.CHEMLAB_CONFIG
                ?.supabase
                ?.tables
                ?.profiles ||
            "profiles"
        );
    }


    function getCurrentUser() {

        return (
            window.CHEMLAB_AUTH &&
            typeof window.CHEMLAB_AUTH.getAuthState ===
            "function"
        )
            ? window.CHEMLAB_AUTH
                .getAuthState()
                .user
            : null;
    }


    /* =====================================================
       LOAD PROFILE
       ===================================================== */

    async function loadProfile() {

        const user =
            getCurrentUser();


        if (!user) {

            PROFILE_STATE.profile =
                null;

            return null;
        }


        PROFILE_STATE.loading =
            true;


        try {

            const client =
                getClient();


            const {
                data,
                error
            } =
                await client
                    .from(
                        getProfileTable()
                    )
                    .select(
                        "*"
                    )
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();


            if (error) {

                throw error;
            }


            PROFILE_STATE.profile =
                data || null;


            if (data) {

                try {

                    localStorage.setItem(
                        "chemlab_student_profile",
                        JSON.stringify(data)
                    );

                } catch (storageError) {

                    console.warn(
                        "[ChemLab] Unable to cache profile.",
                        storageError
                    );
                }
            }


            window.dispatchEvent(
                new CustomEvent(
                    "chemlab:profile-loaded",
                    {
                        detail: {
                            profile:
                                PROFILE_STATE.profile
                        }
                    }
                )
            );


            return PROFILE_STATE.profile;

        } finally {

            PROFILE_STATE.loading =
                false;
        }
    }


    /* =====================================================
       CREATE PROFILE
       ===================================================== */

    async function createProfile(
        profileData = {}
    ) {

        const user =
            getCurrentUser();


        if (!user) {

            throw new Error(
                "You must be signed in to create a profile."
            );
        }


        const client =
            getClient();


        const payload = {

            id:
                user.id,

            full_name:
                String(
                    profileData.full_name ||
                    user.user_metadata?.full_name ||
                    ""
                ).trim(),

            academic_level:
                profileData.academic_level ||
                user.user_metadata?.academic_level ||
                null,

            institution:
                String(
                    profileData.institution ||
                    user.user_metadata?.institution ||
                    ""
                ).trim(),

            avatar_url:
                profileData.avatar_url ||
                null
        };


        const {
            data,
            error
        } =
            await client
                .from(
                    getProfileTable()
                )
                .upsert(
                    payload,
                    {
                        onConflict:
                            "id"
                    }
                )
                .select()
                .single();


        if (error) {

            throw error;
        }


        PROFILE_STATE.profile =
            data;


        return data;
    }


    /* =====================================================
       UPDATE PROFILE
       ===================================================== */

    async function updateProfile(
        updates = {}
    ) {

        const user =
            getCurrentUser();


        if (!user) {

            throw new Error(
                "You must be signed in to update your profile."
            );
        }


        const allowedFields = [

            "full_name",

            "academic_level",

            "institution",

            "avatar_url"
        ];


        const payload = {};


        allowedFields.forEach(
            field => {

                if (
                    Object.prototype
                        .hasOwnProperty
                        .call(
                            updates,
                            field
                        )
                ) {

                    payload[field] =
                        updates[field];
                }
            }
        );


        if (
            Object.keys(payload).length === 0
        ) {

            throw new Error(
                "No profile changes were provided."
            );
        }


        const client =
            getClient();


        const {
            data,
            error
        } =
            await client
                .from(
                    getProfileTable()
                )
                .update(
                    payload
                )
                .eq(
                    "id",
                    user.id
                )
                .select()
                .single();


        if (error) {

            throw error;
        }


        PROFILE_STATE.profile =
            data;


        try {

            localStorage.setItem(
                "chemlab_student_profile",
                JSON.stringify(data)
            );

        } catch (storageError) {

            console.warn(
                "[ChemLab] Unable to cache updated profile.",
                storageError
            );
        }


        window.dispatchEvent(
            new CustomEvent(
                "chemlab:profile-updated",
                {
                    detail: {
                        profile:
                            data
                    }
                }
            )
        );


        return data;
    }


    /* =====================================================
       PROFILE ACCESS
       ===================================================== */

    function getProfile() {

        return PROFILE_STATE.profile;
    }


    function isLoaded() {

        return Boolean(
            PROFILE_STATE.profile
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CHEMLAB_PROFILE = {

        loadProfile,

        createProfile,

        updateProfile,

        getProfile,

        isLoaded
    };


})();
