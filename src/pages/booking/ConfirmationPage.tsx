import { Link, useParams } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { CalendarDays, Clock, HandCoins, MapPin, ShieldCheck, Users } from "lucide-react";
import { useStore } from "@/app/store";
import { artisanById } from "@/data/artisans";
import { cityById } from "@/data/catalog";
import { workshopById } from "@/data/workshops";
import { formatDate, formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { EmptyState } from "@/components/ui/misc";

/** Booking confirmation, on its own URL so a reload during the demo keeps it on screen. */
export default function ConfirmationPage() {
  const { reference = "" } = useParams();
  const { bookings } = useStore();
  const booking = bookings.find((b) => b.reference === reference);
  const w = booking ? workshopById(booking.workshopId) : undefined;

  if (!booking || !w) {
    return (
      <div className="container-page pb-28 pt-36">
        <EmptyState icon={<CalendarDays className="size-6" aria-hidden />} title="Réservation introuvable" text={`Aucune réservation ${reference} sur cet appareil.`} action={{ label: "Mes réservations", to: "/compte" }} />
      </div>
    );
  }

  const artisan = artisanById(w.artisanId)!;
  const city = cityById(w.cityId)!;
  const url = `${window.location.origin}/reservation/${booking.reference}`;

  return (
    <div className="bg-navy pb-28 pt-32 text-white sm:pt-40">
      <div className="container-page">
        <div className="text-center" data-reveal>
          <p className="font-script text-[clamp(3.5rem,9vw,6.5rem)] leading-none text-saffron">Merci</p>
          <h1 className="mx-auto mt-6 max-w-[18ch] text-[clamp(2.2rem,5vw,4rem)]">
            Votre atelier est <span className="serif">réservé.</span>
          </h1>
          <p className="mt-4 text-lg text-navy-muted">Une confirmation a été envoyée à {booking.contact.email}.</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl overflow-hidden rounded-[2rem] bg-surface text-ink md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col items-center justify-center gap-5 border-b border-dashed border-line p-8 md:border-b-0 md:border-e">
            <div className="rounded-[var(--radius-lg)] bg-white p-4 shadow-[var(--shadow-soft)]">
              <QRCodeSVG value={url} size={176} fgColor="#0c1522" level="M" title={`QR code de la réservation ${booking.reference}`} />
            </div>
            <div className="text-center">
              <p className="eyebrow text-muted">Référence</p>
              <p className="tabular mt-1 text-3xl font-semibold tracking-[0.04em]">{booking.reference}</p>
              <p className="mt-2 max-w-[28ch] text-sm text-muted">Montrez ce QR code à l’artisan à votre arrivée.</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="aspect-[16/8] overflow-hidden">
              <Img src={w.photos[0]!} alt="" sizes="(min-width: 768px) 30rem, 100vw" />
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
              <div>
                <h2 className="text-2xl tracking-[-0.025em]">{w.title}</h2>
                <p className="text-muted">avec {artisan.name}</p>
              </div>
              <ul className="grid gap-3 text-sm sm:grid-cols-2">
                <li className="flex items-center gap-2"><CalendarDays className="size-4 text-terracotta" aria-hidden /> {formatDate(booking.date)}</li>
                <li className="flex items-center gap-2"><Clock className="size-4 text-terracotta" aria-hidden /> {booking.slot.replace(":", " h ")}</li>
                <li className="flex items-center gap-2"><Users className="size-4 text-terracotta" aria-hidden /> {booking.participants} participant{booking.participants > 1 ? "s" : ""}</li>
                <li className="flex items-center gap-2"><MapPin className="size-4 text-terracotta" aria-hidden /> {city.name}</li>
              </ul>
              <div className="flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-muted">Total payé{booking.discountCentimes > 0 ? ` (dont −${formatPrice(booking.discountCentimes)})` : ""}</span>
                <span className="tabular text-2xl font-semibold">{formatPrice(booking.totalCentimes)}</span>
              </div>
              <p className="flex items-start gap-2 rounded-[var(--radius-md)] bg-teal-100 px-4 py-3 text-teal">
                <HandCoins className="mt-0.5 size-5 shrink-0" aria-hidden />
                <span>
                  <strong className="tabular">{formatPrice(booking.artisanShareCentimes)}</strong> vont directement à {artisan.name.split(" ")[0]}.
                </span>
              </p>
              <p className="flex items-center gap-2 text-sm text-muted">
                <ShieldCheck className="size-4" aria-hidden /> Annulation gratuite jusqu’à 48 h avant.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button to="/compte" variant="light" size="lg">
            Voir mes réservations
          </Button>
          <Button to="/explorer" size="lg" className="border border-white/25 bg-transparent hover:bg-white/10">
            Découvrir d’autres ateliers
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-navy-muted">
          Une question ? <Link to="/a-propos" className="underline">Contactez-nous</Link>.
        </p>
      </div>
    </div>
  );
}
