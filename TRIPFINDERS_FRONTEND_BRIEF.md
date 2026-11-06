# TripFinders — Frontend Brief

> Read this whole file before writing any code. Then work **step by step** through the build plan at the end: finish one step, show me the result, and wait for my OK before starting the next.

---

## 1. The project in one paragraph

**TripFinders** is a web and mobile platform for **craft tourism in Morocco**. Travelers discover artisans' workshops (weaving, pottery, leather, zellige…), book a visit or a hands-on workshop, and watch, or take part in, the creation of a piece. Artisans and cooperatives get visibility and direct income, with no middlemen.

- **Tagline:** « Au cœur des ateliers »
- **Title (pitch):** « Plateforme immersive au cœur des ateliers d'artisans marocains »
- **Baseline:** « Voir · Apprendre · Créer »
- **Closing line:** « Chaque objet a une histoire. Venez la voir naître. »
- **Context:** hackathon project (Digitex 2026, textile and craft axis). The website will be shown in a **live demo** in front of a jury, so the main user path must be flawless and beautiful.

---

## 2. Scope of this phase

**Frontend only.**

- No backend, no database, no real authentication, no real payments.
- All data comes from **local mock files** (`src/data/*.ts`), behind a small data-access layer (`src/services/*.ts`). Later we will replace that layer with calls to a **Laravel REST API** without touching the components.
- Forms (login, booking, partner sign-up) validate on the client and then show a success state. Nothing is sent anywhere.
- **Mobile-first and fully responsive.** A mobile app (Expo / React Native) will come later, so keep business logic out of components.

---

## 3. Tech stack

| Need | Choice |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS (design tokens in `tailwind.config`) |
| Routing | React Router v6 |
| Icons | lucide-react (thin line icons) |
| Forms | react-hook-form + zod |
| Dates | date-fns (French locale) |
| QR code (booking confirmation) | qrcode.react |
| Map (explore page) | react-leaflet with OpenStreetMap tiles (static markers are enough) |
| State | React context + hooks (no Redux) |

Package manager: npm. No UI kit (no MUI, no Bootstrap): build our own small components.

---

## 4. Language and copy

- **UI language: French** (all visible text).
- Prepare for i18n: keep all strings in `src/i18n/fr.ts`, so we can add `en` and `ar` later. Arabic will need **RTL**, so use logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`) instead of left/right where possible.
- Currency: **DH** (dirhams), formatted like `250 DH` with a non-breaking space for thousands: `1 500 DH`.
- Write proper French with all accents and French punctuation spacing (`Réserver :`, `« … »`).

---

## 5. Design system (must match our pitch deck)

The look is **warm, elegant and Moroccan**: cream backgrounds, deep navy, a teal accent, big serif titles, rounded cards, and real photos of artisans.

### Colors

| Token | Hex | Use |
|---|---|---|
| `navy` | `#10233F` | Headings, dark sections, primary buttons |
| `cream` | `#EFE8E1` | Page background |
| `card` | `#F6F2EC` | Card background |
| `line` | `#D5CBBF` | Card borders, dividers |
| `teal` | `#5E9E9B` | Accent: icons, wave decorations, highlights |
| `teal-dark` | `#2F6F6B` | Accent text on cream (labels, links) |
| `teal-light` | `#A9CBC8` | Decorative shapes |
| `terracotta` | `#A2452F` | Secondary accent, prices, badges |
| `gold` | `#E0A43A` | Highlights on navy (stars, key numbers) |
| `ink` | `#263345` | Body text |
| `muted` | `#5A6472` | Secondary text |

Text must keep at least 4.5:1 contrast with its background. Never put teal text on cream for body copy; use `teal-dark`.

### Typography (Google Fonts)

- **Headings:** Playfair Display, weight 800, tight line height (1.05–1.15).
- **Body / UI:** DM Sans, weights 400 / 500 / 700.
- **Accent script (rare, 1 line max per page):** Dancing Script, used for words like « Au cœur des ateliers » or « Merci ».
- Eyebrow labels: DM Sans 700, uppercase, letter-spacing 0.15em, small, `teal-dark`.

### Visual motifs (reuse them everywhere)

