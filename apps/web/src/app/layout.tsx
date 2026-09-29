import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";

import "../index.css";
import Providers from "@/components/providers";
import { env } from "@next-js-template/env/web";
import { cn } from "@next-js-template/ui/lib/utils";
import { getSeoMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = getSeoMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, geistMono.variable)}>
      <body className="antialiased">
        <Providers>{children}</Providers>
        {env.NEXT_PUBLIC_TKIT_WIDGET_ID && (
          <Script
            src="https://cdn.tkit.ai/widget.js"
            data-widget-id={env.NEXT_PUBLIC_TKIT_WIDGET_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
