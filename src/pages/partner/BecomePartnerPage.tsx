import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BadgeCheck, Camera, Check, CheckCircle2, Globe2, HandCoins, QrCode } from "lucide-react";
import { cities, crafts } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { submitForm } from "@/services/api";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { SectionHeading } from "@/components/ui/misc";

const plans = [
  {
    id: "gratuit", name: "Gratuit", price: "0 DH", per: "pour toujours",
    pitch: "Pour commencer à recevoir des visiteurs.",
    features: ["Fiche atelier et réservations en ligne", "Commission de 15 % seulement à la réservation", "Jusqu’à 5 photos", "Badge « Vérifié sur place » après notre visite"],
  },
  {
    id: "pro", name: "Pro", price: "100 DH", per: "par mois", highlight: true,
    pitch: "Pour les ateliers qui veulent grandir.",
    features: ["Tout le plan Gratuit", "Statistiques : vues, réservations, revenus", "Jusqu’à 20 photos et une vidéo", "Une vidéo tournée dans votre atelier par notre équipe", "Support prioritaire sur WhatsApp"],
  },
  {
    id: "mis-en-avant", name: "Mis en avant", price: "500 DH", per: "par mois",
    pitch: "Pour être vu en premier dans votre ville.",
    features: ["Tout le plan Pro", "Badge « Mis en avant »", "En tête des résultats de votre ville", "Présence sur la page d’accueil", "Toujours signalé comme sponsorisé"],
  },
];

const schema = z.object({
  name: z.string().trim().min(2, "Votre nom est requis."),
  workshop: z.string().trim().min(2, "Nom de l’atelier ou de la coopérative requis."),
  craft: z.string().min(1, "Choisissez un artisanat."),
  city: z.string().min(1, "Choisissez une ville."),
  phone: z.string().trim().regex(/^\+?[\d\s.-]{8,}$/, "Numéro invalide (WhatsApp de préférence)."),
  plan: z.string(),
  message: z.string().max(800).optional(),
});
type Signup = z.infer<typeof schema>;

