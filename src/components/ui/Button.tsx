import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "accent" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-800",
  secondary: "border border-navy/20 text-navy hover:border-navy hover:bg-navy/[0.04]",
  accent: "bg-terracotta text-white hover:bg-terracotta-700",
  light: "bg-sand text-navy hover:bg-white",
  ghost: "text-navy hover:bg-navy/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap",
    "transition-[background-color,border-color,transform] duration-200 active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    extra,
  );
}

interface Common {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonProps = Common & ComponentPropsWithoutRef<"button"> & { to?: never };
type LinkProps = Common & { to: string; state?: unknown } & Omit<ComponentPropsWithoutRef<"a">, "href">;

/** Pill button. Renders a router <Link> when `to` is given. */
export function Button(props: ButtonProps | LinkProps) {
  const { variant, size, className, children, ...rest } = props;
  const cls = buttonClass(variant, size, className);
  if ("to" in rest && rest.to !== undefined) {
    const { to, state, ...a } = rest as LinkProps;
    // In-page anchors scroll natively; the router does not handle hash-only links.
    if (to.startsWith("#")) {
      return (
        <a href={to} className={cls} {...a}>
          {children}
        </a>
      );
    }
    return (
      <Link to={to} state={state} className={cls} {...a}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
