<template>
    <div
        ref="cardContainer"
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

        <div class="mb-4 py-2">
            <p v-if="message.type === 'text'" class="text-sm">
                {{ message.content }}
            </p>
            <div
                v-else-if="['image', 'video', 'audio'].includes(message.type)"
                class="space-y-2"
            >
                <p class="text-sm">{{ message.content }}</p>
                <div
                    v-if="message.mediaUrl"
                    class="mt-2 rounded bg-white/10 p-2 flex items-center justify-center"
                >
                    <img
                        v-if="message.type === 'image'"
                        :src="message.mediaUrl"
                        alt="Shared media"
                        class="max-h-32 rounded"
                    />
                    <div
                        v-else-if="message.type === 'video'"
                        class="w-full aspect-video bg-black/20 rounded flex items-center justify-center"
                    >
                        <UIcon name="i-heroicons-play" class="h-8 w-8" />
                    </div>
                    <div
                        v-else-if="message.type === 'audio'"
                        class="w-full h-12 bg-black/20 rounded flex items-center justify-center"
                    >
                        <UIcon
                            name="i-heroicons-musical-note"
                            class="h-6 w-6"
                        />
                    </div>
                </div>
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
import { onMounted } from "vue";
import html2canvas from "html2canvas";

const props = defineProps({
    message: {
        type: Object,
        required: true,
        // validator: (val) =>
        //     typeof val.id === "string" &&
        //     typeof val.content === "string" &&
        //     ["text", "image", "video", "audio"].includes(val.type),
    },
    username: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["generated"]);
const cardContainer = ref(null);

const formattedDate = computed(() => {
    const now = new Date();
    return now.toLocaleString("default", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
});

onMounted(() => {
    // Wait a moment for rendering before generating image
    setTimeout(() => {
        if (cardContainer.value) {
            html2canvas(cardContainer.value).then((canvas) => {
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
    name: "MessageCardGenerator",
};
</script>
