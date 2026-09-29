"use client";

import { Button } from "@next-js-template/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { isGoogleSignInEnabled } from "../actions";

export function OAuthButtonGroup({
  callbackURL,
  errorCallbackURL,
  onPendingChange,
}: {
  callbackURL: string;
  errorCallbackURL: string;
  onPendingChange: (pending: boolean) => void;
}) {
  const { data: googleEnabled } = useQuery({
    queryKey: ["auth", "google-sign-in-enabled"],
    queryFn: () => isGoogleSignInEnabled(),
  });
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);
  const providers = [
    {
      id: "google",
      name: "Google",
      enabled: googleEnabled,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
          <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          />
        </svg>
      ),
    },
  ] as const;

  async function signIn(provider: (typeof providers)[number]) {
    setPendingProvider(provider.id);
    onPendingChange(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: provider.id,
        callbackURL,
        errorCallbackURL,
      });
      if (!error) return;
      toast.error(error.message || `${provider.name} sign-in could not start. Please try again.`);
    } catch {
      toast.error("Unable to connect. Check your connection and try again.");
    }
    setPendingProvider(null);
    onPendingChange(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <div key={provider.id}>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-3 rounded-lg"
            disabled={!provider.enabled || pendingProvider !== null}
            onClick={() => void signIn(provider)}
            aria-describedby={!provider.enabled ? `${provider.id}-unavailable` : undefined}
          >
            {pendingProvider === provider.id ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              provider.icon
            )}
            {pendingProvider === provider.id
              ? `Connecting to ${provider.name}…`
              : `Continue with ${provider.name}`}
          </Button>
          {!provider.enabled && (
            <p id={`${provider.id}-unavailable`} className="sr-only">
              {provider.name} sign-in is unavailable. Use your email instead.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
