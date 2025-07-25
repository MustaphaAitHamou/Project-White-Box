/* eslint-env browser */
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaEuroSign, FaStar } from 'react-icons/fa';
import { GetPlaceDetails } from '~/service/GlobalApi';
import env from '~/lib/env';

const API_KEY  = env.VITE_GOOGLE_PLACE_API_KEY || 'test-key';
const FALLBACK = '/placeholder.png';

const buildPhotoURL = (name) =>
  `https://places.googleapis.com/v1/${name}/media?maxHeightPx=1000&maxWidthPx=1200&key=${API_KEY}`;

export default function HotelCardItem({ hotel }) {
  const {
    hotelName: rawHotelName,
    displayName,
    hotelAddress = 'Adresse inconnue',
    price,
    rating,
  } = hotel || {};

  const hotelName = rawHotelName || displayName || '';
  const [photoUrl, setPhotoUrl] = useState(FALLBACK);

  useEffect(() => {
    if (!hotelName) return;
    let active = true;

    (async () => {
      try {
        const { data } = await GetPlaceDetails({
          textQuery: `${hotelName}, ${hotelAddress}`,
        });
        const place  = data.places?.[0];
        const photo  = place?.photos?.[0]?.name;
        const newURL = photo ? buildPhotoURL(photo) : FALLBACK;
        if (active) setPhotoUrl(newURL);
      } catch (err) {
        console.error('❌ Photo hôtel', err?.response?.data || err);
        if (active) setPhotoUrl(FALLBACK);
      }
    })();

    return () => { active = false; };
  }, [hotelName, hotelAddress]);

  const mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${hotelName} ${hotelAddress}`
    )}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow hover:-translate-y-0.5 hover:shadow-lg transition"
    >
      <div className="relative h-60 w-full">
        <img
          src={photoUrl}
          alt={hotelName}
          onError={(e) => (e.currentTarget.src = FALLBACK)}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {rating && (
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-sm font-semibold text-gray-700 shadow">
            <FaStar className="text-yellow-500" /> {rating}
          </span>
        )}
      </div>
      <div className="space-y-1 px-4 py-3 text-sm">
        <h3 className="font-semibold text-indigo-700 group-hover:underline">
          {hotelName}
        </h3>
        <p className="flex items-start gap-1 text-gray-600">
          <FaMapMarkerAlt className="mt-0.5 shrink-0 text-gray-500" />
          {hotelAddress}
        </p>
        {price && (
          <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            <FaEuroSign /> {price}
          </p>
        )}
      </div>
    </a>
  );
}
