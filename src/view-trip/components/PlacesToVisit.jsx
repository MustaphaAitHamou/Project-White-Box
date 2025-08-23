/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import PlaceCardItem from '~/view-trip/components/PlaceCardItem';

const SLOT_ORDER = { breakfast: 0, morning: 1, afternoon: 2, evening: 3 };

export default function PlacesToVisit({ trip }) {
  const { dailyItinerary = [] } = trip?.TripData || {};
  const destinationLabel = trip?.userSelection?.location?.label || '';

  if (!dailyItinerary.length) {
    return (
      <p className="rounded bg-yellow-50 p-4 text-sm text-yellow-800">
        Aucun itinéraire n’a été généré pour ce voyage.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {dailyItinerary.map(({ dayNumber, theme, activities }) => {
        const ordered = [...(activities || [])].sort((a, b) => {
          const ra = SLOT_ORDER[a.bestTimeToVisit?.toLowerCase()] ?? 99;
          const rb = SLOT_ORDER[b.bestTimeToVisit?.toLowerCase()] ?? 99;
          return ra - rb;
        });

        return (
          <section key={dayNumber} className="space-y-4">
            <h3 className="text-xl font-semibold">
              Jour {dayNumber}
              {theme && (
                <span className="ml-2 text-sm italic text-gray-500">
                  ({theme})
                </span>
              )}
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ordered.map((act, idx) => (
                <PlaceCardItem
                  key={`${act.placeName}-${idx}`}
                  {...act}
                  destinationLabel={destinationLabel}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

PlacesToVisit.propTypes = {
  trip: PropTypes.shape({
    TripData: PropTypes.shape({
      dailyItinerary: PropTypes.array,
    }),
    userSelection: PropTypes.shape({
      location: PropTypes.shape({ label: PropTypes.string }),
    }),
  }).isRequired,
};
