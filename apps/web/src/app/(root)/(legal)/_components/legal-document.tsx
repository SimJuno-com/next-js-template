import { Separator } from "@next-js-template/ui/components/separator";

type LegalDocument = {
  title: string;
  lastUpdated: string;
  description: string;
  clauses: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    items?: readonly string[];
  }[];
  contactHeading: string;
  contactDescription: string;
};

interface LegalDocumentProps {
  document: LegalDocument;
  contactEmail: string;
}

export function LegalDocument({ document, contactEmail }: LegalDocumentProps) {
  return (
    <article className="max-w-2xl">
      <header className="border-b border-border pb-8 md:pb-10">
        <h1 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-medium tracking-[-0.045em] text-balance text-foreground">
          {document.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          {document.description}
        </p>
        <p className="mt-6 text-xs font-medium text-muted-foreground">
          Last updated {document.lastUpdated}
        </p>
      </header>

      <ol className="mt-8 flex flex-col gap-8 sm:mt-10 sm:gap-10">
        {document.clauses.map((clause, index) => (
          <li className="scroll-mt-24" id={clause.id} key={clause.id}>
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 font-mono text-xs tabular-nums text-primary"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h2 className="text-base leading-6 font-medium tracking-tight text-foreground">
                  {clause.title}
                </h2>
                <div className="mt-3 flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
                  {clause.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {clause.items ? (
                    <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-primary">
                      {clause.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <Separator className="mt-10 sm:mt-12" />
      <section className="mt-8 rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">Need help?</p>
        <h2 className="mt-3 text-base leading-6 font-medium tracking-tight text-foreground">
          {document.contactHeading}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {document.contactDescription}{" "}
          <a
            className="rounded-sm font-medium break-words text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            href={`mailto:${contactEmail}`}
          >
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </article>
  );
}
