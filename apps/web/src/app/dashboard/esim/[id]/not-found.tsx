import { Button } from "@next-js-template/ui/components/button";
import { CardSim } from "lucide-react";
import Link from "next/link";
import { CardFrame } from "@/components/card-frame";

export default function EsimNotFound() {
  return (
    <CardFrame>
      <div className="mx-auto max-w-lg space-y-6 px-5 py-12 text-center sm:px-6 sm:py-16">
        <CardSim aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
        <h1 className="text-2xl font-medium tracking-tight">eSIM not found</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Check the link and make sure you’re signed in to the account that owns this eSIM.
        </p>
        <Button
          variant="outline"
          className="h-11 px-5"
          render={<Link href="/dashboard/esim" />}
          nativeButton={false}
          role="link"
        >
          All your eSIMs
        </Button>
      </div>
    </CardFrame>
  );
}
