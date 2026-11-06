import { useState } from "react";
import { Link, Navigate } from "react-router";
import { CalendarDays, Gift, Heart, LogOut, MessageSquareQuote, Share2 } from "lucide-react";
import { useStore } from "@/app/store";
import { workshopById, workshops } from "@/data/workshops";
import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";
import { loyaltyProgress } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { Pill } from "@/components/ui/Pill";
import { EmptyState } from "@/components/ui/misc";
import { Tabs, useToast } from "@/components/ui/overlays";
import { WorkshopCard } from "@/components/workshop/WorkshopCard";
import { todayISO } from "@/lib/availability";
import type { Booking } from "@/types";

type Tab = "reservations" | "fidelite" | "avis" | "favoris";

export default function AccountPage() {
  const { user, bookings, favorites, logout } = useStore();
  const [tab, setTab] = useState<Tab>("reservations");
  const toast = useToast();
  if (!user) return <Navigate to="/connexion?next=/compte" replace />;

  const today = todayISO();
  const upcoming = bookings.filter((b) => b.status === "confirmed" && b.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = bookings.filter((b) => !(b.status === "confirmed" && b.date >= today));
  const completed = bookings.filter((b) => b.status === "completed");
  const loyalty = loyaltyProgress(completed.length);
  const favs = workshops.filter((w) => favorites.includes(w.id));

  return (
    <div className="bg-sand pb-28 pt-32 sm:pt-40">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-teal">Mon compte</p>
            <h1 className="display mt-4 text-[clamp(2.8rem,7vw,6rem)] text-navy">
              Bonjour <span className="serif">{user.name.split(" ")[0]}</span>
            </h1>
          </div>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="size-4" aria-hidden /> Se déconnecter
          </Button>
        </div>

        <div className="mt-10">
          <Tabs<Tab>
            label="Sections du compte"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "reservations", label: "Réservations", count: bookings.length },
              { id: "fidelite", label: "Fidélité" },
              { id: "avis", label: "Mes avis", count: completed.length },
              { id: "favoris", label: "Favoris", count: favs.length },
            ]}
          />
        </div>

        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-10">
          {tab === "reservations" &&
            (bookings.length === 0 ? (
              <EmptyState icon={<CalendarDays className="size-6" aria-hidden />} title="Aucune réservation" text="Votre prochain atelier vous attend." action={{ label: "Explorer les ateliers", to: "/explorer" }} />
            ) : (
              <div className="flex flex-col gap-12">
                <BookingGroup title="À venir" list={upcoming} />
                <BookingGroup title="Passées" list={past} />
              </div>
            ))}

          {tab === "fidelite" && (
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-[var(--radius-card)] bg-navy p-8 text-white sm:p-10">
                <p className="eyebrow text-teal-300">Programme de fidélité</p>
                <p className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.04em]">
                  5 visites = <span className="serif text-saffron">1 visite offerte</span>
                </p>
                <div className="mt-10 flex gap-2" role="img" aria-label={`${loyalty.current} visites sur ${loyalty.target}`}>
                  {Array.from({ length: loyalty.target }, (_, i) => (
                    <span key={i} className={cn("h-3 flex-1 rounded-full", i < loyalty.current ? "bg-saffron" : "bg-white/15")} />
                  ))}
                </div>
                <p className="mt-4 text-navy-muted">
                  <strong className="tabular text-white">{loyalty.current} / {loyalty.target}</strong> visites effectuées.{" "}
                  {loyalty.target - loyalty.current} de plus pour votre visite offerte (jusqu’à {formatPrice(25000)}, 1 personne).
                </p>
                {loyalty.freeVisitsEarned > 0 && <Pill pigment="saffron" className="mt-4">{loyalty.freeVisitsEarned} visite offerte disponible</Pill>}
              </div>
              <div className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-surface p-8">
                <Gift className="size-8 text-terracotta" aria-hidden />
                <p className="text-2xl font-semibold tracking-[-0.03em]">Parrainage entre amis</p>
                <p className="text-muted">Offrez −10 % à un ami sur sa première réservation. Quand il a vécu son atelier, une visite compte double pour vous.</p>
                <code className="rounded-[var(--radius-md)] bg-sand-200 px-4 py-3 text-center font-semibold tracking-[0.12em]">
                  {user.name.split(" ")[0]!.toUpperCase()}-AMI
                </code>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`${user.name.split(" ")[0]!.toUpperCase()}-AMI`);
                    } catch {
                      /* clipboard not available */
                    }
                    toast("Code de parrainage copié");
                  }}
                >
                  <Share2 className="size-4" aria-hidden /> Copier mon code
                </Button>
              </div>
            </div>
          )}

          {tab === "avis" &&
            (completed.length === 0 ? (
              <EmptyState icon={<MessageSquareQuote className="size-6" aria-hidden />} title="Pas encore d’avis" text="Après chaque atelier vécu, vous pourrez laisser un avis vérifié." />
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {completed.map((b) => {
                  const w = workshopById(b.workshopId)!;
                  return (
                    <li key={b.id} className="rounded-[var(--radius-card)] bg-surface p-6">
                      <p className="text-sm text-muted">Visite du {formatDate(b.date, "d MMMM yyyy")}</p>
                      <p className="mt-1 text-lg font-semibold tracking-[-0.02em]">{w.title}</p>
                      <p className="mt-4 text-muted">« Une expérience magnifique, très authentique. Merci pour l’accueil ! »</p>
                      <Pill className="mt-4 bg-teal-100 text-teal">Avis vérifié · 5/5</Pill>
                    </li>
                  );
                })}
              </ul>
            ))}

          {tab === "favoris" &&
            (favs.length === 0 ? (
              <EmptyState icon={<Heart className="size-6" aria-hidden />} title="Aucun favori" text="Touchez le cœur d’un atelier pour le retrouver ici." action={{ label: "Explorer les ateliers", to: "/explorer" }} />
            ) : (
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {favs.map((w) => (
                  <WorkshopCard key={w.id} workshop={w} />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const statusLabel: Record<Booking["status"], { label: string; className: string }> = {
  confirmed: { label: "Confirmée", className: "bg-teal-100 text-teal" },
  completed: { label: "Effectuée", className: "bg-sand-200 text-ink" },
  cancelled: { label: "Annulée", className: "bg-danger-100 text-danger" },
  "no-show": { label: "Absent", className: "bg-danger-100 text-danger" },
};

function BookingGroup({ title, list }: { title: string; list: Booking[] }) {
  if (!list.length) return null;
  return (
    <section>
      <h2 className="text-2xl">{title}</h2>
      <ul className="mt-5 flex flex-col gap-3">
        {list.map((b) => {
          const w = workshopById(b.workshopId)!;
          const s = statusLabel[b.status];
          return (
            <li key={b.id}>
              <Link to={`/reservation/${b.reference}`} className="grid grid-cols-[5rem_1fr] items-center gap-4 rounded-[var(--radius-card)] bg-surface p-3 pe-5 transition hover:shadow-[var(--shadow-soft)] sm:grid-cols-[7rem_1fr_auto]">
                <div className="aspect-square overflow-hidden rounded-[var(--radius-lg)]">
                  <Img src={w.photos[0]!} alt="" sizes="7rem" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold tracking-[-0.02em]">{w.title}</p>
                  <p className="text-sm text-muted">
                    {formatDate(b.date, "EEE d MMM yyyy")} · {b.slot.replace(":", " h ")} · {b.participants} pers.
                  </p>
                  <p className="tabular mt-1 text-sm text-muted">{b.reference}</p>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:flex-col sm:items-end">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", s.className)}>{s.label}</span>
                  <span className="tabular font-semibold">{formatPrice(b.totalCentimes)}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
