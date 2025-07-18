/* ------------------------------------------------------------------
   Carte Hôtel – image robuste + badge note + détails complets
------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react'
import { FaMapMarkerAlt, FaEuroSign, FaStar } from 'react-icons/fa'
import { GetPlaceDetails } from '~/service/GlobalApi'

const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY
const PLACE_PHOTO = (ref) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${encodeURIComponent(
    ref
  )}&key=${API_KEY}`

/** Placeholder local (public/placeholder.png) */
const FALLBACK = '/placeholder.png'

export default function HotelCardItem({ hotel }) {
  const {
    hotelName,
    hotelAddress = 'Adresse indisponible',
    price,
    rating,
  } = hotel || {}

  const [photoUrl, setPhotoUrl] = useState(FALLBACK)

  /* ----------- récupère la meilleure photo ----------- */
  useEffect(() => {
    let isMounted = true
    const query = hotelName ? `${hotelName}, ${hotelAddress}` : null
    if (!query) return

    ;(async () => {
      try {
        const { data } = await GetPlaceDetails({ textQuery: query })
        const place   = data.places?.[0]
        const ref     = place?.photos?.[0]?.name?.split('/photos/')[1]
        if (!ref) return
        isMounted && setPhotoUrl(PLACE_PHOTO(ref))
      } catch (err) {
        console.warn('❌ Place photo:', err?.response?.data || err)
      }
    })()

    return () => (isMounted = false)
  }, [hotelName, hotelAddress])

  /* ----------- lien Google Maps ----------- */
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${hotelName}, ${hotelAddress}`
  )}`

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-2xl bg-white shadow transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* image */}
      <div className="relative h-60 w-full overflow-hidden rounded-t-2xl">
        <img
          src={photoUrl}
          alt={hotelName}
          onError={(e) => (e.currentTarget.src = FALLBACK)}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />

        {/* badge note */}
        {rating && (
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-sm font-semibold text-gray-700 shadow">
            <FaStar className="text-yellow-500" /> {rating}
          </span>
        )}
      </div>

      {/* texte */}
      <div className="space-y-1 px-4 py-3 text-sm">
        <h3 className="font-medium text-indigo-700 group-hover:underline">
          {hotelName}
        </h3>

        <p className="flex items-start gap-1 text-gray-600">
          <FaMapMarkerAlt className="mt-0.5 shrink-0 text-gray-500" />
          {hotelAddress}
        </p>

        {price && (
          <p className="flex items-center gap-2 rounded-full bg-gray-100 px-2 py-0.5 w-max">
            <FaEuroSign className="text-gray-500" />
            {price}
          </p>
        )}
      </div>
    </a>
  )
}
