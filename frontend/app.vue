<template>
    <UApp>
        <!-- Adds a loading indicator between page transitions -->
        <NuxtLoadingIndicator />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>

<script setup>
// Default SEO metadata
useSeoMeta({
    titleTemplate: "%s | Incognito",
    description:
        "Create your personal inbox, share your link, and receive anonymous messages from anyone.",
    ogTitle: "Incognito - Anonymous Messaging Made Simple",
    ogDescription:
        "Create your personal inbox, share your link, and receive anonymous messages from anyone.",
    ogType: "website",
    ogImage: "/images/og-image.png",
    twitterCard: "summary_large_image",
    twitterSite: "@incognito",
    twitterCreator: "@incognito",
    robots: "index, follow",
    canonical: useRuntimeConfig().public.siteDomain,
});
</script>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>
