import { useParams } from "react-router";
import { Heart, Languages, MapPin, Share2, Timer } from "lucide-react";
import { useStore } from "@/app/store";
import { cityById, craftById } from "@/data/catalog";
import { useAsync } from "@/hooks/useAsync";
import { getArtisanBySlug, getReviews, getWorkshopsByArtisan } from "@/services/api";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Pill, VerifiedBadge } from "@/components/ui/Pill";
import { SectionHeading, Skeleton } from "@/components/ui/misc";
import { useToast } from "@/components/ui/overlays";
import { ReviewList } from "@/components/workshop/ReviewList";
import { WorkshopCard } from "@/components/workshop/WorkshopCard";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

export default function ArtisanPage() {
  const { slug = "" } = useParams();
  const { data: a, loading } = useAsync(() => getArtisanBySlug(slug), [slug]);
  const { data: list } = useAsync(() => (a ? getWorkshopsByArtisan(a.id) : Promise.resolve([])), [a?.id]);
  const { data: reviews } = useAsync(() => (list?.length ? getReviews(list.map((w) => w.id)) : Promise.resolve([])), [list?.length]);
  const { toggleFavorite, favorites } = useStore();
  const toast = useToast();

  if (loading) return <div className="container-page pb-24 pt-36"><Skeleton className="h-[50vh]" /></div>;
  if (!a) return <NotFoundPage />;

  const craft = craftById(a.craftId)!;
  const city = cityById(a.cityId)!;
  const firstName = a.name.split(" ")[0];

  const support = async () => {
    list?.forEach((w) => !favorites.includes(w.id) && toggleFavorite(w.id));
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast(`Ateliers de ${firstName} ajoutés aux favoris, lien copié`);
    } catch {
      toast(`Ateliers de ${firstName} ajoutés aux favoris`);
    }
  };

  return (
    <>
      <PageHero
        eyebrow={`${craft.name} · ${city.name}`}
        title={
          <>
            {firstName} <span className="serif text-saffron">{a.name.split(" ").slice(1).join(" ")}</span>
          </>
        }
        intro={<p className="serif text-2xl text-white/90">« {a.quote} »</p>}
        image={a.photo}
        imageAlt={`L’univers de ${a.name} : ${craft.name.toLowerCase()} à ${city.name}`}
      >
        <div className="flex flex-wrap gap-2">
          <VerifiedBadge />
          <Pill pigment={craft.pigment}>{craft.name}</Pill>
          <Pill className="bg-white/10 text-white">{a.cooperative}</Pill>
        </div>
      </PageHero>

      <section className="bg-sand py-24 sm:py-32">
        <div className="container-page grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div data-reveal className="flex max-w-[62ch] flex-col gap-5 text-lg">
            <p className="eyebrow text-teal">Son histoire</p>
            {a.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div data-reveal className="flex flex-col gap-4 self-start rounded-[var(--radius-card)] bg-surface p-6">
            {[
              { icon: Timer, label: `${a.yearsOfExperience} ans de métier` },
              { icon: MapPin, label: `${city.name}, ${city.region}` },
              { icon: Languages, label: a.languages.join(", ") },
            ].map((f) => (
              <p key={f.label} className="flex items-center gap-3">
                <f.icon className="size-5 text-terracotta" aria-hidden /> {f.label}
              </p>
            ))}
            <div className="mt-2 rounded-[var(--radius-md)] bg-terracotta-100 p-5">
              <p className="text-lg font-semibold tracking-[-0.02em]">Soutenir {firstName}</p>
              <p className="mt-1 text-sm text-muted">85 % de chaque réservation lui revient directement. Partagez son atelier, ou gardez-le en favori.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={support}>
                  <Heart className="size-4" aria-hidden /> Soutenir cet artisan
                </Button>
                <Button size="sm" variant="secondary" onClick={support}>
                  <Share2 className="size-4" aria-hidden /> Partager
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow="Ses ateliers" title={<>Réserver avec <span className="serif">{firstName}</span></>} />
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {list ? list.map((w) => <WorkshopCard key={w.id} workshop={w} />) : <Skeleton className="h-80" />}
          </div>
        </div>
      </section>

      {!!reviews?.length && (
        <section className="bg-sand py-24 sm:py-32">
          <div className="container-page">
            <SectionHeading eyebrow="Avis" title={<>Ils sont passés <span className="serif">par l’atelier</span></>} />
            <div className="mt-12">
              <ReviewList reviews={reviews.slice(0, 4)} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
