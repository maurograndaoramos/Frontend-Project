import type { Metadata } from "next";
import Layout from '../components/layout/Layouts';
import AuthStatus from "@/components/layout/AuthStatus";
import Providers from "./providers";
import "./globals.scss";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Blooming Delights - Fresh flowers and arrangements",
  description: "Shop for beautiful floral arrangements and fresh flowers",
  twitter: {
    card: 'summary_large_image',
    title: 'Blooming Delights - Fresh flowers and arrangements',
    description: 'Shop for beautiful floral arrangements and fresh flowers',
    creator: '@bloomingdelights',
    images: [
      {
        url: '/images/twitter/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Blooming Delights - Fresh flowers and arrangements'
      }
    ],
  },
  openGraph: {
    type: 'website',
    title: 'Blooming Delights - Fresh flowers and arrangements',
    description: 'Shop for beautiful floral arrangements and fresh flowers',
    images: [
      {
        url: '/images/twitter/og-image.jpg',
        width: 1200, 
        height: 630,
        alt: 'Blooming Delights - Fresh flowers and arrangements'
      }
    ],
    url: 'https://algarbloom.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://algarbloom.vercel.app/#organization',
                  'name': 'Blooming Delights',
                  'url': 'https://algarbloom.vercel.app',
                  'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://algarbloom.vercel.app/flower-shop-logo.svg',
                    'width': 800,
                    'height': 800
                  },
                  'sameAs': [
                    'https://facebook.com/bloomingdelights',
                    'https://instagram.com/bloomingdelights',
                    'https://twitter.com/bloomingdelights'
                  ]
                },
                {
                  '@type': 'LocalBusiness',
                  '@id': 'https://algarbloom.vercel.app/#localbusiness',
                  'name': 'Blooming Delights',
                  'url': 'https://algarbloom.vercel.app',
                  'image': 'https://algarbloom.vercel.app/images/twitter/og-image.jpg',
                  'description': 'Shop for beautiful floral arrangements and fresh flowers',
                  'telephone': '+351 123 456 789',
                  'email': 'contact@algarbloom.com',
                  'priceRange': '€€',
                  'address': {
                    '@type': 'PostalAddress',
                    'streetAddress': '123 Flower Street',
                    'addressLocality': 'Faro',
                    'addressRegion': 'Algarve',
                    'postalCode': '8000-000',
                    'addressCountry': 'PT'
                  },
                  'geo': {
                    '@type': 'GeoCoordinates',
                    'latitude': 37.019356,
                    'longitude': -7.930440
                  },
                  'openingHoursSpecification': [
                    {
                      '@type': 'OpeningHoursSpecification',
                      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                      'opens': '09:00',
                      'closes': '18:00'
                    },
                    {
                      '@type': 'OpeningHoursSpecification',
                      'dayOfWeek': ['Saturday'],
                      'opens': '10:00',
                      'closes': '16:00'
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body>
        <Providers>
          <Layout>
            <AuthStatus />
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}