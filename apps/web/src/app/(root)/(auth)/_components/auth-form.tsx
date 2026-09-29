"use client";

import { Button } from "@next-js-template/ui/components/button";
import {
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@next-js-template/ui/components/field";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { FloatingInput } from "@/components/floating-input";
import { LogoMark } from "@/components/logo";
import { SITE_INFO } from "@/constants/site";
import { authClient } from "@/lib/auth-client";

import { getAuthCallbackURL, type AuthSearchParams } from "../utils";
import { OAuthButtonGroup } from "./oauth-button-group";

export function AuthForm({
  mode,
  searchParams,
}: {
  mode: "login" | "register";
  searchParams: AuthSearchParams;
}) {
  const isRegister = mode === "register";
  const { email, redirect_to, next, error: oauthError } = use(searchParams);
  const initialEmail = typeof email === "string" ? email.trim() : "";
  const router = useRouter();
  const {
    data: session,
    isPending: isSessionPending,
    error: sessionError,
  } = authClient.useSession();
  const callbackURL = getAuthCallbackURL(redirect_to ?? next);
  const [isOAuthPending, setIsOAuthPending] = useState(false);
  const form = useForm({
    defaultValues: { email: initialEmail, password: "", repeatPassword: "" },
    validators: {
      onSubmit: z
        .object({
          email: z.string().trim().pipe(z.email("Enter a valid email address")),
          password: isRegister
            ? z.string().min(8, "Use at least 8 characters").max(128, "Use at most 128 characters")
            : z.string().min(1, "Enter your password"),
          repeatPassword: z.string(),
        })
        .refine((value) => !isRegister || value.password === value.repeatPassword, {
          message: "Passwords do not match",
          path: ["repeatPassword"],
        }),
    },
    onSubmit: async ({ value }) => {
      try {
        const credentials = { email: value.email.trim(), password: value.password };
        const { error } = isRegister
          ? await authClient.signUp.email({
              ...credentials,
              name: credentials.email.split("@")[0],
            })
          : await authClient.signIn.email(credentials);
        if (error) {
          toast.error(
            error.message ||
              (isRegister
                ? "Unable to create your account. Please try again."
                : "Unable to sign in. Please try again."),
          );
          return;
        }
        router.replace(callbackURL);
        router.refresh();
        toast.success(isRegister ? "Account created" : "Welcome back");
      } catch {
        toast.error("Unable to connect. Check your connection and try again.");
      }
    },
  });

  if (session?.user && !session.user.isAnonymous) redirect(callbackURL);

  return (
    <div className="relative flex min-h-[calc(100svh-4.5rem)] flex-col md:min-h-[calc(100svh-5.5rem)] bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-3 text-center">
            <div className="mx-auto mb-6 flex size-14 items-center justify-center">
              <LogoMark alt="" className="size-20" />
            </div>
            <h1 className="text-3xl leading-tight font-medium tracking-[-0.045em]">
              {isRegister ? "Create an account" : "Welcome back"}
            </h1>
          </div>
          {sessionError && (
            <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              Unable to check your session. Please refresh the page and try again.
            </p>
          )}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <fieldset
                disabled={isSubmitting || isOAuthPending || isSessionPending || !!sessionError}
                aria-busy={isSubmitting || isOAuthPending || isSessionPending}
                className="flex min-w-0 flex-col gap-6"
              >
                <OAuthButtonGroup
                  callbackURL={callbackURL}
                  errorCallbackURL={`/${mode}?redirect_to=${encodeURIComponent(callbackURL)}&error=oauth`}
                  onPendingChange={setIsOAuthPending}
                />
                {oauthError && (
                  <p
                    role="alert"
                    className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    Social sign-in wasn't completed. Please try again or use your email and
                    password.
                  </p>
                )}
                <FieldSeparator>or continue with your email</FieldSeparator>
                <form
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    void form.handleSubmit();
                  }}
                >
                  <FieldGroup>
                    <form.Field name="email">
                      {(field) => (
                        <FloatingInput
                          id="email"
                          required
                          name="email"
                          label="Email"
                          type="email"
                          autoComplete="email"
                          autoCapitalize="none"
                          spellCheck={false}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          errors={field.state.meta.errors}
                        />
                      )}
                    </form.Field>
                    <form.Field name="password">
                      {(field) => (
                        <FloatingInput
                          id="password"
                          required
                          name="password"
                          label="Password"
                          type="password"
                          autoComplete={isRegister ? "new-password" : "current-password"}
                          hint={isRegister ? "Use at least 8 characters." : undefined}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          errors={field.state.meta.errors}
                        />
                      )}
                    </form.Field>
                    {isRegister && (
                      <form.Field name="repeatPassword">
                        {(field) => (
                          <FloatingInput
                            id="repeat-password"
                            required
                            name="repeatPassword"
                            label="Repeat password"
                            type="password"
                            autoComplete="new-password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </form.Field>
                    )}
                    <Button type="submit" className="h-11 w-full">
                      {isSubmitting ? (
                        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      ) : null}
                      {isSubmitting
                        ? isRegister
                          ? "Creating account…"
                          : "Signing in…"
                        : isRegister
                          ? "Create account"
                          : "Sign in"}
                      {!isSubmitting && <ArrowRight className="ml-1 size-4" aria-hidden="true" />}
                    </Button>
                  </FieldGroup>
                </form>
              </fieldset>
            )}
          </form.Subscribe>
          <p className="text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : `New to ${SITE_INFO.name}?`}{" "}
            <Link
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              href={{
                pathname: isRegister ? "/login" : "/register",
                query: {
                  redirect_to: callbackURL,
                  ...(initialEmail ? { email: initialEmail } : {}),
                },
              }}
            >
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </p>
          <FieldDescription className="text-center text-xs leading-relaxed">
            By continuing, you agree to our <Link href="/privacy">Privacy Policy</Link>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
