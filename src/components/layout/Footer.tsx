import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { fr } from "@/i18n/fr";

const sponsors = [
  { file: "ambassade-espagne", name: "Ambassade d’Espagne au Maroc" },
  { file: "aecid", name: "AECID" },
  { file: "fundacion-cideal", name: "Fundación Cideal" },
  { file: "360", name: "360" },
  { file: "ofppt", name: "OFPPT" },
];

const columns = [
  { title: "Voyager", links: [["Explorer les ateliers", "/explorer"], ["Offres de groupe", "/groupes"], ["Mon compte", "/compte"]] },
  { title: "Artisans", links: [["Devenir partenaire", "/devenir-partenaire"], ["Espace artisan", "/espace-artisan"], ["Hôtels et riads", "/devenir-partenaire#hotels"]] },
  { title: "TripFinders", links: [["À propos", "/a-propos"], ["Mentions légales", "/mentions-legales"], ["Exemple de page hôtel", "/h/riad-yasmine"]] },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="container-page pt-24 sm:pt-32">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div data-reveal>
            <p className="max-w-[16ch] text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
              Chaque objet a une histoire. <span className="serif text-saffron">Venez la voir naître.</span>
            </p>
            <Link
              to="/explorer"
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 py-3 ps-6 pe-3 text-lg font-medium transition-colors hover:border-white"
            >
              Trouver un atelier
              <span className="grid size-10 place-items-center rounded-full bg-saffron text-navy transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-5" aria-hidden />
              </span>
            </Link>
          </div>
          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="eyebrow text-navy-muted">{c.title}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {c.links.map(([label, to]) => (
                    <li key={to}>
                      <Link to={to} className="text-white/85 transition-colors hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 rounded-[var(--radius-card)] bg-white px-6 py-6 sm:px-10">
          <p className="eyebrow text-center text-muted">Avec le soutien de · Digitex 2026</p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {sponsors.map((s) => (
              <li key={s.file}>
                <img src={`/images/sponsors/${s.file}.webp`} alt={s.name} loading="lazy" className="h-10 w-auto sm:h-12" />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/10 py-8 text-sm text-navy-muted sm:flex-row sm:items-center">
          <p>© 2026 TripFinders · {fr.brand.tagline} · Projet de démonstration, données fictives.</p>
          <ul className="flex gap-2">
            {["Instagram", "Facebook", "YouTube"].map((label) => (
              <li key={label}>
                <a href="#" aria-label={`TripFinders sur ${label} (bientôt)`} className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-white/85 hover:border-white">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p aria-hidden className="pointer-events-none -mb-[0.2em] select-none text-center text-[clamp(4rem,19.5vw,19rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-white/[0.06]">
        Trip<span className="serif font-normal">Finders</span>
      </p>
    </footer>
  );
}
