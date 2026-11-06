import type { ComponentType } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import { RootLayout } from "./RootLayout";

/** Every page is lazy-loaded, so each route only downloads its own code. */
const page = (load: () => Promise<{ default: ComponentType }>): Pick<RouteObject, "lazy"> => ({
  lazy: async () => ({ Component: (await load()).default }),
});

/** Pages that open on a dark hero: the header starts transparent with light text. */
const dark = { handle: { darkHero: true } };

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    HydrateFallback: () => null,
    children: [
      { index: true, ...dark, ...page(() => import("@/pages/home/HomePage")) },
      { path: "explorer", ...page(() => import("@/pages/explore/ExplorePage")) },
      { path: "ateliers/:slug", ...page(() => import("@/pages/workshop/WorkshopPage")) },
      { path: "reserver/:slug", ...page(() => import("@/pages/booking/BookingPage")) },
      { path: "reservation/:reference", ...dark, ...page(() => import("@/pages/booking/ConfirmationPage")) },
      { path: "artisans/:slug", ...dark, ...page(() => import("@/pages/artisan/ArtisanPage")) },
      { path: "groupes", ...dark, ...page(() => import("@/pages/groups/GroupsPage")) },
      { path: "devenir-partenaire", ...dark, ...page(() => import("@/pages/partner/BecomePartnerPage")) },
      { path: "h/:partnerId", ...dark, ...page(() => import("@/pages/partner/HotelLandingPage")) },
      { path: "compte", ...page(() => import("@/pages/account/AccountPage")) },
      { path: "espace-artisan", ...page(() => import("@/pages/artisan/ArtisanDashboardPage")) },
      { path: "a-propos", ...dark, ...page(() => import("@/pages/about/AboutPage")) },
      { path: "mentions-legales", ...page(() => import("@/pages/legal/LegalPage")) },
      { path: "connexion", lazy: async () => ({ Component: (await import("@/pages/auth/AuthPage")).LoginPage }) },
      { path: "inscription", lazy: async () => ({ Component: (await import("@/pages/auth/AuthPage")).RegisterPage }) },
      { path: "styleguide", ...page(() => import("@/pages/styleguide/StyleguidePage")) },
      { path: "*", ...page(() => import("@/pages/not-found/NotFoundPage")) },
    ],
  },
]);
