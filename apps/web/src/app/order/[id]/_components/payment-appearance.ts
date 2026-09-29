"use client";

import type { Appearance, CustomFontSource } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

// Elements renders in an iframe, so it needs its own copy of next/font's
// self-hosted font faces. Resolve URLs against the stylesheet, not the order URL.
async function getPaymentFonts(): Promise<CustomFontSource[]> {
  const family = getComputedStyle(document.body)
    .fontFamily.split(",")[0]!
    .trim()
    .replace(/["']/g, "");
  const fonts: Promise<CustomFontSource | undefined>[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // Cross-origin stylesheets cannot be read; the sans-serif fallback remains available.
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue;
      const style = rule.style;
      if (style.fontFamily.replace(/["']/g, "") !== family) continue;
      const url = style.getPropertyValue("src").match(/url\(["']?([^"')]+)["']?\)/)?.[1];
      if (!url) continue;
      fonts.push(
        (async () => {
          try {
            // Data URLs work in Stripe's iframe on both localhost HTTP and HTTPS,
            // without requiring cross-origin access to the site's font assets.
            const response = await fetch(new URL(url, sheet.href ?? document.baseURI), {
              signal: AbortSignal.timeout(5_000),
            });
            if (!response.ok) return;
            const blob = await response.blob();
            const source = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(blob);
            });
            return {
              family,
              src: `url("${source}")`,
              weight: style.fontWeight,
              style: "normal" as const,
              display: "swap",
              unicodeRange: style.getPropertyValue("unicode-range"),
            };
          } catch {
            // Font loading must never prevent payment; retain the sans-serif fallback.
            return;
          }
        })(),
      );
    }
  }
  return (await Promise.all(fonts)).filter((font): font is CustomFontSource => !!font);
}

function getPaymentAppearance(): Appearance {
  const root = document.documentElement;
  const theme = root.classList.contains("dark") ? "night" : "stripe";
  const styles = getComputedStyle(root);
  const base: Appearance = {
    theme,
    inputs: "spaced",
    labels: "floating",
    variables: {
      fontFamily: `${getComputedStyle(document.body).fontFamily}, system-ui, sans-serif`,
      fontSizeBase: "16px",
      fontSizeSm: "14px",
      fontWeightMedium: "500",
      borderRadius: styles.getPropertyValue("--radius").trim(),
      spacingUnit: "4px",
    },
  };
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return base;

  // Stripe's main color variables reject rgba() and CSS variable references.
  // Resolve OKLCH tokens to hex, compositing translucent tokens on the page surface.
  const color = (token: string, opacity = 1) => {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = styles.getPropertyValue("--background").trim();
    context.fillRect(0, 0, 1, 1);
    context.globalAlpha = opacity;
    context.fillStyle = styles.getPropertyValue(`--${token}`).trim();
    context.fillRect(0, 0, 1, 1);
    context.globalAlpha = 1;
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    return `#${[red!, green!, blue!].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
  };

  return {
    ...base,
    variables: {
      ...base.variables,
      colorPrimary: color("primary"),
      colorBackground: color("background"),
      colorText: color("foreground"),
      colorTextSecondary: color("muted-foreground"),
      colorTextPlaceholder: color("muted-foreground"),
      colorDanger: color("destructive"),
      accessibleColorOnColorPrimary: color("primary-foreground"),
      iconColor: color("muted-foreground"),
      gridRowSpacing: "16px",
      gridColumnSpacing: "16px",
    },
    rules: {
      ".Input": {
        backgroundColor: theme === "night" ? color("input", 0.3) : color("background"),
        border: `1px solid ${color("input")}`,
        boxShadow: "none",
      },
      ".Tab, .Block, .AccordionItem": {
        backgroundColor: color("background"),
        border: `1px solid ${color("border")}`,
        boxShadow: "none",
      },
      ".Input:focus": {
        borderColor: "var(--colorPrimary)",
        boxShadow: "none",
      },
      ".Input--invalid": {
        borderColor: "var(--colorDanger)",
      },
      ".Tab--selected, .Tab--selected:hover, .Tab--selected:focus": {
        borderColor: "var(--colorPrimary)",
        color: "var(--colorText)",
      },
      ".Label": {
        color: color("muted-foreground"),
        fontWeight: "400",
      },
      ".Label--focused": {
        color: "var(--colorPrimary)",
      },
      ".Label--invalid": {
        color: "var(--colorDanger)",
      },
    },
  };
}

export function usePaymentAppearance() {
  const [appearance, setAppearance] = useState<Appearance>();
  const [fonts, setFonts] = useState<CustomFontSource[]>([]);

  useEffect(() => {
    let active = true;
    void getPaymentFonts().then((loaded) => {
      if (active) setFonts(loaded);
    });
    const update = () => setAppearance(getPaymentAppearance());
    // Observe the applied theme, rather than reading CSS before next-themes has
    // updated the root class. Stripe Elements updates without remounting the form.
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    update();
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  return { appearance, fonts };
}
