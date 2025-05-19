import { useToast } from "#imports";

export const useShare = () => {
    const toast = useToast();

    // Helper function to create a File object from a blob
    const createFileFromBlob = (blob, fileName, fileType) => {
        return new File([blob], fileName, {
            type: fileType,
            lastModified: new Date().getTime(),
        });
    };

    // Helper function to fetch and convert URL to blob
    const fetchAsBlob = async (url) => {
        const response = await fetch(url);
        return await response.blob();
    };

    // Helper function to download a file
    const downloadFile = (url, fileName) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper function to show toast notifications
    const showToast = (title, description, color = "primary") => {
        toast.add({ title, description, color });
    };

    // Helper function to prepare media file for sharing
    const prepareMediaFile = async (mediaUrl, mediaType) => {
        const mediaBlob = await fetchAsBlob(mediaUrl);
        const extension = mediaType === "video" ? "mp4" : "mp3";
        const mimeType = mediaType === "video" ? "video/mp4" : "audio/mpeg";
        const fileName = `incognito-${mediaType}-${Date.now()}.${extension}`;

        return createFileFromBlob(mediaBlob, fileName, mimeType);
    };

    // Helper function to prepare card image for sharing
    const prepareCardImage = async (imageUrl) => {
        const imageBlob = await fetchAsBlob(imageUrl);
        const fileName = `incognito-card-${Date.now()}.png`;
        return createFileFromBlob(imageBlob, fileName, "image/png");
    };

    // Main sharing function
    async function shareViaWebShare({
        title,
        text,
        url,
        imageUrl,
        mediaUrl,
        mediaType,
    }) {
        if (!process.client || !navigator.share) {
            showToast(
                "Sharing not supported",
                "Your browser doesn't support the sharing feature.",
                "error"
            );
            return false;
        }

        try {
            const shareData = { title, text, url };

            const filesToShare = [];
            if (imageUrl) {
                filesToShare.push(prepareCardImage(imageUrl));
            }
            // Handle media messages (video/audio)
            if (mediaUrl && mediaType) {
                filesToShare.push(prepareMediaFile(mediaUrl, mediaType));
            }

            shareData.files = await Promise.all(filesToShare);
            console.log(shareData);
            await navigator.share(shareData);
            return true;
        } catch (error) {
            console.error("Error sharing media:", error);

            // Fallback to download if sharing fails
            if (mediaUrl && mediaType) {
                downloadFile(
                    mediaUrl,
                    `incognito-${mediaType}-${Date.now()}.mp4`
                );
            } else if (imageUrl) {
                downloadFile(imageUrl, `incognito-card-${Date.now()}.png`);
            }
            showToast(
                "Sharing failed",
                "The message has been downloaded instead.",
                "warning"
            );
            return false;
        }
    }

    // Social media sharing functions
    const shareViaTwitter = ({ text, url }) => {
        if (!process.client) return;

        const shareText = encodeURIComponent(text);
        const shareUrl = url ? `&url=${encodeURIComponent(url)}` : "";
        window.open(
            `https://twitter.com/intent/tweet?text=${shareText}${shareUrl}`,
            "_blank"
        );
        showToast(
            "Opening Twitter...",
            "Share your content with your followers.",
            "primary"
        );
    };

    const shareViaFacebook = ({ url }) => {
        if (!process.client) return;

        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
            )}`,
            "_blank"
        );
        showToast(
            "Opening Facebook...",
            "Share your content with your friends.",
            "primary"
        );
    };

    const shareViaEmail = ({ subject, body }) => {
        if (!process.client) return;

        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        window.open(
            `mailto:?subject=${encodedSubject}&body=${encodedBody}`,
            "_blank"
        );
        showToast(
            "Opening email client...",
            "Share your content via email.",
            "primary"
        );
    };

    const shareViaInstagram = ({ text }) => {
        const { copyToClipboard } = useCopyToClipboard();
        copyToClipboard(text, { showToast: false });
        showToast(
            "Content copied for Instagram!",
            "Paste this content in your Instagram bio or stories.",
            "primary"
        );
    };

    const shareViaWhatsApp = ({ text, url }) => {
        if (!process.client) return;

        const shareText = encodeURIComponent(text);
        const shareUrl = url ? `&url=${encodeURIComponent(url)}` : "";
        window.open(`https://wa.me/?text=${shareText}${shareUrl}`, "_blank");
        showToast(
            "Opening WhatsApp...",
            "Share your content with your contacts.",
            "success"
        );
    };

    const shareViaSnapchat = ({ url }) => {
        if (!process.client) return;

        const snapchatShareUrl = `https://www.snapchat.com/share?link=${encodeURIComponent(
            url
        )}`;
        window.open(snapchatShareUrl, "_blank");
        showToast(
            "Opening Snapchat...",
            "Share your content with your friends.",
            "primary"
        );
    };

    const shareViaTelegram = ({ text, url }) => {
        if (!process.client) return;

        const shareText = encodeURIComponent(text);
        const shareUrl = url ? `&url=${encodeURIComponent(url)}` : "";
        window.open(
            `https://t.me/share/url?text=${shareText}${shareUrl}`,
            "_blank"
        );
        showToast(
            "Opening Telegram...",
            "Share your content with your contacts.",
            "primary"
        );
    };

    return {
        downloadFile,
        shareViaWebShare,
        shareViaTwitter,
        shareViaFacebook,
        shareViaEmail,
        shareViaInstagram,
        shareViaWhatsApp,
        shareViaSnapchat,
        shareViaTelegram,
    };
};
