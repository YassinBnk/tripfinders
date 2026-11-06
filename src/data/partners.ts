import type { Partner } from "@/types";

/** Fictional hotels and riads that recommend workshops through a QR code. */
export const partners: Partner[] = [
  {
    id: "riad-yasmine", name: "Riad Yasmine", kind: "riad", cityId: "fes", host: "Leïla",
    message: "Nos voisins artisans sont ce que Fès a de plus précieux. Voici ceux que nous recommandons à tous nos hôtes.",
    recommendedWorkshopIds: ["w1", "w2", "w3", "w4", "w13"],
  },
  {
    id: "dar-el-bahja", name: "Dar El Bahja", kind: "maison d’hôtes", cityId: "marrakech", host: "Mehdi",
    message: "À cinq minutes à pied : les meilleurs ateliers de la médina, vérifiés par l’équipe TripFinders.",
    recommendedWorkshopIds: ["w5", "w16", "w14"],
  },
  {
    id: "hotel-mogador", name: "Hôtel Mogador Océan", kind: "hôtel", cityId: "essaouira", host: "Sara",
    message: "Le thuya, c’est l’âme d’Essaouira. Nos artisans préférés vous attendent sous les remparts.",
    recommendedWorkshopIds: ["w9", "w10"],
  },
];
