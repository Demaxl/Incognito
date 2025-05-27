export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client side
    if (!import.meta.client) return;

    // If the user is not authenticated and trying to access protected page, redirect to login
    if (!(await useAuthStore().hasSession())) {
        return navigateTo("/login");
    }
});
