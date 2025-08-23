/* eslint-env jest, browser */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyTrips from '~/my-trips';

/* 
  Je teste la page "Mes voyages".
  Objectif :
    - si aucun utilisateur n’est connecté, je dois être redirigé vers "/"
    - si un utilisateur est présent en localStorage, je charge ses voyages et je les affiche
*/

/* --- Mocks d’enfants avec displayName + propTypes pour calmer eslint --- */
// Je remplace le Footer par un composant neutre : je ne veux pas qu’il influence le rendu.
jest.mock('~/view-trip/components/Footer', () => {
  const React = require('react');
  function MockFooter() {
    return React.createElement('div', { 'data-testid': 'footer' });
  }
  MockFooter.displayName = 'MockFooter';
  return { __esModule: true, default: MockFooter };
});

// Je remplace la carte de voyage par un stub minimal : je n’ai besoin que d’un marqueur testable.
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

/* --- Mock router (navigate) --- */
// Je capture useNavigate pour vérifier les redirections programmatiques.
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

/* --- Mocks Firestore (⚠️ variables préfixées `mock` pour Jest) --- */
// Je remplace les appels Firestore par des fonctions espion : je contrôle la réponse dans chaque test.
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
  // Je repars d’un état propre : mocks et localStorage réinitialisés.
  jest.clearAllMocks();
  localStorage.clear();
});

// -------- Tests --------

test('redirige vers / si aucun utilisateur connecté', async () => {
  // Je rends la page sans utilisateur en localStorage.
  render(
    <MemoryRouter>
      <MyTrips />
    </MemoryRouter>
  );

  // Je m’attends à une redirection immédiate vers la page d’accueil.
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  // Et je vérifie qu’aucune requête Firestore n’a été tentée.
  expect(mockGetDocs).not.toHaveBeenCalled();
});

test("affiche les voyages de l'utilisateur connecté", async () => {
  // Je simule un utilisateur connecté.
  localStorage.setItem('user', JSON.stringify({ email: 'u@test.io' }));

  // Je fournis deux documents Firestore factices.
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

  // Je m’assure que deux cartes de voyage apparaissent et qu’il n’y a pas eu de redirection.
  const cards = await screen.findAllByTestId('trip-card');
  expect(cards).toHaveLength(2);
  expect(mockNavigate).not.toHaveBeenCalled();
});
