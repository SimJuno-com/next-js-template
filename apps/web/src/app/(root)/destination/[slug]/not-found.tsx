import Link from "next/link";
import { buttonVariants } from "@next-js-template/ui/components/button";

export default function DestinationNotFound() {
  return (
    <div className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
      <p className="text-xs tracking-widest text-muted-foreground uppercase">A small detour</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight">Destination not found</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        This destination isn’t in our current coverage. Let’s find your next connection.
      </p>
      <Link
        href="/destination"
        className={buttonVariants({ variant: "outline", className: "mt-6 h-11 px-5" })}
      >
        Browse destinations
      </Link>
    </div>
  );
}
