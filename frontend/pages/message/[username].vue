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
                        v-model="activeTab"
                        class="w-full"
                        :ui="{ list: 'mb-2', label: 'hidden sm:inline' }"
                    >
                        <template #text="{ selectedId }">
                            <!-- Text Message Tab -->
                            <div class="space-y-4">
                                <UTextarea
                                    class="block"
                                    v-model="text_message"
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
                                    ref="imageDropZoneRef"
                                    class="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-md"
                                    :class="{
                                        'border-gray-500/40':
                                            !isOverImageDropZone,
                                        'border-primary-500 bg-primary-50 dark:bg-primary-950':
                                            isOverImageDropZone,
                                    }"
                                >
                                    <div
                                        v-if="mediaPreview"
                                        class="relative w-full"
                                    >
                                        <img
                                            :src="mediaPreview"
                                            alt="Image preview"
                                            class="w-full h-auto rounded-md"
                                        />
                                        <UButton
                                            type="button"
                                            variant="solid"
                                            size="lg"
                                            class="absolute top-2 right-2"
                                            @click="clearMediaFile"
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
                                    v-model="text_message"
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
                                    ref="videoDropZoneRef"
                                    class="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-md"
                                    :class="{
                                        'border-gray-500/40':
                                            !isOverVideoDropZone,
                                        'border-primary-500 bg-primary-50 dark:bg-primary-950':
                                            isOverVideoDropZone,
                                    }"
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
                                            @click="clearMediaFile"
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
                                    v-model="text_message"
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
                                                @click="clearMediaFile"
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
                                    v-model="text_message"
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
                            :trailing-icon="isSending ? '' : 'lucide:send'"
                            :label="isSending ? 'Sending' : 'Send'"
                            size="lg"
                        />
                    </div>
                </form>
            </UCard>
        </div>
    </main>
</template>

<script setup>
import { useDropZone } from "@vueuse/core";

/* Constants */
const tabs = [
    {
        label: "Text",
        icon: "i-lucide-message-square",
        slot: "text",
        value: "text",
    },
    {
        label: "Image",
        icon: "i-lucide-image",
        slot: "image",
        value: "image",
    },
    {
        label: "Video",
        icon: "i-lucide-video",
        slot: "video",
        value: "video",
    },
    {
        label: "Audio",
        icon: "i-lucide-mic",
        slot: "audio",
        value: "audio",
    },
];
const route = useRoute();
const username = route.params.username;

/* Refs */
const text_message = ref("");
const isSending = ref(false);
const activeTab = ref("text");
const isRecording = ref(false);
const mediaPreview = ref(null);
const mediaFile = ref(null);
// Drop zone refs
const imageDropZoneRef = useTemplateRef("imageDropZoneRef");
const videoDropZoneRef = useTemplateRef("videoDropZoneRef");

const isSubmitDisabled = computed(() => {
    if (isSending.value) return true;
    if (activeTab.value === "text" && !text_message.value.trim()) return true;
    if (
        ["image", "video", "audio"].includes(activeTab.value) &&
        !mediaPreview.value
    ) {
        return true;
    }
    return false;
});

/* Composables */
const toast = useToast();

// Set up drop zones using useDropZone
const { isOverDropZone: isOverImageDropZone } = useDropZone(imageDropZoneRef, {
    onDrop: (files) => setMediaFile(files[0]),
    dataTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    multiple: false,
});

const { isOverDropZone: isOverVideoDropZone } = useDropZone(videoDropZoneRef, {
    onDrop: (files) => setMediaFile(files[0]),
    dataTypes: ["video/mp4", "video/webm", "video/ogg"],
    multiple: false,
});

/* Functions */

function setMediaFile(file) {
    // Create a preview URL for the selected file
    const url = URL.createObjectURL(file);
    mediaPreview.value = url;
    mediaFile.value = file;
}

const clearMediaFile = () => {
    if (mediaPreview.value) {
        URL.revokeObjectURL(mediaPreview.value);
    }
    mediaPreview.value = null;
    mediaFile.value = null;
};

const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
        setMediaFile(file);
    }
};

async function handleSubmit() {
    if (isSubmitDisabled.value) return;

    isSending.value = true;

    const data = {
        message_type: activeTab.value,
        receiver: username,
        text_content: text_message.value,
        media_content: mediaFile.value,
    };

    const formData = new FormData();

    for (const key in data) {
        if (!!data[key]) {
            formData.append(key, data[key]);
        }
    }

    const { sendMessage } = useMessagesAPI();
    const responseStatus = await sendMessage(formData);

    if (responseStatus === 201) {
        isSending.value = false;
        text_message.value = "";
        clearMediaFile();

        toast.add({
            title: "Message sent!",
            description: `Your anonymous message has been delivered to ${username}.`,
            color: "success",
        });
    }
}

const toggleRecording = () => {
    isRecording.value = !isRecording.value;

    // Simulate recording for demonstration
    if (isRecording.value) {
        toast.add({
            title: "Recording started",
            description: "Click the button again to stop recording.",
            color: "primary",
        });
    } else {
        mediaPreview.value = "/placeholder.svg?height=50&width=200";
        toast.add({
            title: "Recording stopped",
            description: "Your audio is ready to send.",
            color: "success",
        });
    }
};
</script>
