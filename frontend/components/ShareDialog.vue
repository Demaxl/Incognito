<template>
    <UModal>
        <template #content>
            <UCard :ui="{ root: 'divide-none' }">
                <template #header>
                    <div class="space-y-1">
                        <h3 class="text-lg font-semibold">
                            Share your anonymous link
                        </h3>
                        <p class="text-sm text-gray-500">
                            Anyone with this link can send you anonymous
                            messages. Share it on your social media or send it
                            directly to friends.
                        </p>
                    </div>
                </template>
                <div class="flex items-center space-x-2 mb-10">
                    <div class="grid flex-1 gap-2">
                        <label for="link" class="sr-only">Link</label>
                        <UInput
                            id="link"
                            :value="shareUrl"
                            readonly
                            class="font-mono text-sm"
                            size="lg"
                        />
                    </div>
                    <UTooltip text="Copy link" :delayDuration="0">
                        <UButton
                            variant="outline"
                            class="cursor-pointer"
                            size="lg"
                            icon="material-symbols:content-copy-outline"
                            @click="
                                copyToClipboard(props.shareUrl, {
                                    successTitle: 'Link Copied',
                                    successDescription:
                                        'Your anonymous link has been copied to clipboard',
                                })
                            "
                        />
                    </UTooltip>
                </div>
                <div class="grid grid-cols-4 gap-4 mb-4">
                    <UButton
                        color="neutral"
                        variant="solid"
                        class="flex flex-col cursor-pointer bg-[#3b5998] items-center justify-center gap-1 p-3 h-auto"
                        @click="shareViaTwitter"
                        aria-label="Share on Twitter"
                    >
                        <UIcon name="lucide:twitter" size="24" />
                        <span class="text-sm hidden sm:block">Twitter</span>
                    </UButton>
                    <UButton
                        color="neutral"
                        variant="solid"
                        class="flex flex-col cursor-pointer bg-[#1877f2] items-center justify-center gap-1 p-3 h-auto"
                        @click="shareViaFacebook"
                        aria-label="Share on Facebook"
                    >
                        <UIcon name="lucide:facebook" size="24" />
                        <span class="text-sm hidden sm:block">Facebook</span>
                    </UButton>
                    <UButton
                        color="neutral"
                        variant="solid"
                        class="flex flex-col cursor-pointer bg-[#e4405f] items-center justify-center gap-1 p-3 h-auto"
                        @click="shareViaInstagram"
                        aria-label="Share on Instagram"
                    >
                        <UIcon name="lucide:instagram" size="24" />
                        <span class="text-sm hidden sm:block">Instagram</span>
                    </UButton>
                    <UButton
                        color="success"
                        variant="solid"
                        class="flex flex-col cursor-pointer items-center justify-center gap-1 p-3 h-auto"
                        @click="shareViaWhatsApp"
                        aria-label="Share on WhatsApp"
                    >
                        <UIcon name="ic:baseline-whatsapp" size="24" />
                        <span class="text-sm hidden sm:block">WhatsApp</span>
                    </UButton>
                    <UButton
                        color="neutral"
                        variant="solid"
                        class="flex flex-col cursor-pointer bg-[#c4c237] hover:bg-[#FFFC08] items-center justify-center gap-1 p-3 h-auto"
                        @click="shareViaSnapchat"
                        aria-label="Share on Snapchat"
                    >
                        <UIcon name="ic:outline-snapchat" size="24" />
                        <span class="text-sm hidden sm:block">Snapchat</span>
                    </UButton>
                    <UButton
                        color="neutral"
                        variant="solid"
                        class="flex flex-col cursor-pointer bg-[#30ADED] items-center justify-center gap-1 p-3 h-auto"
                        @click="shareViaTelegram"
                        aria-label="Share on Telegram"
                    >
                        <UIcon name="ic:baseline-telegram" size="24" />
                        <span class="text-sm hidden sm:block">Telegram</span>
                    </UButton>

                    <UButton
                        color="neutral"
                        variant="solid"
                        class="flex flex-col cursor-pointer bg-[#0088cc] items-center justify-center gap-1 p-3 h-auto"
                        @click="shareViaEmail"
                        aria-label="Share via Email"
                    >
                        <UIcon name="ic:baseline-email" size="24" />
                        <span class="text-sm hidden sm:block">Email</span>
                    </UButton>
                    <UButton
                        v-if="hasWebShareApi"
                        color="neutral"
                        variant="solid"
                        class="flex flex-col cursor-pointer bg-[#0088cc] items-center justify-center gap-1 p-3 h-auto"
                        @click="shareViaWebShare"
                        aria-label="More sharing options"
                    >
                        <UIcon
                            name="material-symbols:share-outline"
                            size="24"
                        />
                        <span class="text-sm hidden sm:block">More</span>
                    </UButton>
                </div>
                <template #footer>
                    <div class="flex justify-start">
                        <UButton
                            type="button"
                            variant="soft"
                            class="py-3 px-4 cursor-pointer"
                            @click="closeModal"
                            size="xl"
                        >
                            Close
                        </UButton>
                    </div>
                </template>
            </UCard>
        </template>
    </UModal>
