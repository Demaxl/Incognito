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
                        <template #text>
                            <!-- Text Message Tab -->
                            <div class="space-y-4">
                                <UTextarea
                                    class="block"
                                    v-model="text_message"
                                    :maxlength="maxLength"
                                    placeholder="Type your anonymous message here..."
                                    :ui="{
                                        base: 'min-h-[150px] resize-none w-full block',
                                    }"
                                    autoresize
                                    @keydown="handleKeyDown"
                                />
                                <p
                                    class="text-xs text-right"
                                    :class="
                                        text_message.length < minLength
                                            ? 'text-orange-500'
                                            : 'text-gray-500'
                                    "
                                >
                                    {{ text_message.length }}/{{ maxLength }}
                                    characters
                                    <span
                                        v-show="text_message.length < minLength"
                                    >
                                        (min: {{ minLength }})</span
                                    >
                                </p>
                            </div>
                        </template>
                        <template #image>
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
                                        v-if="mediaPreviewURL"
                                        class="relative w-full"
                                    >
                                        <img
                                            :src="mediaPreviewURL"
                                            alt="Image preview"
                                            class="w-full h-auto rounded-md"
                                        />
                                        <UButton
                                            type="button"
                                            variant="solid"
                                            size="lg"
                                            class="absolute top-2 right-2"
                                            @click="clearMediaFile('image')"
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
                                    :maxlength="maxLength"
                                    :ui="{
                                        base: 'min-h-[80px] resize-none w-full block',
                                    }"
                                    autoresize
                                />
                                <p
                                    class="text-xs text-right"
                                    :class="
                                        text_message.length > 0 &&
                                        text_message.length < minLength
                                            ? 'text-orange-500'
                                            : 'text-gray-500'
                                    "
                                >
                                    {{ text_message.length }}/{{ maxLength }}
                                    characters
                                    <span
                                        v-if="
                                            text_message.length > 0 &&
                                            text_message.length < minLength
                                        "
                                    >
                                        (min: {{ minLength }})
                                    </span>
                                </p>
                            </div>
                        </template>
                        <template #video>
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
                                        v-if="mediaPreviewURL"
                                        class="relative w-full"
                                    >
                                        <div
                                            class="bg-black/10 rounded-md flex items-center justify-center h-[200px]"
                                        >
                                            <video
                                                :src="mediaPreviewURL"
                                                class="max-w-full max-h-full"
                                                controls
                                            />
                                        </div>
                                        <UButton
                                            type="button"
                                            variant="solid"
                                            size="lg"
                                            class="absolute top-2 right-2"
                                            @click="clearMediaFile('video')"
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
                                    :maxlength="maxLength"
                                    :ui="{
                                        base: 'min-h-[80px] resize-none w-full block',
                                    }"
                                    autoresize
                                />
                                <p
                                    class="text-xs text-right"
                                    :class="
                                        text_message.length > 0 &&
                                        text_message.length < minLength
                                            ? 'text-orange-500'
                                            : 'text-gray-500'
                                    "
                                >
                                    {{ text_message.length }}/{{ maxLength }}
                                    characters
                                    <span
                                        v-if="
                                            text_message.length > 0 &&
                                            text_message.length < minLength
                                        "
                                    >
                                        (min: {{ minLength }})
                                    </span>
                                </p>
                            </div>
                        </template>
                        <template #audio>
                            <!-- Audio Message Tab -->
                            <div class="space-y-4 mt-4">
                                <div
                                    class="flex flex-col items-center gap-4 p-4 border-2 border-gray-500/40 border-dashed rounded-md"
                                >
                                    <div v-if="mediaPreviewURL" class="w-full">
                                        <div class="flex items-center gap-3">
                                            <AudioPlayer :src="mediaPreviewURL">
                                                <template #audio-player-actions>
                                                    <UTooltip
                                                        text="Delete audio"
                                                        :delay="0"
                                                    >
                                                        <UButton
                                                            type="button"
                                                            size="sm"
                                                            icon="lucide:trash-2"
                                                            class="cursor-pointer"
                                                            @click="
                                                                clearMediaFile(
                                                                    'audio'
                                                                )
                                                            "
                                                        >
                                                            <span
                                                                class="sr-only"
                                                                >Re-record</span
                                                            >
                                                        </UButton>
                                                    </UTooltip>
                                                </template>
                                            </AudioPlayer>
                                        </div>
                                    </div>
                                    <template v-else>
                                        <div
                                            class="w-full flex flex-col items-center"
                                        >
                                            <div
                                                v-if="isRecording"
                                                class="flex flex-col items-center w-full"
                                            >
                                                <!-- Animated waveform -->
                                                <div
                                                    class="flex items-center justify-center w-full mb-2"
                                                >
                                                    <svg
                                                        width="120"
                                                        height="40"
                                                        viewBox="0 0 120 40"
                                                    >
                                                        <rect
                                                            v-for="i in 12"
                                                            :key="i"
                                                            :x="(i - 1) * 10"
                                                            y="10"
                                                            width="6"
                                                            :height="20"
                                                            class="fill-primary-500"
                                                        >
                                                            <animate
                                                                attributeName="height"
                                                                values="20;35;20"
                                                                dur="0.8s"
                                                                :begin="
                                                                    (i - 1) *
                                                                        0.07 +
                                                                    's'
                                                                "
                                                                repeatCount="indefinite"
                                                            />
                                                            <animate
                                                                attributeName="y"
                                                                values="10;2;10"
                                                                dur="0.8s"
                                                                :begin="
                                                                    (i - 1) *
                                                                        0.07 +
                                                                    's'
                                                                "
                                                                repeatCount="indefinite"
                                                            />
                                                        </rect>
                                                    </svg>
                                                </div>
                                                <span
                                                    class="text-primary-500 font-semibold"
                                                    >Recording...</span
                                                >
                                            </div>
                                            <div
                                                v-else
                                                class="flex flex-col items-center w-full"
                                            >
                                                <Icon
                                                    name="lucide:mic"
                                                    class="h-10 w-10 text-primary-500"
                                                />
                                                <p
                                                    class="text-sm text-gray-500 text-center"
                                                >
                                                    Record an audio message or
                                                    upload a file
                                                </p>
                                            </div>
                                            <div class="flex gap-2 mt-2">
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
                                                        :name="
                                                            isRecording
                                                                ? 'material-symbols:stop'
                                                                : 'lucide:mic'
                                                        "
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
                                                        @change="
                                                            handleFileChange
                                                        "
                                                    />
                                                </UButton>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <UTextarea
                                    v-model="text_message"
                                    placeholder="Add a caption (optional)"
                                    class="block"
                                    :maxlength="maxLength"
                                    :ui="{
                                        base: 'min-h-[80px] resize-none w-full block',
                                    }"
                                    autoresize
                                />
                                <p
                                    class="text-xs text-right"
                                    :class="
                                        text_message.length > 0 &&
                                        text_message.length < minLength
                                            ? 'text-orange-500'
                                            : 'text-gray-500'
                                    "
                                >
                                    {{ text_message.length }}/{{ maxLength }}
                                    characters
                                    <span
                                        v-if="
                                            text_message.length > 0 &&
                                            text_message.length < minLength
                                        "
                                    >
                                        (min: {{ minLength }})
                                    </span>
                                </p>
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
const route = useRoute();
const username = route.params.username.replace("@", "");

