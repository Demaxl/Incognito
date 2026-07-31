// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    // ssr: process.env.NODE_ENV === "production", // Enable SSR only in production
    modules: [
        "@nuxt/ui",
        "@pinia/nuxt",
        "pinia-plugin-persistedstate/nuxt",
        "@vee-validate/nuxt",
        "@nuxtjs/seo",
    ],
    css: ["~/assets/css/main.css", "animate.css/animate.min.css"],
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            // ffmpeg.wasm should not be pre-bundled by Vite
            exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
        },
    },

    ui: {
        colorMode: false,
    },
    // Configure @nuxt/fonts module to download the font files for Fredoka
    // with the appropriate weights
    fonts: {
        families: [
            {
                name: "Fredoka",
                weights: [400, 500, 600, 700, 800, 900],
            },
        ],
    },
    icon: {
        customCollections: [
            {
                prefix: "custom",
                dir: "./assets/icons",
            },
        ],
    },
    runtimeConfig: {
        public: {
            // Overridden in production via NUXT_PUBLIC_BACKEND_URL / NUXT_PUBLIC_SITE_DOMAIN
            backendURL: "http://localhost:8000",
            // Full site origin used for share links and SEO (e.g. https://incgt.link)
            siteDomain: "http://localhost:3000",
        },
    },
    // Production site URL for @nuxtjs/seo (set NUXT_SITE_URL on Vercel)
    site: {
        url: process.env.NUXT_SITE_URL || "http://localhost:3000",
        name: "Incognito",
    },
    app: {
        head: {
            title: "Get honest thoughts. Anonymously.",
            meta: [
                { name: "format-detection", content: "telephone=no" },
                { name: "theme-color", content: "#46a6f8" },
            ],
            link: [
                {
                    rel: "icon",
                    type: "image/png",
                    href: "/images/logo_icon_colored.png",
                },
            ],
        },
    },
    routeRules: {
        // Static pages
        "/": { prerender: true },
        "/how-it-works": { prerender: true },
        // Dynamic username route - will be server rendered
        "/@*": { ssr: true },
        // Admin routes - client side only
        "/dashboard": { ssr: false },
        "/logout": { ssr: false },
    },
});
