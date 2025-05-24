<template>
    <div
        ref="cardContainer"
        style="
            position: absolute;
            left: -99999px;
            top: 0;
            width: 1080px;
            height: 1920px;
            overflow: hidden;
        "
        class="rounded-lg bg-gradient-to-r relative py-[200px] to-primary-500 from-[rgb(0,255,143)] text-white flex flex-col"
    >
        <!-- <div
        ref="cardContainer"
        class="rounded-lg bg-gradient-to-r relative to-primary-500 from-[rgb(0,255,143)] p-6 text-white flex flex-col"
        style="width: 350px; height: 500px"
    > -->
        <!-- Visual effects -->
        <div class="absolute top-0 left-0 opacity-50">
            <IconLucideQuote />
        </div>
        <div class="absolute bottom-0 right-0 opacity-50 rotate-180">
            <IconLucideQuote />
        </div>
        <div
            class="absolute top-12 right-12 w-20 h-20 rounded-full bg-white/30"
        ></div>
        <div
            class="absolute bottom-12 left-12 w-32 h-32 rounded-full bg-white/30"
        ></div>

        <!-- Message Content -->
        <div class="flex-1 flex flex-col items-center p-6 justify-center">
            <!-- Text Message -->
            <p
                v-if="message.message_type === 'text'"
                class="text-center text-6xl font-light leading-relaxed"
            >
                {{ message.text }}
            </p>

            <!-- Image Message -->
            <div
                v-else-if="message.message_type === 'image'"
                class="flex flex-col items-center gap-4"
            >
                <p
                    v-if="message.text"
                    class="text-center text-4xl font-light leading-relaxed"
                >
                    {{ message.text }}
                </p>
                <div class="relative w-[800px] h-[800px] bg-transparent">
                    <img
                        :src="message.content"
                        :alt="message.text || 'Image message'"
                        :data-message-id="message.id"
                        class="w-full h-full object-contain rounded-lg"
                        @load="onImageLoad"
                        ref="messageImage"
                    />
                </div>
            </div>

            <!-- Video Message -->
            <div
                v-else-if="message.message_type === 'video'"
                class="flex flex-col items-center gap-4"
            >
                <p
                    v-if="message.text"
                    class="text-center text-4xl font-light leading-relaxed"
                >
                    {{ message.text }}
                </p>
                <div
                    v-else
                    class="text-center text-4xl font-light leading-relaxed"
                >
                    Video Message
                </div>
                <div
                    class="relative w-[800px] h-[400px] bg-transparent flex items-center justify-center"
                >
                    <!-- Video thumbnail with play button overlay -->
                    <div
                        class="w-full h-full flex items-center justify-center rounded-lg"
                    >
                        <IconLucideVideo class="h-32 w-32 fill-white" />
                    </div>
                </div>
            </div>

            <!-- Audio Message -->
            <div
                v-else-if="message.message_type === 'audio'"
                class="flex flex-col items-center gap-4"
            >
                <p
                    v-if="message.text"
                    class="text-center text-4xl font-light leading-relaxed"
                >
                    {{ message.text }}
                </p>
                <div
                    v-else
                    class="text-center text-4xl font-light leading-relaxed"
                >
                    Audio Message
                </div>
                <div
                    class="relative w-[800px] h-[200px] bg-transparent flex items-center justify-center"
                >
                    <div
                        class="w-full h-full flex items-center justify-center rounded-lg"
                    >
                        <IconLucideAudio class="h-32 w-32 fill-white" />
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-auto pt-6">
            <div class="w-[50%] h-1 bg-white/90 mx-auto mb-4"></div>
            <p class="text-center opacity-90 text-5xl font-light">
                @{{ username }}
            </p>
        </div>
        <div class="mt-32 flex flex-col items-center">
            <div class="mb-2 rounded-full p-6 flex items-center justify-center">
                <img
                    src="/images/logo_icon_colored.png"
                    alt="Incognito logo"
                    class="w-[100px] h-[100px]"
                />
            </div>
            <!-- <UIcon name="i-custom-logo-text" size="40px" class="text-white" /> -->
            <p class="text-4xl font-bold tracking-wider">#INCOGNITO</p>
            <!-- <UIcon name="i-custom-logo" size="40" /> -->
        </div>
    </div>
</template>

<script setup>
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
const messageImage = useTemplateRef("messageImage");
const imageLoaded = ref(false);

// Function to handle image load
const onImageLoad = () => {
    imageLoaded.value = true;
    generateImage();
};

// Function to generate the image
const generateImage = () => {
    if (!cardContainer.value) return;

    // For image messages, wait for the image to load
    if (props.message.message_type === "image" && !imageLoaded.value) {
        return;
    }

    html2canvas(cardContainer.value, {
        scale: 1,
        width: 1070,
        height: 1905,
        useCORS: true,
        backgroundColor: null,
        windowWidth: 1070,
        windowHeight: 1905,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
            // Ensure the cloned document has the image loaded
            const clonedImage = clonedDoc.querySelector(
                `img[data-message-id="${props.message.id}"]`
            );
            if (clonedImage) {
                clonedImage.crossOrigin = "anonymous";
            }

            // Ensure the gradient fills the entire cloned container
            const clonedContainer = clonedDoc.querySelector(
                '[ref="cardContainer"]'
            );
            if (clonedContainer) {
                clonedContainer.style.width = "1080px";
                clonedContainer.style.height = "1920px";
                clonedContainer.style.overflow = "hidden";
                clonedContainer.style.padding = "0";
            }
        },
    }).then((canvas) => {
        const dataUrl = canvas.toDataURL("image/png");
        emit("generated", dataUrl);
    });
};

onMounted(() => {
    // For text messages, generate immediately
    if (["text", "video", "audio"].includes(props.message.message_type)) {
        generateImage();
    }
    // For image messages, wait for onImageLoad
});
</script>
