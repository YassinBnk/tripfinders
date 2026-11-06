import { Outlet, ScrollRestoration } from "react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/hooks/useReveal";
import { fr } from "@/i18n/fr";

export function RootLayout() {
  useReveal();
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-white"
      >
        {fr.nav.skipToContent}
      </a>
      <Header />
      <main id="contenu">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
