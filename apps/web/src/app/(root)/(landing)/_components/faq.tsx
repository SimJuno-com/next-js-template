"use client";

import { buttonVariants } from "@next-js-template/ui/components/button";
import { cn } from "@next-js-template/ui/lib/utils";
import { ArrowUpRight, PlusIcon } from "lucide-react";
import { useId } from "react";
import { FAQS } from "@/constants/faq";
import { CardFrame } from "@/components/card-frame";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@next-js-template/ui/components/accordion";

import { Section } from "./section";

export function Faq() {
  const headingId = useId();

  return (
    <Section id="faq" aria-labelledby={headingId}>
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <header className="flex max-w-xl flex-col items-start">
          <h2
            className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-medium tracking-[-0.045em] text-balance text-foreground"
            id={headingId}
          >
            Questions before you go?
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-pretty text-muted-foreground">
            Everything you need to know about staying connected with an eSIM.
          </p>

          <a className={cn(buttonVariants(), "mt-6 h-11 gap-2 px-5")} href="/destination">
            Explore destinations
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </header>

        <CardFrame className="shadow-surface">
          <Accordion>
            {FAQS.map((faq, index) => (
              <AccordionItem className="border-border px-5 sm:px-6" key={faq.id} value={faq.id}>
                <AccordionTrigger className="group/faq-trigger [&>svg]:hidden! grid touch-manipulation grid-cols-[1rem_minmax(0,1fr)_2.25rem] items-center gap-x-3 rounded-none border-0 py-5 transition-none hover:no-underline sm:gap-x-4 sm:py-6">
                  <span className="font-mono text-xs font-medium text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-left text-base leading-6 font-medium text-foreground">
                    {faq.question}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-xs shadow-black/5 transition-[transform,background-color,border-color,color] dark:shadow-black/20 duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/faq-trigger:border-primary/40 group-hover/faq-trigger:bg-primary/5 group-active/faq-trigger:scale-[0.96] group-aria-expanded/faq-trigger:border-primary group-aria-expanded/faq-trigger:bg-primary group-aria-expanded/faq-trigger:text-primary-foreground [&_svg]:size-4">
                    <PlusIcon
                      aria-hidden="true"
                      className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-aria-expanded/faq-trigger:rotate-45 motion-reduce:transition-none"
                    />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-7 sm:pb-6 sm:pl-8">
                  <div className="pr-12 text-sm leading-6 text-muted-foreground sm:pr-13">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardFrame>
      </div>
    </Section>
  );
}
