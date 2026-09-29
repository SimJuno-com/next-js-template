import Image from "next/image";

import { SITE_INFO } from "@/constants/site";

export function Logo() {
  return (
    <span className="inline-flex h-10 items-center gap-2 whitespace-nowrap font-sans text-xl font-normal tracking-tight text-foreground transition-colors duration-200">
      <LogoMark alt="" />
      <span>{SITE_INFO.name}</span>
    </span>
  );
}

export function LogoMark({
  alt = SITE_INFO.name,
  className,
}: {
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      className={className || "size-8 shrink-0"}
      src="https://cdn.simjuno.com/template/logo/primary-logomark.svg"
      alt={alt}
      width={32}
      height={32}
    />
  );
}
