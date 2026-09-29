"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Info, Link2, LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@next-js-template/ui/components/button";
import { Input } from "@next-js-template/ui/components/input";
import { Label } from "@next-js-template/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@next-js-template/ui/components/dialog";

import { isGoogleSignInEnabled } from "@/app/(root)/(auth)/actions";
import { authClient } from "@/lib/auth-client";
import type { SettingsSection, SettingsUser } from "./settings-dialog";

const settingsURL = "/dashboard?settings=account";

export function SettingsNameForm({ name }: { name: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState(name);
  const [savedName, setSavedName] = useState(name);
  const isDirty = draft.trim() !== savedName.trim();
  const save = useMutation({
    mutationFn: async (name: string) => {
      if (!name || name.length > 100) throw new Error("Use a name between 1 and 100 characters.");
      const { error } = await authClient.updateUser({ name });
      if (error) throw new Error(error.message || "Unable to update your name.");
      return name;
    },
    onSuccess: (name) => {
      setSavedName(name);
      setDraft(name);
      requestAnimationFrame(() => document.getElementById("settings-name")?.focus());
      toast.success("Name updated");
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (isDirty && !save.isPending) save.mutate(draft.trim());
      }}
      className="space-y-3"
    >
      <Label htmlFor="settings-name">Name</Label>
      <Input
        id="settings-name"
        name="name"
        autoComplete="name"
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          save.reset();
        }}
        required
        maxLength={100}
        disabled={save.isPending}
        aria-invalid={Boolean(save.error)}
        aria-describedby={save.error ? "settings-name-error" : "settings-name-hint"}
        className="h-11 bg-background px-3 focus-visible:border-primary focus-visible:ring-primary/15"
      />
      <p id="settings-name-hint" className="text-xs text-muted-foreground">
        The name displayed on your account.
      </p>
      {save.error && (
        <p id="settings-name-error" role="alert" className="text-sm text-destructive">
          {save.error.message}
        </p>
      )}
      {isDirty && (
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            className="h-10 px-4"
            disabled={save.isPending}
            onClick={() => {
              setDraft(savedName);
              save.reset();
              document.getElementById("settings-name")?.focus();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" className="h-11 gap-2 px-5" disabled={save.isPending}>
            {save.isPending && (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin motion-reduce:animate-none"
              />
            )}
            {save.isPending ? "Saving…" : "Save name"}
          </Button>
        </div>
      )}
    </form>
  );
}

function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const change = useMutation({
    mutationFn: async (form: FormData) => {
      const newPassword = String(form.get("newPassword") ?? "");
      if (newPassword !== form.get("confirmPassword")) throw new Error("Passwords do not match.");
      const { error } = await authClient.changePassword({
        currentPassword: String(form.get("currentPassword") ?? ""),
        newPassword,
        revokeOtherSessions: true,
      });
      if (error) throw new Error(error.message || "Unable to change your password.");
    },
    onSuccess: () => {
      formRef.current?.reset();
      toast.success("Password changed. Other sessions have been signed out.");
    },
  });

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault();
        change.mutate(new FormData(event.currentTarget));
      }}
    >
      <fieldset disabled={change.isPending} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="settings-current-password">Current password</Label>
          <Input
            id="settings-current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className="h-11 bg-background px-3 focus-visible:border-primary focus-visible:ring-primary/15"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="settings-new-password">New password</Label>
            <Input
              id="settings-new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              aria-describedby="settings-password-hint"
              className="h-11 bg-background px-3 focus-visible:border-primary focus-visible:ring-primary/15"
            />
            <p id="settings-password-hint" className="text-xs text-muted-foreground">
              Use 8–128 characters.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-confirm-password">Confirm new password</Label>
            <Input
              id="settings-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              className="h-11 bg-background px-3 focus-visible:border-primary focus-visible:ring-primary/15"
            />
          </div>
        </div>
        {change.error && (
          <p role="alert" className="text-sm text-destructive">
            {change.error.message}
          </p>
        )}
        <p className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Changing your password signs you out on other devices. You'll stay signed in here.
        </p>
        <div className="flex justify-end border-t pt-4">
          <Button type="submit" className="h-11 gap-2 px-5">
            {change.isPending && (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin motion-reduce:animate-none"
              />
            )}
            {change.isPending ? "Changing…" : "Change password"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}

