const RAW_API = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/api` : "http://localhost:3000/api";
const API_BASE = RAW_API.replace(/\/api$/, "");

export const getAbsoluteImageUrl = (src) => {
    if (!src) return "";

    // Intercept legacy Cloudinary URLs and transform to local assets
    if (src.includes("res.cloudinary.com") && src.includes("/prohostix/static/")) {
        const filename = src.split('/').pop();
        // Fallback for known missing assets or generic leadership photos
        if (filename === 'dilshad.jpg' || filename === 'akhilesh.jpg') {
            return "/working-professional.jpg";
        }
        return `/${filename}`;
    }

    // If it's a full Cloudinary URL, external link, or Base64 data URI, return as is
    if (src.startsWith("http") || src.startsWith("data:")) return src;

    // If it starts with / but not /uploads, it's a local static asset in public/
    if (src.startsWith("/") && !src.startsWith("/uploads")) {
        return src;
    }

    // Handle legacy /uploads paths for existing data
    if (src.startsWith("/uploads")) {
        return `${API_BASE}${src}`;
    }

    // Default fallback for simple paths (assumed to be in server uploads)
    // If it's already a full relative path like "logo.png" without slash
    if (src.includes(".")) {
        // If it starts with a letter, check if it's in public or uploads
        // For now, assume it's an uploaded file if it doesn't have a leading slash
        return `${API_BASE}/uploads/${src}`;
    }

    return `${API_BASE}/uploads/${src}`;
};
