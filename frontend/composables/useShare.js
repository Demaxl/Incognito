import { useToast } from "#imports";

export const useShare = () => {
    const toast = useToast();

    const shareViaWebShare = async ({ title, text, url, file }) => {
        if (process.client && navigator.share) {
            try {
                const shareData = {
                    title,
                    text,
                };

                // If we have a file, convert it to a File object
                if (file) {
                    // Convert data URL to blob
                    const response = await fetch(file);
                    const blob = await response.blob();

                    // Create a File object with a better name and explicit type
                    const fileName = "incognito-message-" + Date.now() + ".png";
                    const fileToShare = new File([blob], fileName, {
                        type: "image/png",
                        lastModified: new Date().getTime(),
                    });

                    // Some platforms handle files array better, others prefer a single file
                    shareData.files = [fileToShare];
                } else if (url) {
                    shareData.url = url;
                }

                // Try to share
                await navigator.share(shareData);
                // toast.add({
                //     title: "Shared successfully!",
                //     description: "Your content has been shared.",
                //     color: "success",
                // });
                return true;
            } catch (error) {
                console.error("Error sharing:", error);

                // If sharing failed, offer fallback
                if (file) {
                    // Offer download as fallback
                    const link = document.createElement("a");
                    link.href = file;
                    link.download = "incognito-message-" + Date.now() + ".png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    toast.add({
                        title: "Sharing failed",
                        description: "The image has been downloaded instead.",
                        color: "warning",
                    });
                }
                return false;
            }
        } else {
            // Web Share API not supported
            toast.add({
                title: "Sharing not supported",
                description:
                    "Your browser doesn't support the sharing feature.",
                color: "error",
            });
            return false;
        }
    };

    const shareViaTwitter = ({ text, url }) => {
        if (process.client) {
            const shareText = encodeURIComponent(text);
            const shareUrl = url ? `&url=${encodeURIComponent(url)}` : "";
            window.open(
                `https://twitter.com/intent/tweet?text=${shareText}${shareUrl}`,
                "_blank"
            );
            toast.add({
                title: "Opening Twitter...",
                description: "Share your content with your followers.",
                ui: {
                    progress: "bg-[#3b5998]",
                },
            });
        }
    };

    const shareViaFacebook = ({ url }) => {
        if (process.client) {
            window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    url
                )}`,
                "_blank"
            );
            toast.add({
                title: "Opening Facebook...",
                description: "Share your content with your friends.",
                ui: {
                    progress: "bg-[#1877f2]",
                },
            });
        }
    };

    const shareViaEmail = ({ subject, body }) => {
        if (process.client) {
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);
            window.open(
                `mailto:?subject=${encodedSubject}&body=${encodedBody}`,
                "_blank"
            );
            toast.add({
                title: "Opening email client...",
                description: "Share your content via email.",
                color: "primary",
            });
        }
    };

    const shareViaInstagram = ({ text }) => {
        // Instagram doesn't have a direct web sharing API
        // Usually, people copy the link and paste it in their Instagram bio or stories
        const { copyToClipboard } = useCopyToClipboard();
        copyToClipboard(text, {
            showToast: false,
        });
        toast.add({
            title: "Content copied for Instagram!",
            description: "Paste this content in your Instagram bio or stories.",
            ui: {
                progress: "bg-[#e4405f]",
            },
        });
    };

    const shareViaWhatsApp = ({ text, url }) => {
        if (process.client) {
            const shareText = encodeURIComponent(text);
            const shareUrl = url ? `&url=${encodeURIComponent(url)}` : "";
            window.open(
                `https://wa.me/?text=${shareText}${shareUrl}`,
                "_blank"
            );
            toast.add({
                title: "Opening WhatsApp...",
                description: "Share your content with your contacts.",
                color: "success",
            });
        }
    };

    const shareViaSnapchat = ({ url }) => {
        if (process.client) {
            const snapchatShareUrl = `https://www.snapchat.com/share?link=${encodeURIComponent(
                url
            )}`;
            window.open(snapchatShareUrl, "_blank");
            toast.add({
                title: "Opening Snapchat...",
                description: "Share your content with your friends.",
                color: "primary",
                ui: {
                    progress: "bg-[#c4c237]",
                },
            });
        }
    };

    const shareViaTelegram = ({ text, url }) => {
        if (process.client) {
            const shareText = encodeURIComponent(text);
            const shareUrl = url ? `&url=${encodeURIComponent(url)}` : "";
            window.open(
                `https://t.me/share/url?text=${shareText}${shareUrl}`,
                "_blank"
            );
            toast.add({
                title: "Opening Telegram...",
                description: "Share your content with your contacts.",
                ui: {
                    progress: "bg-[#30ADED]",
                },
            });
        }
    };

    return {
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
