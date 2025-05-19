// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    ssr: false,
    modules: [
        "@nuxt/ui",
        "@pinia/nuxt",
        "pinia-plugin-persistedstate/nuxt",
        "@vee-validate/nuxt",
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
});
