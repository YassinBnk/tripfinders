import type { City, Craft } from "@/types";

/** Image paths without size suffix: `<Img src>` adds `-800.webp` / `-1600.webp`. */
export const crafts: Craft[] = [
  { id: "tissage", name: "Tissage", tagline: "Tapis et kilims noués à la main", pigment: "rose", image: "/images/crafts/tissage" },
  { id: "poterie", name: "Poterie", tagline: "Argile tournée, émaillée, cuite au four", pigment: "clay", image: "/images/crafts/poterie" },
  { id: "cuir", name: "Cuir", tagline: "Tanneries et maroquinerie de Fès", pigment: "saffron", image: "/images/crafts/cuir" },
  { id: "zellige", name: "Zellige", tagline: "La mosaïque taillée pièce par pièce", pigment: "mint", image: "/images/crafts/zellige" },
  { id: "broderie", name: "Broderie", tagline: "Fils de soie et motifs citadins", pigment: "rose", image: "/images/crafts/broderie" },
  { id: "bois", name: "Bois", tagline: "Thuya, cèdre et marqueterie", pigment: "clay", image: "/images/crafts/bois" },
  { id: "dinanderie", name: "Dinanderie", tagline: "Laiton et cuivre ciselés", pigment: "saffron", image: "/images/crafts/dinanderie" },
  { id: "bijouterie", name: "Bijouterie", tagline: "L’argent berbère du Souss", pigment: "sky", image: "/images/crafts/bijouterie" },
];

export const cities: City[] = [
  { id: "fes", name: "Fès", region: "Fès-Meknès", coordinates: [34.0645, -4.9733], image: "/images/cities/fes" },
  { id: "marrakech", name: "Marrakech", region: "Marrakech-Safi", coordinates: [31.6295, -7.9811], image: "/images/cities/marrakech" },
  { id: "safi", name: "Safi", region: "Marrakech-Safi", coordinates: [32.2994, -9.2372], image: "/images/cities/safi" },
  { id: "essaouira", name: "Essaouira", region: "Marrakech-Safi", coordinates: [31.5085, -9.7595], image: "/images/cities/essaouira" },
  { id: "tetouan", name: "Tétouan", region: "Tanger-Tétouan-Al Hoceïma", coordinates: [35.5785, -5.3684], image: "/images/cities/tetouan" },
  { id: "ouarzazate", name: "Ouarzazate", region: "Drâa-Tafilalet", coordinates: [30.9335, -6.937], image: "/images/cities/ouarzazate" },
  { id: "tiznit", name: "Tiznit", region: "Souss-Massa", coordinates: [29.6974, -9.7316], image: "/images/cities/tiznit" },
  { id: "rabat", name: "Rabat", region: "Rabat-Salé-Kénitra", coordinates: [34.0209, -6.8416], image: "/images/cities/rabat" },
];

export const craftById = (id: string) => crafts.find((c) => c.id === id);
export const cityById = (id: string) => cities.find((c) => c.id === id);
