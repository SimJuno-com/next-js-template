import { Skeleton } from "@next-js-template/ui/components/skeleton";

export function AuthFormSkeleton({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";

  return (
    <div
      role="status"
      aria-label={isRegister ? "Loading account registration" : "Loading sign-in"}
      className="relative flex min-h-[calc(100svh-4.5rem)] flex-col md:min-h-[calc(100svh-5.5rem)] bg-background text-foreground"
    >
      <p className="sr-only">
        {isRegister ? "Loading the create account form…" : "Loading the sign-in form…"}
      </p>
      <div
        aria-hidden="true"
        className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-3 text-center">
            <Skeleton className="mx-auto mb-6 size-14 rounded-xl" />
            <h1 className="text-3xl leading-tight font-medium tracking-[-0.045em]">
              {isRegister ? "Create an account" : "Welcome back"}
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-11 w-full rounded-lg" />
            <div className="relative -my-2 flex h-5 items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-border" />
              <span className="relative bg-background px-2 text-sm text-muted-foreground">
                or continue with your email
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <Skeleton className="h-12 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                {isRegister && <Skeleton className="h-4 w-40" />}
              </div>
              {isRegister && <Skeleton className="h-12 w-full" />}
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
          <Skeleton className="mx-auto h-5 w-64 max-w-full" />
          <Skeleton className="mx-auto h-5 w-72 max-w-full" />
        </div>
      </div>
    </div>
  );
}
