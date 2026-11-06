import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router";
import { ArrowRight, Check, Clock, Heart, Languages, MapPin, Users } from "lucide-react";
import { useStore } from "@/app/store";
import { artisanById } from "@/data/artisans";
import { cityById, craftById } from "@/data/catalog";
import { useAsync } from "@/hooks/useAsync";
import { cn } from "@/lib/cn";
import { formatDuration, formatPrice } from "@/lib/format";
import { getReviews, getWorkshopBySlug } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { Pill, Rating, SponsoredBadge, VerifiedBadge } from "@/components/ui/Pill";
import { Monogram, Skeleton } from "@/components/ui/misc";
import { BookingCard } from "@/components/workshop/BookingCard";
import { ReviewList } from "@/components/workshop/ReviewList";
import { typeLabels } from "@/components/workshop/WorkshopCard";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

const MapView = lazy(() => import("@/components/workshop/MapView"));

export default function WorkshopPage() {
  const { slug = "" } = useParams();
  const { data: w, loading } = useAsync(() => getWorkshopBySlug(slug), [slug]);
  const { data: reviews } = useAsync(() => (w ? getReviews([w.id]) : Promise.resolve([])), [w?.id]);
  const { favorites, toggleFavorite } = useStore();

  if (loading) {
    return (
      <div className="container-page pb-24 pt-32" aria-busy="true">
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="mt-8 h-[60vh] w-full rounded-[var(--radius-card)]" />
      </div>
    );
  }
  if (!w) return <NotFoundPage />;

  const artisan = artisanById(w.artisanId)!;
  const craft = craftById(w.craftId)!;
  const city = cityById(w.cityId)!;
  const fav = favorites.includes(w.id);

  return (
    <article className="bg-sand pb-28 pt-28 sm:pt-36">
      <div className="container-page">
        {/* Title block */}
        <nav aria-label="Fil d’Ariane" className="text-sm text-muted">
          <Link to="/explorer" className="hover:text-navy">
            Explorer
          </Link>{" "}
          / <Link to={`/explorer?ville=${city.id}`} className="hover:text-navy">{city.name}</Link> / {craft.name}
        </nav>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Pill pigment={craft.pigment}>{craft.name}</Pill>
          <Pill>{typeLabels[w.type]}</Pill>
          {w.verified && <VerifiedBadge />}
          {w.sponsored && <SponsoredBadge />}
        </div>
        <h1 className="mt-5 max-w-[20ch] text-[clamp(2.4rem,5.5vw,5rem)] text-navy">{w.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted">
          <Rating value={w.rating} count={w.reviewCount} className="text-ink" />
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden /> {city.name}
          </span>
          <button type="button" onClick={() => toggleFavorite(w.id)} aria-pressed={fav} className="inline-flex items-center gap-1.5 font-medium text-navy hover:underline">
            <Heart className={cn("size-4", fav && "fill-terracotta text-terracotta")} aria-hidden /> {fav ? "Dans vos favoris" : "Ajouter aux favoris"}
          </button>
        </div>

        {/* Gallery: arch + two stacked */}
        <div className="mt-10 grid gap-3 md:grid-cols-[1.25fr_1fr] md:grid-rows-2 md:h-[min(72vh,44rem)]">
          <div className="arch aspect-[3/4] md:row-span-2 md:aspect-auto">
            <Img src={w.photos[0]!} alt={w.title} priority sizes="(min-width: 768px) 55vw, 100vw" />
          </div>
          {w.photos.slice(1, 3).map((p, i) => (
            <div key={p} className="hidden overflow-hidden rounded-[var(--radius-card)] md:block">
              <Img src={p} alt={`${w.title}, photo ${i + 2}`} sizes="40vw" />
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_24rem] lg:gap-16">
          <div className="min-w-0">
            <p className="max-w-[52ch] text-[clamp(1.3rem,2.2vw,1.65rem)] leading-snug tracking-[-0.02em] text-navy">{w.summary}</p>

            {/* Key facts */}
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-4">
              {[
                { icon: Clock, k: "Durée", v: formatDuration(w.durationMin) },
                { icon: Users, k: "Groupe", v: `${w.maxGroupSize} pers. max` },
                { icon: Languages, k: "Langues", v: w.languages.join(", ") },
                { icon: MapPin, k: "Lieu", v: city.name },
              ].map((f) => (
                <div key={f.k} className="bg-surface p-5">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <f.icon className="size-4" aria-hidden /> {f.k}
                  </dt>
                  <dd className="mt-1 font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>

            {/* Artisan story */}
            <section className="mt-20" aria-labelledby="artisan">
              <p className="eyebrow text-teal">L’artisan</p>
              <div className="mt-5 flex items-center gap-4">
                <Monogram name={artisan.name} className="size-16 text-2xl" />
                <div>
                  <h2 id="artisan" className="text-3xl">
                    {artisan.name}
                  </h2>
                  <p className="text-muted">
                    {artisan.cooperative} · {artisan.yearsOfExperience} ans de métier
                  </p>
                </div>
              </div>
              <blockquote className="serif mt-8 text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug text-terracotta">« {artisan.quote} »</blockquote>
              <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-ink/90">
                {artisan.story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link to={`/artisans/${artisan.slug}`} className="mt-6 inline-flex items-center gap-2 font-medium text-teal underline-offset-4 hover:underline">
                Voir le profil de {artisan.name.split(" ")[0]} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </section>

            {/* Steps */}
            <section className="mt-20" aria-labelledby="vivre">
              <p className="eyebrow text-teal">Le déroulé</p>
              <h2 id="vivre" className="mt-3 text-[clamp(2rem,4vw,3.2rem)]">
                Ce que vous allez <span className="serif">vivre</span>
              </h2>
              <ol className="mt-10 flex flex-col">
                {w.steps.map((s, i) => (
                  <li key={s.title} data-reveal className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line py-6">
                    <span className="tabular text-2xl font-semibold text-terracotta">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-xl">{s.title}</h3>
                      <p className="mt-1 text-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Included */}
            <section className="mt-16 rounded-[var(--radius-card)] bg-surface p-6 sm:p-8" aria-labelledby="inclus">
              <h2 id="inclus" className="text-2xl">
                Ce qui est inclus
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {w.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal-100 text-teal">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Location */}
            <section className="mt-16" aria-labelledby="lieu">
              <h2 id="lieu" className="text-2xl">
                Où se retrouver
              </h2>
              <p className="mt-2 flex items-center gap-2 text-muted">
                <MapPin className="size-4 text-terracotta" aria-hidden /> {w.address}
              </p>
              <div className="mt-5 h-72 overflow-hidden rounded-[var(--radius-card)] bg-sand-200">
                <Suspense fallback={<Skeleton className="h-full w-full" />}>
                  <MapView workshops={[w]} />
                </Suspense>
              </div>
            </section>

            {/* Reviews */}
            <section className="mt-20" aria-labelledby="avis">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="avis" className="text-[clamp(2rem,4vw,3.2rem)]">
                  Avis <span className="serif">des voyageurs</span>
                </h2>
                <Rating value={w.rating} count={w.reviewCount} className="text-lg text-ink" />
              </div>
              <div className="mt-8">{reviews ? <ReviewList reviews={reviews} /> : <Skeleton className="h-48" />}</div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Réservation">
            <BookingCard workshop={w} />
          </aside>
        </div>
      </div>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-sand/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <p className="text-sm text-muted">
          <span className="tabular text-xl font-semibold text-ink">{formatPrice(w.priceCentimes)}</span> / pers.
        </p>
        <Button size="md" onClick={() => document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" })}>
          Choisir une date
        </Button>
      </div>
    </article>
  );
}
