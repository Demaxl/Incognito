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
                        :value="
                            'https://incognito.app/message/' +
                            useAuthStore().userData?.username
                        "
                        class="text-sm w-full"
                        size="xl"
                    />
                    <UButton
                        variant="outline"
                        size="xl"
                        icon="material-symbols:content-copy-outline"
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
                <div class="text-sm text-gray-500">4 messages</div>
            </div>
            <div class="mt-4 space-y-4 block">
                <MessageItem
                    v-for="message in messages"
                    :key="message.id"
                    v-bind="message"
                />
            </div>
        </div>
    </main>
</template>

<script setup>
const messages = ref([]);

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

onMounted(async () => {
    const { fetchMessages } = useMessagesAPI();
    messages.value = await fetchMessages();
});
</script>
