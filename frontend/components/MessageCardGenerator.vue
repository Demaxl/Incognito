<template>
    <div
        ref="cardContainer"
        style="
            position: absolute;
            left: -99999px;
            top: 0;
            width: 1080px;
            height: 1920px;
        "
        class="rounded-lg bg-gradient-to-r relative py-[200px] to-primary-500 from-[rgb(0,255,143)] p-6 text-white flex flex-col"
    >
        <!-- <div
        ref="cardContainer"
        class="rounded-lg bg-gradient-to-r relative to-primary-500 from-[rgb(0,255,143)] p-6 text-white flex flex-col"
        style="width: 350px; height: 500px"
    > -->
        <!-- Visual effects -->
        <div class="absolute top-0 left-0 opacity-50">
            <LucideQuote />
        </div>
        <div class="absolute bottom-0 right-0 opacity-50 rotate-180">
            <LucideQuote />
        </div>
        <div
            class="absolute top-12 right-12 w-20 h-20 rounded-full bg-white/30"
        ></div>
        <div
            class="absolute bottom-12 left-12 w-32 h-32 rounded-full bg-white/30"
        ></div>

        <!-- Message -->
        <div class="flex-1 flex items-center p-4 justify-center">
            <p class="text-center text-6xl font-light leading-relaxed">
                {{ message.text }}
            </p>
        </div>
        <div class="mt-auto pt-6">
            <div class="w-[50%] h-1 bg-white/90 mx-auto mb-4"></div>
            <p class="text-center text-6xl font-light">@{{ username }}</p>
        </div>
        <div class="mt-40 flex flex-col items-center">
            <div
                class="mb-2 bg-white/30 rounded-full p-6 flex items-center justify-center"
            >
                <img
                    src="/images/logo_icon_colored.png"
                    alt="Incognito logo"
                    class="w-[200px] h-[200px]"
                />
            </div>
            <!-- <UIcon name="i-custom-logo-text" size="40px" class="text-white" /> -->
            <p class="text-5xl font-bold tracking-wider">#INCOGNITO</p>
            <!-- <UIcon name="i-custom-logo" size="40" /> -->
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import html2canvas from "html2canvas-pro";

const props = defineProps({
    message: {
        type: Object,
        required: true,
    },
});

const username = useAuthStore().userData.username;
const emit = defineEmits(["generated"]);
const cardContainer = useTemplateRef("cardContainer");

onMounted(() => {
    if (cardContainer.value) {
        html2canvas(cardContainer.value, {
            scale: 1,
            width: 1080,
            height: 1920,
            useCORS: true,
            // logging: false,
        }).then((canvas) => {
            const dataUrl = canvas.toDataURL("image/png");
            emit("generated", dataUrl);
        });
    }
});
</script>
