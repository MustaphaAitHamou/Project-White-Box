// src/__tests__/PlaceCardItem.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlaceCardItem from '../view-trip/components/PlaceCardItem';
import * as api from '../service/GlobalApi';

jest.mock('../service/GlobalApi');

describe('PlaceCardItem', () => {
  it('affiche l’image construite depuis la référence', async () => {
    const fakeRef = 'XYZ789';
    api.GetPlaceDetails.mockResolvedValueOnce({
      data: { places: [{ photos: [{ name: `places/YY/photos/${fakeRef}` }] }] }
    });

    render(
      <MemoryRouter>
        <PlaceCardItem
          placeName="Musée"
          details="Visite culturelle"
          timeToTravel="5 min"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      const img = screen.getByAltText('Musée');
      expect(img).toBeInTheDocument();
      expect(img.src).toContain(encodeURIComponent(fakeRef));
    });
  });

  it('retombe sur le placeholder en cas d’erreur', async () => {
    api.GetPlaceDetails.mockRejectedValueOnce(new Error('Oops'));

    render(
      <MemoryRouter>
        <PlaceCardItem
          placeName="Musée"
          details="Visite culturelle"
          timeToTravel="5 min"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      const img = screen.getByAltText('Musée');
      expect(img.src).toContain('/placeholder.png');
    });
  });
});
