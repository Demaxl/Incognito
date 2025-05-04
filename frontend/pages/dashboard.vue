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
                    <UButton
                        variant="outline"
                        class="cursor-pointer"
                        size="xl"
                        icon="material-symbols:content-copy-outline"
                        @click="copyLinkToClipboard"
                    />
                    <UButton
                        variant="outline"
                        size="xl"
                        icon="material-symbols:share-outline"
                    />
                </div>
            </UCard>
            <div class="flex items-center justify-between">
                <UTabs
                    :items="tabItems"
                    size="lg"
                    :content="false"
                    :ui="{ trigger: 'basis-[fit-content] px-3 py-1' }"
                >
                </UTabs>
                <div class="text-sm text-gray-500">
                    {{ messages.length }} messages
                </div>
            </div>
            <div class="mt-4 space-y-4 block">
                <TransitionGroup name="list">
                    <MessageItem
                        v-for="message in messages"
                        :key="message.id"
                        v-bind="message"
                        @delete="removeMessageItem"
                    />
                </TransitionGroup>
            </div>
        </div>
    </main>
</template>

<script setup>
const tabItems = [
    {
        label: "All Messages",
        slot: "all",
    },
    {
        label: "Unread",
        slot: "unread",
    },
];

const messages = ref([]);
const toast = useToast();

const {
    public: { siteDomain },
} = useRuntimeConfig();
const linkValue = computed(() => {
    return `${siteDomain}/message/${useAuthStore().userData?.username}`;
});

function copyLinkToClipboard() {
    navigator.clipboard
        .writeText(linkValue.value)
        .then(() => {
            toast.add({
                title: "Link Copied",
                description: "Your anonymous link has been copied to clipboard",
                color: "primary",
            });
        })
        .catch((err) => {
            console.error("Failed to copy text: ", err);
            toast.add({
                title: "Copy Failed",
                description: "Could not copy link to clipboard",
                color: "error",
            });
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
        description: `Successfully deleted message: ${message_text}`,
        color: "primary",
        actions: [
            {
                label: "Undo",
                color: "primary",
                icon: "material-symbols:undo",
                variant: "outline",
                onClick: () => {
                    messages.value.splice(index, 0, message_props);
                    // TODO: Add undo functionality. Send API response to server to undo deletion
                },
            },
        ],
    });
}

onMounted(async () => {
    const { fetchMessages } = useMessagesAPI();
    messages.value = await fetchMessages();
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
