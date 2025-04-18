<template>
    <div></div>
</template>

<script setup>
definePageMeta({
    async middleware() {
        await useAuthStore().logout();

        // Clear sessionid from cookie
        const sessionId = useCookie("sessionid");
        sessionId.value = null;

        // Redirect to the login page
        return navigateTo("/login");
    },
});
</script>
