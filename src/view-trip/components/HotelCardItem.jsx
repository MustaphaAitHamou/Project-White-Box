  // src/view-trip/components/HotelCardItem.jsx
  import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import { GetPlaceDetails } from "~/service/GlobalApi";

  const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
  const LEGACY_PHOTO_URL =
    "https://maps.googleapis.com/maps/api/place/photo" +
    "?maxwidth=500" +
    "&photoreference={PHOTO_REF}" +
    `&key=${API_KEY}`;

  function HotelCardItem({ hotel }) {
    const [photoUrl, setPhotoUrl] = useState(null);

    const query =
      hotel?.hotelName && hotel?.hotelAddress
        ? `${hotel.hotelName}, ${hotel.hotelAddress}`
        : null;

    useEffect(() => {
      if (!query) return;
      fetchHotelPhoto(query);
    }, [query]);

    const fetchHotelPhoto = async (textQuery) => {
      try {
        const resp = await GetPlaceDetails({ textQuery });
        const fullName = resp.data.places?.[0]?.photos?.[0]?.name;
        if (!fullName) return;

        const parts = fullName.split("/photos/");
        if (parts.length < 2) return;
        const photoRef = parts[1];
        const url = LEGACY_PHOTO_URL.replace(
          "{PHOTO_REF}",
          encodeURIComponent(photoRef)
        );
        setPhotoUrl(url);
      } catch (err) {
        console.error("Erreur récupération photo hôtel :", err.response?.data || err);
      }
    };

    return (
      <Link
        to={
          "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(`${hotel.hotelName}, ${hotel.hotelAddress}`)
        }
        target="_blank"
        rel="noreferrer"
      >
        <div className="hover:scale-105 transition-all cursor-pointer">
          <img
            src={photoUrl || "/placeholder.png"}
            alt={hotel.hotelName}
            className="rounded-xl w-full h-48 object-cover"
          />
          <div className="my-3">
            <h2 className="font-medium">{hotel.hotelName}</h2>
            <h2 className="text-xs text-gray-500">📍 {hotel.hotelAddress}</h2>
            <h2 className="text-sm">💵 {hotel.price}</h2>
            <h2 className="text-sm">⭐ {hotel.rating}</h2>
          </div>
        </div>
      </Link>
    );
  }

  export default HotelCardItem;
