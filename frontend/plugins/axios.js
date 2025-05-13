import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    // Create axios instance without CSRF token initially
    const axiosInstance = axios.create({
        baseURL: config.public.backendURL,
        withCredentials: true,
    });

    // Add request interceptor to include CSRF token on each request
    axiosInstance.interceptors.request.use((config) => {
        // Get the latest CSRF token value before each request
        const token = useCookie("csrftoken").value;
        if (token) {
            config.headers["X-CSRFToken"] = token;
        }
        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Handle common errors (401, 403, 500, etc.)
            if (error.response?.status === 401) {
                if (error.config.url !== "/_allauth/browser/v1/auth/session") {
                    useAuthStore().logout();
                }
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
