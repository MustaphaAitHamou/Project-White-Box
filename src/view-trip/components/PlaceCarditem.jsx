// src/components/PlaceCardItem.jsx
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { GetPlaceDetails } from "~/service/GlobalApi";

const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
const LEGACY_PHOTO_URL =
  "https://maps.googleapis.com/maps/api/place/photo" +
  "?maxwidth=400" +
  "&photoreference={PHOTO_REF}" +
  `&key=${API_KEY}`;

export default function PlaceCardItem({ placeName, details, timeToTravel }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  // Prépare la query pour l'API v1
  const query = placeName?.trim();

  useEffect(() => {
    if (!query) return;
    fetchPlacePhoto(query);
  }, [query]);

  const fetchPlacePhoto = async (textQuery) => {
    try {
      // 1) recherche via POST /places:searchText
      const resp = await GetPlaceDetails({ textQuery });
      const fullName = resp.data.places?.[0]?.photos?.[0]?.name;
      if (!fullName) {
        console.warn("Pas de photo pour", textQuery);
        return;
      }

      // 2) on split pour récupérer uniquement le photoreference
      const parts = fullName.split("/photos/");
      if (parts.length < 2) return;
      const photoRef = parts[1];

      // 3) on construit l'URL legacy et on l'enregistre
      const url = LEGACY_PHOTO_URL.replace(
        "{PHOTO_REF}",
        encodeURIComponent(photoRef)
      );
      setPhotoUrl(url);
    } catch (err) {
      console.error("Erreur récupération photo lieu :", err.response?.data || err);
    }
  };

  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(placeName)
      }
      target="_blank"
      rel="noreferrer"
    >
      <div className="border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
        <img
          src={photoUrl || "/placeholder.png"}
          alt={placeName}
          className="w-[130px] h-[130px] rounded-xl object-cover"
        />
        <div>
          <h2 className="font-bold text-lg">{placeName}</h2>
          <h2 className="text-sm text-gray-400">{details}</h2>
          <h2 className="mt-2">🕙 {timeToTravel}</h2>
          <Button size="sm">
            <FaMapLocationDot />
          </Button>
        </div>
      </div>
    </Link>
  );
}
