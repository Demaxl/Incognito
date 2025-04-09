<template>
    <!-- Main Content -->
    <main class="flex-1 p-4 md:p-6">
        <div class="mx-auto max-w-md">
            <UCard>
                <div class="space-y-2 mb-6">
                    <h3 class="text-2xl font-semibold leading-none">
                        Send an anonymous message
                    </h3>
                    <p class="text-sm text-gray-500">
                        Your message will be delivered to @{{ username }}
                        anonymously
                    </p>
                </div>

                <form @submit.prevent="handleSubmit">
                    <UTabs
                        :items="tabs"
                        class="w-full"
                        :ui="{ list: 'mb-2', label: 'hidden sm:inline' }"
                    >
                        <template #text="{ selectedId }">
                            <!-- Text Message Tab -->
                            <div class="space-y-4">
                                <UTextarea
                                    class="block"
                                    v-model="message"
                                    placeholder="Type your anonymous message here..."
                                    :ui="{
                                        base: 'min-h-[150px] resize-none w-full block',
                                    }"
                                    autoresize
                                />
                            </div>
                        </template>
                        <template #image="{ selectedId }">
                            <!-- Image Message Tab -->
                            <div class="space-y-4 mt-4">
                                <div
                                    class="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-500/40 rounded-md"
                                >
                                    <div
                                        v-if="mediaPreview"
                                        class="relative w-full"
                                    >
                                        <img
                                            :src="
                                                mediaPreview ||
                                                '/images/placeholder.png'
                                            "
                                            alt="Image preview"
                                            class="w-full h-auto rounded-md"
                                        />
                                        <UButton
                                            type="button"
                                            variant="solid"
                                            size="lg"
                                            class="absolute top-2 right-2"
                                            @click="clearMediaPreview"
                                        >
                                            Change
                                        </UButton>
                                    </div>
                                    <template v-else>
                                        <UIcon
                                            name="lucide:image"
                                            class="h-10 w-10 text-primary-500"
                                        />
                                        <p
                                            class="text-sm text-gray-500 text-center"
                                        >
                                            Drag and drop an image, or click to
                                            select
                                        </p>
                                        <UButton
                                            type="button"
                                            variant="outline"
                                            class="relative"
                                            size="lg"
                                        >
                                            Choose Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                class="absolute inset-0 opacity-0 cursor-pointer"
                                                @change="handleFileChange"
                                            />
                                        </UButton>
                                    </template>
                                </div>
                                <UTextarea
                                    v-model="message"
                                    placeholder="Add a caption (optional)"
                                    class="block"
                                    :ui="{
                                        base: 'min-h-[80px] resize-none w-full block',
                                    }"
                                    autoresize
                                />
                            </div>
                        </template>
                        <template #video="{ selectedId }">
                            <!-- Video Message Tab -->
                            <div class="space-y-4 mt-4">
                                <div
                                    class="flex flex-col items-center gap-4 p-4 border-2 border-gray-500/40 border-dashed rounded-md"
                                >
                                    <div
                                        v-if="mediaPreview"
                                        class="relative w-full"
                                    >
                                        <div
                                            class="bg-black/10 rounded-md flex items-center justify-center h-[200px]"
                                        >
                                            <video
                                                :src="mediaPreview"
                                                class="max-w-full max-h-full"
                                                controls
                                            />
                                        </div>
                                        <UButton
                                            type="button"
                                            variant="solid"
                                            size="lg"
                                            class="absolute top-2 right-2"
                                            @click="clearMediaPreview"
                                        >
                                            Change
                                        </UButton>
                                    </div>
                                    <template v-else>
                                        <Icon
                                            name="lucide:video"
                                            class="h-10 w-10 text-primary-500"
                                        />
                                        <p
                                            class="text-sm text-gray-500 text-center"
                                        >
                                            Drag and drop a video, or click to
                                            select
                                        </p>
                                        <UButton
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            class="relative"
                                        >
                                            Choose Video
                                            <input
                                                type="file"
                                                accept="video/*"
                                                class="absolute inset-0 opacity-0 cursor-pointer"
                                                @change="handleFileChange"
                                            />
                                        </UButton>
                                    </template>
                                </div>

                                <UTextarea
                                    v-model="message"
                                    placeholder="Add a caption (optional)"
                                    class="block"
                                    :ui="{
                                        base: 'min-h-[80px] resize-none w-full block',
                                    }"
                                    autoresize
                                />
                            </div>
                        </template>
                        <template #audio="{ selectedId }">
                            <!-- Audio Message Tab -->
                            <div class="space-y-4 mt-4">
                                <div
                                    class="flex flex-col items-center gap-4 p-4 border-2 border-gray-500/40 border-dashed rounded-md"
                                >
                                    <div v-if="mediaPreview" class="w-full">
                                        <div
                                            class="bg-gray-100rounded-md p-3 flex items-center gap-3"
                                        >
                                            <div
                                                class="bg-primary-500/10 rounded-full p-2 flex items-center justify-center"
                                            >
                                                <Icon
                                                    name="lucide:mic"
                                                    class="h-4 w-4 text-primary-500"
                                                />
                                            </div>
                                            <div class="flex-1">
                                                <div
                                                    class="h-2 rounded-full bg-gray-200 overflow-hidden"
                                                >
                                                    <div
                                                        class="h-full w-full bg-primary rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <span class="text-xs text-gray-500"
                                                >0:12</span
                                            >
                                            <UButton
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                class="h-8 w-8 p-0 rounded-full flex items-center justify-center"
                                                @click="clearMediaPreview"
                                            >
                                                <Icon
                                                    name="lucide:mic"
                                                    class="h-4 w-4"
                                                />
                                                <span class="sr-only"
                                                    >Re-record</span
                                                >
                                            </UButton>
                                        </div>
                                    </div>
                                    <template v-else>
                                        <Icon
                                            name="lucide:mic"
                                            class="h-10 w-10 text-primary-500"
                                        />
                                        <p
                                            class="text-sm text-gray-500 text-center"
                                        >
                                            Record an audio message or upload a
                                            file
                                        </p>
                                        <div class="flex gap-2">
                                            <UButton
                                                type="button"
                                                :color="
                                                    isRecording
                                                        ? 'error'
                                                        : 'primary'
                                                "
                                                :variant="
                                                    isRecording
                                                        ? 'solid'
                                                        : 'outline'
                                                "
                                                @click="toggleRecording"
                                                class="gap-2"
                                            >
                                                <Icon
                                                    name="lucide:mic"
                                                    class="h-4 w-4"
                                                />
                                                {{
                                                    isRecording
                                                        ? "Stop Recording"
                                                        : "Record Audio"
                                                }}
                                            </UButton>
                                            <UButton
                                                type="button"
                                                variant="outline"
                                                class="relative"
                                            >
                                                Upload Audio
                                                <input
                                                    type="file"
                                                    accept="audio/*"
                                                    class="absolute inset-0 opacity-0 cursor-pointer"
                                                    @change="handleFileChange"
                                                />
                                            </UButton>
                                        </div>
                                    </template>
                                </div>
                                <UTextarea
                                    v-model="message"
                                    placeholder="Add a caption (optional)"
                                    class="block"
                                    :ui="{
                                        base: 'min-h-[80px] resize-none w-full block',
                                    }"
                                    autoresize
                                />
                            </div>
                        </template>
                    </UTabs>

                    <div class="flex justify-between items-center mt-6">
                        <p class="text-xs text-gray-500">
                            Messages are anonymous, but please be kind and
                            respectful.
                        </p>
                        <UButton
                            type="submit"
                            :disabled="isSubmitDisabled"
                            :loading="isSending"
                            size="lg"
                        >
                            <template v-if="!isSending">
                                Send
                                <Icon
                                    name="lucide:send"
                                    class="ml-2"
                                    size="16"
                                />
                            </template>
                        </UButton>
                    </div>
                </form>
            </UCard>
        </div>
    </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
