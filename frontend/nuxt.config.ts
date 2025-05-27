// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    ssr: process.env.NODE_ENV === "production", // Enable SSR only in production
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
            backendURL: "http://localhost:8000",
            siteDomain: "http://localhost:3000",
        },
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
    nitro: {
        prerender: {
            routes: ["/", "/how-it-works"],
            ignore: ["/dashboard", "/logout"],
        },
    },
});
