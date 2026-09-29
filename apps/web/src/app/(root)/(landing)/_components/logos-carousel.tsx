"use client";
import { Children, memo, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useInView, usePageInView, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";

import { cn } from "@next-js-template/ui/lib/utils";

const CYCLE_INTERVAL = 2400;
const STAGGER_DELAY = 0.125;
const TRANSITION_DURATION = 0.5;
const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

export type LogosCarouselProps = {
  children: ReactNode;
  columnCount?: number;
  direction?: "ltr" | "rtl";
  className?: string;
};

export function LogosCarousel({
  children,
  columnCount = 5,
  direction = "ltr",
  className,
}: LogosCarouselProps) {
  const logos = useMemo(() => Children.toArray(children), [children]);
  const count = Math.min(
    Number.isFinite(columnCount) ? Math.max(1, Math.floor(columnCount)) : 5,
    logos.length,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isPageInView = usePageInView();
  const isInView = useInView(containerRef, { margin: "100px" });
  const reduceMotion = useReducedMotion() ?? false;
  const [step, setStep] = useState(0);
  const shouldPlay = isPageInView && isInView && logos.length > 1;

  useEffect(() => {
    if (!shouldPlay) return;

    const interval = setInterval(() => setStep((previous) => previous + 1), CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, [shouldPlay]);

  if (logos.length === 0) return null;

  return (
    <div
      ref={containerRef}
      data-slot="logos-carousel"
      className={cn("grid", className)}
      style={{ gridTemplateColumns: `repeat(var(--column-count, ${count}), minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }, (_, columnIndex) => {
        // Share one queue so every logo also appears in the columns visible on small screens.
        const activeIndex = (step + columnIndex) % logos.length;

        return (
          <LogoColumn
            key={columnIndex}
            activeIndex={activeIndex}
            waveIndex={direction === "rtl" ? count - 1 - columnIndex : columnIndex}
            reduceMotion={reduceMotion}
          >
            {logos[activeIndex]}
          </LogoColumn>
        );
      })}
    </div>
  );
}

type LogoColumnProps = {
  children: ReactNode;
  activeIndex: number;
  waveIndex: number;
  reduceMotion: boolean;
};

const LogoColumn = memo(function LogoColumn({
  children,
  activeIndex,
  waveIndex,
  reduceMotion,
}: LogoColumnProps) {
  const transition: Transition = {
    ease: EASE_OUT_QUAD,
    duration: TRANSITION_DURATION,
    delay: waveIndex * STAGGER_DELAY,
  };

  return (
    <div data-slot="logos-carousel-column" className="relative min-w-0 overflow-hidden">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeIndex}
          data-slot="logos-carousel-logo"
          className="absolute inset-0 flex items-center justify-center px-2"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "60%", filter: "blur(2px)" }}
          animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "-50%", filter: "blur(3px)" }}
          transition={transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
