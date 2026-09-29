import { SITE_INFO } from "@/constants/site";

export const TERMS_OF_SERVICE = {
  title: "Terms of Service",
  lastUpdated: "September 11, 2026",
  description: `The terms that apply when you use ${SITE_INFO.name} and purchase an eSIM plan.`,
  clauses: [
    {
      id: "accepting-these-terms",
      title: "Accepting these terms",
      paragraphs: [
        `These terms apply to purchases from ${SITE_INFO.name}, operated by ${SITE_INFO.legalName}. In these terms, "we", "us", and "our" refer to the store operator, and "you" refers to the customer using our store or purchasing an eSIM plan.`,
        `By accessing ${SITE_INFO.name}, or purchasing a plan, you agree to these Terms of Service. If you do not agree, please do not use the service.`,
        "You must be legally able to enter into this agreement and provide accurate, current information when using the service.",
      ],
    },
    {
      id: "the-service",
      title: "The service",
      paragraphs: [
        `${SITE_INFO.name} offers prepaid travel data plans delivered through compatible eSIM technology. Plan availability, coverage, speeds, and supported networks vary by destination, device, and local network conditions.`,
        "We sell eSIM plans through this store and are your point of contact for orders and support. Connectivity is delivered through our eSIM and mobile network partners. Plans provide mobile data unless the plan details explicitly include calls or SMS.",
      ],
    },
    {
      id: "device-compatibility",
      title: "Device compatibility",
      paragraphs: [
        "You are responsible for confirming that your device is eSIM-compatible, unlocked, and supported by the selected plan before purchase. Device settings, operating-system requirements, and local carrier restrictions may affect service availability.",
      ],
    },
    {
      id: "purchases-and-payments",
      title: "Purchases and payments",
      paragraphs: [
        "Prices, plan allowances, validity periods, and included destinations are shown before checkout. You agree to pay all applicable charges, including any taxes or fees presented during purchase.",
        "Plans are prepaid. Review the destination coverage, data allowance, validity, activation rules, and any usage limits before confirming your order.",
      ],
    },
    {
      id: "delivery-and-installation",
      title: "Delivery and installation",
      paragraphs: [
        "Your eSIM is delivered digitally using the installation details provided with your order. You are responsible for providing accurate contact details and following the instructions for your device and plan.",
        "Keep your installation details secure. Installation codes may be limited to a single device or a single use. Do not delete an installed eSIM or transfer it to another device unless your plan instructions or our support team confirm that this is supported.",
      ],
    },
    {
      id: "activation-and-data-use",
      title: "Activation and data use",
      paragraphs: [
        "The activation trigger and validity period depend on your selected plan. Check whether validity begins at installation, first connection to a supported network, or another event stated in the plan details before installing or enabling your eSIM.",
        "Service ends when the plan expires or its data allowance is exhausted, subject to the plan details. Speed limits, fair-use rules, hotspot availability, and top-up options apply only as described for your plan.",
        "Use the service lawfully and follow any usage restrictions disclosed for your plan. You must not interfere with networks, engage in fraud, distribute unlawful content, or misuse another person's order or installation details.",
      ],
    },
    {
      id: "refunds-and-cancellations",
      title: "Refunds and cancellations",
      paragraphs: [
        "If you need to cancel an order or report a problem, contact our support team with your order details and a description of the issue. We will review your request based on the plan's delivery, activation, and usage status, the purchase terms shown before checkout, and applicable law.",
        "Any limits on cancellation or refunds will be stated before purchase. Nothing in these terms removes your statutory consumer rights or any remedies available under applicable law for a service that is not supplied as agreed.",
      ],
    },
    {
      id: "third-party-networks",
      title: "Third-party networks",
      paragraphs: [
        "Mobile coverage and data service are provided through third-party network partners. We do not control their networks and cannot guarantee uninterrupted, error-free, or universally available service.",
        "Actual speeds and availability depend on local coverage, network congestion, your device, and other operating conditions. Contact our support team if you have trouble connecting so we can help investigate.",
      ],
    },
    {
      id: "changes-and-termination",
      title: "Changes and termination",
      paragraphs: [
        "We may update these terms and will publish the revised version with an updated date. The terms presented when you purchase a plan apply to that order, unless a change is required by law or agreed with you.",
        "We may suspend or terminate access where reasonably necessary to address fraud, unlawful use, a breach of these terms, or a threat to network security. Any such action remains subject to applicable law and your consumer rights.",
      ],
    },
  ],
  contactHeading: "Questions about these terms",
  contactDescription: "For questions about these terms, contact us at",
} as const;
