import { useState, type FormEvent } from "react";
import { BarChart3, CalendarDays, CheckCircle2, Eye, HandCoins, QrCode, Sparkles, Star } from "lucide-react";
import { useStore } from "@/app/store";
import { artisans } from "@/data/artisans";
import { workshops } from "@/data/workshops";
import { todayISO } from "@/lib/availability";
import { formatDate, formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/forms";
import { Monogram } from "@/components/ui/misc";
import { Modal, useToast } from "@/components/ui/overlays";
import type { Booking } from "@/types";

/** Mock dashboard of Khadija (demo artisan): her real bookings from this device + sample ones. */
export default function ArtisanDashboardPage() {
  const { bookings, checkIn } = useStore();
  const toast = useToast();
  const artisan = artisans[0]!;
  const mine = workshops.filter((w) => w.artisanId === artisan.id).map((w) => w.id);
  const [scanOpen, setScanOpen] = useState(false);
  const [ref, setRef] = useState("");
  const [error, setError] = useState<string | null>(null);

  const real = bookings.filter((b) => mine.includes(b.workshopId));
  const sample: Pick<Booking, "reference" | "date" | "slot" | "participants" | "artisanShareCentimes" | "status">[] = [
    { reference: "TF-26-K7QM", date: "2026-11-18", slot: "09:30", participants: 4, artisanShareCentimes: 85000, status: "confirmed" },
    { reference: "TF-26-P3XA", date: "2026-11-21", slot: "14:30", participants: 2, artisanShareCentimes: 42500, status: "confirmed" },
  ];
  const list = [...real, ...sample].filter((b) => b.status === "confirmed" && b.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date));
  const monthEarnings = 1_190_000 + real.reduce((s, b) => s + b.artisanShareCentimes, 0);

  const scan = (e: FormEvent) => {
    e.preventDefault();
    const done = checkIn(ref);
    if (done) {
      setScanOpen(false);
      setRef("");
      setError(null);
      toast(`Visite ${done.reference} validée, bon atelier !`);
    } else {
      setError("Référence introuvable ou déjà validée. Exemple : la référence de votre réservation de démo.");
    }
  };

  return (
    <div className="bg-sand pb-28 pt-32 sm:pt-40">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <Monogram name={artisan.name} className="size-16 text-2xl" />
            <div>
              <p className="eyebrow text-teal">Espace artisan · démonstration</p>
              <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.8rem)] text-navy">
                Bonjour <span className="serif">{artisan.name.split(" ")[0]}</span>
              </h1>
            </div>
          </div>
          <Button size="lg" onClick={() => setScanOpen(true)}>
            <QrCode className="size-5" aria-hidden /> Scanner un QR
          </Button>
        </div>

        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: HandCoins, k: "Revenus ce mois-ci", v: formatPrice(monthEarnings), dark: true },
            { icon: CalendarDays, k: "Visites à venir", v: String(list.length) },
            { icon: Eye, k: "Vues de la fiche (30 j)", v: "2 418" },
            { icon: Star, k: "Note moyenne", v: "4,9" },
          ].map((s) => (
            <div key={s.k} data-reveal className={s.dark ? "rounded-[var(--radius-card)] bg-navy p-6 text-white" : "rounded-[var(--radius-card)] bg-surface p-6"}>
              <dt className={s.dark ? "flex items-center gap-2 text-sm text-navy-muted" : "flex items-center gap-2 text-sm text-muted"}>
                <s.icon className="size-4" aria-hidden /> {s.k}
              </dt>
              <dd className={s.dark ? "tabular mt-3 text-4xl font-semibold tracking-[-0.04em] text-saffron" : "tabular mt-3 text-4xl font-semibold tracking-[-0.04em]"}>{s.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-[var(--radius-card)] bg-surface p-6 sm:p-8" aria-labelledby="prochaines">
            <h2 id="prochaines" className="text-2xl">Prochaines visites</h2>
            <ul className="mt-6 flex flex-col divide-y divide-line">
              {list.map((b) => (
                <li key={b.reference} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-semibold">{formatDate(b.date, "EEEE d MMMM")} · {b.slot.replace(":", " h ")}</p>
                    <p className="tabular text-sm text-muted">{b.reference} · {b.participants} pers.</p>
                  </div>
                  <span className="tabular rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal">+{formatPrice(b.artisanShareCentimes)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-terracotta p-6 text-white sm:p-8" aria-labelledby="formule">
            <Sparkles className="size-7 text-saffron-200" aria-hidden />
            <h2 id="formule" className="text-2xl">Formule Pro</h2>
            <p className="text-white/85">Statistiques détaillées, 20 photos, vidéo tournée dans l’atelier, support WhatsApp prioritaire.</p>
            <div className="mt-auto flex items-center gap-2 rounded-[var(--radius-md)] bg-white/10 px-4 py-3 text-sm">
              <BarChart3 className="size-4" aria-hidden /> +38 % de réservations depuis la vidéo
            </div>
            <Button to="/devenir-partenaire" variant="light">
              Gérer ma formule
            </Button>
          </section>
        </div>
      </div>

      <Modal open={scanOpen} onClose={() => setScanOpen(false)} title="Valider une visite">
        <form onSubmit={scan} className="flex flex-col gap-5">
          <div className="grid aspect-[4/3] place-items-center rounded-[var(--radius-lg)] bg-navy text-navy-muted">
            <div className="flex flex-col items-center gap-3 text-center">
              <QrCode className="size-16 text-saffron" aria-hidden />
              <p className="max-w-[26ch] text-sm">Caméra simulée pour la démo. Saisissez la référence du voyageur.</p>
            </div>
          </div>
          <Field label="Référence de réservation" error={error ?? undefined}>
            {(p) => <Input {...p} value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} placeholder="TF-26-XXXX" autoComplete="off" />}
          </Field>
          <Button type="submit" size="lg">
            <CheckCircle2 className="size-5" aria-hidden /> Valider la visite
          </Button>
        </form>
      </Modal>
    </div>
  );
}
