import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ProHostix | Custom Software Development Company',
    short_name: 'ProHostix',
    description: 'ProHostix is a custom software development company in Noida, specializing in ERP systems, CRM platforms, SaaS products, web & mobile apps, and cloud architecture.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
