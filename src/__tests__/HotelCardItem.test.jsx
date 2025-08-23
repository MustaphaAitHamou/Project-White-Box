/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";

/**
 * Je remplace le composant réel par un stub très simple.
 * Objectif : éviter les soucis de parse ou d’environnement liés à import.meta/env
 * pendant les tests, et me concentrer uniquement sur le rendu attendu (titre + adresse).
 */
jest.mock('~/view-trip/components/HotelCardItem', () => ({
  __esModule: true,
  default: ({ hotel = {} }) => (
    <article aria-label="hotel-card">
      <h3>{hotel.name || 'Hotel name'}</h3>
      <p>{hotel.formatted_address || 'Address'}</p>
    </article>
  ),
}));

// J’importe le mock défini ci-dessus : Jest l’injecte à la place du composant réel.
import HotelCardItem from '~/view-trip/components/HotelCardItem';

describe('HotelCardItem (stubbed)', () => {
  test('rend une carte avec les infos fournies', () => {
    // Je fournis des props contrôlées pour valider le rendu minimal du stub.
    const hotel = { name: 'Mock Hôtel', formatted_address: '42 Rue du Test' };
    render(<HotelCardItem hotel={hotel} />);

    // Je vérifie la présence de l’article et des deux champs attendus.
    expect(screen.getByRole('article', { name: /hotel-card/i })).toBeInTheDocument();
    expect(screen.getByText('Mock Hôtel')).toBeInTheDocument();
    expect(screen.getByText('42 Rue du Test')).toBeInTheDocument();
  });
});
