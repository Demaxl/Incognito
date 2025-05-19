<template>
    <UCard class="transition-all duration-200">
        <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Icon
                    :name="messageTypeIcon"
                    class="h-4 w-4 text-primary-500"
                />
                <div class="text-sm text-gray-500">
                    {{ timeAgo(timestamp) }}
                </div>
                <UBadge v-if="!is_read" color="primary" size="xs" class="ml-2"
                    >New</UBadge
                >
            </div>
            <div class="flex items-center gap-1">
                <UTooltip text="Share message" :delay-duration="0">
                    <UButton
                        color="primary"
                        variant="ghost"
                        icon="material-symbols:share-outline"
                        size="sm"
                        class="cursor-pointer"
                        @click="shareMessageModal.open()"
                    />
                </UTooltip>
                <UTooltip text="Delete message" :delay-duration="0">
                    <UButton
                        color="error"
                        variant="ghost"
                        icon="i-lucide-trash-2"
                        size="sm"
                        class="cursor-pointer"
                        @click="deleteMessageItem(props)"
                    />
                </UTooltip>
            </div>
        </div>

        <!-- Text message -->
        <div v-if="message_type === 'text'" class="space-y-2">
            <p class="text-sm">{{ sanitizedText }}</p>
        </div>

        <!-- Image message -->
        <div v-else-if="message_type === 'image'" class="space-y-2">
            <p class="text-sm mb-5">{{ sanitizedText }}</p>
            <div class="relative rounded-md overflow-hidden">
                <img
                    :src="sanitizedContent"
                    :alt="sanitizedText || 'Image message'"
                    class="sm:max-w-[500px] h-auto mx-auto rounded-md cursor-zoom-in"
                    @click="showImagePreview = true"
                />

                <div
                    class="absolute top-2 right-2 bg-black/40 rounded-full p-1 flex items-center justify-center"
                >
                    <UIcon name="lucide:image" class="h-4 w-4 text-white" />
                </div>
            </div>
            <!-- Use the new ImagePreview component -->
            <ImagePreview
                v-model="showImagePreview"
                :src="sanitizedContent"
                :alt="sanitizedText || 'Image message'"
            />
        </div>

        <!-- Video message -->
        <div v-else-if="message_type === 'video'" class="space-y-2">
            <p class="text-sm mb-5">{{ sanitizedText }}</p>
            <div class="relative rounded-md overflow-hidden">
                <div class="rounded-md flex items-center justify-center">
                    <div
                        class="absolute inset-0 flex items-center justify-center"
                    >
                        <UButton
                            size="sm"
                            variant="solid"
                            class="gap-1 z-50"
                            @click="playVideo"
                            v-if="!isPlayingVideo"
                        >
                            <Icon name="lucide:video" class="h-4 w-4" />
                            Play video
                        </UButton>
                    </div>
                    <video
                        controls
                        class="sm:max-w-[500px] h-auto object-cover opacity-80"
                        ref="videoRef"
                        @play="isPlayingVideo = true"
                        @pause="isPlayingVideo = false"
                    >
                        <source :src="sanitizedContent" type="video/mp4" />
                    </video>
                    <div
                        class="absolute top-2 right-2 bg-black/40 rounded-full p-1 flex items-center justify-center"
                    >
                        <UIcon name="lucide:video" class="h-4 w-4 text-white" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Audio message -->
        <div v-else-if="message_type === 'audio'" class="space-y-2">
            <p class="text-sm">{{ sanitizedText }}</p>
            <AudioPlayer :src="sanitizedContent" />
        </div>
    </UCard>
</template>

<script setup>
import { OnClickOutside } from "@vueuse/components";
import { MessageShareDialog } from "#components";
import { sanitizeUrl, sanitizeText } from "~/utils/sanitize";

const emit = defineEmits(["delete"]);

const props = defineProps({
    message_type: String,
    content: String,
    id: Number,
    text: String,
    timestamp: String,
    is_read: Boolean,
});

// Sanitize content and text
const sanitizedContent = computed(() => sanitizeUrl(props.content));
const sanitizedText = computed(() => sanitizeText(props.text));

const isPlayingVideo = ref(false);
const showImagePreview = ref(false);
const videoRef = useTemplateRef("videoRef");

const messageTypeIcon = computed(() => {
    const iconMap = {
        image: "i-lucide-image",
        video: "i-lucide-video",
        audio: "i-lucide-volume-2",
    };
    return iconMap[props.message_type] || "i-lucide-message-square";
});

const overlay = useOverlay();
const shareMessageModal = overlay.create(MessageShareDialog, {
    props: {
        messages: [props],
    },
});

function playVideo() {
    if (videoRef.value) {
        videoRef.value.play();
    }
}

function timeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    if (isNaN(seconds) || seconds < 0) return "";
    if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
}

async function deleteMessageItem(props) {
    const { deleteMessage } = useMessagesAPI();
    try {
        const status = await deleteMessage(props.id);
        if (status === 204) {
            emit("delete", props);
        }
    } catch (error) {
        useToast().add({
            title: "Error",
            description: "Failed to delete message",
            color: "error",
            icon: "material-symbols:error",
            actions: [
                {
                    label: "Retry",
                    color: "error",
                    icon: "material-symbols:refresh",
                    variant: "outline",
                    onClick: () => {
                        deleteMessageItem(props);
                    },
                },
            ],
        });
    }
}
</script>
