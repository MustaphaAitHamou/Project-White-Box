/* ------------------------------------------------------------------
   Grille d’hôtels – clé unique + fallback « aucun »
------------------------------------------------------------------- */
import React from 'react'
import HotelCardItem from './HotelCardItem'

export default function Hotels({ trip }) {
  const hotels = trip?.TripData?.hotelOptions || []

  if (!hotels.length) {
    const label = trip?.userSelection?.location?.label || 'la destination'
    return (
      <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        aucun hôtel n’a été trouvé pour « {label} ».
      </p>
    )
  }

  return (
    <>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((h, idx) => (
          /* clé unique = nom + index */
          <HotelCardItem
            key={`${h.hotelName}-${idx}`}
            hotel={h}
          />
        ))}
      </div>
    </>
  )
}
