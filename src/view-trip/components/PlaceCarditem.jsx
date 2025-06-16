import React, { useEffect, useState } from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { GetPlaceDetails } from '~/service/GlobalApi';

const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
const LEGACY_PHOTO_URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={PHOTO_REF}&key=${API_KEY}`;

export default function PlaceCardItem({ placeName, details, timeToTravel }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.png');
  const [tried, setTried] = useState(false);
  const query = placeName?.trim();

  useEffect(() => {
    if (!query || tried) return;
    setTried(true);
    fetchPlacePhoto(query);
  }, [query, tried]);

  const fetchPlacePhoto = async textQuery => {
    try {
      const resp = await GetPlaceDetails({ textQuery });
      const place = resp.data.places?.[0];
      const fullName = place?.photos?.[0]?.name;
      if (!fullName) return;
      const photoRef = fullName.split('/photos/')[1];
      const url = LEGACY_PHOTO_URL.replace('{PHOTO_REF}', encodeURIComponent(photoRef));
      setPhotoUrl(url);
    } catch (err) {
      console.error('Photo fetch error:', err);
    }
  };

  return (
    <Link
      to={
        'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(placeName)
      }
      target="_blank"
      rel="noreferrer"
      className="block"
    >
      <div className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* Image */}
        <img
          src={photoUrl}
          alt={placeName}
          className="w-full h-40 object-cover"
          onError={e => { e.currentTarget.src = '/placeholder.png'; }}
        />

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{placeName}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{details}</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-gray-700 text-sm flex items-center">
              <span role="img" aria-label="time" className="mr-1">🕙</span>
              {timeToTravel}
            </span>
            <Button size="sm" variant="outline" className="p-2">
              <FaMapLocationDot />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
