import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    // Create axios instance without CSRF token initially
    const axiosInstance = axios.create({
        baseURL: config.public.backendURL,
        withCredentials: true,
    });

    // Add request interceptor to include CSRF token on each request
    axiosInstance.interceptors.request.use(async (config) => {
        // If the request is a POST, PUT, or DELETE, include the CSRF token in the headers
        if (["post", "put", "delete"].includes(config.method)) {
            // Get the latest CSRF token value from cookie
            let csrfToken = useCookie("csrftoken").value;

            // If no CSRF token is found, get it from the store
            if (!csrfToken) {
                csrfToken = await useAuthStore().getCsrfToken();
            }

            config.headers["X-CSRFToken"] = csrfToken;
        }
        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            // Handle common errors (401, 403, 500, etc.)
            if (error.response?.status === 401) {
                if (error.config.url !== "/_allauth/browser/v1/auth/session") {
                    useAuthStore().logout();
                }
            }
            if (error.response?.status === 403 && !error.config._retry) {
                // Might be a CSRF token issue, clear the CSRF token
                // so the request interceptor will get a new one
                useAuthStore().clearCsrfToken();
                // Mark as retry attempt
                error.config._retry = true;
                // retry
                return axiosInstance.request(error.config);
            }
            return Promise.reject(error);
        }
    );

    return {
        provide: {
            axios: axiosInstance,
        },
    };
});
