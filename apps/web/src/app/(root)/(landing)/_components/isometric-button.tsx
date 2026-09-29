import Link from "next/link";

export function IsometricCubeButton() {
  return (
    <Link
      href="/destination"
      prefetch={false}
      aria-label="Launch — explore eSIM plans"
      className="group/cube relative block h-[140px] w-[176.67px] shrink-0 rounded-sm [--press:0] [-webkit-tap-highlight-color:transparent] group-hover/activation:[--press:3.8] hover:[--press:3.8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary focus-visible:[--press:3.8] active:[--press:8] [&>span]:absolute [&>span]:origin-top-left [&>span]:border before:pointer-events-none before:absolute before:inset-x-2 before:bottom-0 before:h-6 before:rounded-full before:bg-black/15 before:blur-lg  [&>span]:border-white/50 [&>span]:bg-clip-padding [&>span]:backdrop-blur-md dark:[&>span]:border-white/20 [&>span]:transition-transform [&>span]:duration-160 [&>span]:ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:[&>span]:transition-none motion-reduce:[&>span]:transition-none"
    >
      <span
        aria-hidden="true"
        className="top-[41.5px] left-0 h-[38px] w-[121px] bg-linear-to-b from-white/40 to-white/15 shadow-[inset_0_1px_0_rgb(255_255_255/50%)] [transform:matrix(.8660254,.5,0,calc(1_-_var(--press)/38),0,var(--press))] dark:from-white/15 dark:to-background/30 dark:shadow-[inset_0_1px_0_rgb(255_255_255/15%)]"
      />
      <span
        aria-hidden="true"
        className="top-[102px] left-[104.7891px] h-[38px] w-[83px] bg-linear-to-b from-white/25 to-background/30 shadow-[inset_0_1px_0_rgb(255_255_255/35%)] [transform:matrix(.8660254,-.5,0,calc(1_-_var(--press)/38),0,var(--press))] dark:from-white/10 dark:to-background/50 dark:shadow-[inset_0_1px_0_rgb(255_255_255/10%)]"
      />
      <span
        aria-hidden="true"
        className="top-0 left-[71.8801px] grid h-[83px] w-[121px] place-items-center bg-linear-to-br from-white/80 via-white/35 to-white/60 text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/80%),0_8px_24px_rgb(0_0_0/8%)] dark:from-white/25 dark:via-white/10 dark:to-background/40 dark:shadow-[inset_0_1px_0_rgb(255_255_255/30%),0_8px_24px_rgb(0_0_0/15%)] [transform:matrix(.8660254,.5,-.8660254,.5,0,var(--press))]"
      >
        <span className="rounded-sm border border-white/40 bg-background/55 px-3 py-2 font-mono text-sm shadow-[inset_0_1px_0_rgb(255_255_255/50%)] group-hover/activation:border-primary/50 group-focus-visible/cube:border-primary/50 dark:border-white/15 dark:bg-background/45 dark:shadow-[inset_0_1px_0_rgb(255_255_255/10%)]">
          Activate
        </span>
      </span>
    </Link>
  );
}
