/* ------------------------------------------------------------------
   src/view-trip/components/PlaceCardItem.jsx
------------------------------------------------------------------- */
import React, { useEffect, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { GetPlaceDetails } from "~/service/GlobalApi";

const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
const buildPhotoUrl = (fullName) =>
  `https://places.googleapis.com/v1/${fullName}/media?maxHeightPx=800&maxWidthPx=800&key=${API_KEY}`;

export default function PlaceCardItem({
  placeName,
  details,
  timeToTravel,
  slotLabel,
  destinationLabel,        /* ← nouveau */
}) {
  /* ---------- états --------- */
  const [photoUrl, setPhotoUrl] = useState("/placeholder.png");
  const [mapsUrl,  setMapsUrl]  = useState("");

  /* ---------- fetch --------- */
  useEffect(() => {
    if (!placeName) return;

    const fullQuery = destinationLabel
      ? `${placeName} ${destinationLabel}`        /* ex : Pantheon Rome Italy */
      : placeName;

    (async () => {
      try {
        const { data } = await GetPlaceDetails({ textQuery: fullQuery });
        const place   = data.places?.[0];
        if (!place) return;

        /* photo */
        const photo = place.photos?.[0]?.name;
        if (photo) setPhotoUrl(buildPhotoUrl(photo));

        /* lien G-Maps : priorité aux coord°, sinon on retombe sur fullQuery */
        const { latitude, longitude } = place.location || {};
        const url = latitude && longitude
          ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;
        setMapsUrl(url);
      } catch (err) {
        console.error("Place details error:", err);
        /* fallback simple */
        setMapsUrl(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            fullQuery
          )}`
        );
      }
    })();
  }, [placeName, destinationLabel]);

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow hover:shadow-lg transition-shadow">
      <img
        src={photoUrl}
        alt={placeName}
        className="h-40 w-full object-cover"
        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
      />

      <div className="flex flex-1 flex-col p-4">
        {slotLabel && (
          <p className="mb-1 text-xs font-semibold text-orange-600">{slotLabel}</p>
        )}

        <h3 className="text-lg font-bold text-gray-900">{placeName}</h3>
        <p className="mt-1 flex-1 text-sm text-gray-600 line-clamp-3">{details}</p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1 text-gray-700">
            <span role="img" aria-label="time">
              🕙
            </span>
            {timeToTravel}
          </span>

          <Link
            to={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir dans Google Maps"
          >
            <Button size="icon" variant="outline" className="p-2">
              <FaMapLocationDot />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
 