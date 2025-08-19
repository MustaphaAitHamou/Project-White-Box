/* eslint-env jest, browser */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyTrips from '~/my-trips';

// --- Mocks d’enfants avec displayName + propTypes pour calmer eslint ---
jest.mock('~/view-trip/components/Footer', () => {
  const React = require('react');
  function MockFooter() {
    return React.createElement('div', { 'data-testid': 'footer' });
  }
  MockFooter.displayName = 'MockFooter';
  return { __esModule: true, default: MockFooter };
});

jest.mock('~/my-trips/components/UserTripCardItem', () => {
  const React = require('react');
  const PropTypes = require('prop-types');

  function MockUserTripCardItem(props) {
    const id = props?.trip?.id;
    return React.createElement('div', { 'data-testid': 'trip-card' }, id);
  }

  MockUserTripCardItem.displayName = 'MockUserTripCardItem';
  MockUserTripCardItem.propTypes = {
    trip: PropTypes.shape({
      id: PropTypes.string,
    }),
  };

  return { __esModule: true, default: MockUserTripCardItem };
});

// --- Mock router (navigate) ---
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// --- Mocks Firestore (⚠️ variables préfixées `mock` pour Jest) ---
const mockGetDocs = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
jest.mock('firebase/firestore', () => ({
  getDocs: (...args) => mockGetDocs(...args),
  collection: (...args) => mockCollection(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
}));
jest.mock('~/service/firebaseConfig', () => ({ db: {} }));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// -------- Tests --------

test('redirige vers / si aucun utilisateur connecté', async () => {
  render(
    <MemoryRouter>
      <MyTrips />
    </MemoryRouter>
  );

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  expect(mockGetDocs).not.toHaveBeenCalled();
});

test("affiche les voyages de l'utilisateur connecté", async () => {
  localStorage.setItem('user', JSON.stringify({ email: 'u@test.io' }));

  mockGetDocs.mockResolvedValue({
    docs: [
      {
        id: 'trip-a',
        data: () => ({
          userEmail: 'u@test.io',
          userSelection: { location: { label: 'Paris' }, noOfDays: '2', budget: 'Budget Test' },
          TripData: {},
        }),
      },
      {
        id: 'trip-b',
        data: () => ({
          userEmail: 'u@test.io',
          userSelection: { location: { label: 'Rome' }, noOfDays: '3', budget: 'Budget Test' },
          TripData: {},
        }),
      },
    ],
  });

  render(
    <MemoryRouter>
      <MyTrips />
    </MemoryRouter>
  );

  const cards = await screen.findAllByTestId('trip-card');
  expect(cards).toHaveLength(2);
  expect(mockNavigate).not.toHaveBeenCalled();
});
