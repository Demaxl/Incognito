export default defineNuxtRouteMiddleware(async (to, from) => {
  // If the user is authenticated and trying to access login page, redirect to dashboard
  if (await useAuthStore().hasSession()) {
    return navigateTo("/dashboard");
  }
});
