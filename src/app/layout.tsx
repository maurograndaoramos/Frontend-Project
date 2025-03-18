// src/app/layout.tsx
import type { Metadata } from "next";
import Layout from '../components/Layouts';
import Providers from "./providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Mrs. Pots - Beautiful pottery for your home",
  description: "Shop for handcrafted pottery and ceramics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}