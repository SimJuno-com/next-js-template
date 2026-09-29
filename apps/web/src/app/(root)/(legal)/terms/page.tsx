import { getSeoMetadata } from "@/lib/seo";

import { SITE_INFO } from "@/constants/site";
import { TERMS_OF_SERVICE } from "@/constants/terms";

import { LegalDocument } from "../_components/legal-document";

export const metadata = getSeoMetadata({
  canonicalUrlRelative: "/terms",
  title: TERMS_OF_SERVICE.title,
  description: TERMS_OF_SERVICE.description,
});

export default function TermsOfServicePage() {
  return <LegalDocument contactEmail={SITE_INFO.email} document={TERMS_OF_SERVICE} />;
}
