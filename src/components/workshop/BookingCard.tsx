import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { CalendarDays, HandCoins, ShieldCheck } from "lucide-react";
import { useStore } from "@/app/store";
import { firstBookableDate, isDateBookable, slotAvailability } from "@/lib/availability";
import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { NumberStepper } from "@/components/ui/forms";
import { Modal } from "@/components/ui/overlays";
import type { Workshop } from "@/types";

/** Sticky booking card: date, slot, participants, total and the transparent artisan share. */
export function BookingCard({ workshop: w }: { workshop: Workshop }) {
  const navigate = useNavigate();
  const { bookings, partnerId } = useStore();
  const [date, setDate] = useState(() => firstBookableDate(w));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const availability = useMemo(() => slotAvailability(w, date, bookings), [w, date, bookings]);
  const [slot, setSlot] = useState<string | null>(() => availability.find((s) => s.remaining > 0)?.slot ?? null);
  const [participants, setParticipants] = useState(2);

  const remaining = availability.find((s) => s.slot === slot)?.remaining ?? 0;
  const maxParticipants = Math.max(1, Math.min(remaining || w.maxGroupSize, w.maxGroupSize));
  const price = computePrice({ unitPriceCentimes: w.priceCentimes, participants, partnerId });

  const pickDate = (d: string) => {
    setDate(d);
    setCalendarOpen(false);
    const first = slotAvailability(w, d, bookings).find((s) => s.remaining > 0);
    setSlot(first?.slot ?? null);
  };

  const book = () => {
    if (!slot) return;
    navigate(`/reserver/${w.slug}?date=${date}&slot=${encodeURIComponent(slot)}&p=${participants}`);
  };

  return (
    <div id="reservation" className="scroll-mt-28 rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-soft)]">
      <p className="text-muted">
        <span className="tabular text-3xl font-semibold tracking-[-0.03em] text-ink">{formatPrice(w.priceCentimes)}</span> / personne
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <div>
          <p className="mb-2 text-sm font-medium">Date</p>
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="flex h-12 w-full items-center justify-between rounded-[var(--radius-md)] border border-line px-4 text-start transition hover:border-navy"
            aria-haspopup="dialog"
          >
            <span >{formatDate(date)}</span>
            <CalendarDays className="size-5 text-muted" aria-hidden />
          </button>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Créneau</legend>
          {availability.length === 0 ? (
            <p className="text-sm text-muted">Atelier fermé ce jour-là. Choisissez une autre date.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availability.map((s) => {
                const full = s.remaining === 0;
                return (
                  <label
                    key={s.slot}
                    className={cn(
                      "flex cursor-pointer flex-col rounded-[var(--radius-md)] border px-4 py-2 text-sm transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-teal",
                      slot === s.slot ? "border-navy bg-navy text-white" : "border-line hover:border-navy",
                      full && "cursor-not-allowed opacity-45 hover:border-line",
                    )}
                  >
                    <input type="radio" name="slot" value={s.slot} checked={slot === s.slot} disabled={full} onChange={() => setSlot(s.slot)} className="sr-only" />
                    <span className="tabular font-semibold">{s.slot.replace(":", " h ")}</span>
                    <span className={slot === s.slot ? "text-white/75" : "text-muted"}>{full ? "Complet" : `${s.remaining} places`}</span>
                  </label>
                );
              })}
            </div>
          )}
        </fieldset>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Participants</p>
          <NumberStepper value={Math.min(participants, maxParticipants)} onChange={setParticipants} max={maxParticipants} label="Nombre de participants" />
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-muted">
            {formatPrice(w.priceCentimes)} × {participants}
          </span>
          <span className="tabular text-2xl font-semibold">{formatPrice(price.subtotalCentimes)}</span>
        </div>
        <p className="mt-3 flex items-start gap-2 rounded-[var(--radius-md)] bg-teal-100 px-4 py-3 text-sm text-teal">
          <HandCoins className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <strong className="tabular">{formatPrice(price.artisanShareCentimes)}</strong> vont directement à l’artisan (85 %).
          </span>
        </p>
      </div>

      <Button onClick={book} disabled={!slot} size="lg" className="mt-5 w-full">
        Réserver
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-muted">
        <ShieldCheck className="size-4" aria-hidden /> Annulation gratuite jusqu’à 48 h avant
      </p>

      <Modal open={calendarOpen} onClose={() => setCalendarOpen(false)} title="Choisir une date">
        <DatePicker value={date} onChange={pickDate} isDisabled={(d) => !isDateBookable(w, d)} />
      </Modal>
    </div>
  );
}
