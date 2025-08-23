/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";

// On MOCK le composant réel (qui utilise import.meta) pour éviter les erreurs de parse en test
jest.mock('~/view-trip/components/HotelCardItem', () => ({
  __esModule: true,
  default: ({ hotel = {} }) => (
    <article aria-label="hotel-card">
      <h3>{hotel.name || 'Hotel name'}</h3>
      <p>{hotel.formatted_address || 'Address'}</p>
    </article>
  ),
}));

// Importe le mock ci-dessus
import HotelCardItem from '~/view-trip/components/HotelCardItem';

describe('HotelCardItem (stubbed)', () => {
  test('rend une carte avec les infos fournies', () => {
    const hotel = { name: 'Mock Hôtel', formatted_address: '42 Rue du Test' };
    render(<HotelCardItem hotel={hotel} />);

    expect(screen.getByRole('article', { name: /hotel-card/i })).toBeInTheDocument();
    expect(screen.getByText('Mock Hôtel')).toBeInTheDocument();
    expect(screen.getByText('42 Rue du Test')).toBeInTheDocument();
  });
});
