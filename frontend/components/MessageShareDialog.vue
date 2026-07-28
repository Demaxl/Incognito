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
                <!-- Always mounted (outside tabs): Preview panel unmounts when
                     Share is active, which would block offscreen card capture. -->
                <div v-if="generatorMessage" aria-hidden="true">
                    <MessageCardGenerator
                        :key="generatorMessage.id"
                        :message="generatorMessage"
                        @generated="handleCardGenerated"
                    />
                </div>

                <UTabs
                    v-model="activeTab"
                    :items="tabs"
                    :ui="{
                        trigger: 'cursor-pointer',
                    }"
                >
                    <template #preview>
                        <div class="space-y-4 mt-2 relative h-max min-h-[280px]">
                            <div
                                v-if="isGenerating"
                                class="w-full flex flex-col items-center justify-center gap-3 py-10"
                            >
                                <UIcon
                                    name="i-heroicons-arrow-path"
                                    class="animate-spin h-8 w-8 text-primary"
                                />
                                <p class="text-sm text-gray-500 text-center">
                                    {{ generationStatus }}
                                </p>
                                <div
                                    v-if="isComposing"
                                    class="w-48 h-1.5 rounded-full bg-gray-200 overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-primary transition-all duration-200"
                                        :style="{ width: `${progress}%` }"
                                    />
                                </div>
                            </div>

                            <div
                                v-else-if="previewAssets.length === 0"
                                class="flex flex-col items-center justify-center gap-3 py-12 text-center"
                            >
                                <UIcon
                                    name="i-heroicons-photo"
                                    class="h-10 w-10 text-gray-300"
                                />
                                <p class="text-sm text-gray-500 max-w-xs">
                                    Your share card will appear here after you
                                    Share or Download a message.
                                </p>
                            </div>

                            <TransitionGroup
                                v-else
                                enter-active-class="animate__animated animate__zoomIn animate__faster"
                                leave-active-class="animate__animated animate__zoomOut animate__faster"
                            >
                                <div
                                    v-for="asset in previewAssets"
                                    :key="asset.messageId"
                                    class="flex justify-center"
                                >
                                    <video
                                        v-if="asset.type === 'video'"
                                        :src="sanitizeUrl(asset.url)"
                                        controls
                                        playsinline
                                        class="rounded-md"
                                        style="
                                            width: auto;
                                            height: 400px;
                                            max-width: 100%;
                                        "
                                    />
                                    <template v-else>
                                        <img
                                            style="
                                                width: auto;
                                                height: 400px;
                                                cursor: zoom-in;
                                            "
                                            :src="sanitizeUrl(asset.url)"
                                            :alt="
                                                sanitizeText(
                                                    'Generated Message'
                                                )
                                            "
                                            @click="
                                                openImagePreview(asset.url)
                                            "
                                        />
                                    </template>
                                </div>
                            </TransitionGroup>

                            <Teleport to="body">
                                <ImagePreview
                                    v-model="showImagePreview"
                                    :src="sanitizeUrl(previewImageUrl)"
                                    :alt="sanitizeText('Generated Message')"
                                />
                            </Teleport>
                        </div>
                    </template>
                    <template #share>
                        <div class="space-y-6 mt-4">
                            <div
                                v-for="message in messages"
                                :key="message.id"
                                class="border border-gray-300 rounded-lg p-4"
                            >
                                <h3 class="font-medium mb-3 truncate">
                                    {{ message.text || "Media message" }}
                                </h3>

                                <div class="space-y-4">
                                    <UButton
                                        label="Share Message"
                                        icon="material-symbols:share-outline"
                                        class="w-full gap-2 flex justify-center py-3 cursor-pointer"
                                        @click="() => shareMessage(message.id)"
                                        :loading="
                                            isGenerating &&
                                            generatingMessageId === message.id
                                        "
                                        :disabled="
                                            isGenerating || isDownloadingOriginal
                                        "
                                    />
                                    <UButton
                                        variant="soft"
                                        color="neutral"
                                        label="Download Share Card"
                                        icon="i-heroicons-arrow-down-tray"
                                        class="w-full gap-2 flex justify-center py-3 cursor-pointer"
                                        @click="() => downloadMessage(message)"
                                        :loading="
                                            isGenerating &&
                                            generatingMessageId === message.id
                                        "
                                        :disabled="
                                            isGenerating || isDownloadingOriginal
                                        "
                                    />
                                    <UButton
                                        v-if="
                                            ['video', 'audio'].includes(
                                                message.message_type
                                            )
                                        "
                                        variant="outline"
                                        color="neutral"
                                        :label="
                                            message.message_type === 'audio'
                                                ? 'Download Original Audio'
                                                : 'Download Original Video'
                                        "
                                        :icon="
                                            message.message_type === 'audio'
                                                ? 'i-heroicons-musical-note'
                                                : 'i-heroicons-film'
                                        "
                                        class="w-full gap-2 flex justify-center py-3 cursor-pointer"
                                        @click="
                                            () => downloadOriginalMedia(message)
                                        "
                                        :loading="
                                            isDownloadingOriginal &&
                                            downloadingOriginalId === message.id
                                        "
                                        :disabled="
                                            isGenerating || isDownloadingOriginal
                                        "
                                    />
                                    <p
                                        v-if="
                                            isGenerating &&
                                            generatingMessageId === message.id
                                        "
                                        class="text-xs text-primary text-center"
                                    >
                                        {{ generationStatus || "Preparing…" }}
                                        <template v-if="isComposing">
                                            ({{ progress }}%)
                                        </template>
                                    </p>
                                    <p
                                        v-else-if="
                                            ['video', 'audio'].includes(
                                                message.message_type
                                            )
                                        "
                                        class="text-xs text-gray-500 text-center"
                                    >
                                        Share Card creates a branded MP4 for
                                        Stories, Reels, or TikTok. Original
                                        downloads the raw
                                        {{ message.message_type }} file.
                                    </p>
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