- **Wave squiggle** under section titles: a small teal SVG wave (about 120 × 24 px).
- **Curved photo edge:** hero and split sections have the photo on one side with a soft wavy or arc-shaped edge (SVG mask or clip-path).
- **Dot grid** decoration in a top corner of some sections (navy dots, low weight).
- **Soft organic blob** (`teal-light`) in a bottom corner of some sections.
- **Cards:** `card` background, 2 px `line` border, radius 28 px, generous padding, no heavy shadows.
- **Icon circles:** a line icon inside a circle (filled teal, or outlined on navy sections).
- **Pills:** rounded-full badges for prices, categories and audiences.
- Alternate cream and navy sections for rhythm.

### Components to create (`src/components/ui`)

`Button` (primary navy, secondary outline, accent teal), `Card`, `Badge/Pill`, `SectionTitle` (eyebrow + Playfair title + wave), `IconCircle`, `Rating` (stars), `PriceTag`, `Input`, `Select`, `DatePicker` (simple calendar), `Stepper` (booking steps), `Modal`, `Tabs`, `EmptyState`, `Skeleton`, `Toast`.

---

## 6. Users

- **Travelers (B2C):** foreign tourists, Moroccans and Moroccans living abroad (MRE), and groups (schools, associations, companies).
- **Artisans and cooperatives (B2B):** they list their workshop, receive bookings, and can pay for extra visibility.
- **Partners (B2B):** hotels, riads, guest houses, guides and travel agencies, which recommend workshops through a QR code.

---

## 7. Business rules shown in the UI

- Average visit price: **250 DH per person** (each workshop has its own price).
- TripFinders takes a **15 % commission**; the artisan keeps 85 %. Show this transparently on the workshop page, e.g. « 212,50 DH vont directement à l'artisan ».
- **Pro subscription** for artisans: 100 DH / mois (optional).
- **Sponsored listing:** 500 DH / mois (« Mis en avant » badge).
- **Loyalty:** 5 visits = 1 visit free (progress bar in the user account).
- **Welcome promo code:** `BIENVENUE10` gives 10 % off the first booking.
- Every workshop is **« Vérifié sur place »** (verified badge).

---

## 8. Pages and routes

| Route | Page | Main content |
|---|---|---|
| `/` | Home | Hero (photo with curved edge, script tagline, big title, search bar for city, craft and date), « Comment ça marche » (Découvrir → Réserver → Vivre l'atelier), featured workshops, crafts carousel, cities, impact numbers, artisan testimonial (clearly marked as an example), CTA for artisans |
| `/explorer` | Explore | Filters (city, craft, price, duration, date, group-friendly), sort, grid of workshop cards, list/map toggle (Leaflet), result count, empty state |
| `/ateliers/:slug` | Workshop detail | Photo gallery, title, city, craft, rating, verified badge, artisan story, « Ce que vous allez vivre » (steps), duration, languages, group size, what's included, location (small map), reviews, sticky **booking card** (date, time slot, participants, total, transparent split to the artisan) |
| `/reserver/:slug` | Booking flow | Stepper: 1) date and slot, 2) participants and contact details, 3) payment (**mock** card form, no real payment), 4) confirmation with a QR code and booking reference |
| `/artisans/:slug` | Artisan profile | Portrait, craft, cooperative, story, workshops offered, reviews, « Soutenir cet artisan » |
| `/groupes` | Group offers | Circuits for schools and companies, request-a-quote form |
| `/devenir-partenaire` | For artisans | Benefits, 3 plans (Gratuit with 15 % commission, Pro at 100 DH/mois, Mis en avant at 500 DH/mois), sign-up form |
| `/h/:partnerId` | Hotel QR landing | « Recommandé par Riad X », a curated list of nearby workshops (this is what tourists see after scanning the QR code in a hotel) |
| `/compte` | My account | Tabs: my bookings (upcoming and past), loyalty progress, my reviews, favorites |
| `/a-propos` | About and impact | Mission, problem, numbers, team |
| `/connexion`, `/inscription` | Auth (UI only) | Simple forms, fake login stored in context |
| `*` | 404 | Friendly empty state |

Global layout: a sticky header (logo, Explorer, Groupes, Devenir partenaire, account) with a mobile burger menu, plus a footer (links, partner logos, social links, « © 2026 TripFinders »).

---

## 9. The demo path (top priority)

