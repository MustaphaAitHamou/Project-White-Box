/* eslint-env browser, node */
import axios from 'axios';
import env from '~/lib/env';

const API_KEY = env.VITE_GOOGLE_PLACE_API_KEY || 'test-key';

const SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';
const SEARCH_CONF = {
  headers: {
    'Content-Type'   : 'application/json',
    'X-Goog-Api-Key' : API_KEY,
    'X-Goog-FieldMask':
      'places.id,places.displayName,places.formattedAddress,' +
      'places.location,places.rating,places.priceLevel,places.photos',
  },
};

export const GetPlaceDetails = (payload) =>
  axios.post(SEARCH_URL, payload, SEARCH_CONF);

export const GetPlacePhoto = (photoRef, max = 1000) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${max}` +
  `&photoreference=${encodeURIComponent(photoRef)}&key=${API_KEY}`;