// Add SEO metadata
useSeoMeta({
    title: `Send Anonymous Message to ${username}`,
    description: `Send an anonymous message to ${username} on Incognito. Share your thoughts, feedback, or questions without revealing your identity.`,
    ogTitle: `Send Anonymous Message to ${username} | Incognito`,
    ogDescription: `Send an anonymous message to ${username} on Incognito. Share your thoughts, feedback, or questions without revealing your identity.`,
    ogType: "website",
    ogUrl: `${useRuntimeConfig().public.siteDomain}/@${username}`,
    ogImageAlt: `Send Anonymous Message to ${username} | Incognito`,
    twitterTitle: `Send Anonymous Message to ${username} | Incognito`,
    twitterDescription: `Send an anonymous message to ${username} on Incognito. Share your thoughts, feedback, or questions without revealing your identity.`,
    twitterImageAlt: `Send Anonymous Message to ${username} | Incognito`,
    robots: "noindex, follow", // Prevent individual message pages from being indexed
});

// Check if username is available
const response = await useApi().get(`/check-username?username=${username}`);
if (!response.data.available) {
    throw createError({
        statusCode: 404,
        statusMessage: `Username ${username} not found`,
    });
}

import { useDropZone } from "@vueuse/core";

/* Constants */
const maxLength = 255;
const minLength = 10;
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

/* Refs */
const text_message = ref("");
const isSending = ref(false);
const activeTab = ref("text");
const isRecording = ref(false);

// Separate media refs for each type
const imagePreviewURL = ref(null);
const imageFile = ref(null);
const videoPreviewURL = ref(null);
const videoFile = ref(null);
const audioPreviewURL = ref(null);
const audioFile = ref(null);

const mediaRecorder = ref(null);
const audioChunks = ref([]);
// Drop zone refs
const imageDropZoneRef = useTemplateRef("imageDropZoneRef");
const videoDropZoneRef = useTemplateRef("videoDropZoneRef");

// Computed property to get the current media preview URL based on active tab
const mediaPreviewURL = computed(() => {
    switch (activeTab.value) {
        case "image":
            return imagePreviewURL.value;
        case "video":
            return videoPreviewURL.value;
        case "audio":
            return audioPreviewURL.value;
        default:
            return null;
    }
});

// Computed property to get the current media file based on active tab
const mediaFile = computed(() => {
    switch (activeTab.value) {
        case "image":
            return imageFile.value;
        case "video":
            return videoFile.value;
        case "audio":
            return audioFile.value;
        default:
            return null;
    }
});

