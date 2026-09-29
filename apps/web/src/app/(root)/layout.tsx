import dynamic from "next/dynamic";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const ScrollToTop = dynamic(() =>
  import("@/components/scroll-to-top").then((mod) => mod.ScrollToTop),
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/layout flex min-h-svh flex-col">
      <SiteHeader />
      <main className="pt-18 md:pt-22 w-full flex-1 overflow-x-clip">{children}</main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
