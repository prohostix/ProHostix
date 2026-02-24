import { useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to manage SEO metadata
 * @param {Object} options - SEO options
 * @param {string} options.title - Meta title
 * @param {string} options.description - Meta description
 * @param {Array} options.keywords - Meta keywords
 * @param {string} options.image - Open Graph image
 * @param {string} options.type - page type (article, website)
 */
export const useSeo = ({
    title,
    description,
    keywords = [],
    image,
    type = 'website'
}) => {
    const { data: settings } = useSelector(state => state.settings);

    useEffect(() => {
        const companyName = settings?.companyName || 'ProHostix';
        const siteUrl = settings?.siteUrl || window.location.origin;
        const defaultTitle = settings?.defaultSeoTitle || `${companyName} | Engineering Intelligent Solutions`;
        const defaultDesc = settings?.defaultSeoDescription || 'Architecting high-performance digital ecosystems with precision-engineered AI solutions.';

        // Update Title
        const metaTitle = title ? `${title} | ${companyName}` : defaultTitle;
        document.title = metaTitle;

        // Update Meta Tags
        const updateMeta = (name, content, property = false) => {
            if (!content) return;
            let el = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
            if (el) {
                el.setAttribute('content', content);
            } else {
                el = document.createElement('meta');
                if (property) el.setAttribute('property', name);
                else el.setAttribute('name', name);
                el.setAttribute('content', content);
                document.head.appendChild(el);
            }
        };

        updateMeta('description', description || defaultDesc);
        updateMeta('keywords', keywords.join(', '));

        // Open Graph
        updateMeta('og:title', metaTitle, true);
        updateMeta('og:description', description || defaultDesc, true);
        updateMeta('og:type', type, true);
        updateMeta('og:url', window.location.href, true);
        if (image) updateMeta('og:image', image, true);

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', metaTitle);
        updateMeta('twitter:description', description || defaultDesc);
        if (image) updateMeta('twitter:image', image);

    }, [title, description, keywords, image, type, settings]);
};
