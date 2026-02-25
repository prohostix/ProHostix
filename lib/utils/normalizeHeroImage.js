export const normalizeHeroImage = (img) => {
    if (!img) return img;
    // Intercept legacy Cloudinary URLs and transform to local assets
    if (img.includes("res.cloudinary.com") && img.includes("/prohostix/static/")) {
        return `/${img.split('/').pop()}`;
    }
    // If it's a full URL (Cloudinary) or Base64 data URI, return as is
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    // If it's already a relative path (starts with /), return as is
    if (img.startsWith("/")) return img;
    // Fallback for legacy simple filenames without leading slash
    return `/uploads/${img}`;
};