export default function BecomePartnerPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, setValue, watch, formState } = useForm<Signup>({ resolver: zodResolver(schema), defaultValues: { plan: "gratuit" } });
  const plan = watch("plan");
  const err = formState.errors;

  return (
    <>
      <PageHero
        eyebrow="Artisans et coopératives"
        title={
          <>
            Votre savoir-faire <span className="serif text-saffron">mérite d’être vu.</span>
          </>
        }
        intro="Recevez des visiteurs du monde entier, sans intermédiaire. Vous gardez 85 % de chaque réservation."
        image="/images/gallery/dinanderie-fes"
        imageAlt="Un artisan cisèle un plateau en laiton"
      >
        <Button to="#inscription" variant="light" size="lg">
          Inscrire mon atelier
        </Button>
      </PageHero>

      <section className="bg-sand py-24 sm:py-32">
        <div className="container-page">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: HandCoins, t: "85 % pour vous", d: "Paiement direct, transparent, affiché à chaque voyageur." },
              { icon: BadgeCheck, t: "Vérifié sur place", d: "Notre équipe visite chaque atelier avant sa mise en ligne." },
              { icon: Camera, t: "Photos et vidéo", d: "Nous filmons votre savoir-faire pour votre fiche." },
              { icon: Globe2, t: "Visible partout", d: "Français, anglais, arabe : des voyageurs de 40 pays." },
            ].map((x) => (
              <li key={x.t} data-reveal className="rounded-[var(--radius-card)] bg-surface p-6">
                <x.icon className="size-7 text-terracotta" aria-hidden />
                <h3 className="mt-4 text-xl">{x.t}</h3>
                <p className="mt-1 text-muted">{x.d}</p>
              </li>
            ))}
          </ul>

          <div className="mt-28">
            <SectionHeading eyebrow="Tarifs" title={<>Trois formules, <span className="serif">zéro surprise.</span></>} intro="La commission de 15 % reste la même sur toutes les formules. Changez ou arrêtez quand vous voulez." />
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.id}
                  data-reveal
                  className={cn("flex flex-col rounded-[var(--radius-card)] p-8", p.highlight ? "bg-navy text-white" : "border border-line bg-surface")}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl">{p.name}</h3>
                    {p.highlight && <span className="rounded-full bg-saffron px-3 py-1 text-xs font-semibold text-navy">Le plus choisi</span>}
                  </div>
                  <p className={cn("mt-2", p.highlight ? "text-navy-muted" : "text-muted")}>{p.pitch}</p>
                  <p className="mt-8">
                    <span className="tabular text-5xl font-semibold tracking-[-0.04em]">{p.price}</span>{" "}
                    <span className={p.highlight ? "text-navy-muted" : "text-muted"}>{p.per}</span>
                  </p>
                  <ul className="mt-8 flex flex-1 flex-col gap-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className={cn("mt-1 size-4 shrink-0", p.highlight ? "text-saffron" : "text-teal")} aria-hidden /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    to="#inscription"
                    variant={p.highlight ? "light" : "secondary"}
                    className="mt-8 w-full"
                    onClick={() => setValue("plan", p.id)}
                  >
                    Choisir {p.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="hotels" className="scroll-mt-24 bg-navy py-24 text-white sm:py-32">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading dark eyebrow="Hôtels, riads, guides et agences" title={<>Recommandez nos artisans, <span className="serif text-saffron">gagnez 5 %.</span></>} />
          <div data-reveal className="flex flex-col gap-6 text-lg text-navy-muted">
            <p>
              Nous vous donnons un QR code à poser à la réception. Vos hôtes le scannent et découvrent les ateliers que vous recommandez. Sur chaque réservation qui passe par votre QR code, vous recevez <strong className="text-white">5 % du montant</strong>.
            </p>
            <p>Ces 5 % sont pris sur la part de TripFinders : l’artisan garde toujours ses 85 % et votre hôte ne paie rien de plus.</p>
            <div className="flex flex-wrap gap-3">
              <Button to="/h/riad-yasmine" variant="light">
                <QrCode className="size-4" aria-hidden /> Voir un exemple de page hôtel
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="inscription" className="scroll-mt-24 bg-sand py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Inscription" title={<>Inscrire <span className="serif">mon atelier</span></>} intro="Nous vous appelons sous 72 h pour organiser la visite de vérification." />
          {sent ? (
            <div role="status" className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-teal-100 p-8">
              <CheckCircle2 className="size-10 text-teal" aria-hidden />
              <p className="text-2xl font-semibold tracking-[-0.02em] text-teal">Bienvenue chez TripFinders !</p>
              <p>Votre demande est enregistrée. Un membre de l’équipe partenariats vous contacte sur WhatsApp. (Démonstration : rien n’a été envoyé.)</p>
              <Button to="/espace-artisan" variant="secondary">
                Découvrir l’espace artisan
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit(async (v) => { await submitForm(v); setSent(true); })} className="grid gap-5 sm:grid-cols-2">
              <Field label="Votre nom" error={err.name?.message}>{(p) => <Input {...p} autoComplete="name" {...register("name")} />}</Field>
              <Field label="Atelier ou coopérative" error={err.workshop?.message}>{(p) => <Input {...p} {...register("workshop")} />}</Field>
              <Field label="Artisanat" error={err.craft?.message}>
                {(p) => (
                  <Select {...p} defaultValue="" {...register("craft")}>
                    <option value="" disabled>Choisir…</option>
                    {crafts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                )}
              </Field>
              <Field label="Ville" error={err.city?.message}>
                {(p) => (
                  <Select {...p} defaultValue="" {...register("city")}>
                    <option value="" disabled>Choisir…</option>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                )}
              </Field>
              <Field label="Téléphone (WhatsApp)" error={err.phone?.message}>{(p) => <Input {...p} type="tel" inputMode="tel" autoComplete="tel" {...register("phone")} />}</Field>
              <Field label="Formule">
                {(p) => (
                  <Select {...p} value={plan} {...register("plan")}>
                    {plans.map((pl) => <option key={pl.id} value={pl.id}>{pl.name} · {pl.price}</option>)}
                  </Select>
                )}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Parlez-nous de votre atelier (facultatif)">{(p) => <Textarea {...p} {...register("message")} />}</Field>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? "Envoi…" : "Envoyer ma demande"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
