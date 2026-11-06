/**
 * Domain types. They mirror the future Laravel API resources, so the services layer
 * can switch from mock data to HTTP without touching components.
 * Money is always in integer centimes. Dates are local `YYYY-MM-DD`, times `HH:mm`.
 */

export type CraftId =
  | "tissage" | "poterie" | "cuir" | "zellige" | "broderie" | "bois" | "dinanderie" | "bijouterie";

export type CityId =
  | "fes" | "marrakech" | "safi" | "essaouira" | "tetouan" | "ouarzazate" | "tiznit" | "rabat";

export type Pigment = "rose" | "saffron" | "mint" | "sky" | "clay";

export interface Craft {
  id: CraftId;
  name: string;
  tagline: string;
  pigment: Pigment;
  image: string;
}

export interface City {
  id: CityId;
  name: string;
  region: string;
  coordinates: [number, number];
  image: string;
}

export interface Artisan {
  id: string;
  slug: string;
  name: string;
  craftId: CraftId;
  cityId: CityId;
  cooperative: string;
  story: string[];
  quote: string;
  yearsOfExperience: number;
  languages: string[];
  photo: string;
}

export type WorkshopType = "visite" | "atelier-pratique" | "circuit-groupe";

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  summary: string;
  artisanId: string;
  craftId: CraftId;
  cityId: CityId;
  type: WorkshopType;
  priceCentimes: number;
  durationMin: number;
  maxGroupSize: number;
  languages: string[];
  steps: { title: string; text: string }[];
  included: string[];
  rating: number;
  reviewCount: number;
  photos: string[];
  verified: boolean;
  sponsored: boolean;
  groupFriendly: boolean;
  slots: string[];
  /** Days of the week the workshop is closed (0 = dimanche … 6 = samedi). */
  closedWeekdays: number[];
  address: string;
  coordinates: [number, number];
}

export interface Review {
  id: string;
  workshopId: string;
  author: string;
  country: string;
  rating: number;
  date: string;
  text: string;
}

export type BookingStatus = "confirmed" | "completed" | "cancelled" | "no-show";

export interface Booking {
  id: string;
  reference: string;
  workshopId: string;
  date: string;
  slot: string;
  participants: number;
  contact: { name: string; email: string; phone: string };
  subtotalCentimes: number;
  discountCentimes: number;
  totalCentimes: number;
  artisanShareCentimes: number;
  partnerId: string | null;
  promoCode: string | null;
  status: BookingStatus;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  kind: "riad" | "hôtel" | "maison d’hôtes" | "agence";
  cityId: CityId;
  host: string;
  message: string;
  recommendedWorkshopIds: string[];
}

export interface User {
  name: string;
  email: string;
}

export interface WorkshopFilters {
  city?: CityId;
  craft?: CraftId;
  maxPrice?: number;
  maxDuration?: number;
  date?: string;
  group?: boolean;
  type?: WorkshopType;
  sort?: "recommandes" | "prix" | "note" | "duree";
}
