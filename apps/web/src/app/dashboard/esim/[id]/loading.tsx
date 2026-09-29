import { Skeleton } from "@next-js-template/ui/components/skeleton";
import { QrCode, ShieldCheck, Wifi } from "lucide-react";

import { CardFrame } from "@/components/card-frame";
import { EsimIdentitySkeleton } from "../_components/esim-identity-skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading eSIM details" className="max-w-3xl">
      <p className="sr-only">
        Loading your eSIM installation code, configuration, and network details…
      </p>
      <div aria-hidden="true">
        <Skeleton className="mb-5 -ml-2 h-10 w-36" />
        <div className="mb-8 sm:mb-10">
          <EsimIdentitySkeleton detail />
        </div>
        <CardFrame>
          <div className="divide-y bg-background px-5 sm:px-6">
            <div className="space-y-6 py-5 sm:py-6">
              <div className="flex items-center gap-2.5">
                <QrCode className="size-5 text-muted-foreground" />
                <h2 className="text-xl font-medium tracking-tight">Install your eSIM</h2>
              </div>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Wifi className="mt-0.5 size-4 shrink-0" />
                Connect to Wi-Fi before installing. At your destination, select this eSIM for mobile
                data and enable data roaming for it.
              </p>
              <div className="rounded-xl bg-muted/40 px-4 py-6">
                <Skeleton className="mx-auto aspect-square w-48 max-w-full rounded-lg" />
                <p className="mx-auto mt-4 max-w-60 text-center text-xs leading-relaxed text-muted-foreground">
                  Scan this QR code with your device camera to install the eSIM.
                </p>
              </div>
              <div>
                <p className="mb-3 text-center text-xs leading-relaxed text-muted-foreground">
                  Installing on this device? Open setup directly — no QR scan needed.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-18" />
                  <Skeleton className="h-18" />
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Requires a compatible device. If setup doesn’t open, use manual installation
                  below.
                </p>
              </div>
              <Skeleton className="h-10 w-52 max-w-full" />
            </div>
            <div className="space-y-3 py-6">
              <h2 className="text-base font-medium tracking-tight">Manual installation</h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                In your device’s cellular settings, choose Add eSIM, then enter these details
                manually.
              </p>
              {[0, 1].map((field) => (
                <div key={field} className="relative rounded-lg bg-muted/60 py-2.5 pr-14 pl-3">
                  <Skeleton className="h-4 w-24 max-w-full" />
                  <Skeleton className="mt-1 h-5 w-full" />
                  <Skeleton className="absolute top-1/2 right-2 size-10 -translate-y-1/2" />
                </div>
              ))}
            </div>
            <div className="space-y-3 py-6">
              <h2 className="text-base font-medium tracking-tight">Configuration</h2>
              <div className="rounded-lg bg-muted/60 px-3 py-2.5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-1 h-5 w-28" />
              </div>
            </div>
            <div className="space-y-3 py-6">
              <h2 className="text-base font-medium tracking-tight">Network details</h2>
              <div className="rounded-lg bg-muted/60 px-3 py-2.5">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="mt-1 h-5 w-24" />
              </div>
              <div className="rounded-lg bg-muted/60 p-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4.5 w-6 shrink-0" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0" /> Keep your installation details private.
              </p>
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </CardFrame>
      </div>
    </div>
  );
}
