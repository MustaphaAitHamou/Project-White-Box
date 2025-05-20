// src/view-trip/components/Hotels.jsx
import React from "react";
import HotelCardItem from "./HotelCardItem"; // importe ton composant
// plus besoin de Link ici

function Hotels({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommandation</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {trip?.TripData?.hotelOptions?.map((hotel, index) => (
          <HotelCardItem
            key={hotel.id ?? `${hotel.hotelName}-${index}`}
            hotel={hotel}
          />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