This exact path must be smooth, fast and visually polished, because it will be shown live to the jury:

1. **Home** → type « Fès » in the search bar → choose « Tissage ».
2. **Explore** → filtered results → click the weaving workshop.
3. **Workshop page** → read the artisan's story → pick a date, a slot and 2 participants.
4. **Booking** → fill in the details (pre-fillable with a « Remplir pour la démo » button) → fake payment.
5. **Confirmation** → reference number, QR code, summary, « 425 DH vont directement à l'artisan ».

---

## 10. Mock data (`src/data`)

Create typed mock data (`src/types.ts`) for these entities:

- `Craft`: id, name, icon (tissage, poterie, cuir, zellige, broderie, bois, dinanderie, bijouterie).
- `City`: id, name, region, coordinates (Fès, Marrakech, Safi, Essaouira, Tétouan, Ouarzazate, Tiznit, Rabat).
- `Artisan`: id, slug, name, craft, city, cooperative, story, yearsOfExperience, languages, photo.
- `Workshop`: id, slug, title, artisanId, craftId, cityId, type (`visite` | `atelier-pratique` | `circuit-groupe`), priceDH, durationMin, maxGroupSize, languages, steps[], included[], rating, reviewCount, photos[], verified, sponsored, groupFriendly, slots[].
- `Review`: id, workshopId, author, country, rating, date, text.
- `Booking`: id, reference, workshopId, date, slot, participants, totalDH, artisanShareDH, status.
- `Partner` (hotel or riad): id, name, city, recommendedWorkshopIds.

Volume: about **16 workshops** across the 8 cities and all crafts, **10 artisans**, and 3–6 reviews per workshop. **All people are fictional**: invent names, don't use real people. Write realistic French content (stories, steps, reviews).

Images: use the photos I put in `public/images/` (weaving, Fès tannery, pottery, southern village). For the missing ones, use neutral placeholders (a cream block with a craft icon). **Don't hotlink images from the internet.**

---

## 11. Project structure

```
src/
  app/            # router, providers, layout
  pages/          # one folder per page
  components/
    ui/           # design-system components
    workshop/     # WorkshopCard, BookingCard, Gallery…
    layout/       # Header, Footer, MobileMenu
  data/           # mock data
  services/       # data access (async functions, API-ready)
  hooks/
  i18n/fr.ts
  lib/            # formatPrice, formatDate, cn()…
  types.ts
public/images/
```

Services must be async and return promises (simulate 300 ms latency), for example `getWorkshops(filters)`, `getWorkshopBySlug(slug)` and `createBooking(data)`, so switching to the Laravel API later is easy.

---

## 12. Quality rules

- TypeScript strict; no `any`.
- Accessible: semantic HTML, alt texts in French, visible focus states, labels on all inputs, keyboard-usable date picker and modal.
- Performance: lazy-load pages and images, compressed images, no huge libraries.
- Loading skeletons and empty states everywhere data appears.
- Subtle animations only (fade or slide on scroll, hover lift on cards); respect `prefers-reduced-motion`.
- Responsive breakpoints: 375 px (mobile), 768 px (tablet), 1280 px (desktop). Test the demo path on mobile width.
- Clean, commented code. Small components.

---

## 13. Build plan (one step at a time)

1. **Setup:** Vite + React + TS + Tailwind + Router, fonts, design tokens, folder structure.
2. **Design system:** UI components plus a hidden `/styleguide` page that shows them all.
3. **Layout:** header, mobile menu, footer.
4. **Mock data and services:** types, data, async services.
5. **Home page.**
6. **Explore page:** filters, grid, map toggle.
7. **Workshop detail page:** gallery, story, reviews, sticky booking card.
8. **Booking flow and confirmation with QR code.**
9. **Artisan profile and hotel QR landing page.**
10. **Groups, Devenir partenaire, About.**
11. **Account and fake auth.**
12. **Polish:** responsive check, accessibility pass, animations, 404, and a final run-through of the demo path.

After each step: run the dev server, check that there are no errors, and summarize what was done.

---

## 14. Don't

- Don't build a backend, a database or real payments.
- Don't use real people's names or photos, or images hotlinked from other sites.
- Don't use emojis as icons; use lucide-react.
- Don't change the colors or fonts above without asking me.
- Don't move on to the next step without my OK.