// import { useToast } from "@/composables/useToast";

const useToast = () => {
    return {
        add: ({ title, description, color }) => {
            // In a real app, this would use Nuxt UI's useToast or a similar system
            console.log(`Toast: ${title} - ${description} (${color})`);
        },
    };
};

const route = useRoute();
const username = route.params.username;
const toast = useToast();

const message = ref("");
const isSending = ref(false);
const activeTab = ref("text");
const isRecording = ref(false);
const mediaPreview = ref(null);

const tabs = [
    {
        label: "Text",
        icon: "i-lucide-message-square",
        slot: "text",
    },
    {
        label: "Image",
        icon: "i-lucide-image",
        slot: "image",
    },
    {
        label: "Video",
        icon: "i-lucide-video",
        slot: "video",
    },
    {
        label: "Audio",
        icon: "i-lucide-mic",
        slot: "audio",
    },
];

const isSubmitDisabled = computed(() => {
    if (isSending.value) return true;
    if (activeTab.value === "text" && !message.value.trim()) return true;
    if (
        ["image", "video", "audio"].includes(activeTab.value) &&
        !mediaPreview.value
    )
        return true;
    return false;
});

const handleSubmit = () => {
    if (isSubmitDisabled.value) return;

    isSending.value = true;

    // Simulate sending message
    setTimeout(() => {
        isSending.value = false;
        message.value = "";
        mediaPreview.value = null;

        toast.add({
            title: "Message sent!",
            description: "Your anonymous message has been delivered.",
            color: "green",
        });
    }, 1000);
};

const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
        // Create a preview URL for the selected file
        const url = URL.createObjectURL(file);
        mediaPreview.value = url;
    }
};

const clearMediaPreview = () => {
    mediaPreview.value = null;
};

const toggleRecording = () => {
    isRecording.value = !isRecording.value;

    // Simulate recording for demonstration
    if (isRecording.value) {
        toast.add({
            title: "Recording started",
            description: "Click the button again to stop recording.",
            color: "blue",
        });
    } else {
        mediaPreview.value = "/placeholder.svg?height=50&width=200";
        toast.add({
            title: "Recording stopped",
            description: "Your audio is ready to send.",
            color: "green",
        });
    }
};
</script>
