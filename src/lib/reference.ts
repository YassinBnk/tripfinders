/** Unambiguous alphabet: no 0/O or 1/I, so a reference can be read aloud at the workshop door. */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Booking reference like `TF-26-7K3P`. */
export function createReference(year = new Date().getFullYear(), random: () => number = Math.random): string {
  let code = "";
  for (let i = 0; i < 4; i++) code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  return `TF-${String(year).slice(-2)}-${code}`;
}

export function isReference(value: string): boolean {
  return /^TF-\d{2}-[2-9A-HJ-NP-Z]{4}$/.test(value.trim().toUpperCase());
}
