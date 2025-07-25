/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import PlacesToVisit from '~/view-trip/components/PlacesToVisit';

jest.mock('~/view-trip/components/PlaceCardItem', () => (props) => (
  <div data-testid="place" data-slot={props.slotLabel}>{props.placeName}</div>
));

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
  render(<PlacesToVisit trip={trip} />);
  const items = screen.getAllByTestId('place');
  const order = items.map((n) => n.textContent);
  expect(order).toEqual(['Petit dej', 'Musee', 'Parc', 'Diner']);
});

test('Affiche un message si aucun itinéraire', () => {
  render(<PlacesToVisit trip={{ TripData: { dailyItinerary: [] } }} />);
  expect(screen.getByText(/aucun itinéraire/i)).toBeInTheDocument();
});
