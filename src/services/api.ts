/**
 * Data access layer. Every function is async and returns plain domain objects,
 * exactly like the future Laravel REST API. To switch, replace these bodies with
 * `fetch()` calls (and map snake_case → camelCase here), components stay untouched.
 */
import { artisans } from "@/data/artisans";
import { cities, crafts } from "@/data/catalog";
import { partners } from "@/data/partners";
import { reviews } from "@/data/reviews";
import { workshops } from "@/data/workshops";
import { slotAvailability } from "@/lib/availability";
import type { Artisan, City, Craft, Partner, Review, Workshop, WorkshopFilters } from "@/types";

const LATENCY_MS = 300;
const delay = <T,>(value: T): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

export function getCrafts(): Promise<Craft[]> {
  return delay(crafts);
}

export function getCities(): Promise<City[]> {
  return delay(cities);
}

export function filterWorkshops(all: Workshop[], f: WorkshopFilters): Workshop[] {
  const list = all.filter(
    (w) =>
      (!f.city || w.cityId === f.city) &&
      (!f.craft || w.craftId === f.craft) &&
      (!f.type || w.type === f.type) &&
      (!f.maxPrice || w.priceCentimes <= f.maxPrice * 100) &&
      (!f.maxDuration || w.durationMin <= f.maxDuration) &&
      (!f.group || w.groupFriendly) &&
      (!f.date || slotAvailability(w, f.date).some((s) => s.remaining > 0)),
  );
  const sorters: Record<NonNullable<WorkshopFilters["sort"]>, (a: Workshop, b: Workshop) => number> = {
    recommandes: (a, b) => Number(b.sponsored) - Number(a.sponsored) || b.rating - a.rating || b.reviewCount - a.reviewCount,
    prix: (a, b) => a.priceCentimes - b.priceCentimes,
    note: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
    duree: (a, b) => a.durationMin - b.durationMin,
  };
  return [...list].sort(sorters[f.sort ?? "recommandes"]);
}

export function getWorkshops(filters: WorkshopFilters = {}): Promise<Workshop[]> {
  return delay(filterWorkshops(workshops, filters));
}

export function getWorkshopBySlug(slug: string): Promise<Workshop | null> {
  return delay(workshops.find((w) => w.slug === slug) ?? null);
}

export function getWorkshopsByIds(ids: string[]): Promise<Workshop[]> {
  return delay(ids.map((id) => workshops.find((w) => w.id === id)).filter((w): w is Workshop => !!w));
}

export function getArtisanBySlug(slug: string): Promise<Artisan | null> {
  return delay(artisans.find((a) => a.slug === slug) ?? null);
}

export function getWorkshopsByArtisan(artisanId: string): Promise<Workshop[]> {
  return delay(workshops.filter((w) => w.artisanId === artisanId));
}

export function getReviews(workshopIds: string[]): Promise<Review[]> {
  return delay(reviews.filter((r) => workshopIds.includes(r.workshopId)).sort((a, b) => b.date.localeCompare(a.date)));
}

export function getPartner(id: string): Promise<Partner | null> {
  return delay(partners.find((p) => p.id === id) ?? null);
}

/** Forms (quote, partner sign-up): nothing is sent, we only simulate the round-trip. */
export function submitForm<T>(_payload: T): Promise<{ ok: true }> {
  return delay({ ok: true });
}
