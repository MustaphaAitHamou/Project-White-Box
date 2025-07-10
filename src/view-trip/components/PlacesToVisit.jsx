/* ------------------------------------------------------------------
   src/view-trip/components/PlacesToVisit.jsx   ← version complète
------------------------------------------------------------------- */
import React from "react";
import PlaceCardItem from "./PlaceCardItem";    // ⚠️ orthographe exacte

export default function PlacesToVisit({ trip }) {
  const days             = trip.TripData?.dailyItinerary || [];
  const destinationLabel =
    trip?.userSelection?.location?.label || ""; // ex. "Rome, Italy"

  if (days.length === 0) {
    return <p className="text-red-600">Aucun itinéraire à afficher.</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Places to Visit</h2>

      {days.map((day, dayIdx) => (
        <div key={dayIdx} className="mb-8">
          {/* ------------- en-tête du jour ------------- */}
          <h3 className="text-xl font-medium mb-1">Jour {day.dayNumber}</h3>
          {day.theme && (
            <p className="italic text-sm text-gray-600 mb-3">
              Thème&nbsp;: {day.theme}
            </p>
          )}

          {/* ------------- activités ------------- */}
          {day.activities?.length ? (
            <div className="-mx-2 flex flex-wrap">
              {day.activities.map((act, actIdx) => (
                <div
                  key={actIdx}
                  className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4"
                >
                  <div className="h-full flex flex-col border rounded-lg p-4">
                    {act.bestTimeToVisit && (
                      <h4 className="mb-2 text-sm font-medium text-orange-600">
                        {act.bestTimeToVisit}
                      </h4>
                    )}

                    <PlaceCardItem
                      placeName={act.placeName}
                      details={act.details}
                      timeToTravel={act.timeToTravel}
                      slotLabel={act.bestTimeToVisit}
                      destinationLabel={destinationLabel}  
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
  );
}
