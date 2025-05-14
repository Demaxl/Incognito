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
                                        style="
                                            width: auto;
                                            height: 400px;
                                            cursor: zoom-in;
                                        "
                                        :src="sanitizeUrl(generatedImage)"
                                        :alt="sanitizeText('Generated Message')"
                                        @click="showImagePreview = true"
                                    />
                                    <Teleport to="body">
                                        <ImagePreview
                                            v-model="showImagePreview"
                                            :src="sanitizeUrl(generatedImage)"
                                            :alt="
                                                sanitizeText(
                                                    'Generated Message'
                                                )
                                            "
                                        />
                                    </Teleport>
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

                                <div class="space-y-4">
                                    <UButton
                                        label="Share Message"
                                        icon="material-symbols:share-outline"
                                        class="w-full gap-2 flex justify-center py-3 cursor-pointer"
                                        @click="
                                            () =>
                                                shareToSocialMedia(
                                                    'more',
                                                    message.id
                                                )
                                        "
                                        :disabled="isGenerating"
                                    >
                                    </UButton>
                                    <UButton
                                        variant="soft"
                                        color="neutral"
                                        label="Download Image"
                                        icon="i-heroicons-arrow-down-tray"
                                        class="w-full gap-2 flex justify-center py-3 cursor-pointer"
                                        @click="() => downloadImage(message.id)"
                                        :disabled="isGenerating"
                                    >
                                    </UButton>
                                </div>
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
import { sanitizeUrl, sanitizeText } from "~/utils/sanitize";

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
const showImagePreview = ref(false);

// Sanitize message content
const sanitizedMessages = computed(() => {
    return props.messages.map((message) => ({
        ...message,
        text: sanitizeText(message.text),
        content: sanitizeUrl(message.content),
    }));
});

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

const { shareViaWebShare } = useShare();

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
    const message = sanitizedMessages.value.find((m) => m.id === messageId);
    const imageUrl = generatedImages.value[messageId];
    const shareText = `Check out this anonymous message on Incognito: ${message.text}`;

    // Use Web Share API for most platforms
    shareViaWebShare({
        title: "Incognito Message",
        text: shareText,
        file: imageUrl,
    });
};
</script>
