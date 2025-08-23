/* eslint-env browser */
/**
 * Carte d’un voyage utilisateur.
 * Je récupère une photo illustrant la destination via l’API Places
 * et j’affiche un résumé (destination, durée, budget) cliquable vers la page du trip.
 */
import React, { useEffect, useState } from "react";
import { GetPlaceDetails } from "~/service/GlobalApi";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getEnv } from "~/lib/meta-env";

UserTripCardItem.propTypes = {
  trip: PropTypes.object.isRequired, // je documente le contrat attendu côté appelant
};

// Je lis la clé API via un helper compatible navigateur/tests, avec un fallback explicite.
const API_KEY = getEnv("VITE_GOOGLE_PLACE_API_KEY", "test-key");
// Modèle d’URL de l’API Photos v1 : je remplace {NAME} par le chemin photo renvoyé par Places.
const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media" +
  `?maxHeightPx=1000&maxWidthPx=1000&key=${API_KEY}`;

export default function UserTripCardItem({ trip }) {
  // Je pars d’un placeholder pour éviter le clignotement ou les erreurs de chargement initiales.
  const [photoUrl, setPhotoUrl] = useState("/placeholder.png");

  useEffect(() => {
    // Je déclenche la recherche d’image dès que j’ai un libellé de destination exploitable.
    const label = trip?.userSelection?.location?.label?.trim();
    if (label) fetchPhoto(label);
     
  }, [trip]);

  // Je recherche des détails de lieu à partir d’une requête textuelle,
  // puis je construis l’URL d’image à partir du premier résultat photo.
  async function fetchPhoto(query) {
    try {
      const resp = await GetPlaceDetails({ textQuery: query });
      const photos = resp.data.places?.[0]?.photos;
      if (!photos?.length) return;
      const url = PHOTO_REF_URL.replace("{NAME}", photos[0].name);
      setPhotoUrl(url);
    } catch (err) {
      console.error("Photo error:", err);
    }
  }

  // Je prépare les champs affichés, avec une destructuration défensive.
  const { label } = trip?.userSelection?.location || {};
  const { noOfDays, budget } = trip?.userSelection || {};

  return (
    // Je lie la carte à la page du trip correspondant via son id.
    <Link to={`/view-trip/${trip?.id}`}>
      <article className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all">
        {/* Image illustrant la destination ; si elle échoue je reviens au placeholder. */}
        <img
          src={photoUrl}
          alt={label}
          className="w-full h-44 object-cover"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />
        <div className="p-4">
          {/* Destination */}
          <h2 className="font-semibold">{label}</h2>
          {/* Résumé lisible : nombre de jours et budget sélectionné */}
          <p className="text-sm text-gray-500">
            {noOfDays} jours – Budget&nbsp;: {budget}
          </p>
        </div>
      </article>
    </Link>
  );
}
