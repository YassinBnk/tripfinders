import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, HandCoins, Lock, Sparkles, Tag as TagIcon } from "lucide-react";
import { useStore } from "@/app/store";
import { cityById } from "@/data/catalog";
import { useAsync } from "@/hooks/useAsync";
import { firstBookableDate, isDateBookable, slotAvailability } from "@/lib/availability";
import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";
import { computePrice, isValidPromo, WELCOME_CODE } from "@/lib/pricing";
import { getWorkshopBySlug } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Field, Input, NumberStepper } from "@/components/ui/forms";
import { Img } from "@/components/ui/Img";
import { Skeleton, Stepper } from "@/components/ui/misc";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import type { Workshop } from "@/types";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom complet."),
  email: z.email("Adresse e-mail invalide."),
  phone: z.string().trim().regex(/^\+?[\d\s.-]{8,}$/, "Numéro de téléphone invalide."),
  promo: z.string().trim().optional(),
});
type Contact = z.infer<typeof contactSchema>;

const paymentSchema = z.object({
  cardName: z.string().trim().min(2, "Nom du titulaire requis."),
  cardNumber: z.string().regex(/^(\d{4} ?){4}$/, "Numéro de carte à 16 chiffres."),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/AA."),
  cvc: z.string().regex(/^\d{3}$/, "3 chiffres."),
});
type Payment = z.infer<typeof paymentSchema>;

const STEPS = ["Date et créneau", "Vos coordonnées", "Paiement"];

export default function BookingPage() {
  const { slug = "" } = useParams();
  const { data: w, loading } = useAsync(() => getWorkshopBySlug(slug), [slug]);
  if (loading) return <div className="container-page pb-24 pt-36"><Skeleton className="h-[60vh]" /></div>;
  if (!w) return <NotFoundPage />;
  return <BookingFlow workshop={w} />;
}

