import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useMatches } from "react-router";
import { ArrowUpRight, Menu, UserRound, X } from "lucide-react";
import { useStore } from "@/app/store";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { fr } from "@/i18n/fr";

const links = [
  { to: "/explorer", label: fr.nav.explore },
  { to: "/groupes", label: fr.nav.groups },
  { to: "/devenir-partenaire", label: fr.nav.becomePartner },
  { to: "/a-propos", label: "À propos" },
];

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-[1.35rem] font-semibold tracking-[-0.04em]", className)}>
      Trip<span className="serif font-normal">Finders</span>
    </span>
  );
}

/** Floating header. Transparent over dark heroes (route handle `darkHero`), ivory glass once scrolled. */
export function Header() {
  const matches = useMatches();
  const darkHero = matches.some((m) => (m.handle as { darkHero?: boolean } | undefined)?.darkHero);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useStore();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onDark = darkHero && !scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 rounded-full ps-5 pe-2 transition-all duration-500",
          onDark ? "text-white" : "border border-line/70 bg-sand/80 text-navy shadow-[var(--shadow-soft)] backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <Link to="/" aria-label="TripFinders, accueil">
          <Wordmark />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors",
                      onDark ? "hover:bg-white/10" : "hover:bg-navy/[0.06]",
                      isActive && (onDark ? "bg-white/10" : "bg-navy/[0.06]"),
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to={user ? "/compte" : "/connexion"}
            className={cn("hidden h-11 items-center gap-2 rounded-full px-4 text-[0.95rem] font-medium sm:flex", onDark ? "hover:bg-white/10" : "hover:bg-navy/[0.06]")}
          >
            <UserRound className="size-[1.1rem]" aria-hidden />
            {user ? user.name.split(" ")[0] : fr.nav.login}
          </Link>
          <Button to="/explorer" variant={onDark ? "light" : "primary"} size="sm" className="h-11 px-5 max-sm:hidden">
            Réserver un atelier
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn("grid size-12 place-items-center rounded-full lg:hidden", onDark ? "hover:bg-white/10" : "hover:bg-navy/[0.06]")}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="size-6" aria-hidden />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-navy px-6 pb-8 pt-6 text-white">
          <div className="flex items-center justify-between">
            <Wordmark />
            <button type="button" autoFocus onClick={() => setOpen(false)} className="grid size-12 place-items-center rounded-full hover:bg-white/10" aria-label="Fermer le menu">
              <X className="size-6" aria-hidden />
            </button>
          </div>
          <nav aria-label="Navigation mobile" className="mt-12 flex-1">
            <ul className="flex flex-col gap-2">
              {[...links, { to: user ? "/compte" : "/connexion", label: user ? fr.nav.account : fr.nav.login }].map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className="group flex items-center justify-between border-b border-white/10 py-4 text-[2.25rem] font-semibold tracking-[-0.04em]">
                    {l.label}
                    <ArrowUpRight className="size-7 text-saffron transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Button to="/explorer" variant="light" size="lg" className="w-full">
            Réserver un atelier
          </Button>
        </div>
      )}
    </header>
  );
}