---

## 15. Decisions (agreed 2026-11-06, these override earlier sections where they differ)

### Money rules
- **The artisan always receives 85 % of the full price.** Promo codes and loyalty freebies are paid out of TripFinders' 15 %.
  - Demo: 2 × 250 DH = 500 DH → with `BIENVENUE10` the traveler pays 450 DH → « 425 DH vont directement à l'artisan ».
  - `BIENVENUE10`: first booking per account only, cannot be combined with a free loyalty visit.
  - Free loyalty visit (after 5 completed visits): 1 person, value capped at 250 DH.
- **Hotel and riad partners** earn **5 %** of each booking made through their QR code, taken from TripFinders' 15 % (TripFinders keeps 10 % on those bookings; the artisan still gets 85 %). The partner ID is remembered for 30 days after a scan and attached to the booking. Explained on `/devenir-partenaire` (section for hotels and riads); never shown to tourists on `/h/:partnerId`.
- Amounts are stored as **integer centimes** and formatted only for display.

### Artisan plans (`/devenir-partenaire`)
The pitch deck lists the prices but not the content of the plans, so:
| Plan | Price | Includes |
|---|---|---|
| Gratuit | 0 DH | Listing, bookings, 15 % commission, up to 5 photos, « Vérifié sur place » after the field visit |
| Pro | 100 DH/mois | Everything in Gratuit + detailed statistics (views, bookings, revenue), up to 20 photos and a presentation video, a short video filmed in the workshop by our team, priority WhatsApp support |
| Mis en avant | 500 DH/mois | Everything in Pro + « Mis en avant » badge, top of results in its city, featured on the Home page. Always visibly labelled. |
The commission stays 15 % on every plan.

### Booking rules
- Instant confirmation (no artisan approval step).
- Statuses: `confirmed` → `completed` (artisan scans the QR) / `cancelled` / `no-show`. Only completed visits count for loyalty and allow a review.
- **Cancellation: free up to 48 h before the visit, no refund after.** Shown on the workshop page, in the booking flow and on the confirmation.
- Reference format `TF-26-XXXX` (no 0/O/1/I).
- Dates stored as `YYYY-MM-DD` + `HH:mm` local time (Africa/Casablanca), never converted timestamps.
- Bookings, favorites, the fake user and partner attribution are persisted in localStorage so the demo survives a reload.

### Pages added
- `/reservation/:reference`: confirmation as its own route (the booking stepper keeps 3 steps: date and slot, details, payment). Built in step 8.
- `/espace-artisan`: one mock artisan dashboard (new bookings, earnings this month, upcoming visits, « Scanner un QR » check-in, current plan). Built in step 11.
- `/mentions-legales`: one simple legal page. Built in step 10.
- Demo path gets a 6th step: open `/compte` → the new booking and loyalty progress 1/5.

### Content from the pitch deck to reuse
- Context numbers (Home impact section and About): « 19,8 M touristes au Maroc en 2025 », « 7 % du PIB vient de l'artisanat », « 54 % des artisans sont des femmes », with sources (Ministère du Tourisme 2026, Secrétariat d'État à l'Artisanat). Any platform figures are labelled « Objectifs ».
- Offers: ateliers pratiques « Créez votre pièce, et repartez avec » ; circuits de groupe « Plusieurs ateliers dans une journée, avec guide ».
- « Parrainage entre amis »: a UI-only card in `/compte`.
- Team on `/a-propos`: Mesbahi Nour (gérante, cheffe de projet), Dghar Mohamed (technique), Benkhouya Yassin (marketing), Asaas Soukayna (partenariats).
- Differentiator line: « 100 % artisanat · ateliers vérifiés sur place · l'argent va directement à l'artisan ».

