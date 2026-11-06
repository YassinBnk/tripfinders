/**
 * All visible French copy lives here so `en` and `ar` can be added later.
 * Keep the same shape when adding a language.
 */
export const fr = {
  brand: {
    name: "TripFinders",
    tagline: "Au cœur des ateliers",
    pitch: "Plateforme immersive au cœur des ateliers d’artisans marocains",
    baseline: "Voir · Apprendre · Créer",
    closing: "Chaque objet a une histoire. Venez la voir naître.",
  },
  nav: {
    explore: "Explorer",
    groups: "Groupes",
    becomePartner: "Devenir partenaire",
    account: "Mon compte",
    login: "Connexion",
    skipToContent: "Aller au contenu",
  },
  common: {
    comingSoon: "Cette page arrive bientôt.",
    backHome: "Retour à l’accueil",
  },
  notFound: {
    title: "Cet atelier est introuvable",
    text: "La page que vous cherchez n’existe pas ou a été déplacée.",
  },
} as const;

export type Messages = typeof fr;