</template>

<script setup>
const props = defineProps({
    shareUrl: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: "Incognito",
    },
});

const emit = defineEmits(["close"]);

const { copyToClipboard } = useCopyToClipboard();
const toast = useToast();
const hasWebShareApi = ref(false);
// Check if Web Share API is available
hasWebShareApi.value = !!(process.client && navigator.share);

const shareMessage = `Send me anonymous messages on Incognito: ${props.shareUrl}`;

const shareViaWebShare = async () => {
    if (process.client && navigator.share) {
        try {
            await navigator.share({
                title: props.title,
                text: shareMessage,
                url: props.shareUrl,
            });
            toast.add({
                title: "Shared successfully!",
                description: "Your link has been shared.",
                color: "success",
            });
        } catch (error) {
            // User cancelled or share failed
            console.error("Error sharing:", error);
        }
    } else {
        toast.add({
            title: "Sharing not supported",
            description:
                "Your browser doesn't support native sharing. Please use the copy link option.",
            color: "error",
        });
    }
};

const shareViaTwitter = () => {
    if (process.client) {
        const text = encodeURIComponent(shareMessage);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
        toast.add({
            title: "Opening Twitter...",
            description: "Share your anonymous link with your followers.",
            ui: {
                progress: "bg-[#3b5998]",
            },
        });
    }
};

const shareViaFacebook = () => {
    if (process.client) {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                props.shareUrl
            )}`,
            "_blank"
        );
        toast.add({
            title: "Opening Facebook...",
            description: "Share your anonymous link with your friends.",
            ui: {
                progress: "bg-[#1877f2]",
            },
        });
    }
};

const shareViaEmail = () => {
    if (process.client) {
        const subject = encodeURIComponent(shareMessage);
        const body = encodeURIComponent(shareMessage);
        window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
        toast.add({
            title: "Opening email client...",
            description: "Share your anonymous link via email.",
            color: "primary",
        });
    }
};

const shareViaInstagram = () => {
    // Instagram doesn't have a direct web sharing API like Twitter
    // Usually, people copy the link and paste it in their Instagram bio or stories
    copyToClipboard(shareMessage, {
        showToast: false,
    });
    toast.add({
        title: "Link copied for Instagram!",
        description: "Paste this link in your Instagram bio or stories.",
        ui: {
            progress: "bg-[#e4405f]",
        },
    });
};

const shareViaWhatsApp = () => {
    if (process.client) {
        const text = encodeURIComponent(
            `Send me anonymous messages on Incognito: ${props.shareUrl}`
        );
        window.open(`https://wa.me/?text=${text}`, "_blank");
        toast.add({
            title: "Opening WhatsApp...",
            description: "Share your anonymous link with your contacts.",
            color: "success",
        });
    }
};

const shareViaSnapchat = () => {
    // Construct the Snapchat share URL
    const snapchatShareUrl = `https://www.snapchat.com/share?link=${encodeURIComponent(
        props.shareUrl
    )}`;

    // Open Snapchat sharing
    window.open(snapchatShareUrl, "_blank");
    toast.add({
        title: "Opening Snapchat...",
        description: "Share your anonymous link with your friends.",
        color: "primary",
        ui: {
            progress: "bg-[#c4c237]",
        },
    });
};

const shareViaTelegram = () => {
    if (process.client) {
        const text = encodeURIComponent(shareMessage);
        window.open(
            `https://t.me/share/url?url=${encodeURIComponent(
                shareMessage
            )}&text=${text}`,
            "_blank"
        );
        toast.add({
            title: "Opening Telegram...",
            description: "Share your anonymous link with your contacts.",
            ui: {
                progress: "bg-[#30ADED]",
            },
        });
    }
};

const closeModal = () => {
    emit("close");
};
</script>