### Design (matches the deck)
- **Colours refined** (approved 2026-11-06, replaces the table in §5): same family as the deck, tuned for contrast and with a single action colour. Source of truth: `src/styles/index.css` (`@theme`), visible on `/styleguide`.
  | Token | Hex | Use |
  |---|---|---|
  | `navy` / `navy-800` / `navy-950` | `#10233F` / `#1B3358` / `#0A1729` | Headings, dark sections / surfaces on navy / footer |
  | `navy-muted` | `#B8C2D3` | Secondary text on navy |
  | `sand` / `sand-200` | `#F6F1E9` / `#EDE4D6` | Page background / alternate sections |
  | `surface` / `line` | `#FFFDF9` / `#E3D8C8` | Cards / borders |
  | `ink` / `muted` | `#1C2635` / `#5B6472` | Body text / secondary text |
  | `terracotta` (+ `-700`, `-100`) | `#AD4E2B` | **The only action colour**: primary buttons, prices |
  | `teal` (+ `-300`, `-100`) | `#1E6B65` | Links, verified badge, icons; `-300` decorative only |
  | `saffron` / `saffron-600` | `#E3A73F` / `#B7791F` | Stars and key numbers on navy / stars on light |
  Primary buttons are terracotta (they stay visible on both sand and navy sections); navy becomes the secondary button.
- The Home hero mirrors the deck cover: navy panel with a large arc-shaped edge, workshop photo on the other side, `TripFinders` wordmark in Playfair Display italic gold, the teal wave.
- Footer: sponsor logos (Ambassade d'Espagne, AECID, Fundación Cideal, 360, OFPPT) in a white rounded card under « Avec le soutien de · Digitex 2026 », not under « Partenaires ».
- Warm Moroccan identity; animations CSS-only and subtle; visual check at 375 / 768 / 1280 after every step.

### Images
- Free-licensed photos (Unsplash free licence, Pexels, Pixabay) are **downloaded and self-hosted** in `public/images/`, compressed to WebP/AVIF, with a `public/images/CREDITS.md`. No Unsplash+ / premium images, no hotlinking.
- Artisans are fictional, so their portraits use hands, tools and workshop shots rather than identifiable faces.
- The Fès weaving workshop (demo path) must have a real photo.

### Tech details
- Stack (replaces §3 versions): **React 19 + Vite 7 + TypeScript 5.9 (strict)**, **React Router 7** (library mode, imports from `react-router`), Tailwind CSS v4 (tokens in CSS `@theme`), react-leaflet v5, zod 4, react-hook-form 7, date-fns 4, qrcode.react 4, lucide-react. Fonts self-hosted with Fontsource.
- Photos: `public/images/{crafts,cities,gallery}/<name>-{800,1600}.webp`, credits in `public/images/CREDITS.md` (Wikimedia Commons CC licences + 3 Pexels photos).
- Filters and sorting live in the URL query string.
- Pricing, availability and reference logic are pure TypeScript in `src/lib/`, unit-tested with Vitest (dev dependency).
- The workshop page map loads lazily, with a styled address card as fallback if map tiles can't load (venue Wi-Fi).

---

## 16. Premium redesign (2026-11-06, replaces the colour table in §15 and the typography roles in §5)

Direction approved by the team from references (GSAP, Apple, Figma, Awwwards, Dribbble, Behance): oversized type, one idea per screen, dark/light chapters, rounded imagery, pigment "tags", scroll-driven text.

- **Signature motif: the Moroccan arch** (`.arch` utility) frames photos across the site.
- **Colours** (`src/styles/index.css`): night navy `#0C1522` (dark sections, primary buttons), ivory `#F6F2EB` (page), surface `#FFFDF9`, ink `#141B26`, muted `#5D6573`, terracotta `#AD4E2B` (prices, accents), zellige teal `#1E6B65` (links, verified), saffron `#E3A73F` (numbers on navy). Moroccan pigments for tags: rose `#F3B7C3`, saffron `#F6CF73`, mint `#9AD8BB`, sky `#B3C1FF`, clay `#F2A983` (always with ink text).
- **Typography roles:** DM Sans 600 with tight tracking for all headings (display sizes up to ~10rem); Playfair Display *italic* for accent words inside headlines; Dancing Script used once (« Merci » on the confirmation).
- **Motion:** GSAP + ScrollTrigger on the Home page only (hero reveal, scroll-scrubbed statement, parallax numbers); CSS marquee and IntersectionObserver reveals elsewhere; everything disabled with `prefers-reduced-motion`.
- **Stack note:** React 19, Vite 7, React Router 7, TypeScript 5.9, Tailwind 4, GSAP 3, zod 4, react-hook-form 7, react-leaflet 5, qrcode.react 4, lucide-react 1 (no brand icons).
