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

    return {
        provide: {
            axios: axiosInstance,
        },
    };
});