const isSubmitDisabled = computed(() => {
    if (isSending.value) return true;
    if (
        activeTab.value === "text" &&
        (text_message.value.trim().length < minLength ||
            !text_message.value.trim())
    )
        return true;
    if (
        ["image", "video", "audio"].includes(activeTab.value) &&
        !mediaPreviewURL.value
    ) {
        return true;
    }
    // If there's text in media messages, it must meet minimum length
    if (
        ["image", "video", "audio"].includes(activeTab.value) &&
        text_message.value.trim() &&
        text_message.value.trim().length < minLength
    ) {
        return true;
    }
    return false;
});

/* Composables */
const toast = useToast();

// Set up drop zones using useDropZone
const { isOverDropZone: isOverImageDropZone } = useDropZone(imageDropZoneRef, {
    onDrop: (files) => setMediaFile(files[0], "image"),
    dataTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    multiple: false,
});

const { isOverDropZone: isOverVideoDropZone } = useDropZone(videoDropZoneRef, {
    onDrop: (files) => setMediaFile(files[0], "video"),
    dataTypes: ["video/mp4", "video/webm", "video/ogg"],
    multiple: false,
});

/* Functions */

function setMediaFile(file, type) {
    // Add file size validation (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        toast.add({
            title: "File too large",
            description: "Please select a file smaller than 10MB",
            color: "error",
        });
        return;
    }

    // Create a preview URL for the selected file
    const url = URL.createObjectURL(file);

    // Clear any existing preview URL for this type
    clearMediaFile(type);

    // Set the new preview URL and file based on type
    switch (type) {
        case "image":
            imagePreviewURL.value = url;
            imageFile.value = file;
            break;
        case "video":
            videoPreviewURL.value = url;
            videoFile.value = file;
            break;
        case "audio":
            audioPreviewURL.value = url;
            audioFile.value = file;
            break;
    }
}

function clearMediaFile(type = null) {
    // If type is specified, only clear that type
    if (type) {
        switch (type) {
            case "image":
                if (imagePreviewURL.value) {
                    URL.revokeObjectURL(imagePreviewURL.value);
                    imagePreviewURL.value = null;
                    imageFile.value = null;
                }
                break;
            case "video":
                if (videoPreviewURL.value) {
                    URL.revokeObjectURL(videoPreviewURL.value);
                    videoPreviewURL.value = null;
                    videoFile.value = null;
                }
                break;
            case "audio":
                if (audioPreviewURL.value) {
                    URL.revokeObjectURL(audioPreviewURL.value);
                    audioPreviewURL.value = null;
                    audioFile.value = null;
                }
                break;
        }
    } else {
        // Clear all media types
        if (imagePreviewURL.value) {
            URL.revokeObjectURL(imagePreviewURL.value);
            imagePreviewURL.value = null;
            imageFile.value = null;
        }
        if (videoPreviewURL.value) {
            URL.revokeObjectURL(videoPreviewURL.value);
            videoPreviewURL.value = null;
            videoFile.value = null;
        }
        if (audioPreviewURL.value) {
            URL.revokeObjectURL(audioPreviewURL.value);
            audioPreviewURL.value = null;
            audioFile.value = null;
        }
    }
}

function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
        setMediaFile(file, activeTab.value);
    }
}

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
    try {
        const { status } = await sendMessage(formData);
        if (status === 201) {
            isSending.value = false;
            text_message.value = "";
            clearMediaFile();

            toast.add({
                title: "Message sent!",
                description: `Your anonymous message has been delivered to ${username}.`,
                color: "success",
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        toast.add({
            title: "Error",
            description: "Failed to send message. Please try again.",
            color: "error",
        });
        isSending.value = false;
    }
}
async function toggleRecording() {
    if (!isRecording.value) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            mediaRecorder.value = new MediaRecorder(stream);
            audioChunks.value = [];

            mediaRecorder.value.ondataavailable = (event) => {
                audioChunks.value.push(event.data);
            };

            mediaRecorder.value.onstop = () => {
                const audioBlob = new Blob(audioChunks.value, {
                    type: "audio/mpeg",
                });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPreviewURL.value = audioUrl;

                // Convert blob to File object
                const audioFileObj = new File(
                    [audioBlob],
                    `audio-recording-${Date.now()}.mp3`,
                    {
                        type: "audio/mpeg",
                        lastModified: Date.now(),
                    }
                );
                audioFile.value = audioFileObj;

                // Stop all audio tracks
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.value.start();
            isRecording.value = true;
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast.add({
                title: "Error",
                description:
                    "Could not access microphone. Please check your permissions.",
                color: "error",
            });
        }
    } else {
        if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
            mediaRecorder.value.stop();
            isRecording.value = false;
        }
    }
}

function handleKeyDown(e) {
    // Check if Ctrl + Enter is pressed
    if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior
        if (!isSubmitDisabled.value) {
            handleSubmit();
        }
    }
}

// Clean up media recorder when component is unmounted
onBeforeUnmount(() => {
    if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
        mediaRecorder.value.stop();
    }
    clearMediaFile();
});
</script>
