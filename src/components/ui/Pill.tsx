import type { ReactNode } from "react";
import { BadgeCheck, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Pigment } from "@/types";

const pigments: Record<Pigment, string> = {
  rose: "bg-rose",
  saffron: "bg-saffron-200",
  mint: "bg-mint",
  sky: "bg-sky",
  clay: "bg-clay",
};

/** Small rounded label. `pigment` gives the Moroccan-colour tag look. */
export function Pill({
  children,
  pigment,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  pigment?: Pigment;
  tone?: "neutral" | "dark" | "outline" | "terracotta";
  className?: string;
}) {
  const tones = {
    neutral: "bg-sand-200 text-ink",
    dark: "bg-navy text-white",
    outline: "border border-current/25",
    terracotta: "bg-terracotta-100 text-terracotta-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.8125rem] font-medium leading-none whitespace-nowrap",
        pigment ? cn(pigments[pigment], "text-ink") : tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Oversized tilted tag, the GSAP-like signature on dark sections. */
export function Tag({ children, pigment, tilt = 0, className }: { children: ReactNode; pigment: Pigment; tilt?: number; className?: string }) {
  return (
    <span
      style={{ ["--tilt" as string]: `${tilt}deg`, transform: `rotate(${tilt}deg)` }}
      className={cn(
        "inline-block rounded-[0.35em] px-[0.45em] pb-[0.12em] pt-[0.05em] font-semibold tracking-[-0.04em] text-ink shadow-[0.12em_0.12em_0_rgb(0_0_0/0.25)]",
        pigments[pigment],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Pill className={cn("bg-teal-100 text-teal", className)}>
      <BadgeCheck className="size-4" aria-hidden /> Vérifié sur place
    </Pill>
  );
}

export function SponsoredBadge() {
  return (
    <Pill tone="dark">
      <Sparkles className="size-3.5 text-saffron" aria-hidden /> Mis en avant
    </Pill>
  );
}

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", className)}>
      <Star className="size-4 fill-saffron-600 text-saffron-600" aria-hidden />
      <span className="tabular">{value.toFixed(1).replace(".", ",")}</span>
      {count !== undefined && <span className="text-muted">({count} avis)</span>}
      <span className="sr-only">sur 5</span>
    </span>
  );
}
