const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function getSeoMetadata(pageIdentifier: string) {
    // skip fetching if we're in build and no production API URL is available
    if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_API_URL && API_URL.includes('localhost')) {
        return null;
    }
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
