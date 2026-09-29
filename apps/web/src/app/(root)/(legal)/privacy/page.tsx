import { getSeoMetadata } from "@/lib/seo";

import { SITE_INFO } from "@/constants/site";
import { PRIVACY_POLICY } from "@/constants/privacy";

import { LegalDocument } from "../_components/legal-document";

export const metadata = getSeoMetadata({
  canonicalUrlRelative: "/privacy",
  title: PRIVACY_POLICY.title,
  description: PRIVACY_POLICY.description,
});

export default function PrivacyPolicyPage() {
  return <LegalDocument contactEmail={SITE_INFO.email} document={PRIVACY_POLICY} />;
}
