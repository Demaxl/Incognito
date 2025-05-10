<template>
    <div
        ref="collageContainer"
        class="w-72 bg-gradient-to-b from-violet-500 to-purple-700 rounded-lg p-4 text-white"
    >
        <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-2">
                <div
                    class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                >
                    <UIcon name="i-heroicons-user" class="h-5 w-5" />
                </div>
                <span class="font-medium">{{ username }}</span>
            </div>
            <div class="text-xs opacity-75">Incognito</div>
        </div>

        <div class="space-y-3 mb-4">
            <div
                v-for="(message, index) in displayMessages"
                :key="message.id"
                class="bg-white/10 p-2 rounded"
            >
                <p class="text-sm">
                    {{ truncateContent(message.content, index) }}
                </p>

                <div
                    v-if="
                        ['image', 'video', 'audio'].includes(message.type) &&
                        message.mediaUrl
                    "
                    class="mt-2 rounded bg-white/10 p-2 flex items-center justify-center"
                >
                    <img
                        v-if="message.type === 'image'"
                        :src="message.mediaUrl"
                        alt="Shared media"
                        class="max-h-24 rounded"
                    />
                    <div
                        v-else-if="message.type === 'video'"
                        class="w-full aspect-video bg-black/20 rounded flex items-center justify-center"
                    >
                        <UIcon name="i-heroicons-play" class="h-6 w-6" />
                    </div>
                    <div
                        v-else-if="message.type === 'audio'"
                        class="w-full h-10 bg-black/20 rounded flex items-center justify-center"
                    >
                        <UIcon
                            name="i-heroicons-musical-note"
                            class="h-5 w-5"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="messages.length > maxMessagesToShow"
                class="text-center text-sm bg-white/10 p-2 rounded"
            >
                <span
                    >+{{ messages.length - maxMessagesToShow }} more
                    messages</span
                >
            </div>
        </div>

        <div class="flex justify-between items-center text-xs opacity-75">
            <span>{{ formattedDate }}</span>
            <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-lock-closed" class="h-3 w-3" />
                <span>Anonymous</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import html2canvas from "html2canvas";

const props = defineProps({
    messages: {
        type: Array,
        required: true,
        // validator: (val) =>
        //     val.every(
        //         (message) =>
        //             typeof message.id === "string" &&
        //             typeof message.content === "string" &&
        //             ["text", "image", "video", "audio"].includes(message.type)
        //     ),
    },
    username: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["generated"]);
const collageContainer = ref(null);
const maxMessagesToShow = 3;

const displayMessages = computed(() => {
    return props.messages.slice(0, maxMessagesToShow);
});

const formattedDate = computed(() => {
    const now = new Date();
    return now.toLocaleString("default", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
});

const truncateContent = (content, index) => {
    const maxLength = index === 0 ? 100 : 50;
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
};

onMounted(() => {
    // Wait a moment for rendering before generating image
    setTimeout(() => {
        if (collageContainer.value) {
            html2canvas(collageContainer.value).then((canvas) => {
                const dataUrl = canvas.toDataURL("image/png");
                emit("generated", dataUrl);
            });
        }
    }, 300);
});
</script>

<script>
// This ensures html2canvas is imported only on client-side
export default {
    name: "MessageCollageGenerator",
};
</script>
