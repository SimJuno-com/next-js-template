"use client";

// Adapted from https://chanhdai.com/r/icon-swap.json.
import type { AnimatePresenceProps, HTMLMotionProps } from "motion/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function IconSwap(props: React.PropsWithChildren<AnimatePresenceProps>) {
  return <AnimatePresence mode="popLayout" initial={false} {...props} />;
}

type MotionElement = typeof motion.div | typeof motion.span;

export function IconSwapItem({
  as: Component = motion.div,
  ...props
}: HTMLMotionProps<"div"> & {
  as?: MotionElement;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <Component
      initial={reduceMotion ? false : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
      transition={{
        type: "spring",
        duration: reduceMotion ? 0 : 0.3,
        bounce: 0,
      }}
      {...props}
    />
  );
}
