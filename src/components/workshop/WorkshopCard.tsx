import { Link } from "react-router";
import { Clock, Heart } from "lucide-react";
import { useStore } from "@/app/store";
import { cityById, craftById } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { formatDuration, formatPrice } from "@/lib/format";
import { Img } from "@/components/ui/Img";
import { Pill, Rating } from "@/components/ui/Pill";
import { Skeleton } from "@/components/ui/misc";
import type { Workshop } from "@/types";

export const typeLabels: Record<Workshop["type"], string> = {
  visite: "Visite",
  "atelier-pratique": "Atelier pratique",
  "circuit-groupe": "Circuit de groupe",
};

/** Workshop card: whole card is one link (overlay), favourite is a separate button above it. */
export function WorkshopCard({ workshop: w, priority, className }: { workshop: Workshop; priority?: boolean; className?: string }) {
  const { favorites, toggleFavorite } = useStore();
  const craft = craftById(w.craftId)!;
  const city = cityById(w.cityId)!;
  const fav = favorites.includes(w.id);

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-sand-200">
        <Img
          src={w.photos[0]!}
          alt={`${w.title}, ${city.name}`}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 90vw"
          priority={priority}
          className="transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Pill pigment={craft.pigment}>{craft.name}</Pill>
            {w.sponsored && <Pill tone="dark">Mis en avant</Pill>}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => toggleFavorite(w.id)}
        aria-pressed={fav}
        aria-label={fav ? `Retirer « ${w.title} » des favoris` : `Ajouter « ${w.title} » aux favoris`}
        className="absolute end-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-surface/90 backdrop-blur transition hover:scale-105"
      >
        <Heart className={cn("size-[1.1rem]", fav ? "fill-terracotta text-terracotta" : "text-navy")} aria-hidden />
      </button>
      <div className="flex flex-1 flex-col gap-2 px-1 pt-4">
        <div className="flex items-center justify-between gap-2 text-sm text-muted">
          <span>
            {city.name} · {typeLabels[w.type]}
          </span>
          <Rating value={w.rating} className="text-ink" />
        </div>
        <h3 className="text-[1.3rem] leading-[1.15] tracking-[-0.025em]">
          <Link to={`/ateliers/${w.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {w.title}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between pt-1 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Clock className="size-4" aria-hidden /> {formatDuration(w.durationMin)}
          </span>
          <span>
            <span className="tabular text-lg font-semibold text-terracotta">{formatPrice(w.priceCentimes)}</span>
            <span className="text-muted"> / pers.</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export function WorkshopCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <Skeleton className="aspect-[4/5] rounded-[var(--radius-card)]" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
