import { useToast } from "#imports";

export function useCopyToClipboard() {
    const toast = useToast();

    const copyToClipboard = (text, options = {}) => {
        const {
            successTitle = "Copied",
            successDescription = "Text has been copied to clipboard",
            errorTitle = "Copy Failed",
            errorDescription = "Could not copy text to clipboard",
            successColor = "primary",
            errorColor = "error",
            showToast = true,
        } = options;

        return navigator.clipboard
            .writeText(text)
            .then(() => {
                if (showToast) {
                    toast.add({
                        title: successTitle,
                        description: successDescription,
                        color: successColor,
                    });
                }
                return true;
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
                if (showToast) {
                    toast.add({
                        title: errorTitle,
                        description: errorDescription,
                        color: errorColor,
                    });
                }
                return false;
            });
    };

    return {
        copyToClipboard,
    };
}
