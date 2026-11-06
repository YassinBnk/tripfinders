import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

/** Non-breaking space, so « 250 DH » never wraps between number and unit. */
const NBSP = " ";

const priceFormatters = {
  whole: new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }),
  cents: new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

/**
 * Formats an amount stored in centimes as French dirhams.
 * 25000 → « 250 DH », 21250 → « 212,50 DH », 150000 → « 1 500 DH ».
 * Intl groups thousands with a narrow no-break space (U+202F), which Playfair Display renders
 * almost invisibly, so it is swapped for a regular no-break space.
 */
export function formatPrice(centimes: number): string {
  const formatter = centimes % 100 === 0 ? priceFormatters.whole : priceFormatters.cents;
  return `${formatter.format(centimes / 100).replace(/ /g, NBSP)}${NBSP}DH`;
}

/**
 * Formats a local calendar date (`YYYY-MM-DD`) in French.
 * Only the first letter is capitalised (« Samedi 14 novembre 2026 »), as French requires.
 * Dates are never converted through timestamps, so Morocco's Ramadan time change can't shift them.
 */
export function formatDate(isoDate: string, pattern = "EEEE d MMMM yyyy"): string {
  const text = format(parseISO(isoDate), pattern, { locale: fr });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Formats a duration in minutes: 90 → « 1 h 30 », 120 → « 2 h », 45 → « 45 min ». */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}${NBSP}min`;
  if (m === 0) return `${h}${NBSP}h`;
  return `${h}${NBSP}h${NBSP}${String(m).padStart(2, "0")}`;
}
