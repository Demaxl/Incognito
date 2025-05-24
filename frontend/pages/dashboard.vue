<template>
    <main class="flex-1 p-4 md:p-6">
        <div class="mx-auto max-w-4xl">
            <div class="mb-8">
                <h1 class="mb-2 text-2xl font-bold">Your Inbox</h1>
                <p class="text-gray-500">
                    Share your link to receive anonymous messages.
                </p>
            </div>

            <UCard class="mb-8">
                <div class="flex flex-col space-y-1.5">
                    <h3
                        class="text-2xl font-semibold leading-none tracking-tight"
                    >
                        Your Anonymous Link
                    </h3>
                    <p class="text-sm text-gray-500">
                        Share this link to receive anonymous messages.
                    </p>
                </div>
                <div class="flex items-center gap-2 mt-6">
                    <UInput
                        readOnly
                        :value="linkValue"
                        class="text-sm w-full"
                        size="xl"
                    />
                    <UTooltip text="Copy link" :delayDuration="0">
                        <UButton
                            variant="outline"
                            class="cursor-pointer"
                            size="xl"
                            icon="material-symbols:content-copy-outline"
                            @click="copyLinkToClipboard"
                        />
                    </UTooltip>
                    <UTooltip text="Share link" :delayDuration="0">
                        <UButton
                            variant="outline"
                            class="cursor-pointer"
                            size="xl"
                            icon="material-symbols:share-outline"
                            @click="modal.open()"
                        />
                    </UTooltip>
                </div>
            </UCard>
            <div class="flex items-center justify-between">
                <UTabs
                    v-model="activeTab"
                    :items="tabItems"
                    size="lg"
                    :content="false"
                    :ui="{ trigger: 'basis-[fit-content] px-3 py-1' }"
                >
                </UTabs>
                <div class="flex items-center gap-2">
                    <div class="text-sm text-gray-500">
                        {{ messages.length }} messages
                    </div>
                    <UTooltip text="Refresh messages" :delayDuration="0">
                        <UButton
                            variant="outline"
                            size="sm"
                            icon="lucide:refresh-cw"
                            class="cursor-pointer"
                            :class="{ 'animate-spin': isLoading }"
                            @click="refreshMessages"
                            :disabled="isLoading"
                        />
                    </UTooltip>
                </div>
            </div>
            <div class="mt-4 space-y-4 block">
                <TransitionGroup name="list">
                    <MessageItem
                        v-for="message in filteredMessages"
                        :key="message.id"
                        v-bind="message"
                        @delete="removeMessageItem"
                    />
                </TransitionGroup>

                <UCard
                    v-if="filteredMessages.length === 0 && !isLoading"
                    class="text-center py-8"
                >
                    <template #header>
                        <div class="flex flex-col items-center gap-2">
                            <Icon
                                name="lucide:inbox"
                                class="h-12 w-12 text-primary-400"
                            />
                            <h3 class="text-lg font-medium">
                                {{
                                    activeTab === "unread"
                                        ? "No unread messages"
                                        : "No messages yet"
                                }}
                            </h3>
                        </div>
                    </template>
                    <p class="text-gray-500">
                        {{
                            activeTab === "unread"
                                ? "You've read all your messages"
                                : "Share your link to start receiving anonymous messages"
                        }}
                    </p>
                </UCard>

                <UCard v-if="isLoading" class="text-center py-8">
                    <template #header>
                        <div class="flex flex-col items-center gap-2">
                            <Icon
                                name="lucide:loader-circle"
                                class="h-12 w-12 text-primary-400 animate-spin"
                            />
                            <h3 class="text-lg font-medium">
                                Loading messages...
                            </h3>
                        </div>
                    </template>
                </UCard>
            </div>
        </div>
    </main>
</template>

<script setup>
// Add SEO metadata
useSeoMeta({
    title: "Your Inbox",
    description:
        "Manage your anonymous inbox, view and respond to messages sent to you. Your personal space for anonymous communication.",
    ogTitle: "Your Incognito Inbox - Anonymous Messaging Platform",
    ogDescription:
        "Manage your anonymous inbox, view and respond to messages sent to you. Your personal space for anonymous communication.",
    ogType: "website",
    robots: "noindex, follow", // Prevent dashboard from being indexed since it's a private page
});

