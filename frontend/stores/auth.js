export const useAuthStore = defineStore(
    "auth",
    () => {
        const { $axios } = useNuxtApp();
        /*
            State properties
        */
        const userData = ref(null);

        async function isAuthenticated() {
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
        async function signup(username, password) {
            try {
                const response = await $axios.post(
                    "/_allauth/browser/v1/auth/signup",
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

        return { login, logout, signup, isAuthenticated, userData };
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.localStorage(),
        },
    }
);
