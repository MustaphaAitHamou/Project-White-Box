// src/view-trip/components/UserTripCardItem.jsx
import React, { useEffect, useState } from 'react';
import { GetPlaceDetails } from '~/service/GlobalApi';
import { Link } from 'react-router-dom';
const PHOTO_REF_URL =
  'https://places.googleapis.com/v1/{NAME}/media' +
  '?maxHeightPx=1000&maxWidthPx=1000&key=' +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

export default function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.png');

  useEffect(() => {
    const label = trip?.userSelection?.location?.label?.trim();
    if (label) {
      fetchTripPhoto(label);
    }
  }, [trip]);

  const fetchTripPhoto = async (query) => {
    try {
      const resp = await GetPlaceDetails({ textQuery: query });
      const photos = resp.data.places?.[0]?.photos;
      if (!photos || photos.length === 0) {
        console.warn('Pas de photo pour', query);
        return;
      }
      // On prend la première photo, pas photos[3] qui peut ne pas exister
      const photoName = photos[0].name;
      const url = PHOTO_REF_URL.replace('{NAME}', photoName);
      setPhotoUrl(url);
    } catch (err) {
      console.error('Erreur récupération photo lieu :', err.response?.data || err);
      // on laisse le placeholder
    }
  };

  const locationLabel = trip?.userSelection?.location?.label || '—';
  const { noOfDays, budget } = trip?.userSelection || {};

  return (
    <Link to={'/view-trip/'+trip?.id}>
        <div className='hover:scale-105 transition-all hover:shadow-md'>
        <img
            src={photoUrl}
            alt={`Photo de ${locationLabel}`}
            className="w-full h-48 object-cover rounded-xl"
            onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
        />
        <div className="mt-2">
            <h2 className="font-bold text-lg">{locationLabel}</h2>
            <p className="text-sm text-gray-500">
            {noOfDays} jours – Budget : {budget}
            </p>
        </div>
        </div>
    </Link>
  );
}
