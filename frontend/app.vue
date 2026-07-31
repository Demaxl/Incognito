<template>
    <UApp>
        <Analytics />
        <SpeedInsights />
        <!-- Adds a loading indicator between page transitions -->
        <NuxtLoadingIndicator />
        <NuxtLayout>
            <NuxtPage />
            <Footer />
        </NuxtLayout>
    </UApp>
</template>

<script setup>
import { Analytics } from "@vercel/analytics/nuxt";
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

const siteDomain = useRuntimeConfig().public.siteDomain;

// Default SEO metadata
useSeoMeta({
    // Basic Meta Tags
    titleTemplate: "%s | Incognito",
    description:
        "Create your anonymous inbox, share your link, and receive text, images, audio, or video messages from anyone — all without revealing their identity.",
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
    ogTitle: "Get honest thoughts. Anonymously.",
    ogDescription:
        "Create your anonymous inbox, share your link, and receive text, images, audio, or video messages from anyone — all without revealing their identity.",
    ogType: "website",
    ogUrl: siteDomain,
    ogImage: `${siteDomain}/images/og-image.png`,
    ogImageWidth: "1200",
    ogImageHeight: "630",
    ogImageAlt: "Incognito - Anonymous Messaging Platform",
    ogSiteName: "Incognito",
    ogLocale: "en_US",

    // Twitter
    twitterCard: "summary_large_image",
    twitterSite: "@incognito",
    twitterCreator: "@incognito",
    twitterTitle: "Get honest thoughts. Anonymously.",
    twitterDescription:
        "Create your anonymous inbox, share your link, and receive text, images, audio, or video messages from anyone — all without revealing their identity.",
    twitterImage: `${siteDomain}/images/og-image.png`,
    twitterImageAlt: "Incognito - Anonymous Messaging Platform",

    // WhatsApp
    ogImageSecureUrl: `${siteDomain}/images/og-image.png`,

    // Additional Meta Tags
    themeColor: "#46a6f8",
    mobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "default",
    appleMobileWebAppTitle: "Incognito",
    appleTouchIcon: `${siteDomain}/images/apple-touch-icon.png`,
    msapplicationTileColor: "#46a6f8",
    msapplicationTileImage: `${siteDomain}/images/mstile-144x144.png`,
    msapplicationConfig: `${siteDomain}/browserconfig.xml`,

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
