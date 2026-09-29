import type { Metadata } from "next";
import { SITE_INFO } from "@/constants/site";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrlRelative?: string;
  keywords?: string[];
}

const config = {
  websiteName: `${SITE_INFO.name} - ${SITE_INFO.tagline}`,
  websiteDescription: SITE_INFO.description,
  websiteUrl: SITE_INFO.url,
};

export function getSeoMetadata({
  title,
  description,
  canonicalUrlRelative,
  keywords = [],
}: SEOProps = {}): Metadata {
  const seoTitle = title || config.websiteName;
  const seoDescription = description || config.websiteDescription;
  const canonicalUrl = `${config.websiteUrl}${canonicalUrlRelative || ""}`;

  const metadata: Metadata = {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords.length > 0 ? keywords : [...SITE_INFO.keywords],
    metadataBase: new URL(config.websiteUrl),
    alternates: {
      canonical: canonicalUrlRelative || "/",
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: SITE_INFO.legalName,
      locale: "en_US",
      type: "website",
      images: [{ url: SITE_INFO.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [{ url: SITE_INFO.ogImage }],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  return metadata;
}
