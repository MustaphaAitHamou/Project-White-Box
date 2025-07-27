/* eslint-env browser */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '~/components/ui/button';
import { IoIosSend } from 'react-icons/io';
import { GetPlaceDetails } from '~/service/GlobalApi';
import { GetPlacePhoto } from '~/service/api'; // ton wrapper placeId -> url

const API_KEY =
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY ||
  import.meta.env.GOOGLE_PLACE_KEY || '';

const FALLBACK = '/placeholder.png';

const buildV1PhotoURL = (name) =>
  `https://places.googleapis.com/v1/${name}/media?maxHeightPx=1000&maxWidthPx=1400&key=${API_KEY}`;

const buildLegacyPhotoURL = (ref) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${encodeURIComponent(
    ref
  )}&key=${API_KEY}`;

function preload(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

function urlFromPhotoName(name) {
  if (!name) return null;
  const v1Url = buildV1PhotoURL(name);
  const parts = String(name).split('/photos/');
  const legacyRef = parts[1];
  const legacyUrl = legacyRef ? buildLegacyPhotoURL(legacyRef) : null;
  return { v1Url, legacyUrl };
}

async function resolvePhoto({ placeId, label }) {
  if (placeId) {
    try {
      const u = await GetPlacePhoto(placeId);
      if (u) {
        await preload(u);
        return u;
      }
    } catch {
      // silencieux (pas bloquant)
    }
  }

  if (label) {
    try {
      const { data } = await GetPlaceDetails({ textQuery: label });
      const photoName = data.places?.[0]?.photos?.[0]?.name;
      if (photoName) {
        const { v1Url, legacyUrl } = urlFromPhotoName(photoName);
        if (v1Url) {
          try {
            await preload(v1Url);
            return v1Url;
          } catch {
            // silencieux (tentera fallback)
          }
        }
        if (legacyUrl) {
          try {
            await preload(legacyUrl);
            return legacyUrl;
          } catch {
            // silencieux (tentera fallback)
          }
        }
      }
    } catch (err) {
      console.error('InfoSection photo error:', err?.response?.data || err);
    }
  }

  return FALLBACK;
}

export default function InfoSection({ trip, placeId, name }) {
  const userSel = trip?.userSelection;
  const label = userSel?.location?.label?.trim() || name;
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const url = await resolvePhoto({ placeId, label });
      if (mounted) setPhotoUrl(url || FALLBACK);
    })();
    return () => {
      mounted = false;
    };
  }, [placeId, label]);

  if (trip && !userSel) {
    return (
      <div className="h-[480px] w-full bg-gray-100 flex items-center justify-center rounded">
        Chargement des infos…
      </div>
    );
  }

  const days = userSel?.noOfDays;
  const budget = userSel?.budget;
  const traveler = userSel?.traveler;

  return (
    <div>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={label}
          className="h-[480px] w-full object-cover rounded"
          onError={(e) => (e.currentTarget.src = FALLBACK)}
        />
      ) : (
        <div className="h-[480px] w-full bg-gray-100 flex items-center justify-center rounded">
          Chargement de l’image…
        </div>
      )}

      {trip && (
        <div className="flex justify-between items-center mt-5">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl">{label}</h2>
            <div className="flex gap-5 flex-wrap">
              {days && (
                <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
                  📆 {days} jours
                </span>
              )}
              {budget && (
                <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
                  💰 Budget : {budget}
                </span>
              )}
              {traveler && (
                <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
                  👥 Voyageurs : {traveler}
                </span>
              )}
            </div>
          </div>
          <Button>
            <IoIosSend />
          </Button>
        </div>
      )}
    </div>
  );
}

InfoSection.propTypes = {
  trip: PropTypes.object,
  placeId: PropTypes.string,
  name: PropTypes.string,
};