function BookingFlow({ workshop: w }: { workshop: Workshop }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { bookings, addBooking, user, partnerId, isFirstBooking } = useStore();
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(() => {
    const d = params.get("date");
    return d && isDateBookable(w, d) ? d : firstBookableDate(w);
  });
  const availability = useMemo(() => slotAvailability(w, date, bookings), [w, date, bookings]);
  const [slot, setSlot] = useState<string | null>(() => {
    const s = params.get("slot");
    return s && availability.some((a) => a.slot === s && a.remaining > 0) ? s : availability.find((a) => a.remaining > 0)?.slot ?? null;
  });
  const remaining = availability.find((a) => a.slot === slot)?.remaining ?? w.maxGroupSize;
  const [participants, setParticipants] = useState(() => Math.min(Number(params.get("p")) || 2, remaining));
  const [contact, setContact] = useState<Contact | null>(null);
  const [paying, setPaying] = useState(false);

  const contactForm = useForm<Contact>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", phone: "", promo: "" },
  });
  const paymentForm = useForm<Payment>({ resolver: zodResolver(paymentSchema) });

  const promo = contactForm.watch("promo");
  const price = computePrice({ unitPriceCentimes: w.priceCentimes, participants, promoCode: promo, isFirstBooking, partnerId });
  const city = cityById(w.cityId)!;

  const pickDate = (d: string) => {
    setDate(d);
    setSlot(slotAvailability(w, d, bookings).find((a) => a.remaining > 0)?.slot ?? null);
  };

  const fillDemoContact = () => {
    contactForm.setValue("name", user?.name ?? "Léa Martin", { shouldValidate: true });
    contactForm.setValue("email", user?.email ?? "lea.martin@example.com", { shouldValidate: true });
    contactForm.setValue("phone", "+33 6 12 34 56 78", { shouldValidate: true });
    if (isFirstBooking) contactForm.setValue("promo", WELCOME_CODE);
  };
  const fillDemoPayment = () => {
    paymentForm.setValue("cardName", "LEA MARTIN", { shouldValidate: true });
    paymentForm.setValue("cardNumber", "4242 4242 4242 4242", { shouldValidate: true });
    paymentForm.setValue("expiry", "12/28", { shouldValidate: true });
    paymentForm.setValue("cvc", "123", { shouldValidate: true });
  };

  const pay = paymentForm.handleSubmit(async () => {
    if (!contact || !slot) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 900)); // simulated payment, nothing is charged
    const booking = addBooking({
      workshopId: w.id, date, slot, participants,
      contact: { name: contact.name, email: contact.email, phone: contact.phone },
      promoCode: contact.promo || null,
    });
    navigate(`/reservation/${booking.reference}`, { replace: true });
  });

  return (
    <div className="bg-sand pb-28 pt-28 sm:pt-36">
      <div className="container-page">
        <Link to={`/ateliers/${w.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-navy">
          <ArrowLeft className="size-4" aria-hidden /> Retour à l’atelier
        </Link>
        <h1 className="mt-6 text-[clamp(2.4rem,5vw,4.2rem)] text-navy">
          Réserver <span className="serif">votre atelier</span>
        </h1>
        <div className="mt-8 max-w-2xl">
          <Stepper steps={STEPS} current={step} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-10">
            {step === 0 && (
              <section aria-labelledby="s1">
                <h2 id="s1" className="text-2xl">Choisissez votre date</h2>
                <div className="mt-6 grid gap-10 md:grid-cols-2">
                  <DatePicker value={date} onChange={pickDate} isDisabled={(d) => !isDateBookable(w, d)} />
                  <div className="flex flex-col gap-8">
                    <fieldset>
                      <legend className="mb-3 font-medium">{formatDate(date)}</legend>
                      <div className="flex flex-wrap gap-2">
                        {availability.map((a) => (
                          <label
                            key={a.slot}
                            className={cn(
                              "flex cursor-pointer flex-col rounded-[var(--radius-md)] border px-4 py-2 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-teal",
                              slot === a.slot ? "border-navy bg-navy text-white" : "border-line hover:border-navy",
                              a.remaining === 0 && "cursor-not-allowed opacity-45",
                            )}
                          >
                            <input type="radio" name="slot" className="sr-only" checked={slot === a.slot} disabled={a.remaining === 0} onChange={() => setSlot(a.slot)} />
                            <span className="tabular font-semibold">{a.slot.replace(":", " h ")}</span>
                            <span className={slot === a.slot ? "text-white/75" : "text-muted"}>{a.remaining === 0 ? "Complet" : `${a.remaining} places`}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <div>
                      <p className="mb-3 font-medium">Participants</p>
                      <NumberStepper value={participants} onChange={setParticipants} max={Math.max(1, remaining)} label="Nombre de participants" />
                      {w.groupFriendly && <p className="mt-3 text-sm text-muted">Plus de {w.maxGroupSize} personnes ? <Link to="/groupes" className="text-teal underline">Demandez un devis groupe</Link>.</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex justify-end">
                  <Button size="lg" disabled={!slot} onClick={() => setStep(1)}>
                    Continuer
                  </Button>
                </div>
              </section>
            )}

            {step === 1 && (
              <form
                aria-labelledby="s2"
                noValidate
                onSubmit={contactForm.handleSubmit((values) => {
                  setContact(values);
                  setStep(2);
                })}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="s2" className="text-2xl">Vos coordonnées</h2>
                  <Button variant="ghost" size="sm" onClick={fillDemoContact}>
                    <Sparkles className="size-4 text-terracotta" aria-hidden /> Remplir pour la démo
                  </Button>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Nom complet" error={contactForm.formState.errors.name?.message}>
                      {(p) => <Input {...p} autoComplete="name" {...contactForm.register("name")} />}
                    </Field>
                  </div>
                  <Field label="E-mail" error={contactForm.formState.errors.email?.message} hint="Votre confirmation et votre QR code y seront envoyés.">
                    {(p) => <Input {...p} type="email" autoComplete="email" {...contactForm.register("email")} />}
                  </Field>
                  <Field label="Téléphone" error={contactForm.formState.errors.phone?.message} hint="L’artisan peut vous joindre le jour J.">
                    {(p) => <Input {...p} type="tel" autoComplete="tel" inputMode="tel" {...contactForm.register("phone")} />}
                  </Field>
                  <div className="sm:col-span-2">
                    <Field
                      label="Code promo (facultatif)"
                      hint={
                        promo
                          ? isValidPromo(promo, isFirstBooking)
                            ? "Code appliqué : −10 % sur votre première réservation."
                            : isValidPromo(promo, true)
                              ? "Ce code est réservé à la première réservation."
                              : "Code inconnu."
                          : `Première réservation ? Essayez ${WELCOME_CODE}.`
                      }
                    >
                      {(p) => <Input {...p} className="uppercase" autoComplete="off" {...contactForm.register("promo")} />}
                    </Field>
                  </div>
                </div>
                <div className="mt-10 flex justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep(0)}>
                    Retour
                  </Button>
                  <Button type="submit" size="lg">
                    Continuer vers le paiement
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form aria-labelledby="s3" noValidate onSubmit={pay}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="s3" className="text-2xl">Paiement</h2>
                  <Button variant="ghost" size="sm" onClick={fillDemoPayment}>
                    <Sparkles className="size-4 text-terracotta" aria-hidden /> Remplir pour la démo
                  </Button>
                </div>
                <p className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] bg-saffron-200/50 px-4 py-3 text-sm">
                  <Lock className="size-4 shrink-0" aria-hidden /> Démonstration : aucun paiement n’est effectué, aucune donnée n’est envoyée.
                </p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Titulaire de la carte" error={paymentForm.formState.errors.cardName?.message}>
                      {(p) => <Input {...p} autoComplete="cc-name" {...paymentForm.register("cardName")} />}
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Numéro de carte" error={paymentForm.formState.errors.cardNumber?.message}>
                      {(p) => <Input {...p} inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" {...paymentForm.register("cardNumber")} />}
                    </Field>
                  </div>
                  <Field label="Expiration" error={paymentForm.formState.errors.expiry?.message}>
                    {(p) => <Input {...p} autoComplete="cc-exp" placeholder="MM/AA" {...paymentForm.register("expiry")} />}
                  </Field>
                  <Field label="CVC" error={paymentForm.formState.errors.cvc?.message}>
                    {(p) => <Input {...p} inputMode="numeric" autoComplete="cc-csc" placeholder="123" {...paymentForm.register("cvc")} />}
                  </Field>
                </div>
                <div className="mt-10 flex justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)} disabled={paying}>
                    Retour
                  </Button>
                  <Button type="submit" size="lg" variant="accent" disabled={paying}>
                    {paying ? "Paiement en cours…" : `Payer ${formatPrice(price.totalCentimes)}`}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Récapitulatif">
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
              <div className="aspect-[16/9] overflow-hidden">
                <Img src={w.photos[0]!} alt="" sizes="24rem" />
              </div>
              <div className="p-6">
                <p className="text-sm text-muted">{city.name}</p>
                <h2 className="mt-1 text-xl tracking-[-0.02em]">{w.title}</h2>
                <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
                  <dt className="text-muted">Date</dt>
                  <dd className="text-end font-medium">{formatDate(date, "EEE d MMM")}</dd>
                  <dt className="text-muted">Créneau</dt>
                  <dd className="text-end font-medium">{slot ? slot.replace(":", " h ") : "—"}</dd>
                  <dt className="text-muted">Participants</dt>
                  <dd className="text-end font-medium">{participants}</dd>
                </dl>
                <dl className="mt-5 grid grid-cols-2 gap-y-3 border-t border-line pt-5 text-sm">
                  <dt className="text-muted">
                    {formatPrice(w.priceCentimes)} × {participants}
                  </dt>
                  <dd className="tabular text-end">{formatPrice(price.subtotalCentimes)}</dd>
                  {price.promoApplied && (
                    <>
                      <dt className="flex items-center gap-1.5 text-teal">
                        <TagIcon className="size-3.5" aria-hidden /> {WELCOME_CODE}
                      </dt>
                      <dd className="tabular text-end text-teal">−{formatPrice(price.discountCentimes)}</dd>
                    </>
                  )}
                  <dt className="text-base font-semibold">Total</dt>
                  <dd className="tabular text-end text-xl font-semibold">{formatPrice(price.totalCentimes)}</dd>
                </dl>
                <p className="mt-5 flex items-start gap-2 rounded-[var(--radius-md)] bg-teal-100 px-4 py-3 text-sm text-teal">
                  <HandCoins className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    <strong className="tabular">{formatPrice(price.artisanShareCentimes)}</strong> vont directement à l’artisan. Les réductions sont prises sur notre part.
                  </span>
                </p>
                <p className="mt-4 text-xs text-muted">Annulation gratuite jusqu’à 48 h avant la visite. Au-delà, aucun remboursement.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
