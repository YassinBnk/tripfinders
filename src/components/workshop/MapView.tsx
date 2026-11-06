import { useState } from "react";
import { Link } from "react-router";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Workshop } from "@/types";

const pin = L.divIcon({
  className: "",
  html: '<span style="display:block;width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#0c1522;border:3px solid #f6cf73;box-shadow:0 4px 10px rgb(0 0 0/.25)"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

/**
 * OpenStreetMap map with static markers. Loaded lazily (Leaflet is only fetched when shown).
 * If tiles fail (no internet at the venue), a styled fallback lists the addresses instead.
 */
export default function MapView({ workshops, zoom }: { workshops: Workshop[]; zoom?: number }) {
  const [failed, setFailed] = useState(false);
  const first = workshops[0];
  if (!first) return null;

  if (failed) {
    return (
      <div className="flex h-full flex-col justify-center gap-3 bg-sand-200 p-6">
        <p className="font-medium">Carte indisponible hors connexion.</p>
        <ul className="flex flex-col gap-2 text-sm text-muted">
          {workshops.slice(0, 6).map((w) => (
            <li key={w.id} className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden /> {w.address}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const bounds = L.latLngBounds(workshops.map((w) => w.coordinates));
  return (
    <MapContainer
      {...(workshops.length > 1 ? { bounds, boundsOptions: { padding: [40, 40] } } : { center: first.coordinates, zoom: zoom ?? 15 })}
      scrollWheelZoom={false}
      className="h-full w-full"
      aria-label="Carte des ateliers"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        eventHandlers={{ tileerror: () => setFailed(true) }}
      />
      {workshops.map((w) => (
        <Marker key={w.id} position={w.coordinates} icon={pin} title={w.title}>
          <Popup>
            <Link to={`/ateliers/${w.slug}`} className="font-semibold text-navy">
              {w.title}
            </Link>
            <br />
            {formatPrice(w.priceCentimes)} / pers.
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
