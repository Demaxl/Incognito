<template>
    <div></div>
</template>

<script setup>
definePageMeta({
    middleware: [
        "auth",
        async () => {
            await useAuthStore().logout();

            // Clear sessionid from cookie
            const sessionId = useCookie("sessionid");
            sessionId.value = null;

            // Redirect to the login page
            return navigateTo("/login");
        },
    ],
});
</script>
