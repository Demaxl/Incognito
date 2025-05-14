/**
 * Sanitizes a URL to ensure it's safe to use
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL
 */
export function sanitizeUrl(url) {
    if (!url) return "";

    // Remove any script tags and their content
    url = url.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
    );

    // Remove any HTML tags
    url = url.replace(/<[^>]*>/g, "");

    // Remove any javascript: protocol
    url = url.replace(/^javascript:/i, "");

    // Remove any data: protocol except for images
    if (!url.startsWith("data:image/")) {
        url = url.replace(/^data:/i, "");
    }

    return url;
}

/**
 * Sanitizes text content to ensure it's safe to display
 * @param {string} text - The text to sanitize
 * @returns {string} - The sanitized text
 */
export function sanitizeText(text) {
    if (!text) return "";

    // Remove any script tags and their content
    text = text.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
    );

    // Remove any HTML tags
    text = text.replace(/<[^>]*>/g, "");

    return text;
}
