import type { Review } from "@/types";
import { workshops } from "./workshops";

/** Fictional reviews. A pool is spread over workshops so each one shows 3 to 5. */
const pool: Omit<Review, "id" | "workshopId">[] = [
  { author: "Claire D.", country: "France", rating: 5, date: "2026-10-12", text: "Un moment hors du temps. L’artisane prend le temps d’expliquer chaque geste, on se sent accueillis comme en famille." },
  { author: "Javier M.", country: "Espagne", rating: 5, date: "2026-10-03", text: "Lo mejor de nuestro viaje. Auténtico, sin presión para comprar, y el dinero va directamente al artesano." },
  { author: "Samir B.", country: "Maroc", rating: 5, date: "2026-09-28", text: "Je suis de Casablanca et je n’avais jamais vu ce travail de près. J’y retournerai avec mes enfants." },
  { author: "Emma W.", country: "Royaume-Uni", rating: 4, date: "2026-09-19", text: "Fascinating and very hands-on. A bit hot in the afternoon, the morning slot is probably better." },
  { author: "Nadia R.", country: "Belgique (MRE)", rating: 5, date: "2026-09-02", text: "J’ai redécouvert le métier de ma grand-mère. Beaucoup d’émotion, et une pièce que je garderai toute ma vie." },
  { author: "Lukas H.", country: "Allemagne", rating: 5, date: "2026-08-24", text: "Sehr authentisch. Man versteht endlich, warum ein echtes Stück so viel Zeit braucht." },
  { author: "Sophie L.", country: "Canada", rating: 5, date: "2026-08-15", text: "Réservation simple, accueil chaleureux, explications passionnantes. Le prix est juste pour ce qu’on vit." },
  { author: "Yassine K.", country: "Maroc", rating: 4, date: "2026-08-02", text: "Très belle expérience. L’atelier est un peu difficile à trouver, mais le plan envoyé par e-mail aide beaucoup." },
  { author: "Giulia P.", country: "Italie", rating: 5, date: "2026-07-21", text: "Un’esperienza meravigliosa. Abbiamo parlato con l’artigiano per un’ora, nessun negozio turistico." },
  { author: "Thomas G.", country: "Suisse", rating: 5, date: "2026-07-09", text: "Nous étions un groupe de huit, tout était parfaitement organisé. Les enfants ont adoré." },
  { author: "Aïcha T.", country: "France (MRE)", rating: 5, date: "2026-06-30", text: "Enfin une façon de soutenir directement les artisans. On voit où va l’argent, c’est rassurant." },
  { author: "Daniel S.", country: "États-Unis", rating: 4, date: "2026-06-14", text: "Great workshop. I made a mess at first but the master was patient and funny." },
];

export const reviews: Review[] = workshops.flatMap((w, wi) => {
  const count = 3 + (wi % 3);
  return Array.from({ length: count }, (_, i) => {
    const r = pool[(wi * 5 + i * 7) % pool.length]!;
    return { ...r, id: `r-${w.id}-${i}`, workshopId: w.id };
  });
});