/** @type {import('vue').Ref<Record<string|number, { type: 'image' | 'video', url: string, blob?: Blob }>>} */
const generatedAssets = ref({});
const isGenerating = ref(false);
const generatingMessageId = ref(null);
const isDownloadingOriginal = ref(false);
const downloadingOriginalId = ref(null);
const showImagePreview = ref(false);
const previewImageUrl = ref("");
const generationStatus = ref("");
const generatorMessage = ref(null);
const activeTab = ref("share");

/** @type {{ resolve: Function, reject: Function, messageId: string|number } | null} */
let pendingCardRequest = null;

const { shareViaWebShare, downloadFile } = useShare();
const {
    progress,
    isComposing,
    statusMessage,
    composeShareVideo,
    cancelCompose,
    isAbortError,
} = useFFmpegShareCard();

/** Set when the dialog unmounts so in-flight encodes don't update state. */
const isCancelled = ref(false);

const sanitizedMessages = computed(() => {
    return props.messages.map((message) => ({
        ...message,
        text: sanitizeText(message.text),
        content: sanitizeUrl(message.content),
    }));
});

const previewAssets = computed(() =>
    Object.entries(generatedAssets.value).map(([messageId, asset]) => ({
        messageId,
        ...asset,
    }))
);

watch(statusMessage, (value) => {
    if (isComposing.value && value) {
        generationStatus.value = value;
    }
});

const tabs = [
    {
        label: "Share",
        slot: "share",
        value: "share",
    },
    {
        label: "Preview",
        slot: "preview",
        value: "preview",
    },
];

const openImagePreview = (url) => {
    previewImageUrl.value = url;
    showImagePreview.value = true;
};

/**
 * Capture the offscreen card PNG (and mediaRect for video) via MessageCardGenerator.
 */
const captureCardChrome = (message) => {
    if (pendingCardRequest) {
        pendingCardRequest.reject(new Error("Superseded by another generation"));
        pendingCardRequest = null;
    }

    return new Promise((resolve, reject) => {
        pendingCardRequest = { resolve, reject, messageId: message.id };
        generatorMessage.value = message;
    });
};

const handleCardGenerated = (payload) => {
    const request = pendingCardRequest;
    pendingCardRequest = null;
    generatorMessage.value = null;

    if (!request) return;

    const { dataUrl, mediaRect } = payload ?? {};
    if (!dataUrl) {
        request.reject(new Error("Card generator returned no image"));
        return;
    }

    request.resolve({ dataUrl, mediaRect });
};

/**
 * Build (or reuse) the shareable asset for a message. Text/image → PNG;
 * video/audio → branded MP4 via ffmpeg.wasm.
 */
const ensureAsset = async (messageId) => {
    const cached = generatedAssets.value[messageId];
    if (cached) return cached;

    if (isCancelled.value) {
        throw new DOMException("Composition aborted", "AbortError");
    }

    const message = sanitizedMessages.value.find((m) => m.id === messageId);
    if (!message) {
        throw new Error("Message not found");
    }

    isGenerating.value = true;
    generatingMessageId.value = messageId;
    generationStatus.value = "Preparing share card…";

    let cardDataUrl = null;

    try {
        const { dataUrl, mediaRect } = await captureCardChrome(message);
        cardDataUrl = dataUrl;

        if (isCancelled.value) {
            throw new DOMException("Composition aborted", "AbortError");
        }

        if (["video", "audio"].includes(message.message_type)) {
            generationStatus.value =
                message.message_type === "audio"
                    ? "Creating audio card…"
                    : "Creating video card…";

            try {
                const blob = await composeShareVideo({
                    messageType: message.message_type,
                    cardDataUrl: dataUrl,
                    mediaUrl: message.content,
                    mediaRect,
                });

                if (isCancelled.value) {
                    throw new DOMException("Composition aborted", "AbortError");
                }

                const asset = {
                    type: "video",
                    url: URL.createObjectURL(blob),
                    blob,
                };
                generatedAssets.value = {
                    ...generatedAssets.value,
                    [messageId]: asset,
                };
                return asset;
            } catch (composeError) {
                if (isCancelled.value || isAbortError(composeError)) {
                    throw composeError;
                }

                console.error("Video card encode failed:", composeError);
                useToast().add({
                    title: "Video card failed",
                    description:
                        "Could not encode the branded video. Using the static card instead.",
                    color: "warning",
                });

                const asset = { type: "image", url: dataUrl };
                generatedAssets.value = {
                    ...generatedAssets.value,
                    [messageId]: asset,
                };
                return asset;
            }
        }

        const asset = { type: "image", url: dataUrl };
        generatedAssets.value = {
            ...generatedAssets.value,
            [messageId]: asset,
        };
        return asset;
    } catch (error) {
        if (isCancelled.value || isAbortError(error)) throw error;

        // Last resort: if chrome capture succeeded somehow stored, unused
        if (cardDataUrl) {
            const asset = { type: "image", url: cardDataUrl };
            generatedAssets.value = {
                ...generatedAssets.value,
                [messageId]: asset,
            };
            return asset;
        }

        throw error;
    } finally {
        generatorMessage.value = null;
        pendingCardRequest = null;
        if (!isCancelled.value) {
            isGenerating.value = false;
            generatingMessageId.value = null;
            generationStatus.value = "";
        }
    }
};

