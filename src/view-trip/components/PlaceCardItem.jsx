/* eslint-env browser */
import React, { useEffect, useState } from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { GetPlaceDetails } from '~/service/GlobalApi';
import env from '~/lib/env';

const API_KEY  = env.VITE_GOOGLE_PLACE_API_KEY || 'test-key';
const FALLBACK = '/placeholder.png';

const buildPhotoURL = (name) =>
  `https://places.googleapis.com/v1/${name}/media?maxHeightPx=900&maxWidthPx=900&key=${API_KEY}`;

export default function PlaceCardItem({
  placeName,
  details,
  timeToTravel,
  slotLabel,
  destinationLabel,
}) {
  const [photoUrl, setPhotoUrl] = useState(FALLBACK);
  const [mapsUrl, setMapsUrl] = useState('#');

  useEffect(() => {
    if (!placeName) return;
    const full = destinationLabel ? `${placeName} ${destinationLabel}` : placeName;

    let active = true;
    (async () => {
      try {
        const { data } = await GetPlaceDetails({ textQuery: full });
        const place = data.places?.[0];
        if (!place) return;

        const photoName = place.photos?.[0]?.name;
        active && setPhotoUrl(photoName ? buildPhotoURL(photoName) : FALLBACK);

        const { latitude, longitude } = place.location ?? {};
        const gmaps = latitude
          ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`;
        active && setMapsUrl(gmaps);
      } catch (err) {
        console.error('❌ PlaceCard photo:', err?.response?.data || err);
        active && setPhotoUrl(FALLBACK);
        active &&
          setMapsUrl(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`
          );
      }
    })();

    return () => { active = false; };
  }, [placeName, destinationLabel]);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow hover:shadow-lg transition">
      <img
        src={photoUrl}
        alt={placeName}
        onError={(e) => (e.currentTarget.src = FALLBACK)}
        className="h-44 w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-4">
        {slotLabel && (
          <p className="mb-1 text-xs font-semibold text-purple-600">{slotLabel}</p>
        )}

        <h3 className="text-lg font-bold">{placeName}</h3>
        <p className="mt-1 flex-1 text-sm text-gray-600 line-clamp-3">{details}</p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1 text-gray-700">
            <span role="img" aria-label="time">⏱</span>
            {timeToTravel}
          </span>

          <Link to={mapsUrl} target="_blank" rel="noopener noreferrer">
            <Button size="icon" variant="outline" className="p-2">
              <FaMapLocationDot />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
