import { describe, expect, it } from "vitest";
import { computePrice, loyaltyProgress } from "./pricing";
import { createReference, isReference } from "./reference";
import { isClosedDay, slotAvailability } from "./availability";
import { workshops } from "@/data/workshops";

describe("computePrice", () => {
  it("matches the demo: 2 × 250 DH → 500 DH, 425 DH to the artisan", () => {
    const p = computePrice({ unitPriceCentimes: 25000, participants: 2 });
    expect(p.totalCentimes).toBe(50000);
    expect(p.artisanShareCentimes).toBe(42500);
    expect(p.platformShareCentimes).toBe(7500);
  });

  it("applies BIENVENUE10 on a first booking without touching the artisan share", () => {
    const p = computePrice({ unitPriceCentimes: 25000, participants: 2, promoCode: "bienvenue10", isFirstBooking: true });
    expect(p.promoApplied).toBe(true);
    expect(p.totalCentimes).toBe(45000);
    expect(p.artisanShareCentimes).toBe(42500);
    expect(p.platformShareCentimes).toBe(2500);
  });

  it("refuses the welcome code after a first booking", () => {
    const p = computePrice({ unitPriceCentimes: 25000, participants: 1, promoCode: "BIENVENUE10", isFirstBooking: false });
    expect(p.promoApplied).toBe(false);
    expect(p.totalCentimes).toBe(25000);
  });

  it("pays the partner 5 % out of the platform share", () => {
    const p = computePrice({ unitPriceCentimes: 25000, participants: 1, partnerId: "riad-yasmine" });
    expect(p.artisanShareCentimes).toBe(21250);
    expect(p.partnerShareCentimes).toBe(1250);
    expect(p.platformShareCentimes).toBe(2500);
  });
});

describe("loyaltyProgress", () => {
  it("counts towards 5 visits", () => {
    expect(loyaltyProgress(3)).toEqual({ current: 3, target: 5, freeVisitsEarned: 0 });
    expect(loyaltyProgress(6)).toEqual({ current: 1, target: 5, freeVisitsEarned: 1 });
  });
});

describe("reference", () => {
  it("creates readable references", () => {
    const ref = createReference(2026);
    expect(ref).toMatch(/^TF-26-/);
    expect(isReference(ref)).toBe(true);
    expect(isReference("TF-26-0OI1")).toBe(false);
  });
});

describe("availability", () => {
  const fesWeaving = workshops.find((w) => w.slug === "tissage-tapis-fes")!;
  it("closes on Fridays", () => {
    expect(isClosedDay(fesWeaving, "2026-11-13")).toBe(true); // vendredi
    expect(slotAvailability(fesWeaving, "2026-11-13")).toEqual([]);
  });
  it("never exceeds capacity and is stable", () => {
    const a = slotAvailability(fesWeaving, "2026-11-14");
    expect(a).toEqual(slotAvailability(fesWeaving, "2026-11-14"));
    a.forEach((s) => expect(s.remaining).toBeLessThanOrEqual(fesWeaving.maxGroupSize));
  });
});
