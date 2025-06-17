/* eslint-env jest */
/* global jest, describe, it, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CreateTrip from '~/create-trip/index';

jest.mock('~/service/GlobalApi', () => ({
  CreateTrip: jest.fn(() => Promise.resolve({ status: 200 }))
}));

jest.mock('react-google-places-autocomplete', () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <input
      aria-label="Destination"
      placeholder="Destination"
      onChange={(e) => onChange?.({ label: e.target.value })}
    />
  )
}));

describe('CreateTrip', () => {
  it('soumet le formulaire avec les bonnes valeurs', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <MemoryRouter>
          <CreateTrip />
        </MemoryRouter>
      </GoogleOAuthProvider>
    );

    // Remplir la destination
    const destinationInput = screen.getByLabelText('Destination');
    fireEvent.change(destinationInput, { target: { value: 'Rome' } });

    // Remplir le nombre de jours
    const daysInput = screen.getByPlaceholderText('Ex. 5');
    fireEvent.change(daysInput, { target: { value: '3' } });

    // Choisir le budget "Modéré"
    fireEvent.click(screen.getByText('Modéré'));

    // Choisir le type de voyageur "Seul"
    fireEvent.click(screen.getAllByText('Seul')[0]);

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /Générer/i }));

    // Vérifie que la suite du process est visible (au moins une transition visible)
    expect(await screen.findByText(/Préférences de voyage|Création en cours/i)).toBeInTheDocument();
  });
});
