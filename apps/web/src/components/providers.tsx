"use client";

import { Toaster } from "@next-js-template/ui/components/sonner";
import { TooltipProvider } from "@next-js-template/ui/components/tooltip";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";

import { queryClient } from "@/lib/orpc";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  );
}
