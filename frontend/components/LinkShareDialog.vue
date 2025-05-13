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
                    <ShareButton
                        v-for="button in shareButtons"
                        v-bind="button"
                        :key="button.label"
                    />
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
const {
    shareViaWebShare,
    shareViaTwitter,
    shareViaFacebook,
    shareViaEmail,
    shareViaInstagram,
    shareViaWhatsApp,
    shareViaSnapchat,
    shareViaTelegram,
} = useShare();

const shareMessage = `Send me anonymous messages on Incognito: ${props.shareUrl}`;

const closeModal = () => {
    emit("close");
};

const shareButtons = [
    {
        icon: "lucide:twitter",
        label: "Twitter",
        bgColor: "#3b5998",
        shareFunction: () =>
            shareViaTwitter({ text: shareMessage, url: props.shareUrl }),
    },
    {
        icon: "lucide:facebook",
        label: "Facebook",
        bgColor: "#1877f2",
        shareFunction: () => shareViaFacebook({ url: props.shareUrl }),
    },
    {
        icon: "lucide:instagram",
        label: "Instagram",
        bgColor: "#e4405f",
        shareFunction: () => shareViaInstagram({ text: shareMessage }),
    },
    {
        icon: "ic:baseline-whatsapp",
        label: "WhatsApp",
        color: "success",
        shareFunction: () =>
            shareViaWhatsApp({ text: shareMessage, url: props.shareUrl }),
    },
    {
        icon: "ic:outline-snapchat",
        label: "Snapchat",
        bgColor: "#c4c237",
        bgHoverColor: "#FFFC08",
        shareFunction: () => shareViaSnapchat({ url: props.shareUrl }),
    },
    {
        icon: "ic:baseline-telegram",
        label: "Telegram",
        bgColor: "#30ADED",
        shareFunction: () =>
            shareViaTelegram({ text: shareMessage, url: props.shareUrl }),
    },
    {
        icon: "ic:baseline-email",
        label: "Email",
        bgColor: "#0088cc",
        ariaLabel: "Share via Email",
        shareFunction: () =>
            shareViaEmail({ subject: shareMessage, body: shareMessage }),
    },
    {
        icon: "material-symbols:share-outline",
        label: "More",
        bgColor: "#0088cc",
        ariaLabel: "More sharing options",
        shareFunction: () =>
            shareViaWebShare({
                title: props.title,
                text: shareMessage,
                url: props.shareUrl,
            }),
    },
];
</script>
