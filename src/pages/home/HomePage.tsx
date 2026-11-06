import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, CalendarCheck, Compass, Hammer } from "lucide-react";
import { artisans } from "@/data/artisans";
import { cities, crafts } from "@/data/catalog";
import { workshops } from "@/data/workshops";
import { formatPrice } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { Pill, Tag } from "@/components/ui/Pill";
import { SectionHeading } from "@/components/ui/misc";
import { WorkshopCard } from "@/components/workshop/WorkshopCard";
import { HeroSearch } from "./HeroSearch";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const statement =
  "Les visiteurs achètent sans voir comment l’objet est fabriqué. Les artisans, eux, restent invisibles. Nous ouvrons les portes de leurs ateliers.";

const steps = [
  { n: "01", icon: Compass, title: "Découvrir", text: "Tissage, poterie, cuir, zellige : choisissez un savoir-faire, une ville, un artisan.", image: "/images/gallery/fes-medina" },
  { n: "02", icon: CalendarCheck, title: "Réserver", text: "Seul ou en groupe, en ligne, avec confirmation immédiate et annulation gratuite.", image: "/images/gallery/lanternes" },
  { n: "03", icon: Hammer, title: "Vivre l’atelier", text: "Voir, apprendre, créer. Et repartir avec votre pièce et son histoire.", image: "/images/gallery/poterie-atelier" },
];

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  const featured = [...workshops].sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || b.rating - a.rating).slice(0, 4);
  const example = computePrice({ unitPriceCentimes: 25000, participants: 1 });
  const khadija = artisans[0]!;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero: lines rise from their mask, tags pop in, photo un-clips.
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from("[data-hero-line]", { yPercent: 110, duration: 1.2, stagger: 0.12 })
          .from("[data-hero-photo]", { clipPath: "inset(100% 0 0 0 round 50% 50% 24px 24px)", duration: 1.4 }, 0.15)
          .from("[data-hero-tag]", { scale: 0, opacity: 0, duration: 0.9, stagger: 0.1, ease: "back.out(2)" }, 0.6)
          .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.5);

        // Statement: words light up as you scroll.
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-statement]", start: "top 75%", end: "bottom 45%", scrub: 0.6 },
          },
        );

        // Big numbers drift up slightly as they enter.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(el, { yPercent: 12 }, { yPercent: -12, ease: "none", scrollTrigger: { trigger: el, scrub: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-navy pb-16 pt-28 text-white sm:pt-36 lg:min-h-[100svh] lg:pb-20">
        <div aria-hidden className="absolute -end-40 top-1/3 -z-10 size-[42rem] rounded-full bg-terracotta/20 blur-[140px]" />
        <div className="container-page grid items-end gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
          <div className="relative">
            <p data-hero-fade className="eyebrow text-teal-300">
              Voir · Apprendre · Créer
            </p>
            <h1 className="display relative mt-6 text-[clamp(3.6rem,10.5vw,10rem)]">
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-hero-line className="block">
                  Au cœur
                </span>
              </span>{" "}
              <span className="block overflow-hidden pb-[0.12em]">
                <span data-hero-line className="block">
                  des <span className="serif text-saffron">ateliers</span>
                </span>
              </span>
              <span aria-hidden data-hero-tag className="absolute -top-2 end-[4%] hidden text-[0.22em] sm:block">
                <Tag pigment="rose" tilt={-8} className="animate-float">
                  Tissage
                </Tag>
              </span>
              <span aria-hidden data-hero-tag className="absolute bottom-[8%] end-[-2%] hidden text-[0.2em] lg:block">
                <Tag pigment="mint" tilt={6} className="animate-float [animation-delay:-2s]">
                  Zellige
                </Tag>
              </span>
            </h1>
            <p data-hero-fade className="mt-8 max-w-[44ch] text-lg text-navy-muted sm:text-xl">
              Réservez une visite ou un atelier pratique chez les artisans du Maroc. Regardez naître une pièce, ou créez la vôtre.
            </p>
            <div data-hero-fade className="mt-10">
              <HeroSearch />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
            <div data-hero-photo className="arch aspect-[3/4] w-full">
              <Img src="/images/crafts/tissage" alt="Une tisserande noue la laine sur un métier traditionnel" priority sizes="(min-width: 1024px) 40vw, 90vw" />
            </div>
            <span aria-hidden data-hero-tag className="absolute start-1 top-[18%] sm:-start-4 text-[clamp(1.4rem,2.4vw,2.2rem)]">
              <Tag pigment="clay" tilt={-5} className="animate-float [animation-delay:-4s]">
                Poterie
              </Tag>
            </span>
            <div data-hero-fade className="absolute -bottom-5 end-4 flex items-center gap-3 rounded-full bg-surface py-2 ps-2 pe-5 text-ink shadow-[var(--shadow-lift)]">
              <span className="serif grid size-11 place-items-center rounded-full bg-navy text-lg text-saffron">K</span>
              <span className="text-sm leading-tight">
                <strong className="block font-semibold">Coopérative Nour Al Atlas</strong>
                <span className="text-muted">Fès · Vérifiée sur place</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Marquee ---------- */}
      <section aria-label="Les savoir-faire" className="overflow-hidden border-b border-line bg-sand py-8 sm:py-10">
        <div className="flex w-max animate-marquee items-center gap-10 pe-10 hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <div key={dup} aria-hidden={dup === 1} className="flex items-center gap-10">
              {crafts.map((c, i) =>
                i % 2 === 0 ? (
                  <Tag key={c.id} pigment={c.pigment} tilt={i % 4 === 0 ? -3 : 3} className="text-[clamp(2rem,5vw,4rem)]">
                    {c.name}
                  </Tag>
                ) : (
                  <span key={c.id} className="text-[clamp(2rem,5vw,4rem)] font-semibold tracking-[-0.05em] text-navy">
                    {c.name}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Statement (scroll-scrubbed) ---------- */}
      <section className="bg-sand py-28 sm:py-40">
        <div className="container-page">
          <p className="eyebrow text-teal">Le constat</p>
          <p data-statement className="mt-8 max-w-[22ch] text-[clamp(2rem,5.2vw,4.6rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-navy">
            {statement.split(" ").map((word, i) => (
              <span key={i} data-word className={word.startsWith("ateliers") || word === "portes" ? "serif text-terracotta" : undefined}>
                {word}{" "}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="bg-sand pb-28 sm:pb-40">
        <div className="container-page">
          <SectionHeading eyebrow="Comment ça marche" title={<>Trois gestes, <span className="serif">une rencontre.</span></>} />
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.n} data-reveal style={{ ["--reveal-delay" as string]: `${i * 120}ms` }} className="group flex flex-col rounded-[var(--radius-card)] bg-surface p-3 shadow-[var(--shadow-soft)]">
                <div className="arch aspect-[3/4] max-h-80 w-full">
                  <Img src={s.image} alt="" sizes="(min-width: 768px) 30vw, 90vw" className="transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="tabular text-sm font-semibold text-muted">{s.n}</span>
                    <s.icon className="size-5 text-terracotta" aria-hidden />
                  </div>
                  <h3 className="text-3xl">{s.title}</h3>
                  <p className="text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Featured workshops ---------- */}
      <section className="border-t border-line bg-surface py-28 sm:py-36">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="À réserver cette semaine" title={<>Les ateliers <span className="serif">du moment</span></>} />
            <Button to="/explorer" variant="secondary" className="self-start md:self-auto">
              Voir les {workshops.length} ateliers <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((w, i) => (
              <div key={w.id} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}>
                <WorkshopCard workshop={w} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Crafts bento (dark) ---------- */}
      <section className="bg-navy py-28 text-white sm:py-40">
        <div className="container-page">
          <SectionHeading dark eyebrow="Huit savoir-faire" title={<>Mille ans de gestes, <span className="serif text-saffron">à portée de main.</span></>} />
          <ul className="mt-14 grid auto-rows-[13rem] grid-cols-2 gap-3 sm:auto-rows-[16rem] md:grid-cols-4">
            {crafts.map((c, i) => (
              <li
                key={c.id}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${(i % 4) * 80}ms` }}
                className={i === 0 ? "col-span-2 row-span-2" : i === 5 ? "md:col-span-2" : i === crafts.length - 1 ? "col-span-2 md:col-span-1" : undefined}
              >
                <Link to={`/explorer?artisanat=${c.id}`} className="group relative block h-full overflow-hidden rounded-[var(--radius-lg)]">
                  <Img src={c.image} alt="" sizes={i === 0 ? "50vw" : "25vw"} className="transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.06]" />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                  <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2">
                    <span>
                      <span className={i === 0 ? "block text-4xl font-semibold tracking-[-0.04em] sm:text-5xl" : "block text-2xl font-semibold tracking-[-0.03em]"}>{c.name}</span>
                      {i === 0 && <span className="mt-1 block text-navy-muted">{c.tagline}</span>}
                    </span>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-saffron group-hover:text-navy">
                      <ArrowUpRight className="size-5" aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Cities rail ---------- */}
      <section className="bg-sand py-28 sm:py-40">
        <div className="container-page">
          <SectionHeading eyebrow="Huit villes" title={<>De la médina <span className="serif">au désert.</span></>} intro="Fès, Marrakech, Safi, Essaouira, Tétouan, Ouarzazate, Tiznit et Rabat : chaque ville a ses ateliers et ses secrets." />
        </div>
        <ul className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1rem,calc((100vw_-_1320px)/2_+_clamp(1rem,4vw,3rem)))] pb-4 [scrollbar-width:none]">
          {cities.map((c) => {
            const count = workshops.filter((w) => w.cityId === c.id).length;
            return (
              <li key={c.id} className="w-[min(72vw,19rem)] shrink-0 snap-start">
                <Link to={`/explorer?ville=${c.id}`} className="group block">
                  <div className="arch aspect-[3/4]">
                    <Img src={c.image} alt={`${c.name}, ${c.region}`} sizes="20rem" className="transition-transform duration-1000 group-hover:scale-105" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between px-1">
                    <h3 className="text-2xl">{c.name}</h3>
                    <span className="text-sm text-muted">
                      {count} atelier{count > 1 ? "s" : ""}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------- Impact numbers ---------- */}
      <section className="overflow-hidden bg-navy py-28 text-white sm:py-40">
        <div className="container-page">
          <SectionHeading dark eyebrow="Pourquoi c’est important" title={<>L’artisanat fait vivre le Maroc. <span className="serif text-saffron">Rendons-le visible.</span></>} />
          <dl className="mt-16 grid gap-12 sm:grid-cols-3">
            {[
              { v: "19,8 M", l: "touristes au Maroc en 2025" },
              { v: "7 %", l: "du PIB vient de l’artisanat" },
              { v: "54 %", l: "des artisans sont des femmes" },
            ].map((s) => (
              <div key={s.v} data-reveal className="border-t border-white/15 pt-6">
                <dt className="sr-only">{s.l}</dt>
                <dd data-parallax className="tabular text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-none tracking-[-0.05em] text-saffron">
                  {s.v}
                </dd>
                <dd className="mt-3 text-lg text-navy-muted">{s.l}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-navy-muted">Sources : Ministère du Tourisme (2026), Secrétariat d’État à l’Artisanat.</p>

          <div data-reveal className="mt-24 rounded-[var(--radius-card)] bg-navy-800 p-6 sm:p-10">
            <p className="text-[clamp(1.6rem,3.2vw,2.6rem)] font-semibold leading-tight tracking-[-0.035em]">
              Sur une visite à {formatPrice(25000)}, <span className="serif text-saffron">{formatPrice(example.artisanShareCentimes)}</span> vont directement à l’artisan.
            </p>
            <div className="mt-8 flex h-14 overflow-hidden rounded-full text-sm font-semibold" aria-hidden>
              <div className="flex w-[85%] items-center bg-saffron ps-5 text-navy">85 % artisan</div>
              <div className="flex w-[15%] items-center justify-center bg-white/15">15 %</div>
            </div>
            <p className="mt-4 text-navy-muted">Pas d’intermédiaire. Promotions et fidélité sont prises sur la part de TripFinders, jamais sur celle de l’artisan.</p>
          </div>
        </div>
      </section>

      {/* ---------- Testimonial (example) ---------- */}
      <section className="bg-sand py-28 sm:py-40">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div data-reveal className="arch mx-auto aspect-[3/4] w-full max-w-md">
            <Img src="/images/gallery/fes-medina" alt="La médina de Fès vue des collines" sizes="(min-width: 1024px) 35vw, 90vw" />
          </div>
          <figure data-reveal>
            <Pill tone="terracotta">Exemple de témoignage</Pill>
            <blockquote className="mt-8 text-[clamp(1.8rem,3.8vw,3.4rem)] leading-[1.12] tracking-[-0.03em] text-navy">
              <p>
                « {khadija.quote.split(".")[0]}. <span className="serif text-terracotta">{khadija.quote.split(".").slice(1).join(".").trim()}</span> »
              </p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span className="serif grid size-14 place-items-center rounded-full bg-navy text-xl text-saffron">KE</span>
              <span>
                <strong className="block">{khadija.name}</strong>
                <span className="text-muted">
                  Tisserande, {khadija.cooperative}, Fès (artisane fictive)
                </span>
              </span>
            </figcaption>
            <Button to={`/artisans/${khadija.slug}`} variant="secondary" className="mt-10">
              Découvrir son atelier <ArrowRight className="size-4" aria-hidden />
            </Button>
          </figure>
        </div>
      </section>

      {/* ---------- Artisan CTA ---------- */}
      <section className="bg-sand pb-28 sm:pb-40">
        <div className="container-page">
          <div data-reveal className="relative isolate overflow-hidden rounded-[2.5rem] bg-terracotta px-6 py-16 text-white sm:px-14 sm:py-24">
            <div aria-hidden className="absolute -end-20 -top-24 -z-10 size-96 rounded-full bg-clay/40 blur-3xl" />
            <p className="eyebrow text-white/80">Artisans et coopératives</p>
            <h2 className="mt-5 max-w-[16ch] text-[clamp(2.4rem,6vw,5rem)]">
              Ouvrez votre atelier <span className="serif">au monde.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg text-white/85">
              Gratuit pour commencer. 85 % de chaque réservation pour vous. Nous venons vérifier votre atelier sur place et filmer votre savoir-faire.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button to="/devenir-partenaire" variant="light" size="lg">
                Devenir partenaire
              </Button>
              <Button to="/espace-artisan" size="lg" className="border border-white/30 bg-transparent hover:bg-white/10">
                Voir l’espace artisan
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
