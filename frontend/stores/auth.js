export const useAuthStore = defineStore(
    "auth",
    () => {
        const { $axios } = useNuxtApp();
        /*
            State properties
        */
        const userData = ref(null);
        const csrfToken = ref(null);

        async function getCsrfToken() {
            try {
                if (csrfToken.value) {
                    return csrfToken.value;
                }
                const response = await $axios.get("/accounts/set-csrf-cookie", {
                    withCredentials: true,
                });
                csrfToken.value = response.data.csrfToken;
                return csrfToken.value;
            } catch (error) {
                clearCsrfToken();
                return null;
            }
        }

        function clearCsrfToken() {
            csrfToken.value = null;
            useCookie("csrftoken").value = null;
        }

        async function hasSession() {
            try {
                const response = await $axios.get(
                    "/_allauth/browser/v1/auth/session"
                );
                // If the request succeeds, update the user data
                userData.value = response.data.data.user;
                return true;
            } catch (error) {
                userData.value = null;
                return false;
            }
        }

        async function login(username, password) {
            try {
                const response = await $axios.post(
                    "/_allauth/browser/v1/auth/login",
                    {
                        username,
                        password,
                    }
                );
                userData.value = response.data.data.user;

                return response;
            } catch (error) {
                return error.response;
            }
        }
        async function logout() {
            try {
                await $axios.delete("/_allauth/browser/v1/auth/session");
            } catch (error) {
            } finally {
                userData.value = null;
            }
        }
        async function signup(username, email, password) {
            try {
                const response = await $axios.post(
                    "/_allauth/browser/v1/auth/signup",
                    {
                        username,
                        email,
                        password,
                    }
                );
                userData.value = response.data.data.user;
                return response;
            } catch (error) {
                return error.response;
            }
        }
        function isAuthenticated() {
            return userData.value !== null;
        }

        return {
            login,
            logout,
            signup,
            hasSession,
            userData,
            csrfToken,
            isAuthenticated,
            getCsrfToken,
            clearCsrfToken,
        };
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.localStorage(),
        },
    }
);
