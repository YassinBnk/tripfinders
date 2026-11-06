import { useEffect } from "react";
import { useParams } from "react-router";
import { QrCode } from "lucide-react";
import { useStore } from "@/app/store";
import { cityById } from "@/data/catalog";
import { useAsync } from "@/hooks/useAsync";
import { getPartner, getWorkshopsByIds } from "@/services/api";
import { PageHero } from "@/components/layout/PageHero";
import { Monogram, Skeleton } from "@/components/ui/misc";
import { WorkshopCard } from "@/components/workshop/WorkshopCard";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

/** What a guest sees after scanning the QR code at a hotel or riad. Remembers the partner for 30 days. */
export default function HotelLandingPage() {
  const { partnerId = "" } = useParams();
  const { setPartner } = useStore();
  const { data: partner, loading } = useAsync(() => getPartner(partnerId), [partnerId]);
  const { data: list } = useAsync(() => (partner ? getWorkshopsByIds(partner.recommendedWorkshopIds) : Promise.resolve([])), [partner?.id]);

  useEffect(() => {
    if (partner) setPartner(partner.id);
  }, [partner, setPartner]);

  if (loading) return <div className="container-page pb-24 pt-36"><Skeleton className="h-[50vh]" /></div>;
  if (!partner) return <NotFoundPage />;
  const city = cityById(partner.cityId)!;

  return (
    <>
      <PageHero
        eyebrow={`Recommandé par ${partner.name}`}
        title={
          <>
            Les artisans de <span className="serif text-saffron">{city.name}</span>
          </>
        }
        intro={
          <div className="flex items-start gap-4">
            <Monogram name={partner.host} className="size-12 text-lg" />
            <p>
              « {partner.message} »<br />
              <span className="text-base text-white/60">
                {partner.host}, {partner.kind} {partner.name}
              </span>
            </p>
          </div>
        }
        image={city.image}
        imageAlt={`${city.name}`}
      />
      <section className="bg-sand py-20 sm:py-28">
        <div className="container-page">
          <p className="flex items-center gap-2 text-muted">
            <QrCode className="size-5 text-terracotta" aria-hidden /> Sélection de votre hôte · {list?.length ?? 0} ateliers vérifiés sur place
          </p>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {list ? list.map((w) => <WorkshopCard key={w.id} workshop={w} />) : <Skeleton className="h-80" />}
          </div>
        </div>
      </section>
    </>
  );
}
