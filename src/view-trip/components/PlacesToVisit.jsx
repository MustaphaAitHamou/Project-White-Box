/* eslint-env browser */
// Liste des lieux à visiter pour chaque jour du trip.
// Je trie les activités d’une journée selon un ordre fixe (Breakfast → Morning → Afternoon → Evening)
// puis j’affiche des cartes <PlaceCardItem>. Si l’itinéraire est vide, je montre un message clair.

import React from 'react';
import PropTypes from 'prop-types';
import PlaceCardItem from '~/view-trip/components/PlaceCardItem';

// Je définis l’ordre des créneaux pour le tri des activités.
const SLOT_ORDER = { breakfast: 0, morning: 1, afternoon: 2, evening: 3 };

export default function PlacesToVisit({ trip }) {
  // Je récupère l’itinéraire et le label de destination en protégeant l’accès aux champs.
  const { dailyItinerary = [] } = trip?.TripData || {};
  const destinationLabel = trip?.userSelection?.location?.label || '';

  // Si je n’ai aucune journée, je rends un simple message d’information.
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
        // Je clone le tableau d’activités et je le trie selon SLOT_ORDER.
        const ordered = [...(activities || [])].sort((a, b) => {
          const ra = SLOT_ORDER[a.bestTimeToVisit?.toLowerCase()] ?? 99;
          const rb = SLOT_ORDER[b.bestTimeToVisit?.toLowerCase()] ?? 99;
          return ra - rb;
        });

        return (
          <section key={dayNumber} className="space-y-4">
            {/* Titre du jour + thème optionnel */}
            <h3 className="text-xl font-semibold">
              Jour {dayNumber}
              {theme && (
                <span className="ml-2 text-sm italic text-gray-500">
                  ({theme})
                </span>
              )}
            </h3>

            {/* Grille responsive de cartes pour les activités de la journée */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ordered.map((act, idx) => (
                <PlaceCardItem
                  key={`${act.placeName}-${idx}`} // je compose une clé simple et stable pour la liste
                  {...act}
                  destinationLabel={destinationLabel} // je contextualise la recherche photo/Maps
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
