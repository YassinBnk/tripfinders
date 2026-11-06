import type { ReactNode } from "react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";

/** Dark cinematic hero for inner pages (route handle `darkHero: true`), optional arch photo. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pb-20 pt-32 text-white sm:pb-28 sm:pt-44">
      <div aria-hidden className="absolute -start-40 top-0 -z-10 size-[36rem] rounded-full bg-teal/25 blur-[140px]" />
      <div className={cn("container-page grid items-end gap-12", image && "lg:grid-cols-[1.3fr_1fr]")}>
        <div data-reveal>
          <p className="eyebrow text-teal-300">{eyebrow}</p>
          <h1 className="display mt-5 text-[clamp(3rem,8vw,7.5rem)]">{title}</h1>
          {intro && <div className="mt-8 max-w-[52ch] text-lg text-navy-muted sm:text-xl">{intro}</div>}
          {children && <div className="mt-10">{children}</div>}
        </div>
        {image && (
          <div data-reveal className="arch mx-auto aspect-[3/4] w-full max-w-sm">
            <Img src={image} alt={imageAlt} priority sizes="(min-width: 1024px) 30vw, 80vw" />
          </div>
        )}
      </div>
    </section>
  );
}