const showPreviewTab = () => {
    activeTab.value = "preview";
};

const shareMessage = async (messageId) => {
    try {
        const asset = await ensureAsset(messageId);
        if (isCancelled.value || !asset) return;

        showPreviewTab();

        if (asset.type === "video") {
            await shareViaWebShare({
                videoUrl: asset.url,
                videoBlob: asset.blob,
            });
            return;
        }

        await shareViaWebShare({ imageUrl: asset.url });
    } catch (error) {
        if (isCancelled.value || isAbortError(error)) return;

        console.error("Failed to share message:", error);
        useToast().add({
            title: "Share failed",
            description:
                "Could not prepare this message for sharing. Please try again.",
            color: "error",
        });
    }
};

const downloadMessage = async (message) => {
    try {
        const asset = await ensureAsset(message.id);
        if (isCancelled.value || !asset) return;

        showPreviewTab();

        if (asset.type === "video") {
            downloadFile(asset.url, `incognito-message-${message.id}.mp4`);
        } else {
            downloadFile(asset.url, `incognito-message-${message.id}.png`);
        }

        useToast().add({
            title: "Message saved",
            description: "Your share card is being saved to your device.",
        });
    } catch (error) {
        if (isCancelled.value || isAbortError(error)) return;

        console.error("Failed to download message:", error);
        useToast().add({
            title: "Download failed",
            description:
                "Could not prepare this message for download. Please try again.",
            color: "error",
        });
    }
};

/**
 * Infer a file extension from a media URL, with sensible fallbacks.
 */
const mediaExtension = (url, messageType) => {
    try {
        const pathname = new URL(url, window.location.origin).pathname;
        const match = pathname.match(/\.([a-zA-Z0-9]+)(?:$|\?)/);
        if (match?.[1]) return match[1].toLowerCase();
    } catch {
        // ignore malformed URLs
    }
    return messageType === "audio" ? "mp3" : "mp4";
};

/**
 * Download the original video/audio file without composing a share card.
 */
const downloadOriginalMedia = async (message) => {
    const media =
        sanitizedMessages.value.find((m) => m.id === message.id) || message;

    if (!["video", "audio"].includes(media.message_type) || !media.content) {
        return;
    }

    isDownloadingOriginal.value = true;
    downloadingOriginalId.value = media.id;

    try {
        const ext = mediaExtension(media.content, media.message_type);
        const fileName = `incognito-${media.message_type}-${media.id}.${ext}`;

        // Fetch as blob so cross-origin S3/CloudFront URLs still download
        // with the intended filename (anchor download alone often fails CORS).
        const response = await fetch(media.content);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const blob = await response.blob();
        await downloadFile(blob, fileName);

        useToast().add({
            title:
                media.message_type === "audio" ? "Audio saved" : "Video saved",
            description: "The original file is being saved to your device.",
        });
    } catch (error) {
        console.error("Failed to download original media:", error);
        useToast().add({
            title: "Download failed",
            description:
                "Could not download the original file. Please try again.",
            color: "error",
        });
    } finally {
        isDownloadingOriginal.value = false;
        downloadingOriginalId.value = null;
    }
};

onBeforeUnmount(() => {
    isCancelled.value = true;

    if (pendingCardRequest) {
        pendingCardRequest.reject(
            new DOMException("Composition aborted", "AbortError")
        );
        pendingCardRequest = null;
    }
    generatorMessage.value = null;

    // Kill the WASM worker + reset the compose queue so the next modal isn't
    // blocked behind a half-finished encode from this one.
    cancelCompose();

    for (const asset of Object.values(generatedAssets.value)) {
        if (asset.type === "video" && asset.url?.startsWith("blob:")) {
            URL.revokeObjectURL(asset.url);
        }
    }
});
</script>
