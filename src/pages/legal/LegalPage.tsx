import { photoCredits } from "@/data/credits";

export default function LegalPage() {
  return (
    <div className="bg-sand pb-28 pt-32 sm:pt-40">
      <div className="container-page max-w-4xl">
        <p className="eyebrow text-teal">Informations</p>
        <h1 className="mt-4 text-[clamp(2.6rem,6vw,4.5rem)] text-navy">
          Mentions <span className="serif">légales</span>
        </h1>
        <div className="mt-12 flex flex-col gap-10 text-ink/90">
          <section>
            <h2 className="text-2xl">Projet de démonstration</h2>
            <p className="mt-3">
              TripFinders est un prototype réalisé pour le hackathon Digitex 2026. Les artisans, ateliers, avis, hôtels et réservations présentés sont fictifs.
              Aucun paiement n’est effectué et aucune donnée n’est transmise : les informations saisies restent dans votre navigateur.
            </p>
          </section>
          <section>
            <h2 className="text-2xl">Conditions de réservation</h2>
            <ul className="mt-3 list-disc ps-6">
              <li>Annulation gratuite jusqu’à 48 h avant la visite ; au-delà, aucun remboursement.</li>
              <li>L’artisan reçoit 85 % du prix ; TripFinders conserve 15 %, sur lesquels sont pris les codes promo, la fidélité et la part des partenaires hôteliers (5 %).</li>
              <li>Le code BIENVENUE10 donne −10 % sur la première réservation uniquement.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl">Données personnelles</h2>
            <p className="mt-3">
              En production, le traitement des données sera déclaré auprès de la CNDP conformément à la loi 09-08. Vous pourrez accéder à vos données, les rectifier ou les supprimer.
            </p>
          </section>
          <section>
            <h2 className="text-2xl">Crédits photo</h2>
            <p className="mt-3">Les personnes visibles sur les photos ne sont pas les artisans fictifs présentés sur le site.</p>
            <div className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-surface">
              <table className="w-full min-w-[36rem] text-start text-sm">
                <thead className="bg-sand-200 text-start">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Image</th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Auteur</th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Licence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {photoCredits.map((c) => (
                    <tr key={c.file}>
                      <td className="px-4 py-2.5 font-mono text-xs">{c.file}</td>
                      <td className="px-4 py-2.5">
                        <a href={c.source} target="_blank" rel="noreferrer" className="text-teal underline-offset-2 hover:underline">
                          {c.author}
                        </a>
                      </td>
                      <td className="px-4 py-2.5 text-muted">{c.license}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
