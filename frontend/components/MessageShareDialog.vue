<template>
    <UModal class="overflow-y-scroll">
        <template #content>
            <UCard :ui="{ root: 'divide-none' }">
                <template #header>
                    <div class="space-y-1">
                        <h3 class="text-base font-semibold leading-6">
                            Share Messages
                        </h3>
                        <p class="text-sm text-gray-500">
                            Share this message on your social media or download
                            it.
                        </p>
                    </div>
                </template>
                <UTabs
                    :items="tabs"
                    :ui="{
                        trigger: 'cursor-pointer',
                    }"
                >
                    <template #preview>
                        <!-- Preview Tab Content -->
                        <div class="space-y-4 mt-2 relative h-max">
                            <div
                                v-if="Object.keys(generatedImages).length === 0"
                                class="flex flex-col items-center gap-6"
                            >
                                <div
                                    v-for="message in messages"
                                    :key="message.id"
                                >
                                    <MessageCardGenerator
                                        :message="message"
                                        @generated="
                                            (dataUrl) =>
                                                handleImageGenerated(
                                                    message.id,
                                                    dataUrl
                                                )
                                        "
                                    />
                                    <div
                                        v-if="isGenerating"
                                        class="w-full flex items-center justify-center"
                                    >
                                        <UIcon
                                            name="i-heroicons-arrow-path"
                                            class="animate-spin h-8 w-8 text-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- <div v-else> -->
                            <TransitionGroup
                                enter-active-class="animate__animated animate__zoomIn animate__faster"
                                leave-active-class="animate__animated animate__zoomOut animate__faster"
                            >
                                <div
                                    v-for="generatedImage in Object.values(
                                        generatedImages
                                    )"
                                    :key="generatedImage"
                                    class="flex justify-center"
                                >
                                    <img
                                        style="width: auto; height: 400px"
                                        :src="generatedImage"
                                        alt="Generated Message"
                                    />
                                </div>
                            </TransitionGroup>
                            <!-- </div> -->
                        </div>
                    </template>
                    <template #share>
                        <!-- Share Tab Content -->
                        <div class="space-y-6 mt-4">
                            <div
                                v-for="message in messages"
                                :key="message.id"
                                class="border border-gray-300 rounded-lg p-4"
                            >
                                <h3 class="font-medium mb-3 truncate">
                                    {{ message.text }}
                                </h3>
                                <div class="grid grid-cols-4 gap-3 mb-4">
                                    <UButton
                                        variant="outline"
                                        class="flex flex-col items-center justify-center gap-1 p-3 h-auto"
                                        @click="
                                            shareToSocialMedia(
                                                'twitter',
                                                message.id
                                            )
                                        "
                                        :disabled="isGenerating"
                                    >
                                        <UIcon
                                            name="i-simple-icons-twitter"
                                            class="h-5 w-5 text-[#1DA1F2]"
                                        />
                                        <span class="text-xs">Twitter</span>
                                    </UButton>
                                    <UButton
                                        variant="outline"
                                        class="flex flex-col items-center justify-center gap-1 p-3 h-auto"
                                        @click="
                                            shareToSocialMedia(
                                                'facebook',
                                                message.id
                                            )
                                        "
                                        :disabled="isGenerating"
                                    >
                                        <UIcon
                                            name="i-simple-icons-facebook"
                                            class="h-5 w-5 text-[#1877F2]"
                                        />
                                        <span class="text-xs">Facebook</span>
                                    </UButton>
                                    <UButton
                                        variant="outline"
                                        class="flex flex-col items-center justify-center gap-1 p-3 h-auto"
                                        @click="
                                            shareToSocialMedia(
                                                'instagram',
                                                message.id
                                            )
                                        "
                                        :disabled="isGenerating"
                                    >
                                        <UIcon
                                            name="i-simple-icons-instagram"
                                            class="h-5 w-5 text-[#E4405F]"
                                        />
                                        <span class="text-xs">Instagram</span>
                                    </UButton>
                                    <UButton
                                        variant="outline"
                                        class="flex flex-col items-center justify-center gap-1 p-3 h-auto"
                                        @click="
                                            shareToSocialMedia(
                                                'whatsapp',
                                                message.id
                                            )
                                        "
                                        :disabled="isGenerating"
                                    >
                                        <UIcon
                                            name="i-simple-icons-whatsapp"
                                            class="h-5 w-5 text-[#25D366]"
                                        />
                                        <span class="text-xs">WhatsApp</span>
                                    </UButton>
                                </div>
                                <UButton
                                    variant="soft"
                                    color="neutral"
                                    label="Download Image"
                                    icon="i-heroicons-arrow-down-tray"
                                    class="w-full gap-2 flex justify-center py-3"
                                    @click="() => downloadImage(message.id)"
                                    :disabled="isGenerating"
                                >
                                </UButton>
                            </div>
                        </div>
                    </template>
                </UTabs>
                <template #footer>
                    <div class="flex flex-col sm:flex-row gap-2">
                        <UButton
                            type="button"
                            variant="outline"
                            class="cursor-pointer"
                            @click="emit('close')"
                        >
                            Close
                        </UButton>
                    </div>
                </template>
            </UCard>
        </template>
    </UModal>
