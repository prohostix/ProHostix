const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function getSeoMetadata(pageIdentifier: string) {
    try {
        // Fetch with revalidation every 60 seconds
        const res = await fetch(`${API_URL}/seo/metadata/${pageIdentifier}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch SEO for ${pageIdentifier}:`, error);
        return null;
    }
}
