/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock du composant enfant avec displayName + propTypes pour calmer eslint
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

// Import après le mock
import * as HotelsMod from '~/view-trip/components/Hotels';
const Hotels = HotelsMod.default || HotelsMod.Hotels;

afterEach(() => jest.clearAllMocks());

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
  render(<Hotels trip={TRIP_OK} />);
  const items = screen.getAllByTestId('hotel-item');
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent('Hotel A');
  expect(items[1]).toHaveTextContent('Hotel B');
});

test("n'affiche rien s'il n'y a pas d'options", () => {
  const tripEmpty = {
    TripData: { hotelOptions: [] },
    userSelection: { location: { label: 'Paris, France' } },
  };
  const { container } = render(<Hotels trip={tripEmpty} />);
  // Hotels.jsx retourne null quand pas d'options
  expect(container).toBeEmptyDOMElement();
});