function DeleteAccount({ user, hasPassword }: { user: SettingsUser; hasPassword: boolean }) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const queryClient = useQueryClient();
  const deletion = useMutation({
    mutationFn: async (form: FormData) => {
      if (confirmation !== "DELETE") throw new Error("Type DELETE to confirm.");
      const { error } = await authClient.deleteUser(
        hasPassword ? { password: String(form.get("password") ?? "") } : {},
      );
      if (error) {
        if (error.code === "SESSION_EXPIRED" || error.code === "FRESH_SESSION_REQUIRED") {
          setNeedsSignIn(true);
          throw new Error("Please sign in again before deleting your account.");
        }
        throw new Error(error.message || "Unable to delete your account.");
      }
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.replace("/");
    },
  });
  const signInAgain = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message || "Unable to sign out. Please try again.");
      queryClient.clear();
      window.location.assign(`/login?redirect_to=${encodeURIComponent(settingsURL)}`);
    },
  });
  const busy = deletion.isPending || signInAgain.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (busy) return;
        setOpen(value);
        setConfirmation("");
        setNeedsSignIn(false);
        deletion.reset();
        signInAgain.reset();
      }}
    >
      <DialogTrigger render={<Button variant="destructive" className="h-10 px-4" />}>
        Delete account
      </DialogTrigger>
      <DialogContent
        showCloseButton={!busy}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-5 sm:max-w-md sm:p-6"
      >
        <DialogTitle>Delete your account?</DialogTitle>
        <DialogDescription>
          This permanently deletes {user.email} and removes access to your orders and eSIMs.
          Purchase records are retained. This cannot be undone and does not issue a refund.
        </DialogDescription>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            deletion.mutate(new FormData(event.currentTarget));
          }}
        >
          <fieldset disabled={busy} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-delete-confirmation">Type DELETE to confirm</Label>
              <Input
                id="settings-delete-confirmation"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                className="h-11 px-3"
                required
              />
            </div>
            {hasPassword ? (
              <div className="space-y-2">
                <Label htmlFor="settings-delete-password">Current password</Label>
                <Input
                  id="settings-delete-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="h-11 px-3"
                  required
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                For security, you must have signed in recently.
              </p>
            )}
            {(deletion.error || signInAgain.error) && (
              <p role="alert" className="text-sm text-destructive">
                {signInAgain.error?.message || deletion.error?.message}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 px-4"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              {needsSignIn ? (
                <Button type="button" className="h-10 px-4" onClick={() => signInAgain.mutate()}>
                  Sign in again
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="destructive"
                  className="h-10 px-4"
                  disabled={confirmation !== "DELETE"}
                >
                  {deletion.isPending ? "Deleting…" : "Permanently delete account"}
                </Button>
              )}
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsSecurity({
  user,
  section,
}: {
  user: SettingsUser;
  section: SettingsSection;
}) {
  const accounts = useQuery({
    queryKey: ["auth", "accounts", user.id],
    queryFn: async () => {
      const { data, error } = await authClient.listAccounts();
      if (error) throw new Error(error.message || "Unable to load sign-in methods.");
      return data;
    },
  });
  const google = useQuery({
    queryKey: ["auth", "google-sign-in-enabled"],
    queryFn: () => isGoogleSignInEnabled(),
  });
  const linkedGoogle = accounts.data?.find((account) => account.providerId === "google");
  const hasPassword =
    accounts.data?.some((account) => account.providerId === "credential") ?? false;
  const canUnlink = (accounts.data?.length ?? 0) > 1;
  const connection = useMutation({
    mutationFn: async () => {
      // Better Auth 1.7 expects the internal account ID, not the provider's accountId.
      const { error } = linkedGoogle
        ? await authClient.unlinkAccount({ accountId: linkedGoogle.id })
        : await authClient.linkSocial({
            provider: "google",
            callbackURL: settingsURL,
            errorCallbackURL: settingsURL,
          });
      if (error)
        throw new Error(
          error.code === "FRESH_SESSION_REQUIRED"
            ? "Sign out and sign in again before unlinking Google."
            : error.message || "Unable to update your Google connection.",
        );
    },
    onSuccess: async () => {
      if (linkedGoogle) {
        await accounts.refetch();
        toast.success("Google account unlinked");
      }
    },
  });

  if (accounts.isPending)
    return (
      <p
        hidden={section === "account"}
        role="status"
        className="rounded-2xl border p-5 text-sm text-muted-foreground"
      >
        Loading sign-in methods…
      </p>
    );
  if (accounts.isError)
    return (
      <div hidden={section === "account"} className="space-y-3 rounded-2xl border p-5">
        <p role="alert" className="text-sm text-destructive">
          Unable to load sign-in methods.
        </p>
        <Button variant="outline" onClick={() => void accounts.refetch()}>
          Try again
        </Button>
      </div>
    );

  return (
    <>
      <section
        hidden={section !== "password"}
        aria-labelledby="settings-password-heading"
        className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6"
      >
        {hasPassword ? (
          <ChangePasswordForm />
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            You sign in with a linked account and do not have a password to change.
          </p>
        )}
      </section>
      <section
        hidden={section !== "connections"}
        aria-labelledby="settings-connections-heading"
        className="space-y-4"
      >
        <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
            <div className="space-y-1.5">
              <p className="font-medium">Google</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {linkedGoogle && <Check aria-hidden="true" className="size-3.5" />}
                {linkedGoogle ? "Connected to your account" : "Not connected"}
              </p>
            </div>
            <Button
              variant="outline"
              className="h-10 gap-2 px-4"
              disabled={connection.isPending || (linkedGoogle ? !canUnlink : !google.data)}
              onClick={() => connection.mutate()}
            >
              {connection.isPending ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
              ) : (
                <Link2 aria-hidden="true" className="size-4" />
              )}
              {connection.isPending
                ? linkedGoogle
                  ? "Unlinking…"
                  : "Connecting…"
                : linkedGoogle
                  ? "Unlink Google"
                  : "Link Google"}
            </Button>
          </div>
          <p className="border-t bg-muted/20 px-5 py-4 text-xs leading-relaxed text-muted-foreground sm:px-6">
            Link a Google account with the same email address to sign in without a password.
          </p>
        </div>
        {linkedGoogle && !canUnlink && (
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
            Google is your only sign-in method and cannot be unlinked.
          </p>
        )}
        {!linkedGoogle && !google.isPending && !google.data && (
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Info aria-hidden="true" className="size-4 shrink-0" />
            Google linking is currently unavailable. You can still sign in with your email and
            password.
          </p>
        )}
        {google.isError && (
          <Button variant="outline" size="sm" onClick={() => void google.refetch()}>
            Retry Google availability
          </Button>
        )}
        {connection.error && (
          <p role="alert" className="text-sm text-destructive">
            {connection.error.message}
          </p>
        )}
      </section>
      <section
        hidden={section !== "delete"}
        aria-labelledby="settings-delete-heading"
        className="overflow-hidden rounded-2xl border border-destructive/20 bg-card"
      >
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TriangleAlert aria-hidden="true" className="size-4 text-destructive" />
            Before you leave
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Your profile and sign-in methods will be permanently deleted.</li>
            <li>You'll lose access to your orders and eSIMs.</li>
            <li>Purchase records are retained. Deleting your account does not issue a refund.</li>
          </ul>
        </div>
        <div className="flex justify-end border-t border-destructive/20 bg-destructive/5 px-5 py-4 sm:px-6">
          <DeleteAccount user={user} hasPassword={hasPassword} />
        </div>
      </section>
    </>
  );
}
