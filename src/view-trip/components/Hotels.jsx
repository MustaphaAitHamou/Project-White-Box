// Liste d’hébergements pour un trip donné.
// Je récupère les options d’hôtels depuis trip.TripData.hotelOptions et
// je passe chaque élément au composant de carte <HotelCardItem>.
// Si la liste est vide, je retourne null pour ne rien afficher.

import React from 'react';
import PropTypes from 'prop-types';
import HotelCardItem from './HotelCardItem';

export default function Hotels({ trip }) {
  // Je protège l’accès aux champs du trip et je fournis des valeurs par défaut.
  const hotels = trip?.TripData?.hotelOptions || [];
  const dest   = trip?.userSelection?.location?.label || '';

  // Pas d’hôtels → je ne rends rien (comportement “silent fail” volontaire).
  if (!hotels.length) return null;

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold">Hébergements recommandés</h3>

      {/* Grille responsive : 1 colonne sur mobile, 2 en small, 3 en large */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((h, i) => (
          <HotelCardItem
            // Je choisis une clé stable si possible (id ou name), sinon je tombe sur l’index.
            key={h.id || h.name || i}
            // Je propage les données de l’hôtel et j’ajoute le label de destination au besoin.
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
