// src/components/InfoSection.jsx
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails } from "~/service/GlobalApi";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  // on surveille uniquement le label
  const label = trip?.userSelection?.location?.label?.trim();

  useEffect(() => {
    if (label) fetchPlacePhoto(label);
  }, [label]);

  const fetchPlacePhoto = async (query) => {
    try {
      // 1) ton appel textSearch v1
      const resp = await GetPlaceDetails({ textQuery: query });
      const photos = resp.data.places?.[0]?.photos;
      if (!photos?.length) {
        console.warn("Aucune photo dispo pour", query);
        return;
      }

      // 2) on extrait la référence
      //    e.g. "places/xxx/photos/Aaw_FcKly0DEv3…"
      const fullName = photos[0].name;
      const parts = fullName.split("/photos/");
      if (parts.length < 2) return;
      const photoRef = parts[1];

      // 3) on construit l'URL vers l'API classique Place Photo
      const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
      const url = [
        "https://maps.googleapis.com/maps/api/place/photo",
        `?maxwidth=1000`,
        `&photoreference=${encodeURIComponent(photoRef)}`,
        `&key=${apiKey}`,
      ].join("");

      // 4) on set directement cette URL
      setPhotoUrl(url);
    } catch (err) {
      console.error("Erreur Places:", err.response?.data || err);
    }
  };

  // loader tant que trip.userSelection n'est pas prêt
  if (!trip?.userSelection) {
    return (
      <div className="h-[480px] w-full bg-gray-100 flex items-center justify-center rounded">
        Chargement des infos…
      </div>
    );
  }

  const { location, noOfDays, budget, traveler } = trip.userSelection;

  return (
    <div>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`Photo de ${location.label}`}
          className="h-[480px] w-full object-cover rounded"
        />
      ) : (
        <div className="h-[480px] w-full bg-gray-100 flex items-center justify-center rounded">
          Chargement de l’image…
        </div>
      )}

      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{location.label}</h2>
          <div className="flex gap-5">
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📆 {noOfDays} jours
            </span>
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💰 Budget : {budget}
            </span>
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              👥 Voyageurs : {traveler}
            </span>
          </div>
        </div>
        <Button>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;
