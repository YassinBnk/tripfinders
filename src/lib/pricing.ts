/**
 * Pricing rules (brief §7 and §15). Pure functions, amounts in integer centimes.
 * - The artisan always receives 85 % of the full price, whatever the discounts.
 * - Promo codes and loyalty are paid out of TripFinders' 15 %.
 * - A hotel/riad partner earns 5 % of bookings made through its QR code, also from the 15 %.
 */

export const ARTISAN_SHARE = 0.85;
export const PARTNER_SHARE = 0.05;
export const WELCOME_CODE = "BIENVENUE10";
export const WELCOME_RATE = 0.1;
export const LOYALTY_TARGET = 5;

export interface PriceInput {
  unitPriceCentimes: number;
  participants: number;
  promoCode?: string | null;
  /** Promo only applies to a first booking. */
  isFirstBooking?: boolean;
  partnerId?: string | null;
}

export interface PriceBreakdown {
  subtotalCentimes: number;
  discountCentimes: number;
  totalCentimes: number;
  artisanShareCentimes: number;
  partnerShareCentimes: number;
  platformShareCentimes: number;
  promoApplied: boolean;
}

export function isValidPromo(code: string | null | undefined, isFirstBooking = true): boolean {
  return !!code && code.trim().toUpperCase() === WELCOME_CODE && isFirstBooking;
}

export function computePrice(input: PriceInput): PriceBreakdown {
  const participants = Math.max(1, Math.floor(input.participants));
  const subtotal = input.unitPriceCentimes * participants;
  const promoApplied = isValidPromo(input.promoCode, input.isFirstBooking ?? true);
  const discount = promoApplied ? Math.round(subtotal * WELCOME_RATE) : 0;
  const artisan = Math.round(subtotal * ARTISAN_SHARE);
  const partner = input.partnerId ? Math.round(subtotal * PARTNER_SHARE) : 0;

  return {
    subtotalCentimes: subtotal,
    discountCentimes: discount,
    totalCentimes: subtotal - discount,
    artisanShareCentimes: artisan,
    partnerShareCentimes: partner,
    platformShareCentimes: subtotal - discount - artisan - partner,
    promoApplied,
  };
}

/** Loyalty: every 5 completed visits unlock one free visit. */
export function loyaltyProgress(completedVisits: number) {
  return {
    current: completedVisits % LOYALTY_TARGET,
    target: LOYALTY_TARGET,
    freeVisitsEarned: Math.floor(completedVisits / LOYALTY_TARGET),
  };
}
