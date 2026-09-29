// TODO: placeholder branding: replace every value below with your own before launch.
export const SITE_INFO = {
  name: "Acme",
  legalName: "Acme Inc.",
  tagline: "Travel far. Stay connected.",
  description:
    "Stay connected on your travels with Acme. Explore prepaid eSIM data plans for countries and regions around the world, choose your coverage, and get online with a compatible phone.",
  email: "support@example.com",
  url: "https://example.com",
  ogImage: "https://cdn.simjuno.com/template/images/footer-image.webp",
  keywords: [
    "travel eSIM",
    "prepaid data plans",
    "international mobile data",
    "country eSIM",
    "regional eSIM",
    "Acme",
  ],
} as const;

export const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Destinations", href: "/destination" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;
