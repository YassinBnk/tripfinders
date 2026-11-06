import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { addDays, format } from "date-fns";
import { Search } from "lucide-react";
import { cities, crafts } from "@/data/catalog";

/** Hero search: city, craft and date go straight into the Explore URL. */
export function HeroSearch() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [craft, setCraft] = useState("");
  const [date, setDate] = useState("");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (city) q.set("ville", city);
    if (craft) q.set("artisanat", craft);
    if (date) q.set("date", date);
    navigate(`/explorer${q.size ? `?${q}` : ""}`);
  };

  const cell = "flex flex-1 flex-col gap-0.5 rounded-[1.25rem] px-5 py-3 transition-colors focus-within:bg-sand-200 hover:bg-sand-200/70 md:rounded-full";
  const label = "text-xs font-semibold uppercase tracking-[0.14em] text-muted";
  const field = "w-full appearance-none bg-transparent text-[1rem] font-medium text-ink outline-none";

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Rechercher un atelier"
      className="flex w-full max-w-3xl flex-col gap-1 rounded-[1.75rem] bg-surface p-2 text-ink shadow-[0_30px_80px_-20px_rgb(0_0_0/0.45)] md:flex-row md:items-center md:rounded-full"
    >
      <label className={cell}>
        <span className={label}>Ville</span>
        <select value={city} onChange={(e) => setCity(e.target.value)} className={field}>
          <option value="">Toutes les villes</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <span aria-hidden className="hidden h-8 w-px bg-line md:block" />
      <label className={cell}>
        <span className={label}>Artisanat</span>
        <select value={craft} onChange={(e) => setCraft(e.target.value)} className={field}>
          <option value="">Tous les savoir-faire</option>
          {crafts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <span aria-hidden className="hidden h-8 w-px bg-line md:block" />
      <label className={cell}>
        <span className={label}>Date</span>
        <input type="date" min={tomorrow} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
      </label>
      <button
        type="submit"
        className="flex h-14 items-center justify-center gap-2 rounded-full bg-terracotta px-7 font-medium text-white transition-colors hover:bg-terracotta-700 md:size-16 md:px-0"
      >
        <Search className="size-5" aria-hidden />
        <span className="md:sr-only">Rechercher</span>
      </button>
    </form>
  );
}
