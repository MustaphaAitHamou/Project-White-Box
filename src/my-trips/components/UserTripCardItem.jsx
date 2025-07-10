import React, { useEffect, useState } from "react"
import { GetPlaceDetails } from "~/service/GlobalApi"
import { Link } from "react-router-dom"

const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media" +
  "?maxHeightPx=1000&maxWidthPx=1000&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY

export default function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.png")

  useEffect(() => {
    const label = trip?.userSelection?.location?.label?.trim()
    if (label) fetchPhoto(label)
  }, [trip])

  async function fetchPhoto(query) {
    try {
      const resp   = await GetPlaceDetails({ textQuery: query })
      const photos = resp.data.places?.[0]?.photos
      if (!photos?.length) return
      const url = PHOTO_REF_URL.replace("{NAME}", photos[0].name)
      setPhotoUrl(url)
    } catch (err) {
      console.error("Photo error:", err)
    }
  }

  const { label }               = trip?.userSelection?.location || {}
  const { noOfDays, budget }    = trip?.userSelection || {}

  return (
    <Link to={`/view-trip/${trip?.id}`}>
      <article className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all">
        <img
          src={photoUrl}
          alt={label}
          className="w-full h-44 object-cover"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />
        <div className="p-4">
          <h2 className="font-semibold">{label}</h2>
          <p className="text-sm text-gray-500">
            {noOfDays} jours – Budget&nbsp;: {budget}
          </p>
        </div>
      </article>
    </Link>
  )
}
