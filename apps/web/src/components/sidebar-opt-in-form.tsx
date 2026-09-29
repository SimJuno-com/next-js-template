"use client";

import { Button } from "@next-js-template/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@next-js-template/ui/components/card";
import { Input } from "@next-js-template/ui/components/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";

export function SidebarOptInForm() {
  const id = useId();
  const router = useRouter();

  return (
    <Card className="gap-3 rounded-2xl pt-0 pb-3 shadow-none bg-muted/50 ring-0">
      <div className="relative h-24 overflow-hidden rounded-2xl">
        <Image
          src="https://cdn.simjuno.com/template/images/i5.webp"
          alt=""
          fill
          className="object-cover opacity-90"
        />
      </div>
      <CardHeader className="px-3">
        <CardTitle id={`${id}-title`} className="text-sm">
          Link your email
        </CardTitle>
        <CardDescription id={`${id}-description`}>
          Access your orders on any device.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        <form
          noValidate
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const email = String(formData.get("email") ?? "")
              .trim()
              .toLowerCase();
            if (!z.email().safeParse(email).success) {
              toast.error("Enter a valid email address");
              return;
            }
            const query = new URLSearchParams({ email, redirect_to: "/dashboard" });
            router.push(`/register?${query}`);
          }}
        >
          <fieldset className="grid min-w-0 gap-2.5">
            <label htmlFor={`${id}-email`} className="sr-only">
              Email
            </label>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              className="h-8 rounded-lg bg-sidebar/50 text-xs shadow-none"
            />
            <Button type="submit" size="sm" className="h-8 rounded-lg">
              Link email
            </Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
