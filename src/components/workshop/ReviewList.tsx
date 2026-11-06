import { Star } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Monogram } from "@/components/ui/misc";
import type { Review } from "@/types";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {reviews.map((r) => (
        <li key={r.id} data-reveal className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6">
          <div className="flex items-center gap-1" aria-label={`Note : ${r.rating} sur 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={i < r.rating ? "size-4 fill-saffron-600 text-saffron-600" : "size-4 text-line"} aria-hidden />
            ))}
          </div>
          <p className="flex-1 text-ink">« {r.text} »</p>
          <div className="flex items-center gap-3">
            <Monogram name={r.author} className="size-10 text-base" />
            <div className="text-sm">
              <p className="font-semibold">{r.author}</p>
              <p className="text-muted">
                {r.country} · {formatDate(r.date, "MMMM yyyy")}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
