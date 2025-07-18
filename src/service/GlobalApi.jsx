/* eslint-env browser, node */
/* global process */

import axios from 'axios';

/* ------------------------------------------------------------------ */
/*  Clé API : on lit d’abord import.meta.env (mode navigateur/Vite),   */
/*  puis on retombe sur process.env (mode tests Node/Jest).            */
/* ------------------------------------------------------------------ */
const API_KEY =
  import.meta.env?.VITE_GOOGLE_PLACE_API_KEY ||
  process.env.VITE_GOOGLE_PLACE_API_KEY;

/* ------------------------------------------------------------------ */
/*  Appel POST vers Places API                                         */
/* ------------------------------------------------------------------ */
const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';

/**
 * @param {object} payload – ex : { textQuery: 'Eiffel Tower' }
 */
export function GetPlaceDetails(payload) {
  return axios.post(
    ENDPOINT,
    payload,
    {
      headers: {
        'Content-Type'   : 'application/json',
        'X-Goog-Api-Key' : API_KEY,
        'X-Goog-FieldMask':
          'places.photos,places.displayName,places.id,places.location'
      }
    }
  );
}
