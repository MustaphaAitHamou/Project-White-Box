import axios from "axios";

/**
 * Service Google Places (Text Search v1).
 * Je prépare l’URL de base et une config Axios avec les bons en-têtes,
 * puis j’expose une fonction simple pour poster la requête.
 * Je n’altère rien au comportement : j’ajoute seulement des commentaires.
 */

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

// Je construis la config des en-têtes pour l’API Places v1.
// - Content-Type: JSON pour le POST
// - X-Goog-Api-Key: clé lue au build via import.meta.env
// - X-Goog-FieldMask: je limite la réponse aux champs utiles pour éviter la surcharge réseau
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    "X-Goog-FieldMask": "places.photos,places.displayName,places.id,places.location"
  }
};

// Appel « textSearch » : j’envoie le body attendu par l’API { textQuery, ... }.
// La fonction retourne directement la Promise Axios (je laisse la gestion au call-site).
export const GetPlaceDetails = (data) => {
  return axios.post(BASE_URL, data, config);
};

// Référence de l’endpoint photo (Google Maps Photos).
// Je ne l’utilise pas ici directement, mais je l’expose tel quel si besoin d’un fetch basé sur photo_reference.
export const PHOTO_REF_URL='https://maps.googleapis.com/maps/api/place/photo'