definePageMeta({
    middleware: ["auth"],
});
import { LinkShareDialog } from "#components";

const tabItems = [
    {
        label: "All Messages",
        slot: "all",
        value: "all",
    },
    {
        label: "Unread",
        slot: "unread",
        value: "unread",
    },
];

const messages = ref([]);
const toast = useToast();
const overlay = useOverlay();
const isLoading = ref(false);

const {
    public: { siteDomain },
} = useRuntimeConfig();
const linkValue = computed(() => {
    return `${siteDomain}/@${useAuthStore().userData?.username}`;
});

const modal = overlay.create(LinkShareDialog, {
    props: {
        shareUrl: linkValue,
        title: "Share your anonymous link",
    },
});

const { copyToClipboard } = useCopyToClipboard();

const activeTab = ref("all");

const filteredMessages = computed(() => {
    if (activeTab.value === "unread") {
        return messages.value.filter((message) => !message.is_read);
    }
    return messages.value;
});

function copyLinkToClipboard() {
    copyToClipboard(linkValue.value, {
        successTitle: "Link Copied",
        successDescription: "Your anonymous link has been copied to clipboard",
    });
}

function removeMessageItem(message_props) {
    const index = messages.value.findIndex(
        (message) => message.id === message_props.id
    );
    let message_text = message_props.text;
    messages.value.splice(index, 1);
    toast.add({
        title: "Message deleted",
        description: `Successfully deleted message: ${
            message_text ||
            `${
                message_props.message_type.charAt(0).toUpperCase() +
                message_props.message_type.slice(1)
            } message`
        }`,
        color: "primary",
        actions: [
            {
                label: "Undo",
                color: "primary",
                icon: "material-symbols:undo",
                variant: "outline",
                onClick: async () => {
                    try {
                        const { sendMessage } = useMessagesAPI();
                        const formData = new FormData();

                        // Add all message properties to FormData
                        formData.append(
                            "message_type",
                            message_props.message_type
                        );
                        formData.append(
                            "receiver",
                            useAuthStore().userData?.username
                        );

                        // Only append text_content if it exists and is not empty
                        if (message_props.text && message_props.text.trim()) {
                            formData.append("text_content", message_props.text);
                        }

                        // If there's media content, add it back
                        if (message_props.content) {
                            // Fetch the media content and convert to File
                            const response = await fetch(message_props.content);
                            const blob = await response.blob();

                            // Determine the correct file extension and MIME type
                            let fileExtension;
                            let mimeType;

                            switch (message_props.message_type) {
                                case "image":
                                    fileExtension = "jpg";
                                    mimeType = "image/jpeg";
                                    break;
                                case "video":
                                    fileExtension = "mp4";
                                    mimeType = "video/mp4";
                                    break;
                                case "audio":
                                    fileExtension = "mp3";
                                    mimeType = "audio/mpeg";
                                    break;
                                default:
                                    fileExtension = "bin";
                                    mimeType = blob.type;
                            }

                            const file = new File(
                                [blob],
                                `restored-${Date.now()}.${fileExtension}`,
                                {
                                    type: mimeType,
                                }
                            );

                            formData.append("media_content", file);
                        }

                        const { status, data } = await sendMessage(formData);
                        if (status === 201) {
                            // Add the message back to the UI
                            messages.value.splice(index, 0, data);
                            toast.add({
                                title: "Message restored",
                                description:
                                    "The message has been successfully restored",
                                color: "success",
                            });
                        }
                    } catch (error) {
                        console.error("Error restoring message:", error);
                        toast.add({
                            title: "Error",
                            description: "Failed to restore message",
                            color: "error",
                        });
                    }
                },
            },
        ],
    });
}

async function refreshMessages() {
    isLoading.value = true;
    try {
        const { fetchMessages } = useMessagesAPI();
        messages.value = await fetchMessages();
    } catch (error) {
        console.error("Error fetching messages:", error);
        toast.add({
            title: "Error",
            description: "Failed to load messages",
            color: "error",
        });
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    await refreshMessages();
});
</script>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}
</style>
