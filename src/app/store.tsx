import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { computePrice } from "@/lib/pricing";
import { createReference } from "@/lib/reference";
import { workshopById } from "@/data/workshops";
import type { Booking, User } from "@/types";

/**
 * Client-side app state (fake auth, bookings, favourites, partner attribution).
 * Persisted in localStorage so the live demo survives a reload. Replaced by the API later.
 */

const STORAGE_KEY = "tripfinders:v1";
const PARTNER_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface PersistedState {
  user: User | null;
  bookings: Booking[];
  favorites: string[];
  partner: { id: string; expiresAt: number } | null;
}

const empty: PersistedState = { user: null, bookings: [], favorites: [], partner: null };

function load(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...empty, ...(JSON.parse(raw) as PersistedState) } : empty;
  } catch {
    return empty;
  }
}

export interface NewBooking {
  workshopId: string;
  date: string;
  slot: string;
  participants: number;
  contact: Booking["contact"];
  promoCode: string | null;
}

interface StoreValue {
  user: User | null;
  bookings: Booking[];
  favorites: string[];
  partnerId: string | null;
  login: (user: User, withDemoHistory?: boolean) => void;
  logout: () => void;
  addBooking: (input: NewBooking) => Booking;
  checkIn: (reference: string) => Booking | null;
  toggleFavorite: (workshopId: string) => void;
  setPartner: (id: string) => void;
  isFirstBooking: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

/** Two past visits for the demo account, so loyalty and « Mes avis » have content. */
function demoHistory(): Booking[] {
  const past = (workshopId: string, date: string, participants: number, ref: string): Booking => {
    const w = workshopById(workshopId)!;
    const p = computePrice({ unitPriceCentimes: w.priceCentimes, participants });
    return {
      id: ref, reference: ref, workshopId, date, slot: w.slots[0]!, participants,
      contact: { name: "Léa Martin", email: "lea.martin@example.com", phone: "+33 6 12 34 56 78" },
      subtotalCentimes: p.subtotalCentimes, discountCentimes: 0, totalCentimes: p.totalCentimes,
      artisanShareCentimes: p.artisanShareCentimes, partnerId: null, promoCode: null,
      status: "completed", createdAt: `${date}T09:00:00`,
    };
  };
  return [past("w7", "2026-04-18", 2, "TF-26-SAF2"), past("w10", "2026-04-21", 2, "TF-26-ESS4")];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* private mode: the demo still works for this session */
    }
  }, [state]);

  const partnerId = state.partner && state.partner.expiresAt > Date.now() ? state.partner.id : null;

  const login = useCallback((user: User, withDemoHistory = false) => {
    setState((s) => ({
      ...s,
      user,
      bookings: withDemoHistory && !s.bookings.some((b) => b.status === "completed") ? [...demoHistory(), ...s.bookings] : s.bookings,
    }));
  }, []);

  const logout = useCallback(() => setState((s) => ({ ...s, user: null })), []);

  const addBooking = useCallback(
    (input: NewBooking): Booking => {
      const w = workshopById(input.workshopId);
      if (!w) throw new Error("Atelier introuvable");
      const price = computePrice({
        unitPriceCentimes: w.priceCentimes,
        participants: input.participants,
        promoCode: input.promoCode,
        isFirstBooking: state.bookings.length === 0,
        partnerId,
      });
      const reference = createReference();
      const booking: Booking = {
        id: reference, reference, workshopId: w.id, date: input.date, slot: input.slot,
        participants: input.participants, contact: input.contact,
        subtotalCentimes: price.subtotalCentimes, discountCentimes: price.discountCentimes,
        totalCentimes: price.totalCentimes, artisanShareCentimes: price.artisanShareCentimes,
        partnerId, promoCode: price.promoApplied ? input.promoCode : null,
        status: "confirmed", createdAt: new Date().toISOString(),
      };
      setState((s) => ({ ...s, bookings: [booking, ...s.bookings] }));
      return booking;
    },
    [partnerId, state.bookings.length],
  );

  const checkIn = useCallback(
    (reference: string): Booking | null => {
      const ref = reference.trim().toUpperCase();
      const found = state.bookings.find((b) => b.reference === ref && b.status === "confirmed");
      if (!found) return null;
      setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.reference === ref ? { ...b, status: "completed" } : b)) }));
      return { ...found, status: "completed" };
    },
    [state.bookings],
  );

  const toggleFavorite = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    }));
  }, []);

  const setPartner = useCallback((id: string) => {
    setState((s) => ({ ...s, partner: { id, expiresAt: Date.now() + PARTNER_TTL_MS } }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      user: state.user, bookings: state.bookings, favorites: state.favorites, partnerId,
      login, logout, addBooking, checkIn, toggleFavorite, setPartner,
      isFirstBooking: state.bookings.length === 0,
    }),
    [state, partnerId, login, logout, addBooking, checkIn, toggleFavorite, setPartner],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore doit être utilisé dans <StoreProvider>");
  return ctx;
}
