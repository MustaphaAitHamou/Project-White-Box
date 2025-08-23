/* eslint-disable react/display-name, react/prop-types */
/* eslint-env jest */
/**
 * Tests de PlacesToVisit :
 * - je vérifie l’ordre des activités triées par créneau (Breakfast → Evening)
 * - je vérifie le message affiché quand aucun itinéraire n’est disponible
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import PlacesToVisit from '~/view-trip/components/PlacesToVisit';

/**
 * Je remplace PlaceCardItem par un stub minimal pour isoler la logique de tri.
 * J’expose `data-slot` pour contrôle éventuel, et j’affiche simplement le nom du lieu.
 */
jest.mock('~/view-trip/components/PlaceCardItem', () => (props) => (
  <div data-testid="place" data-slot={props.slotLabel}>{props.placeName}</div>
));

/** Données de test : un seul jour avec 4 activités non triées */
const trip = {
  TripData: {
    dailyItinerary: [
      {
        dayNumber: 1,
        theme: 'Test Day',
        activities: [
          { placeName: 'Diner', bestTimeToVisit: 'Evening' },
          { placeName: 'Petit dej', bestTimeToVisit: 'Breakfast' },
          { placeName: 'Musee', bestTimeToVisit: 'Morning' },
          { placeName: 'Parc', bestTimeToVisit: 'Afternoon' },
        ],
      },
    ],
  },
  userSelection: { location: { label: 'Paris' } },
};

test('PlacesToVisit trie les activités Breakfast→Evening', () => {
  // Je rends le composant avec l’itinéraire d’exemple
  render(<PlacesToVisit trip={trip} />);

  // Je récupère les éléments rendus et j’extrais l’ordre d’affichage
  const items = screen.getAllByTestId('place');
  const order = items.map((n) => n.textContent);

  // Je m’attends à l’ordre normalisé : Breakfast, Morning, Afternoon, Evening
  expect(order).toEqual(['Petit dej', 'Musee', 'Parc', 'Diner']);
});

test('Affiche un message si aucun itinéraire', () => {
  // Je passe un trip sans dailyItinerary pour déclencher le message d’absence
  render(<PlacesToVisit trip={{ TripData: { dailyItinerary: [] } }} />);

  // Je vérifie la présence du message utilisateur
  expect(screen.getByText(/aucun itinéraire/i)).toBeInTheDocument();
});
