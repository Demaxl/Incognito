export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client side
    if (!import.meta.client) return;

    // If the user is authenticated and trying to access login page, redirect to dashboard
    if (await useAuthStore().hasSession()) {
        return navigateTo("/dashboard");
    }
});
