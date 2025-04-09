<template>
    <UCard class="message-item">
        <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Icon
                    :name="messageTypeIcon"
                    class="h-4 w-4 text-primary-500"
                />
                <div class="text-sm text-gray-500">{{ message.date }}</div>
                <UBadge
                    v-if="!message.read"
                    color="primary"
                    size="xs"
                    class="ml-2"
                    >New</UBadge
                >
            </div>
            <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                size="xs"
                @click="$emit('delete', message.id)"
            />
        </div>

        <!-- Text message -->
        <p v-if="message.type === 'text'" class="text-sm">
            {{ message.content }}
        </p>

        <!-- Image message -->
        <div v-else-if="message.type === 'image'" class="space-y-2">
            <p class="text-sm">{{ message.content }}</p>
            <div class="relative rounded-md overflow-hidden">
                <img
                    :src="message.mediaUrl || '/images/placeholder.png'"
                    alt="Image message"
                    class="w-full rounded-md max-h-[300px]"
                />
                <div
                    class="absolute top-2 right-2 bg-black/40 rounded-full p-1 flex items-center justify-center"
                >
                    <UIcon name="lucide:image" class="h-4 w-4 text-white" />
                </div>
            </div>
        </div>

        <!-- Video message -->
        <div v-else-if="message.type === 'video'" class="space-y-2">
            <p class="text-sm">{{ message.content }}</p>
            <div class="relative rounded-md overflow-hidden">
                <div
                    class="bg-black/10 rounded-md border flex items-center justify-center h-[200px]"
                >
                    <div
                        class="absolute inset-0 flex items-center justify-center"
                    >
                        <UButton size="sm" variant="soft" class="gap-1 z-50">
                            <Icon name="lucide:video" class="h-4 w-4" /> Play
                            video
                        </UButton>
                    </div>
                    <img
                        :src="message.mediaUrl || '/images/placeholder.png'"
                        alt="Video thumbnail"
                        class="w-full h-full object-cover opacity-80"
                    />
                    <div
                        class="absolute top-2 right-2 bg-black/40 rounded-full p-1 flex items-center justify-center"
                    >
                        <UIcon name="lucide:video" class="h-4 w-4 text-white" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Audio message -->
        <div v-else-if="message.type === 'audio'" class="space-y-2">
            <p class="text-sm">{{ message.content }}</p>
            <div
                class="bg-gray-100 dark:bg-gray-800 rounded-md p-3 flex items-center gap-3 border"
            >
                <div class="bg-primary/10 rounded-full p-2">
                    <Icon name="lucide:volume-2" class="h-4 w-4 text-primary" />
                </div>
                <div class="flex-1">
                    <div
                        class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                    >
                        <div class="h-full w-1/3 bg-primary rounded-full" />
                    </div>
                </div>
                <span class="text-xs text-gray-500">0:30</span>
                <UButton
                    color="gray"
                    variant="ghost"
                    class="h-8 w-8 p-0 rounded-full"
                >
                    <Icon name="lucide:volume-2" class="h-4 w-4" />
                    <span class="sr-only">Play audio</span>
                </UButton>
            </div>
        </div>
    </UCard>
</template>

<script setup>
const props = defineProps({
    message: {
        type: Object,
        required: true,
        validator: (obj) => {
            return ["id", "content", "type", "date", "read"].every(
                (key) => key in obj
            );
        },
    },
});

defineEmits(["delete"]);

const messageTypeIcon = computed(() => {
    const iconMap = {
        image: "i-lucide-image",
        video: "i-lucide-video",
        audio: "i-lucide-volume-2",
    };
    return iconMap[props.message.type] || "i-lucide-message-square";
});
</script>

<style scoped>
.message-item {
    transition: all 0.2s ease;
}

.message-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
