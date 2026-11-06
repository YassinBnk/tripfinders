import { Eye, HandCoins, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Img } from "@/components/ui/Img";
import { SectionHeading } from "@/components/ui/misc";

const team = [
  { name: "Nour Mesbahi", role: "Gérante · cheffe de projet", initials: "NM" },
  { name: "Mohamed Dghar", role: "Technique · site et application", initials: "MD" },
  { name: "Yassin Benkhouya", role: "Marketing · vidéos et communauté", initials: "YB" },
  { name: "Soukayna Asaas", role: "Partenariats · recrutement et contrôle des ateliers", initials: "SA" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Notre mission"
        title={
          <>
            Faire vivre l’artisanat <span className="serif text-saffron">à la source.</span>
          </>
        }
        intro="TripFinders relie les voyageurs aux ateliers d’artisans marocains : on y voit naître les objets, on y apprend les gestes, et l’argent va directement à ceux qui les font."
        image="/images/crafts/zellige"
        imageAlt="Des artisans taillent et assemblent du zellige"
      />

      <section className="bg-sand py-24 sm:py-32">
        <div className="container-page grid gap-16 lg:grid-cols-2">
          <SectionHeading eyebrow="Le problème" title={<>On achète sans voir. <span className="serif">L’artisan reste invisible.</span></>} />
          <div data-reveal className="flex flex-col gap-5 text-lg text-ink/90">
            <p>Chaque année, des millions de visiteurs achètent tapis, poteries et lanternes au Maroc sans jamais voir comment ils sont fabriqués, ni savoir qui les a faits.</p>
            <p>Pendant ce temps, les artisans et les coopératives, dont 54 % sont des femmes, restent invisibles en ligne et dépendent d’intermédiaires.</p>
            <p className="serif text-2xl text-terracotta">Comment faire vivre l’artisanat marocain à la source, avec un revenu direct pour l’artisan ?</p>
          </div>
        </div>
      </section>

      <section className="bg-navy py-24 text-white sm:py-32">
        <div className="container-page">
          <SectionHeading dark eyebrow="Nos engagements" title={<>Quatre promesses, <span className="serif text-saffron">tenues.</span></>} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles, t: "100 % artisanat", d: "Uniquement des ateliers, jamais des boutiques de souvenirs." },
              { icon: ShieldCheck, t: "Vérifié sur place", d: "Chaque atelier est visité par notre équipe avant d’être publié." },
              { icon: HandCoins, t: "85 % pour l’artisan", d: "Affiché sur chaque page, sur chaque reçu." },
              { icon: Eye, t: "Transparence", d: "Les annonces sponsorisées sont toujours signalées." },
            ].map((x) => (
              <li key={x.t} data-reveal className="rounded-[var(--radius-card)] bg-navy-800 p-6">
                <x.icon className="size-7 text-saffron" aria-hidden />
                <h3 className="mt-4 text-xl">{x.t}</h3>
                <p className="mt-1 text-navy-muted">{x.d}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-20 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-3">
            {[
              { v: "19,8 M", l: "touristes au Maroc en 2025" },
              { v: "7 %", l: "du PIB vient de l’artisanat" },
              { v: "54 %", l: "des artisans sont des femmes" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="sr-only">{s.l}</dt>
                <dd className="tabular text-6xl font-semibold tracking-[-0.05em] text-saffron">{s.v}</dd>
                <dd className="mt-2 text-navy-muted">{s.l}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-navy-muted">Sources : Ministère du Tourisme (2026), Secrétariat d’État à l’Artisanat.</p>
        </div>
      </section>

      <section className="bg-sand py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow="L’équipe" title={<>Quatre fondateurs, <span className="serif">un même pays.</span></>} intro="Une équipe pluridisciplinaire réunie pour le hackathon Digitex 2026." />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <li key={m.name} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className="rounded-[var(--radius-card)] bg-surface p-6">
                <span className="serif grid size-20 place-items-center rounded-full bg-navy text-3xl text-saffron" aria-hidden>
                  {m.initials}
                </span>
                <p className="mt-6 text-xl font-semibold tracking-[-0.02em]">{m.name}</p>
                <p className="mt-1 text-muted">{m.role}</p>
              </li>
            ))}
          </ul>
          <div data-reveal className="arch mx-auto mt-24 aspect-[3/4] max-w-xs">
            <Img src="/images/gallery/zellige-porte" alt="Porte ornée de zellige à la médersa Ben Youssef" sizes="20rem" />
          </div>
          <p className="mx-auto mt-10 max-w-[30ch] text-center text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-[-0.035em] text-navy">
            Nous cherchons des coopératives pilotes, des partenaires touristiques <span className="serif">et des mentors.</span>
          </p>
        </div>
      </section>
    </>
  );
}
