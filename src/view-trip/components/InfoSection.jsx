/* eslint-env browser */
/* 
  Section d’infos du voyage (image + badges résumé).
  Je tente d’afficher une grande photo de la destination en m’appuyant sur :
    1) un placeId direct (via un wrapper GetPlacePhoto)
    2) à défaut, une recherche textuelle Google Places pour récupérer une photo.
  Si je ne trouve rien de fiable ou qu’un chargement échoue, je bascule sur un placeholder.
*/
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '~/components/ui/button';
import { IoIosSend } from 'react-icons/io';
import { GetPlaceDetails } from '~/service/GlobalApi';
import { GetPlacePhoto } from '~/service/api';
import { getEnv } from '~/lib/meta-env';

/* 
  Je lis la clé d’API de plusieurs façons pour être compatible navigateur / tests.
  Je ne fais aucune hypothèse si la clé manque : les appels tomberont sur le fallback.
*/
const API_KEY =
  getEnv('VITE_GOOGLE_PLACE_API_KEY') ||
  getEnv('GOOGLE_PLACE_KEY') ||
  '';

/* Image de repli si je n’arrive pas à charger une photo distante. */
const FALLBACK = '/placeholder.png';

/* Construction de l’URL d’image v1 à partir du champ "name" renvoyé par Places. */
const buildV1PhotoURL = (name) =>
  `https://places.googleapis.com/v1/${name}/media?maxHeightPx=1000&maxWidthPx=1400&key=${API_KEY}`;

/* Variante historique basée sur photo_reference (API Maps Photos). */
const buildLegacyPhotoURL = (ref) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${encodeURIComponent(
    ref
  )}&key=${API_KEY}`;

/* 
  Petit préchargement d’image : je valide l’URL en simulant un chargement.
  Si ça passe, je résous la promesse ; sinon je rejette pour tenter un fallback.
*/
function preload(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

/* 
  À partir d’un "photo.name" v1, je propose l’URL v1 directe et une URL legacy
  en extrayant la partie après "/photos/" quand c’est possible.
*/
function urlFromPhotoName(name) {
  if (!name) return null;
  const v1Url = buildV1PhotoURL(name);
  const parts = String(name).split('/photos/');
  const legacyRef = parts[1];
  const legacyUrl = legacyRef ? buildLegacyPhotoURL(legacyRef) : null;
  return { v1Url, legacyUrl };
}

/* no-op pour consommer un paramètre et calmer ESLint sans altérer la logique. */
function swallow(e) { void e; }

/* 
  Résolution progressive de l’URL de photo :
  1) J’essaie le wrapper GetPlacePhoto(placeId), puis je précharge.
  2) Sinon, je fais une text search, je récupère le premier "photo.name",
     puis je tente d’abord l’URL v1, ensuite le fallback legacy, avec préchargement.
  3) En dernier recours, je renvoie le placeholder.
*/
async function resolvePhoto({ placeId, label }) {
  // 1) Si on a un placeId -> wrapper direct
  if (placeId) {
    try {
      const u = await GetPlacePhoto(placeId);
      if (u) {
        await preload(u);
        return u;
      }
    } catch (e) {
      swallow(e);
    }
  }

  // 2) Sinon, on tente la recherche textuelle
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
          } catch (e) {
            swallow(e);
          }
        }
        if (legacyUrl) {
          try {
            await preload(legacyUrl);
            return legacyUrl;
          } catch (e) {
            swallow(e);
          }
        }
      }
    } catch (e) {
      swallow(e);
    }
  }

  return FALLBACK;
}

export default function InfoSection({ trip, placeId, name }) {
  /* 
    Je déduis le libellé à afficher : soit depuis la sélection utilisateur,
    soit depuis la prop "name" fournie. Je garde une chaîne propre avec trim().
  */
  const userSel = trip?.userSelection;
  const label = (userSel?.location?.label || name || '').trim();
  const [photoUrl, setPhotoUrl] = useState(null);

  /* 
    Au montage et à chaque changement de placeId/label, je résous l’URL d’image.
    Je protège l’update d’état avec un flag "mounted" en cas de démontage rapide.
  */
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

  /* État intermédiaire si j’ai un trip sans userSelection (donnée encore en cours). */
  if (trip && !userSel) {
    return (
      <div className="h-[480px] w-full bg-gray-100 flex items-center justify-center rounded">
        Chargement des infos…
      </div>
    );
  }

  /* Badges affichés sous l’image si j’ai un trip complet. */
  const days = userSel?.noOfDays;
  const budget = userSel?.budget;
  const traveler = userSel?.traveler;

  return (
    <div>
      {/* Image principale : j’affiche un loader simple tant que photoUrl n’est pas prêt. */}
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={label || 'destination'}
          className="h-[480px] w-full object-cover rounded"
          onError={(e) => {
            e.currentTarget.src = FALLBACK;
          }}
        />
      ) : (
        <div className="h-[480px] w-full bg-gray-100 flex items-center justify-center rounded">
          Chargement de l’image…
        </div>
      )}

      {/* Résumé des infos du trip : destination + badges (jours, budget, voyageurs) + bouton d’action. */}
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
          {/* Bouton neutre visuellement ; l’action précise pourra être branchée plus tard. */}
          <Button>
            <IoIosSend />
          </Button>
        </div>
      )}
    </div>
  );
}

/* Je documente les props acceptées sans imposer de shape stricte pour "trip". */
InfoSection.propTypes = {
  trip: PropTypes.object,
  placeId: PropTypes.string,
  name: PropTypes.string,
};
