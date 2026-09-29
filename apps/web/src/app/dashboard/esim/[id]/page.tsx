import { Button } from "@next-js-template/ui/components/button";
import { ORPCError } from "@orpc/client";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Smartphone,
  Wifi,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { TemplateNotice } from "@/components/template-notice";
import { client } from "@/lib/orpc";
import { EsimIdentity, getEsimPlan } from "../_components/esim-summary";
import { LiveDetails } from "./_components/live-details";
import { CardFrame } from "@/components/card-frame";

export const metadata: Metadata = { title: "Your eSIM" };

function CopyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative rounded-lg bg-muted/60 py-2.5 pr-14 pl-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-xs leading-relaxed break-all">
        <code className="select-all">{value}</code>
        <CopyButton
          text={value}
          aria-label={`Copy ${label === "Activation code" ? "activation code" : label}`}
          variant="ghost"
          className="absolute top-1/2 right-2 size-10 -translate-y-1/2 transition-colors"
        />
      </dd>
    </div>
  );
}

export default async function EsimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const esim = await client.esim.get({ id }).catch((error) => {
    if (error instanceof ORPCError && error.code === "NOT_FOUND") notFound();
    if (error instanceof ORPCError && error.code === "UNAUTHORIZED") {
      redirect(`/login?redirect_to=${encodeURIComponent(`/dashboard/esim/${id}`)}`);
    }
    throw error;
  });
  const plan = await getEsimPlan(esim.packageSlug);
  const activationCode = esim.activationCode?.trim();
  // Keep unrecognized provider codes intact; only split complete LPA activation strings.
  const manual = /^LPA:1\$([^$\s]+)\$([^$\s]+)(?:\$.*)?$/.exec(activationCode ?? "");
  const cardData = manual ? encodeURIComponent(activationCode!) : null;

  return (
    <div className="max-w-3xl">
      <TemplateNotice
        title="Dummy eSIM data"
        description="This is a template. The QR code, activation code, usage, and expiry below are placeholder data, not a real eSIM. Don't try to install it."
      />
      <Button
        variant="ghost"
        className="mb-5 -ml-2 h-10 gap-2 text-muted-foreground transition-colors"
        render={<Link href="/dashboard/esim" />}
        nativeButton={false}
        role="link"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> All your eSIMs
      </Button>
      <header className="mb-8 sm:mb-10">
        <EsimIdentity esim={esim} plan={plan} heading="h1" />
      </header>

      <CardFrame>
        <div className="divide-y bg-background px-5 text-foreground sm:px-6">
          <section aria-labelledby="installation-heading" className="space-y-6 py-5 sm:py-6">
            <div className="flex items-center gap-2.5">
              <QrCode aria-hidden="true" className="size-5 text-muted-foreground" />
              <h2 id="installation-heading" className="text-xl font-medium tracking-tight">
                Install your eSIM
              </h2>
            </div>
            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Wifi aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              Connect to Wi-Fi before installing. At your destination, select this eSIM for mobile
              data and enable data roaming for it.
            </p>
            {!esim.qrCodeUrl && <LiveDetails />}
            {esim.qrCodeUrl ? (
              <div className="rounded-xl bg-muted/40 px-4 py-6">
                <Image
                  src={esim.qrCodeUrl}
                  alt="QR code to install your eSIM"
                  width={224}
                  height={224}
                  unoptimized
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="mx-auto h-auto w-48 max-w-full rounded-lg bg-white p-3"
                />
                <p className="mx-auto mt-4 max-w-60 text-center text-xs leading-relaxed text-muted-foreground">
                  Scan this QR code with your device camera to install the eSIM.
                </p>
              </div>
            ) : !activationCode ? (
              <p
                role="status"
                className="rounded-xl border border-dashed px-5 py-10 text-center text-sm leading-relaxed text-muted-foreground"
              >
                Your profile is being prepared. Installation details will appear automatically.
              </p>
            ) : null}
            {cardData && (
              <div>
                <p className="mb-3 text-center text-xs leading-relaxed text-muted-foreground">
                  Installing on this device? Open setup directly — no QR scan needed.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "iPhone", host: "esimsetup.apple.com" },
                    { label: "Android", host: "esimsetup.android.com" },
                  ].map(({ label, host }) => (
                    <Button
                      key={label}
                      variant="outline"
                      className="h-18 flex-col gap-2 transition-colors"
                      render={
                        <a
                          href={`https://${host}/esim_qrcode_provisioning?carddata=${cardData}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                      nativeButton={false}
                      role="link"
                      aria-label={`Install eSIM on ${label}`}
                    >
                      <Smartphone aria-hidden="true" className="size-5" /> {label}
                    </Button>
                  ))}
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Requires a compatible device. If setup doesn’t open, use manual installation
                  below.
                </p>
              </div>
            )}
            {esim.shortUrl && (
              <a
                href={esim.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Open installation instructions{" "}
                <ExternalLink aria-hidden="true" className="size-3.5" />
              </a>
            )}
          </section>

          {activationCode && (
            <section aria-labelledby="manual-heading" className="space-y-3 py-6">
              <h2 id="manual-heading" className="text-base font-medium tracking-tight">
                Manual installation
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                In your device’s cellular settings, choose Add eSIM, then enter these details
                manually.
              </p>
              <dl className="space-y-3">
                {manual && <CopyField label="SM-DP+ address" value={manual[1]!} />}
                <CopyField label="Activation code" value={manual ? manual[2]! : activationCode} />
              </dl>
            </section>
          )}

          <section aria-labelledby="configuration-heading" className="space-y-3 py-6">
            <h2 id="configuration-heading" className="text-base font-medium tracking-tight">
              Configuration
            </h2>
            {plan?.ipExport && (
              <dl>
                <CopyField label="IP routing" value={plan.ipExport} />
              </dl>
            )}
          </section>

          <section aria-labelledby="network-heading" className="space-y-3 py-6">
            <h2 id="network-heading" className="text-base font-medium tracking-tight">
              Network details
            </h2>
            {plan ? (
              <>
                <dl className="rounded-lg bg-muted/60 px-3 py-2.5">
                  <dt className="text-xs text-muted-foreground">Speed</dt>
                  <dd className="mt-1 text-sm font-medium">{plan.speed || "Not provided"}</dd>
                </dl>
                {plan.locationNetworkList.map((location) => (
                  <div
                    key={location.locationCode || location.locationName}
                    className="rounded-lg bg-muted/60 p-3"
                  >
                    <h3 className="flex items-center gap-2 text-sm font-medium">
                      {location.locationLogo && (
                        <Image
                          src={`https://cdn.simjuno.com${location.locationLogo}`.replace(
                            ".png",
                            ".svg",
                          )}
                          alt=""
                          width={24}
                          height={18}
                          unoptimized
                          className="h-4.5 w-6 shrink-0 rounded-sm object-cover"
                        />
                      )}
                      {location.locationName}
                    </h3>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {location.operatorList?.map((operator) => (
                        <li
                          key={`${operator.operatorName}-${operator.networkType}`}
                          className="rounded-md bg-background px-2 py-1 text-xs"
                        >
                          {operator.operatorName}
                          {operator.networkType && (
                            <span className="text-muted-foreground"> ({operator.networkType})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    {!location.operatorList?.length && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Operator details not provided.
                      </p>
                    )}
                  </div>
                ))}
                {!plan.locationNetworkList.length && (
                  <p className="text-xs text-muted-foreground">
                    {plan.location || "Coverage details not provided."}
                  </p>
                )}
                {plan.fupPolicy && (
                  <p className="text-xs leading-relaxed text-muted-foreground">{plan.fupPolicy}</p>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Network details are temporarily unavailable. Your installation details are still
                accessible above.
              </p>
            )}
          </section>
          <footer className="flex flex-wrap items-center justify-between gap-3 py-4">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="size-4 shrink-0" /> Keep your installation
              details private.
            </p>
            <Button
              variant="ghost"
              className="h-10 gap-2 text-xs transition-colors"
              render={<Link href={`/order/${esim.order_id}`} />}
              nativeButton={false}
              role="link"
            >
              View order <ArrowUpRight aria-hidden="true" className="size-4" />
            </Button>
          </footer>
        </div>
      </CardFrame>
    </div>
  );
}
