import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Pill";
import { fr } from "@/i18n/fr";

export default function NotFoundPage() {
  return (
    <section className="grid min-h-[90svh] place-items-center bg-sand px-4 pb-20 pt-32 text-center">
      <div className="flex flex-col items-center">
        <p className="display relative text-[clamp(7rem,24vw,16rem)] text-navy">
          4<span className="serif text-terracotta">0</span>4
          <span className="absolute -end-6 top-4 text-[0.16em]">
            <Tag pigment="mint" tilt={8}>Oups</Tag>
          </span>
        </p>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] text-navy">{fr.notFound.title}</h1>
        <p className="mt-3 max-w-[40ch] text-muted">{fr.notFound.text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button to="/" size="lg">
            {fr.common.backHome}
          </Button>
          <Button to="/explorer" variant="secondary" size="lg">
            <Compass className="size-5" aria-hidden /> Explorer les ateliers
          </Button>
        </div>
      </div>
    </section>
  );
}
