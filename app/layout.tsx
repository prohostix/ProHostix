
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";

import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.prohostix.com'),
  title: {
    default: "ProHostix | Custom Software Development Company",
    template: "%s | ProHostix"
  },
  description: "ProHostix is a custom software development company specializing in ERP systems, CRM platforms, SaaS products, web & mobile apps, and cloud architecture for growing businesses.",
  keywords: [
    "software development company",
    "IT company",
    "custom software development",
    "ERP development",
    "CRM development",
    "SaaS development",
    "web application development",
    "mobile app development",
    "cloud architecture",
    "software company",
    "IT firm",
    "enterprise software",
    "digital transformation",
    "software agency",
    "ProHostix",
  ],
  authors: [{ name: "ProHostix", url: "https://www.prohostix.com" }],
  creator: "ProHostix",
  publisher: "ProHostix",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.prohostix.com",
    siteName: "ProHostix",
    title: "ProHostix | Custom Software Development Company",
    description: "ProHostix builds intelligent, scalable digital solutions — from custom ERPs and SaaS platforms to cloud architectures — for growing businesses worldwide.",
    images: [
      {
        url: "/hero-ai.jpg",
        width: 1200,
        height: 630,
        alt: "ProHostix - Custom Software Development Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProHostix | Custom Software Development Company",
    description: "ProHostix builds intelligent, scalable digital solutions — from custom ERPs and SaaS platforms to cloud architectures — for growing businesses worldwide.",
    images: ["/hero-ai.jpg"],
    creator: "@prohostix",
    site: "@prohostix",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  alternates: {
    canonical: "https://www.prohostix.com",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ProHostix",
    "url": "https://www.prohostix.com",
    "logo": "https://www.prohostix.com/logo.png",
    "description": "ProHostix is a custom software development company specializing in ERP systems, CRM platforms, SaaS products, web & mobile apps, and cloud architecture.",
    "foundingDate": "2020",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@prohostix.com",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://x.com/prohostix",
      "https://instagram.com/prohostix",
      "https://facebook.com/prohostix"
    ],
    "serviceArea": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Development Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom ERP Development" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SaaS Platform Development" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Application Development" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile App Development" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CRM Development" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cloud Architecture & DevOps" } }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ProHostix",
    "url": "https://www.prohostix.com",
    "description": "Custom software development company — ERP, SaaS, web & mobile apps, cloud architecture.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.prohostix.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased bg-black text-white">
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
