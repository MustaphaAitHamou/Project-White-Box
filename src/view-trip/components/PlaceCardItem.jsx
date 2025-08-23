/* eslint-env browser */
/**
 * Carte d’un lieu à visiter.
 * Je tente de récupérer une photo et un lien Google Maps à partir du nom du lieu
 * (optionnellement contextualisé avec la destination). J’affiche ensuite le visuel,
 * un court descriptif, le temps de trajet et un bouton qui ouvre la carte.
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaMapLocationDot } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { GetPlaceDetails } from '~/service/GlobalApi';
import { getEnv } from '~/lib/meta-env';

/* Je garde une image de repli en cas d’échec réseau ou d’absence de photo. */
const FALLBACK = '/placeholder.png';

/* Je lis la clé via mon helper pour fonctionner en app et en tests. */
const API_KEY = getEnv('VITE_GOOGLE_PLACE_API_KEY', 'test-key');

/* Je construis l’URL d’une photo v1 Google Places depuis le champ `photos[n].name`. */
const buildPhotoURL = (name) =>
  `https://places.googleapis.com/v1/${name}/media?maxHeightPx=900&maxWidthPx=900&key=${API_KEY}`;

export default function PlaceCardItem({
  placeName,
  details,
  timeToTravel,
  slotLabel,
  destinationLabel,
}) {
  // Je démarre avec le placeholder et un lien neutre pour éviter les états indéfinis.
  const [photoUrl, setPhotoUrl] = useState(FALLBACK);
  const [mapsUrl, setMapsUrl] = useState('#');

  useEffect(() => {
    // Sans nom de lieu, je n’ai rien à interroger.
    if (!placeName) return;

    // Je enrichis la requête avec la destination pour améliorer la pertinence.
    const full = destinationLabel ? `${placeName} ${destinationLabel}` : placeName;

    // Je protège la mise à jour d’état si le composant est démonté avant la fin.
    let active = true;
    (async () => {
      try {
        // Je fais une recherche textuelle et je prends le premier résultat.
        const { data } = await GetPlaceDetails({ textQuery: full });
        const place = data.places?.[0];
        if (!place) return;

        // Je préfère la photo v1 si disponible, sinon je reste sur le fallback.
        const photoName = place.photos?.[0]?.name;
        active && setPhotoUrl(photoName ? buildPhotoURL(photoName) : FALLBACK);

        // Je construis l’URL Google Maps : coordonnée si dispo, sinon requête textuelle.
        const { latitude, longitude } = place.location ?? {};
        const gmaps = latitude
          ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`;
        active && setMapsUrl(gmaps);
      } catch (err) {
        // En cas d’erreur, je journalise et je reviens sur des valeurs sûres.
        console.error('❌ PlaceCard photo:', err?.response?.data || err);
        active && setPhotoUrl(FALLBACK);
        active &&
          setMapsUrl(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`
          );
      }
    })();

    return () => {
      active = false;
    };
  }, [placeName, destinationLabel]);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow hover:shadow-lg transition">
      {/* Image du lieu ; je force le placeholder si le chargement échoue */}
      <img
        src={photoUrl}
        alt={placeName}
        onError={(e) => (e.currentTarget.src = FALLBACK)}
        className="h-44 w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-4">
        {/* Étiquette de créneau (Breakfast/Morning/Afternoon/Evening) si fournie */}
        {slotLabel && (
          <p className="mb-1 text-xs font-semibold text-purple-600">{slotLabel}</p>
        )}

        {/* Titre + descriptif court (tronqué à 3 lignes via line-clamp) */}
        <h3 className="text-lg font-bold">{placeName}</h3>
        <p className="mt-1 flex-1 text-sm text-gray-600 line-clamp-3">{details}</p>

        {/* Bas de carte : temps de trajet + bouton pour ouvrir la carte dans un nouvel onglet */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1 text-gray-700">
            <span role="img" aria-label="time">
              ⏱
            </span>
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

PlaceCardItem.propTypes = {
  placeName: PropTypes.string,
  details: PropTypes.string,
  timeToTravel: PropTypes.string,
  slotLabel: PropTypes.string,
  destinationLabel: PropTypes.string,
};
