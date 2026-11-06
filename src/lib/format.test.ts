import { describe, expect, it } from "vitest";
import { formatDate, formatDuration, formatPrice } from "./format";

// Normalise the special spaces Intl uses so expectations stay readable.
const plain = (s: string) => s.replace(/[  ]/g, " ");

describe("formatPrice", () => {
  it("formats whole dirhams without decimals", () => {
    expect(plain(formatPrice(25000))).toBe("250 DH");
  });

  it("keeps centimes when there are some", () => {
    expect(plain(formatPrice(21250))).toBe("212,50 DH");
    expect(plain(formatPrice(42500))).toBe("425 DH");
  });

  it("groups thousands with a non-breaking space", () => {
    expect(plain(formatPrice(150000))).toBe("1 500 DH");
    expect(formatPrice(150000)).toBe("1 500 DH"); // no-break spaces only, visible in every font
  });
});

describe("formatDate", () => {
  it("formats a local date in French", () => {
    expect(formatDate("2026-11-14")).toBe("Samedi 14 novembre 2026");
  });
});

describe("formatDuration", () => {
  it.each([
    [45, "45 min"],
    [90, "1 h 30"],
    [120, "2 h"],
  ])("%i minutes → %s", (minutes, expected) => {
    expect(plain(formatDuration(minutes))).toBe(expected);
  });
});
