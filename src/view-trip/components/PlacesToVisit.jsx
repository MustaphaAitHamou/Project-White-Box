import React from 'react'
import PlaceCarditem from './PlaceCarditem'

export default function PlacesToVisit({ trip }) {
  const days = trip.TripData?.dailyItinerary || []

  if (days.length === 0) {
    return <p className="text-red-600">Aucun itinéraire à afficher.</p>
  }

  return (
    <div>
      <h2 className="font-bold text-lg mb-4">Places to Visit</h2>

      {days.map((day, dayIdx) => (
        <div key={dayIdx} className="mb-8">
          <h3 className="font-medium text-xl mb-1">Jour {day.dayNumber}</h3>
          {day.theme && (
            <p className="text-sm text-gray-600 italic mb-3">Thème : {day.theme}</p>
          )}

          {day.activities?.length > 0 ? (
            <div className="flex flex-wrap -mx-2">
              {day.activities.map((activity, actIdx) => (
                <div
                  key={actIdx}
                  className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4"
                >
                  <div className="h-full p-4 border rounded-lg flex flex-col">
                    <h4 className="font-medium text-sm text-orange-600 mb-2">
                      {activity.bestTimeToVisit}
                    </h4>
                    <PlaceCarditem
                      placeName={activity.placeName}
                      details={activity.details}
                      timeToTravel={activity.timeToTravel}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Pas d’activités ce jour.</p>
          )}
        </div>
      ))}
    </div>
  )
}
