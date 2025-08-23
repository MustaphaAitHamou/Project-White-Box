/* eslint-env jest */
/**
 * Tests du module Hotels.
 * Je mocke l’enfant <HotelCardItem> pour isoler le rendu de la liste et
 * je vérifie deux cas : avec options et sans options.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

/**
 * Je remplace le composant enfant par un stub léger :
 * - je lui donne un displayName pour des logs plus clairs
 * - je déclare des propTypes pour garder une vérification basique des props
 * - je n’affiche que le nom de l’hôtel dans un div testable
 */
jest.mock('~/view-trip/components/HotelCardItem', () => {
  const React = require('react');
  const PropTypes = require('prop-types');

  function MockHotelCardItem(props) {
    const name = props?.hotel?.name || 'hotel';
    return React.createElement('div', { 'data-testid': 'hotel-item' }, name);
  }

  MockHotelCardItem.displayName = 'MockHotelCardItem';
  MockHotelCardItem.propTypes = {
    hotel: PropTypes.shape({
      name: PropTypes.string,
    }),
  };

  return { __esModule: true, default: MockHotelCardItem };
});

// J’importe le module après avoir posé le mock ci-dessus.
import * as HotelsMod from '~/view-trip/components/Hotels';
const Hotels = HotelsMod.default || HotelsMod.Hotels;

// Je remets les mocks/espions à zéro après chaque test.
afterEach(() => jest.clearAllMocks());

// Jeu de données minimal pour le “happy path”.
const TRIP_OK = {
  TripData: {
    hotelOptions: [
      { id: 'h1', name: 'Hotel A' },
      { id: 'h2', name: 'Hotel B' },
    ],
  },
  userSelection: { location: { label: 'Paris, France' } },
};

test("affiche une liste d'hôtels quand il y a des options", () => {
  // Je rends la section et je récupère les items mockés.
  render(<Hotels trip={TRIP_OK} />);
  const items = screen.getAllByTestId('hotel-item');
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent('Hotel A');
  expect(items[1]).toHaveTextContent('Hotel B');
});

test("n'affiche rien s'il n'y a pas d'options", () => {
  // Je vérifie le comportement “silent” : le composant retourne null.
  const tripEmpty = {
    TripData: { hotelOptions: [] },
    userSelection: { location: { label: 'Paris, France' } },
  };
  const { container } = render(<Hotels trip={tripEmpty} />);
  // Hotels.jsx retourne null quand pas d'options
  expect(container).toBeEmptyDOMElement();
});
