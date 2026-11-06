import { addDays, format, getDay, parseISO } from "date-fns";
import type { Booking, Workshop } from "@/types";

export interface SlotAvailability {
  slot: string;
  remaining: number;
}

/** Deterministic pseudo-random number 0..1 so mock availability is stable between renders. */
function seeded(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

export function todayISO(now = new Date()): string {
  return format(now, "yyyy-MM-dd");
}

export function isClosedDay(workshop: Workshop, isoDate: string): boolean {
  return workshop.closedWeekdays.includes(getDay(parseISO(isoDate)));
}

/**
 * Places left per slot on a date: capacity minus mock bookings (seeded) minus the user's own bookings.
 * Roughly one slot in eight is shown as full, which keeps the demo realistic.
 */
export function slotAvailability(workshop: Workshop, isoDate: string, ownBookings: Booking[] = []): SlotAvailability[] {
  if (isClosedDay(workshop, isoDate)) return [];
  return workshop.slots.map((slot) => {
    const r = seeded(`${workshop.slug}|${isoDate}|${slot}`);
    const mockBooked = r < 0.12 ? workshop.maxGroupSize : Math.floor(r * workshop.maxGroupSize * 0.6);
    const own = ownBookings
      .filter((b) => b.workshopId === workshop.id && b.date === isoDate && b.slot === slot && b.status !== "cancelled")
      .reduce((sum, b) => sum + b.participants, 0);
    return { slot, remaining: Math.max(0, workshop.maxGroupSize - mockBooked - own) };
  });
}

/** True when at least one slot has room on that date (and the date is not in the past). */
export function isDateBookable(workshop: Workshop, isoDate: string, today = todayISO()): boolean {
  if (isoDate <= today) return false;
  return slotAvailability(workshop, isoDate).some((s) => s.remaining > 0);
}

/** First bookable date from tomorrow, used to pre-select a sensible date. */
export function firstBookableDate(workshop: Workshop, today = todayISO()): string {
  let d = parseISO(today);
  for (let i = 1; i < 60; i++) {
    const iso = format(addDays(d, i), "yyyy-MM-dd");
    if (isDateBookable(workshop, iso, today)) return iso;
  }
  d = addDays(d, 1);
  return format(d, "yyyy-MM-dd");
}
