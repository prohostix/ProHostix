
import type { Metadata } from "next";
import "./globals.css";
import "lenis/dist/lenis.css";
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
    "enterprise software development",
    "offshore software development",
    "digital transformation agency",
    "global IT services",
    "custom software agency",
    "ProHostix",
    "remote software engineering teams",
    "B2B software solutions",
    "scalable SaaS architecture",
    "offshore development center"
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
    canonical: "/",
    languages: {
      'x-default': '/',
      'en': '/',
    },
  },
  category: "technology",
};

const GTM_ID = "GTM-M8R8V7NK";
// Optional retargeting pixels — set these env vars to enable them
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "name": "ProHostix",
    "url": "https://www.prohostix.com",
    "logo": "https://www.prohostix.com/logo.png",
    "description": "ProHostix is a global custom software development company, specializing in ERP systems, CRM platforms, SaaS products, web & mobile apps, and cloud architecture.",
    "foundingDate": "2020",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "A-18 Sector 59, Office No G-07, Jav Tower",
      "addressLocality": "Noida",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201301",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "info@prohostix.com",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://x.com/prohostix",
      "https://instagram.com/prohostix",
      "https://www.facebook.com/people/ProHostix/61583716765510/"
    ],
    "areaServed": {
      "@type": "GeoShape",
      "addressCountry": "Global"
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
    },
    "founder": {
      "@type": "Person",
      "name": "Dilshad Ashraf",
      "jobTitle": "Chief Executive Officer",
      "description": "Dilshad Ashraf is an exceptionally talented young Indian tech entrepreneur, software strategist, and the Chief Executive Officer (CEO) of ProHostix LLP. Driven by a lifelong ambition to leave a permanent mark on the global technology landscape, Ashraf is actively redefining the future of enterprise software through custom cloud architectures, cutting-edge SaaS platforms, and forward-thinking digital ecosystems.",
      "birthPlace": {
        "@type": "Place",
        "name": "Calicut (Kozhikode), Kerala, India"
      },
      "alumniOf": [
        {
          "@type": "Organization",
          "name": "IRPS Pvt. Ltd."
        },
        {
          "@type": "Organization",
          "name": "Total Trust Air Conditioning"
        }
      ],
      "sameAs": [
        "https://www.linkedin.com/company/prohostix"
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Google Tag Manager — inline in the initial HTML so crawlers/auditors can detect it */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {META_PIXEL_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
            }}
          />
        )}
        {LINKEDIN_PARTNER_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `_linkedin_partner_id="${LINKEDIN_PARTNER_ID}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`,
            }}
          />
        )}
      </head>
      <body className="antialiased bg-black text-white">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
