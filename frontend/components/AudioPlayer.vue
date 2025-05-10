<template>
    <div
        class="bg-gray-100 dark:bg-gray-800 rounded-md p-3 flex flex-1 items-center gap-3 border border-gray-300"
    >
        <audio ref="audioRef" preload="metadata"></audio>

        <UTooltip :delay-duration="0" :text="isPlayingAudio ? 'Pause' : 'Play'">
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

        <slot name="audio-player-actions"></slot>
    </div>
</template>

<script setup>
import { useMediaControls } from "@vueuse/core";

const props = defineProps({
    src: {
        type: String,
        required: true,
    },
});

const audioRef = useTemplateRef("audioRef");

const {
    playing: isPlayingAudio,
    currentTime: currentAudioTime,
    duration: audioDuration,
} = useMediaControls(audioRef, {
    src: {
        src: props.src,
        type: "audio/mpeg",
    },
});

function formatTime(seconds) {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return "-";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = parseInt(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
</script>
