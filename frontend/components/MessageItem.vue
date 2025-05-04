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
                <!-- <UBadge v-if="!read" color="primary" size="xs" class="ml-2"
                    >New</UBadge
                > -->
            </div>
            <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                size="xs"
                @click="$emit('delete', id)"
            />
        </div>

        <!-- Text message -->
        <p v-if="message_type === 'text'" class="text-sm">
            {{ content }}
        </p>

        <!-- Image message -->
        <div v-else-if="message_type === 'image'" class="space-y-2">
            <p class="text-sm mb-5">{{ text }}</p>
            <div class="relative rounded-md overflow-hidden">
                <img
                    :src="content"
                    alt="Image message"
                    class="sm:max-w-[500px] h-auto mx-auto rounded-md cursor-zoom-in"
                    @click="showImagePreview = true"
                />

                <div
                    class="absolute top-2 right-2 bg-black/40 rounded-full p-1 flex items-center justify-center"
                >
                    <UIcon name="lucide:image" class="h-4 w-4 text-white" />
                </div>
            </div>
            <!-- Modal for full-screen image preview -->
            <Transition
                enter-active-class="animate__animated animate__fadeIn animate__faster"
                leave-active-class="animate__animated animate__fadeOut animate__faster"
            >
                <div
                    v-show="showImagePreview"
                    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                >
                    <OnClickOutside @trigger="showImagePreview = false">
                        <img
                            :src="content"
                            class="max-w-full max-h-full"
                            alt="Full Screen Image"
                        />
                    </OnClickOutside>
                    <button
                        @click="showImagePreview = false"
                        class="absolute top-4 right-4 cursor-pointer text-white"
                    >
                        <Icon
                            name="material-symbols:close-rounded"
                            size="24px"
                        ></Icon>
                    </button>
                </div>
            </Transition>
        </div>

        <!-- Video message -->
        <div v-else-if="message_type === 'video'" class="space-y-2">
            <p class="text-sm mb-5">{{ text }}</p>
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
                        <source :src="content" type="video/mp4" />
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
            <p class="text-sm">{{ text }}</p>
            <div
                class="bg-gray-100 dark:bg-gray-800 rounded-md p-3 flex items-center gap-3 border"
            >
                <audio ref="audioRef" preload="metadata"></audio>

                <UTooltip
                    :delay-duration="0"
                    :text="isPlayingAudio ? 'Pause' : 'Play'"
                >
                    <UButton
                        :icon="isPlayingAudio ? 'lucide:pause' : 'lucide:play'"
                        size="md"
                        color="primary"
                        :variant="isPlayingAudio ? 'solid' : 'ghost'"
                        :ui="{ base: 'rounded-full cursor-pointer' }"
                        @click="isPlayingAudio = !isPlayingAudio"
                    />
                </UTooltip>
                <span class="text-xs text-gray-500">{{
                    formatTime(currentAudioTime)
                }}</span>
                <USlider
                    size="xs"
                    class="cursor-grabbing"
                    v-model="currentAudioTime"
                    :max="audioDuration"
                />
                <span class="text-xs text-gray-500">{{
                    formatTime(audioDuration)
                }}</span>
            </div>
        </div>
    </UCard>
</template>

<script setup>
import { OnClickOutside } from "@vueuse/components";
import { useMediaControls } from "@vueuse/core";

const props = defineProps({
    message_type: String,
    content: String,
    id: Number,
    text: String,
    timestamp: String,
});

const isPlayingVideo = ref(false);
const showImagePreview = ref(false);
const videoRef = useTemplateRef("videoRef");
const audioRef = useTemplateRef("audioRef");

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

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = parseInt(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

const messageTypeIcon = computed(() => {
    const iconMap = {
        image: "i-lucide-image",
        video: "i-lucide-video",
        audio: "i-lucide-volume-2",
    };
    return iconMap[props.message_type] || "i-lucide-message-square";
});

const {
    playing: isPlayingAudio,
    currentTime: currentAudioTime,
    duration: audioDuration,
} = useMediaControls(audioRef, {
    src: {
        src: props.content,
        type: "audio/mpeg",
    },
});
</script>
