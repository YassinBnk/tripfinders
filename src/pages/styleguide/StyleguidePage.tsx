import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { workshops } from "@/data/workshops";
import { addDays, format } from "date-fns";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Field, Input, NumberStepper, Select } from "@/components/ui/forms";
import { Pill, Rating, SponsoredBadge, Tag, VerifiedBadge } from "@/components/ui/Pill";
import { EmptyState, Skeleton, Stepper } from "@/components/ui/misc";
import { Tabs, useToast } from "@/components/ui/overlays";
import { WorkshopCard } from "@/components/workshop/WorkshopCard";

/** Hidden page (/styleguide) showing the whole design system. */
const swatches = [
  ["navy", "#0C1522", "Sections nuit, boutons"], ["navy-800", "#172338", "Surfaces sur nuit"], ["sand", "#F6F2EB", "Fond de page"],
  ["sand-200", "#ECE5D9", "Fond secondaire"], ["surface", "#FFFDF9", "Cartes"], ["line", "#E4DCCF", "Bordures"],
  ["ink", "#141B26", "Texte"], ["muted", "#5D6573", "Texte secondaire"], ["terracotta", "#AD4E2B", "Prix, accents"],
  ["teal", "#1E6B65", "Liens, vérifié"], ["saffron", "#E3A73F", "Chiffres sur nuit"], ["rose", "#F3B7C3", "Pigment"],
  ["saffron-200", "#F6CF73", "Pigment"], ["mint", "#9AD8BB", "Pigment"], ["sky", "#B3C1FF", "Pigment"], ["clay", "#F2A983", "Pigment"],
] as const;

export default function StyleguidePage() {
  const [tab, setTab] = useState<"a" | "b" | "c">("a");
  const [n, setN] = useState(2);
  const [date, setDate] = useState(format(addDays(new Date(), 3), "yyyy-MM-dd"));
  const toast = useToast();

  return (
    <div className="bg-sand pb-28 pt-32 sm:pt-40">
      <div className="container-page flex flex-col gap-20">
        <header>
          <p className="eyebrow text-teal">Charte graphique</p>
          <h1 className="display mt-4 text-[clamp(3rem,8vw,7rem)] text-navy">
            Design <span className="serif">system</span>
          </h1>
        </header>

        <section>
          <h2 className="text-3xl">Couleurs</h2>
          <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,10rem),1fr))] gap-3">
            {swatches.map(([token, hex, use]) => (
              <li key={token} className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
                <div className="h-20" style={{ backgroundColor: hex }} />
                <div className="p-3 text-sm">
                  <p className="font-semibold">{token}</p>
                  <p className="font-mono text-xs text-muted">{hex}</p>
                  <p className="text-muted">{use}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-3xl">Typographie</h2>
          <p className="display text-[clamp(3rem,9vw,8rem)] text-navy">
            Au cœur <span className="serif text-terracotta">des ateliers</span>
          </p>
          <p className="max-w-[60ch] text-lg">DM Sans pour les titres (600, interlettrage serré) et le texte. Playfair Display italique pour les mots-accents. Dancing Script une seule fois : « Merci ».</p>
          <p className="font-script text-5xl text-saffron-600">Merci</p>
          <p className="tabular text-4xl font-semibold text-terracotta">{formatPrice(150000)}</p>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-3xl">Boutons, pastilles, étiquettes</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Principal</Button>
            <Button variant="secondary">Secondaire</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Discret <ArrowRight className="size-4" aria-hidden /></Button>
            <Button size="sm" onClick={() => toast("Ceci est une notification")}>Afficher un toast</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill pigment="rose">Tissage</Pill><Pill pigment="clay">Poterie</Pill><Pill pigment="mint">Zellige</Pill><Pill pigment="sky">Bijouterie</Pill><Pill pigment="saffron">Cuir</Pill>
            <VerifiedBadge /><SponsoredBadge /><Rating value={4.9} count={128} />
          </div>
          <div className="flex flex-wrap gap-6 rounded-[var(--radius-card)] bg-navy p-10 text-5xl">
            <Tag pigment="rose" tilt={-6}>Voir</Tag><Tag pigment="saffron" tilt={4}>Apprendre</Tag><Tag pigment="mint" tilt={-3}>Créer</Tag>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl">Formulaires</h2>
            <Field label="Nom complet">{(p) => <Input {...p} placeholder="Léa Martin" />}</Field>
            <Field label="E-mail" error="Adresse e-mail invalide.">{(p) => <Input {...p} defaultValue="lea@" />}</Field>
            <Field label="Ville">{(p) => <Select {...p}><option>Fès</option><option>Marrakech</option></Select>}</Field>
            <NumberStepper value={n} onChange={setN} max={8} label="Participants" />
            <Stepper steps={["Date", "Coordonnées", "Paiement"]} current={1} />
            <Tabs label="Exemple" value={tab} onChange={setTab} tabs={[{ id: "a", label: "Réservations", count: 2 }, { id: "b", label: "Fidélité" }, { id: "c", label: "Favoris" }]} />
          </div>
          <div className="rounded-[var(--radius-card)] bg-surface p-6">
            <DatePicker value={date} onChange={setDate} isDisabled={(d) => new Date(d).getDay() === 5} />
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="mb-6 text-3xl">Carte atelier</h2>
            <WorkshopCard workshop={workshops[0]!} />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl">États</h2>
            <div className="flex gap-3"><Skeleton className="h-24 flex-1" /><Skeleton className="h-24 flex-1" /></div>
            <EmptyState icon={<ArrowRight className="size-6" aria-hidden />} title="Aucun résultat" text="Exemple d’état vide." />
          </div>
        </section>
      </div>
    </div>
  );
}
