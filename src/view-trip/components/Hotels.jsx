import React from 'react';
import PropTypes from 'prop-types';
import HotelCardItem from './HotelCardItem';

export default function Hotels({ trip }) {
  const hotels = trip?.TripData?.hotelOptions || [];
  const dest   = trip?.userSelection?.location?.label || '';

  if (!hotels.length) return null;

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold">Hébergements recommandés</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((h, i) => (
          <HotelCardItem
            key={h.id || h.name || i}
            hotel={{ ...h, destination: dest }}
          />
        ))}
      </div>
    </section>
  );
}

Hotels.propTypes = {
  trip: PropTypes.shape({
    TripData: PropTypes.shape({
      hotelOptions: PropTypes.array,
    }),
    userSelection: PropTypes.shape({
      location: PropTypes.shape({ label: PropTypes.string }),
    }),
  }).isRequired,
};
