import type { ReactNode } from "react";

import { LegalNavigation } from "./_components/legal-navigation";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <section className="border-b border-border py-12 text-foreground sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:gap-16">
          <aside>
            <LegalNavigation />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
