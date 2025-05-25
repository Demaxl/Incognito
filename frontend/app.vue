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
const siteDomain = useRuntimeConfig().public.siteDomain;

// Default SEO metadata
useSeoMeta({
    // Basic Meta Tags
    titleTemplate: "%s | Incognito",
    description:
        "Create your personal inbox, share your link, and receive anonymous messages from anyone.",
    applicationName: "Incognito",
    author: "Incognito",
    generator: "Nuxt",
    keywords:
        "anonymous messaging, anonymous inbox, anonymous chat, secret messages, private messaging",
    referrer: "origin-when-cross-origin",
    colorScheme: "light dark",
    formatDetection: {
        telephone: false,
        date: false,
        address: false,
        email: false,
        url: false,
    },

    // Open Graph / Facebook
    ogTitle: "Incognito - Anonymous Messaging Made Simple",
    ogDescription:
        "Create your personal inbox, share your link, and receive anonymous messages from anyone.",
    ogType: "website",
    ogUrl: siteDomain,
    ogImage: `https://${siteDomain}/images/og-image.png`,
    ogImageWidth: "1200",
    ogImageHeight: "630",
    ogImageAlt: "Incognito - Anonymous Messaging Platform",
    ogSiteName: "Incognito",
    ogLocale: "en_US",

    // Twitter
    twitterCard: "summary_large_image",
    twitterSite: "@incognito",
    twitterCreator: "@incognito",
    twitterTitle: "Incognito - Anonymous Messaging Made Simple",
    twitterDescription:
        "Create your personal inbox, share your link, and receive anonymous messages from anyone.",
    twitterImage: `https://${siteDomain}/images/og-image.png`,
    twitterImageAlt: "Incognito - Anonymous Messaging Platform",

    // WhatsApp
    ogImageSecureUrl: `https://${siteDomain}/images/og-image.png`,

    // Additional Meta Tags
    themeColor: "#46a6f8",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "default",
    appleMobileWebAppTitle: "Incognito",
    appleTouchIcon: `https://${siteDomain}/images/apple-touch-icon.png`,
    msapplicationTileColor: "#46a6f8",
    msapplicationTileImage: `https://${siteDomain}/images/mstile-144x144.png`,
    msapplicationConfig: `https://${siteDomain}/browserconfig.xml`,

    // Robots
    robots: "index, follow",
    googlebot: "index, follow",
    canonical: siteDomain,
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
