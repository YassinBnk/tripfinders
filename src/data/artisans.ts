import type { Artisan } from "@/types";

/** All artisans are fictional. Photos show crafts and workshops, not these people. */
export const artisans: Artisan[] = [
  {
    id: "a1", slug: "khadija-el-amrani", name: "Khadija El Amrani", craftId: "tissage", cityId: "fes",
    cooperative: "Coopérative Nour Al Atlas", yearsOfExperience: 24, languages: ["Arabe", "Français"],
    photo: "/images/crafts/tissage",
    quote: "Un tapis, c’est une lettre qu’on écrit avec de la laine. Chaque nœud a un sens.",
    story: [
      "Khadija a appris à nouer la laine à huit ans, assise à côté de sa grand-mère, dans un village du Moyen Atlas.",
      "Installée à Fès depuis vingt ans, elle a fondé avec onze femmes la coopérative Nour Al Atlas. Elles teignent la laine avec du henné, de la garance et de l’indigo, et transmettent les motifs de leur région.",
      "Avec TripFinders, elle ouvre son atelier aux visiteurs deux fois par jour. « Ils repartent avec un petit tissage, mais surtout avec le temps que demande un vrai tapis. »",
    ],
  },
  {
    id: "a2", slug: "hamid-tazi", name: "Hamid Tazi", craftId: "cuir", cityId: "fes",
    cooperative: "Association des tanneurs de la médina", yearsOfExperience: 31, languages: ["Arabe", "Français", "Anglais"],
    photo: "/images/gallery/cuir-artisan",
    quote: "Le cuir de Fès se travaille comme il y a mille ans : à la main, au soleil, avec patience.",
    story: [
      "Fils et petit-fils de tanneurs, Hamid connaît chaque cuve de Chouara.",
      "Il guide les visiteurs des bassins de chaux aux terrasses de séchage, explique les teintures naturelles (coquelicot, safran, indigo) et la différence entre un cuir industriel et un cuir tanné à l’ancienne.",
    ],
  },
  {
    id: "a3", slug: "youssef-bennani", name: "Youssef Bennani", craftId: "poterie", cityId: "fes",
    cooperative: "Atelier Ben Jelloud", yearsOfExperience: 18, languages: ["Arabe", "Français", "Anglais"],
    photo: "/images/gallery/poterie-atelier",
    quote: "L’argile vous apprend l’humilité : elle sent tout de suite si vous êtes pressé.",
    story: [
      "Youssef travaille l’argile grise de Fès, réputée pour sa finesse et son bleu cobalt.",
      "Dans son atelier près de Bab Ftouh, il fait découvrir le tour à pied, puis l’émaillage et la cuisson au four à bois.",
    ],
  },
  {
    id: "a4", slug: "rachid-alaoui", name: "Rachid Alaoui", craftId: "zellige", cityId: "fes",
    cooperative: "Maâlem Zellige Fassi", yearsOfExperience: 27, languages: ["Arabe", "Français"],
    photo: "/images/crafts/zellige",
    quote: "Une étoile de zellige, ce sont des dizaines de pièces taillées au marteau. Aucune erreur n’est permise.",
    story: [
      "Maâlem respecté, Rachid a restauré des fontaines et des palais de la médina.",
      "Il enseigne la taille au menghach, le petit marteau tranchant, et l’assemblage à l’envers des motifs géométriques.",
    ],
  },
  {
    id: "a5", slug: "omar-lahlou", name: "Omar Lahlou", craftId: "dinanderie", cityId: "marrakech",
    cooperative: "Souk Haddadine", yearsOfExperience: 22, languages: ["Arabe", "Français", "Espagnol"],
    photo: "/images/gallery/lanternes",
    quote: "Une lanterne, c’est de la lumière qu’on dessine avec un poinçon.",
    story: [
      "Omar a grandi dans le bruit des marteaux du souk Haddadine, le quartier des forgerons de Marrakech.",
      "Il découpe, perce et cisèle le cuivre et le laiton pour créer lanternes et plateaux, et adore montrer comment un simple motif devient une ombre sur les murs.",
    ],
  },
  {
    id: "a6", slug: "amina-skalli", name: "Amina Skalli", craftId: "broderie", cityId: "tetouan",
    cooperative: "Dar Taraz", yearsOfExperience: 16, languages: ["Arabe", "Espagnol", "Français"],
    photo: "/images/gallery/broderie-fes",
    quote: "La broderie tétouanaise se lit des deux côtés. C’est notre fierté.",
    story: [
      "Héritière de la tradition andalouse de Tétouan, Amina brode au fil de soie des motifs floraux identiques sur l’endroit et l’envers.",
      "Elle forme aujourd’hui des jeunes femmes de la médina et accueille les visiteurs autour d’un thé à la menthe.",
    ],
  },
  {
    id: "a7", slug: "mustapha-serghini", name: "Mustapha Serghini", craftId: "poterie", cityId: "safi",
    cooperative: "Colline des potiers", yearsOfExperience: 35, languages: ["Arabe", "Français", "Anglais"],
    photo: "/images/gallery/poterie-safi",
    quote: "À Safi, la terre est rouge et la mer n’est jamais loin. Nos couleurs viennent de là.",
    story: [
      "Mustapha travaille sur la colline des potiers de Safi depuis l’âge de douze ans.",
      "Spécialiste du tour et de l’émail polychrome, il fait visiter les fours traditionnels et propose des ateliers de peinture sur céramique.",
    ],
  },
  {
    id: "a8", slug: "said-ouahmane", name: "Saïd Ouahmane", craftId: "bois", cityId: "essaouira",
    cooperative: "Coopérative Argan & Thuya", yearsOfExperience: 20, languages: ["Arabe", "Amazigh", "Français", "Anglais"],
    photo: "/images/crafts/bois",
    quote: "La loupe de thuya a un parfum qu’on n’oublie pas. C’est elle qui choisit le motif.",
    story: [
      "Sous les remparts d’Essaouira, Saïd travaille la loupe de thuya, un bois précieux et parfumé.",
      "Marqueterie de citronnier, d’ébène et de nacre : il montre chaque étape, du bloc brut au coffret poli.",
    ],
  },
  {
    id: "a9", slug: "brahim-ait-lhaj", name: "Brahim Aït Lhaj", craftId: "bijouterie", cityId: "tiznit",
    cooperative: "Maison de l’argent de Tiznit", yearsOfExperience: 29, languages: ["Amazigh", "Arabe", "Français"],
    photo: "/images/gallery/bijou-pendentif",
    quote: "La fibule tient le vêtement, mais elle raconte aussi d’où l’on vient.",
    story: [
      "Tiznit est la capitale de l’argent berbère. Brahim y perpétue les fibules, les bracelets et les pendentifs du Souss.",
      "Il enseigne la fonte, le filigrane et la gravure, et explique la symbolique des motifs amazighs.",
    ],
  },
  {
    id: "a10", slug: "itto-ouchen", name: "Itto Ouchen", craftId: "tissage", cityId: "ouarzazate",
    cooperative: "Coopérative Tafsut", yearsOfExperience: 21, languages: ["Amazigh", "Arabe", "Français"],
    photo: "/images/cities/ouarzazate",
    quote: "Nos kilims parlent la langue des montagnes : losanges, chevrons, et le rouge de la terre.",
    story: [
      "Dans la vallée du Drâa, Itto et les femmes de la coopérative Tafsut tissent kilims et tapis glaoua.",
      "Les visiteurs découvrent le cardage, le filage au fuseau et la teinture végétale, au pied de la kasbah.",
    ],
  },
  {
    id: "a11", slug: "karim-benjelloun", name: "Karim Benjelloun", craftId: "bois", cityId: "rabat",
    cooperative: "Atelier Oudayas", yearsOfExperience: 19, languages: ["Arabe", "Français", "Anglais"],
    photo: "/images/gallery/bois-porte-peinte",
    quote: "Le cèdre se sculpte, se peint, se respire. Un plafond peut prendre un an.",
    story: [
      "Karim sculpte et peint le cèdre de l’Atlas, l’art du zouaq qui orne les plafonds et les portes des palais.",
      "Son atelier, près de la kasbah des Oudayas, restaure aussi des pièces anciennes.",
    ],
  },
];

export const artisanById = (id: string) => artisans.find((a) => a.id === id);
