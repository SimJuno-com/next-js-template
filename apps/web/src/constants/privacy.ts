import { SITE_INFO } from "@/constants/site";

export const PRIVACY_POLICY = {
  title: "Privacy Policy",
  lastUpdated: "September 11, 2026",
  description: `How we collect, use, and protect information when you use ${SITE_INFO.name}.`,
  clauses: [
    {
      id: "information-we-collect",
      title: "Information we collect",
      paragraphs: [
        `We collect information you provide when you purchase a plan, contact support, or otherwise use ${SITE_INFO.name}. This may include your name, email address, billing details, order history, and support messages.`,
        "We also collect limited technical and usage information, such as device and browser details, IP address, pages viewed, referral source, and service activity. This helps us operate, secure, and improve the service.",
      ],
    },
    {
      id: "how-we-use-information",
      title: "How we use information",
      paragraphs: [
        "We use your information to provide and support your eSIM plan, process payments, communicate about your order, and keep the service reliable and secure.",
      ],
      items: [
        "Deliver, activate, and manage travel data plans.",
        "Respond to questions, support requests, and service notices.",
        "Prevent fraud, abuse, and unauthorized activity.",
        "Understand how the service is used and improve it.",
      ],
    },
    {
      id: "how-we-share-information",
      title: "How we share information",
      paragraphs: [
        "We share information only when needed to provide the service, comply with law, protect our rights, or complete a business transaction. This may include payment processors, network and eSIM partners, cloud providers, analytics providers, and professional advisers.",
        "Our service providers may use information only on our instructions and for the purpose of providing their services to us.",
      ],
    },
    {
      id: "cookies-and-local-storage",
      title: "Cookies and local storage",
      paragraphs: [
        "We use cookies and local storage to keep the site working, remember preferences, understand usage, and improve performance. You can control cookies through your browser settings, although disabling them may affect some features.",
      ],
    },
    {
      id: "data-retention",
      title: "Data retention",
      paragraphs: [
        "We retain information for as long as reasonably necessary to provide the service, meet legal and accounting requirements, resolve disputes, and enforce our agreements. When information is no longer needed, we delete or de-identify it where practical.",
      ],
    },
    {
      id: "your-privacy-choices",
      title: "Your privacy choices",
      paragraphs: [
        "Depending on where you live, you may have rights to access, correct, delete, or restrict certain uses of your personal information. You may also have a right to object to processing or request a portable copy of your information.",
        "To make a privacy request, contact us using the details below. We may need to verify your identity before completing the request.",
      ],
    },
    {
      id: "changes-to-this-policy",
      title: "Changes to this policy",
      paragraphs: [
        "We may update this policy as our service or legal obligations change. We will post the updated version here and revise the last-updated date when we do.",
      ],
    },
  ],
  contactHeading: "Privacy questions",
  contactDescription: "For privacy questions, requests, or concerns, contact us at",
} as const;
