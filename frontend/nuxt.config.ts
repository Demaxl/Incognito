// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    ssr: false,
    modules: ["@nuxt/ui"],
    css: ["~/assets/css/main.css", "animate.css/animate.min.css"],
    vite: {
        plugins: [tailwindcss()]
    },
    ui: {
        colorMode: false
    },
    icon: {
        customCollections: [{
            prefix: 'custom',
            dir: './assets/icons'
        }]
    }
});