</template>

<script setup>
const props = defineProps({
    messages: {
        type: Array,
    },
});

const emit = defineEmits(["close"]);
const username = useAuthStore().userData.username;

// Stores generated image data URLs by message ID
const generatedImages = ref({});
const isGenerating = ref(true);

// Tabs configuration for UTabs
const tabs = [
    {
        label: "Preview",
        slot: "preview",
        value: "preview",
    },
    {
        label: "Share",
        slot: "share",
        value: "share",
    },
];

const handleImageGenerated = (messageId, dataUrl) => {
    generatedImages.value = { ...generatedImages.value, [messageId]: dataUrl };
    if (Object.keys(generatedImages.value).length >= props.messages.length) {
        isGenerating.value = false;
    }
};

const downloadImage = (messageId) => {
    const dataUrl = generatedImages.value[messageId];
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `incognito-message-${messageId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    useToast().add({
        title: "Image downloaded",
        description: "Your message card has been saved to your device.",
    });
};

const shareToSocialMedia = (platform, messageId) => {
    // In a real implementation, we would upload the image to a server
    // and get a shareable URL, then open the appropriate sharing URL
    const mockShareableUrl = "https://incognito.app/shared/m123456";

    let shareUrl = "";
    const shareText =
        "Check out this anonymous message I received on Incognito!";

    switch (platform) {
        case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
            )}&url=${encodeURIComponent(mockShareableUrl)}`;
            break;
        case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                mockShareableUrl
            )}`;
            break;
        case "instagram":
            // Instagram doesn't have a web sharing API, so we'd typically
            // instruct the user to download and share manually
            useToast().add({
                title: "Instagram sharing",
                description:
                    "Download the image and share it on Instagram manually.",
            });
            downloadImage(messageId);
            return;
        case "whatsapp":
            shareUrl = `https://wa.me/?text=${encodeURIComponent(
                shareText + " " + mockShareableUrl
            )}`;
            break;
        case "telegram":
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
                mockShareableUrl
            )}&text=${encodeURIComponent(shareText)}`;
            break;
        case "snapchat":
            useToast().add({
                title: "Snapchat sharing",
                description:
                    "Download the image and share it on Snapchat manually.",
            });
            downloadImage(messageId);
            return;
    }

    if (shareUrl) {
        window.open(shareUrl, "_blank");
    }
};

// Reset generating status when modal opens
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            isGenerating.value = true;
            // Simulate generation completion after a delay
            setTimeout(() => {
                isGenerating.value = false;
            }, 1000);
        }
    }
);
</script>
