import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpenCheck, Building2, CheckCircle2, GraduationCap, HeartHandshake } from "lucide-react";
import { cities } from "@/data/catalog";
import { workshops } from "@/data/workshops";
import { submitForm } from "@/services/api";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { SectionHeading } from "@/components/ui/misc";
import { WorkshopCard } from "@/components/workshop/WorkshopCard";

const schema = z.object({
  organisation: z.string().trim().min(2, "Nom de l’organisation requis."),
  kind: z.enum(["ecole", "entreprise", "association", "agence"], "Choisissez un type."),
  name: z.string().trim().min(2, "Votre nom est requis."),
  email: z.email("Adresse e-mail invalide."),
  city: z.string().min(1, "Choisissez une ville."),
  size: z.coerce.number<string>().int().min(8, "8 personnes minimum.").max(200, "Contactez-nous au-delà de 200."),
  date: z.string().min(1, "Indiquez une date souhaitée."),
  message: z.string().max(800).optional(),
});
type Quote = z.infer<typeof schema>;

export default function GroupsPage() {
  const [sent, setSent] = useState(false);
  const circuits = workshops.filter((w) => w.type === "circuit-groupe" || (w.groupFriendly && w.maxGroupSize >= 12)).slice(0, 3);
  const { register, handleSubmit, formState } = useForm<z.input<typeof schema>, unknown, Quote>({ resolver: zodResolver(schema) });
  const err = formState.errors;

  return (
    <>
      <PageHero
        eyebrow="Écoles, entreprises, associations"
        title={
          <>
            Apprendre <span className="serif text-saffron">ensemble.</span>
          </>
        }
        intro="Des circuits d’une journée dans plusieurs ateliers, avec guide agréé, déjeuner et dossier pédagogique. Pour 8 à 200 personnes."
        image="/images/gallery/fes-medina"
        imageAlt="La médina de Fès"
      />

      <section className="bg-sand py-24 sm:py-32">
        <div className="container-page">
          <ul className="grid gap-4 md:grid-cols-4">
            {[
              { icon: GraduationCap, t: "Écoles", d: "Sorties pédagogiques avec fiches d’activités." },
              { icon: Building2, t: "Entreprises", d: "Team building créatif et séminaires." },
              { icon: HeartHandshake, t: "Associations", d: "Tarifs solidaires et accessibilité." },
              { icon: BookOpenCheck, t: "Agences", d: "Circuits clés en main pour vos clients." },
            ].map((x) => (
              <li key={x.t} data-reveal className="rounded-[var(--radius-card)] bg-surface p-6">
                <x.icon className="size-7 text-terracotta" aria-hidden />
                <h3 className="mt-4 text-xl">{x.t}</h3>
                <p className="mt-1 text-muted">{x.d}</p>
              </li>
            ))}
          </ul>

          <div className="mt-24">
            <SectionHeading eyebrow="Circuits" title={<>Nos journées <span className="serif">de groupe</span></>} />
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {circuits.map((w) => (
                <WorkshopCard key={w.id} workshop={w} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="devis" className="border-t border-line bg-surface py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Devis gratuit" title={<>Parlez-nous <span className="serif">de votre groupe</span></>} intro="Réponse sous 48 h avec un programme sur mesure et un prix par personne." />
          {sent ? (
            <div role="status" className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-teal-100 p-8 text-teal">
              <CheckCircle2 className="size-10" aria-hidden />
              <p className="text-2xl font-semibold tracking-[-0.02em]">Demande envoyée.</p>
              <p className="text-ink">Merci ! Notre équipe vous recontacte sous 48 h avec une proposition. (Démonstration : rien n’a été envoyé.)</p>
              <Button variant="secondary" onClick={() => setSent(false)}>
                Nouvelle demande
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit(async (v) => { await submitForm(v); setSent(true); })} className="grid gap-5 sm:grid-cols-2">
              <Field label="Organisation" error={err.organisation?.message}>{(p) => <Input {...p} {...register("organisation")} />}</Field>
              <Field label="Type" error={err.kind?.message}>
                {(p) => (
                  <Select {...p} defaultValue="" {...register("kind")}>
                    <option value="" disabled>Choisir…</option>
                    <option value="ecole">École</option>
                    <option value="entreprise">Entreprise</option>
                    <option value="association">Association</option>
                    <option value="agence">Agence de voyage</option>
                  </Select>
                )}
              </Field>
              <Field label="Votre nom" error={err.name?.message}>{(p) => <Input {...p} autoComplete="name" {...register("name")} />}</Field>
              <Field label="E-mail" error={err.email?.message}>{(p) => <Input {...p} type="email" autoComplete="email" {...register("email")} />}</Field>
              <Field label="Ville" error={err.city?.message}>
                {(p) => (
                  <Select {...p} defaultValue="" {...register("city")}>
                    <option value="" disabled>Choisir…</option>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                )}
              </Field>
              <Field label="Nombre de personnes" error={err.size?.message}>{(p) => <Input {...p} type="number" inputMode="numeric" min={8} {...register("size")} />}</Field>
              <div className="sm:col-span-2">
                <Field label="Date souhaitée" error={err.date?.message}>{(p) => <Input {...p} type="date" {...register("date")} />}</Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Message (facultatif)">{(p) => <Textarea {...p} {...register("message")} />}</Field>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? "Envoi…" : "Demander un devis"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
