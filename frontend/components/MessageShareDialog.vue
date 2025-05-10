<template>
    <UModal>
        <template #content>
            <UCard :ui="{ root: 'divide-none' }">
                <template #header>
                    <div class="space-y-1">
                        <h3 class="text-base font-semibold leading-6">
                            Share Messages
                        </h3>
                        <p class="text-sm text-gray-500">
                            {{
                                messages.length > 1
                                    ? "Share these messages on your social media or download them."
                                    : "Share this message on your social media or download it."
                            }}
                        </p>
                    </div>
                </template>
                <UTabs :items="tabs">
                    <template #preview>
                        <!-- Preview Tab Content -->
                        <div class="space-y-4">
                            <div
                                v-if="messages.length > 1"
                                class="flex justify-end mb-2"
                            >
                                <UButton
                                    variant="outline"
                                    size="sm"
                                    @click="toggleView"
                                    class="gap-1"
                                >
                                    {{
                                        showCollage
                                            ? "View Individual"
                                            : "View as Collage"
                                    }}
                                </UButton>
                            </div>
                            <div class="flex flex-col items-center gap-6">
                                <div v-if="showCollage" class="relative">
                                    <!-- <MessageCollageGenerator
                                        :messages="messages"
                                        :username="username"
                                        @generated="handleCollageGenerated"
                                    /> -->
                                    <div
                                        v-if="isGenerating"
                                        class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
                                    >
                                        <UIcon
                                            name="i-heroicons-arrow-path"
                                            class="animate-spin h-8 w-8 text-primary"
                                        />
                                    </div>
                                </div>
                                <div
                                    v-else
                                    v-for="message in messages"
                                    :key="message.id"
                                    class="relative"
                                >
                                    <!-- <MessageCardGenerator
                                        :message="message"
                                        :username="username"
                                        @generated="
                                            (dataUrl) =>
                                                handleImageGenerated(
                                                    message.id,
                                                    dataUrl
                                                )
                                        "
                                    /> -->
                                    <div
                                        v-if="isGenerating"
                                        class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
                                    >
                                        <UIcon
                                            name="i-heroicons-arrow-path"
                                            class="animate-spin h-8 w-8 text-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #share>
                        <!-- Share Tab Content -->
                        <div class="space-y-6 mt-4">
                            <div
                                v-if="showCollage"
                                class="border rounded-lg p-4"
                            >
                                <h3 class="font-medium mb-3">
                                    Message Collage
                                </h3>
                                <div class="grid grid-cols-4 gap-3 mb-4">
                                    <UButton
                                        variant="outline"
                                        class="flex flex-col items-center justify-center gap-1 p-3 h-auto"
                                        @click="shareToSocialMedia('twitter')"
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
                                        @click="shareToSocialMedia('facebook')"
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
                                        @click="shareToSocialMedia('instagram')"
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
                                        @click="shareToSocialMedia('whatsapp')"
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
                                    variant="secondary"
                                    class="w-full gap-2"
                                    @click="downloadCollage"
                                    :disabled="isGenerating"
                                >
                                    <UIcon
                                        name="i-heroicons-arrow-down-tray"
                                        class="h-4 w-4"
                                    />
                                    Download Collage
                                </UButton>
                            </div>
                            <div
                                v-else
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
                            v-if="messages.length > 1 && !showCollage"
                            variant="outline"
                            class="gap-2"
                            @click="toggleView"
                            :disabled="isGenerating"
                        >
                            <UIcon name="i-heroicons-share" class="h-4 w-4" />
                            Share as Collage
                        </UButton>
                        <UButton type="button" variant="secondary">
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
    username: {
        type: String,
        required: true,
    },
});

const generatedImages = ref({});
const collageImage = ref(null);
const isGenerating = ref(true);
const showCollage = ref(false);

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

const handleCollageGenerated = (dataUrl) => {
    collageImage.value = dataUrl;
    isGenerating.value = false;
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

const downloadCollage = () => {
    if (!collageImage.value) return;

    const link = document.createElement("a");
    link.href = collageImage.value;
    link.download = `incognito-messages-collage.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    useToast().add({
        title: "Collage downloaded",
        description: "Your message collage has been saved to your device.",
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
            if (messageId) {
                downloadImage(messageId);
            } else {
                downloadCollage();
            }
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
            if (messageId) {
                downloadImage(messageId);
            } else {
                downloadCollage();
            }
            return;
    }

    if (shareUrl) {
        window.open(shareUrl, "_blank");
    }
};

const toggleView = () => {
    if (props.messages.length <= 1) return;
    showCollage.value = !showCollage.value;
    isGenerating.value = true;
    // Reset after a short delay to simulate generation
    setTimeout(() => {
        isGenerating.value = false;
    }, 500);
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
