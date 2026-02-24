// utils/normalizeContentImages.js
export const normalizeContentImages = (content) => {
    if (!content) return content;

    // Only prepend /uploads/ if the src doesn't start with http, https, data:, or /uploads/
    return content.replace(
        /(<img[^>]+src=["'])(?!https?:\/\/|data:|\/uploads\/)([^"']+)/gi,
        `$1/uploads/$2`
    );
};
