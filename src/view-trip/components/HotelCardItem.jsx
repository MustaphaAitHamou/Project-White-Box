/* eslint-env browser */
// Carte d’hôtel autonome : je tente de récupérer une photo via Google Places
// à partir du nom + adresse, puis j’affiche un lien vers la recherche Google Maps.
// Je n’altère aucun comportement : j’ajoute uniquement des commentaires.

import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaEuroSign, FaStar } from 'react-icons/fa';
import { GetPlaceDetails } from '~/service/GlobalApi';
import PropTypes from 'prop-types';

// Je lis la clé d’API exposée par Vite (ou un fallback pour les tests).
const API_KEY = import.meta.env?.VITE_GOOGLE_PLACE_API_KEY || 'test-key';

// Image de secours si je ne récupère rien de l’API ou si le chargement échoue.
const FALLBACK = '/placeholder.png';

// Je construis l’URL d’une photo v1 à partir du champ "name" renvoyé par Places.
const buildPhotoURL = (name) =>
  `https://places.googleapis.com/v1/${name}/media?maxHeightPx=1000&maxWidthPx=1200&key=${API_KEY}`;
  

export default function HotelCardItem({ hotel }) {
  // Je lis les champs possibles (certaines sources utilisent displayName).
  const {
    hotelName: rawHotelName,
    displayName,
    hotelAddress = 'Adresse inconnue',
    price,
    rating,
  } = hotel || {};

  // Je choisis le meilleur nom disponible pour la carte et la requête.
  const hotelName = rawHotelName || displayName || '';

  // Je démarre avec une image de fallback pour éviter le flash à blanc.
  const [photoUrl, setPhotoUrl] = useState(FALLBACK);

  // À chaque changement de nom/adresse, je tente de récupérer une photo depuis Places.
  useEffect(() => {
    if (!hotelName) return;
    let active = true; // je protège l’update d’état contre les unmount rapides

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

    // Je neutralise l’update si le composant est démonté entre-temps.
    return () => { active = false; };
  }, [hotelName, hotelAddress]);

  // Je prépare un lien simple vers Google Maps pour afficher la fiche correspondante.
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
        {/* Image principale de la carte ; je reviens au placeholder en cas d’erreur. */}
        <img
          src={photoUrl}
          alt={hotelName}
          onError={(e) => (e.currentTarget.src = FALLBACK)}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {/* Badge de note si disponible */}
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
        {/* Prix indicatif si fourni (je n’impose pas de formatage ici). */}
        {price && (
          <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            <FaEuroSign /> {price}
          </p>
        )}
      </div>
    </a>
  );
}

HotelCardItem.propTypes = {
  hotel: PropTypes.shape({
    hotelName: PropTypes.string,
    displayName: PropTypes.string,
    hotelAddress: PropTypes.string,
    price: PropTypes.number,
    rating: PropTypes.number,
  }).isRequired,
};
