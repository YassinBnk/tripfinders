import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

/** Eyebrow + large headline + optional intro. `serif` words are passed inside the title. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "start",
  dark,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "start" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div data-reveal className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}>
      {eyebrow && <p className={cn("eyebrow", dark ? "text-teal-300" : "text-teal")}>{eyebrow}</p>}
      <h2 className="max-w-[18ch] text-[clamp(2.25rem,5.5vw,4.5rem)]">{title}</h2>
      {intro && <p className={cn("max-w-[56ch] text-lg", dark ? "text-navy-muted" : "text-muted")}>{intro}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-[var(--radius-lg)] bg-sand-200", className)} />;
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: { label: string; to: string } | { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-dashed border-line px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-sand-200 text-navy">{icon}</span>
      <h3 className="text-2xl">{title}</h3>
      <p className="max-w-[42ch] text-muted">{text}</p>
      {action &&
        ("to" in action ? (
          <Button to={action.to} variant="secondary">
            {action.label}
          </Button>
        ) : (
          <Button onClick={action.onClick} variant="secondary">
            {action.label}
          </Button>
        ))}
    </div>
  );
}

/** Horizontal step indicator for the booking flow. */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Étapes de la réservation">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex flex-1 items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "tabular grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold",
                done ? "bg-teal text-white" : active ? "bg-navy text-white" : "bg-sand-200 text-muted",
              )}
            >
              {done ? <Check className="size-4" aria-hidden /> : i + 1}
            </span>
            <span className={cn("hidden text-sm font-medium sm:inline", active ? "text-navy" : "text-muted")}>{s}</span>
            {i < steps.length - 1 && <span aria-hidden className={cn("h-px flex-1", done ? "bg-teal" : "bg-line")} />}
          </li>
        );
      })}
    </ol>
  );
}

/** Initials avatar, used for fictional people instead of real faces. */
export function Monogram({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter((p) => /^[A-ZÀ-Ý]/.test(p))
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <span aria-hidden className={cn("serif grid shrink-0 place-items-center rounded-full bg-navy text-saffron", className)}>
      {initials}
    </span>
  );
}
