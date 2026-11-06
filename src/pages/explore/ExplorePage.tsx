import { lazy, Suspense, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { LayoutGrid, Map as MapIcon, SearchX, SlidersHorizontal, X } from "lucide-react";
import { cities, cityById, craftById, crafts } from "@/data/catalog";
import { useAsync } from "@/hooks/useAsync";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { getWorkshops } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/forms";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { Modal } from "@/components/ui/overlays";
import { WorkshopCard, WorkshopCardSkeleton } from "@/components/workshop/WorkshopCard";
import type { CityId, CraftId, WorkshopFilters, WorkshopType } from "@/types";

const MapView = lazy(() => import("@/components/workshop/MapView"));

const priceOptions = [150, 200, 250, 300, 400];
const durationOptions = [
  { v: 90, l: "1 h 30 max" },
  { v: 150, l: "2 h 30 max" },
  { v: 360, l: "Jusqu’à la journée" },
];

/** Filters are the URL: shareable, back-button friendly, and the Home search simply links here. */
export default function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters: WorkshopFilters = useMemo(
    () => ({
      city: (params.get("ville") as CityId) || undefined,
      craft: (params.get("artisanat") as CraftId) || undefined,
      type: (params.get("type") as WorkshopType) || undefined,
      maxPrice: Number(params.get("prix")) || undefined,
      maxDuration: Number(params.get("duree")) || undefined,
      date: params.get("date") || undefined,
      group: params.get("groupe") === "1",
      sort: (params.get("tri") as WorkshopFilters["sort"]) || "recommandes",
    }),
    [params],
  );
  const view = params.get("vue") === "carte" ? "carte" : "grille";
  const { data, loading } = useAsync(() => getWorkshops(filters), [params.toString()]);

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const active: { key: string; label: string }[] = [
    filters.city && { key: "ville", label: cityById(filters.city)?.name ?? "" },
    filters.craft && { key: "artisanat", label: craftById(filters.craft)?.name ?? "" },
    filters.type && { key: "type", label: { visite: "Visite", "atelier-pratique": "Atelier pratique", "circuit-groupe": "Circuit de groupe" }[filters.type] },
    filters.maxPrice && { key: "prix", label: `≤ ${filters.maxPrice} DH` },
    filters.maxDuration && { key: "duree", label: durationOptions.find((d) => d.v === filters.maxDuration)?.l ?? "" },
    filters.date && { key: "date", label: formatDate(filters.date, "d MMM yyyy") },
    filters.group && { key: "groupe", label: "Adapté aux groupes" },
  ].filter((x): x is { key: string; label: string } => !!x);

  const filterFields: ReactNode = (
    <>
      <Field label="Ville">
        {(p) => (
          <Select {...p} value={filters.city ?? ""} onChange={(e) => set("ville", e.target.value || null)}>
            <option value="">Toutes</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Type">
        {(p) => (
          <Select {...p} value={filters.type ?? ""} onChange={(e) => set("type", e.target.value || null)}>
            <option value="">Tous</option>
            <option value="visite">Visite</option>
            <option value="atelier-pratique">Atelier pratique</option>
            <option value="circuit-groupe">Circuit de groupe</option>
          </Select>
        )}
      </Field>
      <Field label="Budget par personne">
        {(p) => (
          <Select {...p} value={filters.maxPrice ?? ""} onChange={(e) => set("prix", e.target.value || null)}>
            <option value="">Tous les prix</option>
            {priceOptions.map((v) => (
              <option key={v} value={v}>
                Jusqu’à {v} DH
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Durée">
        {(p) => (
          <Select {...p} value={filters.maxDuration ?? ""} onChange={(e) => set("duree", e.target.value || null)}>
            <option value="">Toutes</option>
            {durationOptions.map((d) => (
              <option key={d.v} value={d.v}>
                {d.l}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Date">
        {(p) => <Input {...p} type="date" value={filters.date ?? ""} onChange={(e) => set("date", e.target.value || null)} />}
      </Field>
      <label className="flex h-12 cursor-pointer items-center gap-3 self-end rounded-[var(--radius-md)] border border-line bg-surface px-4">
        <input type="checkbox" checked={filters.group} onChange={(e) => set("groupe", e.target.checked ? "1" : null)} className="size-4 accent-navy" />
        <span className="text-sm font-medium">Adapté aux groupes</span>
      </label>
    </>
  );

  return (
    <div className="bg-sand pb-28 pt-32 sm:pt-40">
      <div className="container-page">
        <p className="eyebrow text-teal">Explorer</p>
        <h1 className="display mt-4 text-[clamp(3rem,8vw,7.5rem)] text-navy">
          Trouvez <span className="serif">votre atelier</span>
        </h1>

        {/* Craft pills */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" role="group" aria-label="Filtrer par artisanat">
          <button
            type="button"
            onClick={() => set("artisanat", null)}
            aria-pressed={!filters.craft}
            className={cn("h-11 shrink-0 rounded-full px-5 font-medium transition", !filters.craft ? "bg-navy text-white" : "bg-surface hover:bg-sand-200")}
          >
            Tous
          </button>
          {crafts.map((c) => {
            const on = filters.craft === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => set("artisanat", on ? null : c.id)}
                aria-pressed={on}
                className={cn(
                  "h-11 shrink-0 rounded-full px-5 font-medium transition",
                  on ? { rose: "bg-rose", saffron: "bg-saffron-200", mint: "bg-mint", sky: "bg-sky", clay: "bg-clay" }[c.pigment] : "bg-surface hover:bg-sand-200",
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Desktop filters */}
        <div className="mt-6 hidden grid-cols-6 items-end gap-3 lg:grid">{filterFields}</div>

        {/* Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="me-2 font-medium" aria-live="polite">
              {loading ? "Recherche…" : `${data?.length ?? 0} atelier${(data?.length ?? 0) > 1 ? "s" : ""}`}
            </p>
            {active.map((a) => (
              <button key={a.key} type="button" onClick={() => set(a.key, null)} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface px-3 text-sm hover:bg-sand-200" aria-label={`Retirer le filtre ${a.label}`}>
                {a.label} <X className="size-3.5" aria-hidden />
              </button>
            ))}
            {active.length > 1 && (
              <button type="button" onClick={() => setParams({}, { replace: true })} className="text-sm font-medium text-teal underline underline-offset-4">
                Tout effacer
              </button>
            )}
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button variant="secondary" size="sm" className="h-11 shrink-0 lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="size-4" aria-hidden /> Filtres
            </Button>
            <label className="sr-only" htmlFor="tri">
              Trier par
            </label>
            <Select id="tri" value={filters.sort} onChange={(e) => set("tri", e.target.value === "recommandes" ? null : e.target.value)} className="h-11 min-w-0 flex-1 rounded-full sm:w-auto sm:flex-none">
              <option value="recommandes">Recommandés</option>
              <option value="prix">Prix croissant</option>
              <option value="note">Mieux notés</option>
              <option value="duree">Plus courts</option>
            </Select>
            <div className="flex shrink-0 rounded-full bg-sand-200 p-1" role="group" aria-label="Affichage">
              {[
                { id: "grille", icon: LayoutGrid, label: "Grille" },
                { id: "carte", icon: MapIcon, label: "Carte" },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={view === v.id}
                  onClick={() => set("vue", v.id === "carte" ? "carte" : null)}
                  className={cn("flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium", view === v.id ? "bg-surface shadow-[var(--shadow-soft)]" : "text-muted")}
                >
                  <v.icon className="size-4" aria-hidden /> <span className="hidden sm:inline">{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-10">
          {loading ? (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <WorkshopCardSkeleton key={i} />
              ))}
            </div>
          ) : !data?.length ? (
            <EmptyState
              icon={<SearchX className="size-6" aria-hidden />}
              title="Aucun atelier ne correspond"
              text="Essayez une autre date, une autre ville ou retirez un filtre. De nouveaux ateliers rejoignent TripFinders chaque mois."
              action={{ label: "Effacer les filtres", onClick: () => setParams({}, { replace: true }) }}
            />
          ) : view === "carte" ? (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="h-[60vh] overflow-hidden rounded-[var(--radius-card)] bg-sand-200 lg:sticky lg:top-28 lg:h-[calc(100svh-9rem)]">
                <Suspense fallback={<Skeleton className="h-full w-full" />}>
                  <MapView workshops={data} />
                </Suspense>
              </div>
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
                {data.map((w) => (
                  <WorkshopCard key={w.id} workshop={w} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.map((w, i) => (
                <WorkshopCard key={w.id} workshop={w} priority={i < 2} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filtres" side="bottom">
        <div className="grid gap-4">{filterFields}</div>
        <Button className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>
          Voir {data?.length ?? 0} atelier{(data?.length ?? 0) > 1 ? "s" : ""}
        </Button>
      </Modal>
    </div>
  );
}
